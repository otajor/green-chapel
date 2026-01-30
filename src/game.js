// ═══════════════════════════════════════════════════════════════
// THE GREEN CHAPEL — Core Game Engine
// ═══════════════════════════════════════════════════════════════

import { generateMap, MAP_WIDTH, MAP_HEIGHT, CELL } from './map.js';
import { BIOMES, ENEMIES, ITEMS, ENCOUNTERS, RESULT_TEXT, DEATH_MESSAGES, VICTORY_MESSAGES } from './data.js';

// ── Game State ──────────────────────────────────────────────

export function createGame() {
  const seed = Date.now();
  return {
    seed,
    state: 'title', // title | playing | combat | encounter | inventory | dead | victory
    depth: 1,
    turns: 0,
    player: createPlayer(),
    map: null,
    entities: null,
    enemies: [],
    items: [],
    encounters: [],
    combat: null,
    encounter: null,
    log: [],
    fogOfWar: null,
    revealRadius: 4,
  };
}

function createPlayer() {
  return {
    x: 0,
    y: 0,
    hp: 50,
    maxHp: 50,
    attack: 5,
    defense: 2,
    xp: 0,
    level: 1,
    xpToLevel: 30,
    weapon: null,
    armor: null,
    charm: null,
    inventory: [
      { ...ITEMS.bread_loaf },
      { ...ITEMS.bread_loaf },
    ],
    karma: 0,
    hasGreenSash: false,
  };
}

// ── Level Generation ────────────────────────────────────────

export function enterLevel(game) {
  const biome = BIOMES.find(b => game.depth >= b.depth[0] && game.depth <= b.depth[1]) || BIOMES[0];
  const { grid, rooms, entities } = generateMap(game.depth, game.seed);

  game.map = grid;
  game.biome = biome;
  game.player.x = entities.start.x;
  game.player.y = entities.start.y;

  // Initialize fog of war
  game.fogOfWar = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    game.fogOfWar[y] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      game.fogOfWar[y][x] = false;
    }
  }

  // Spawn enemies
  game.enemies = entities.enemies.map((pos, i) => {
    const enemyKeys = biome.enemies;
    const key = enemyKeys[Math.floor(seededRandom(game.seed + game.depth * 100 + i) * enemyKeys.length)];
    const template = ENEMIES[key];
    return {
      ...template,
      key,
      x: pos.x,
      y: pos.y,
      hp: template.hp,
    };
  });

  // Spawn items
  game.items = entities.items.map((pos, i) => {
    const allItems = Object.keys(ITEMS).filter(k => ITEMS[k].type === 'consumable' || ITEMS[k].type === 'weapon' || ITEMS[k].type === 'armor');
    const key = allItems[Math.floor(seededRandom(game.seed + game.depth * 200 + i) * allItems.length)];
    return {
      ...ITEMS[key],
      key,
      x: pos.x,
      y: pos.y,
    };
  });

  // Spawn encounters
  const encounterKeys = biome.encounters;
  game.encounters = entities.encounters.map((pos, i) => {
    const key = encounterKeys[Math.floor(seededRandom(game.seed + game.depth * 300 + i) * encounterKeys.length)];
    return {
      key,
      x: pos.x,
      y: pos.y,
      triggered: false,
    };
  });

  game.stairs = entities.stairs;

  updateFog(game);
  addLog(game, `— ${biome.name} (Depth ${game.depth}) —`);
  addLog(game, biome.description);
}

// ── Fog of War ──────────────────────────────────────────────

function updateFog(game) {
  const r = game.revealRadius + (game.player.charm?.effect === 'sight' ? 2 : 0);
  const px = game.player.x;
  const py = game.player.y;

  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const x = px + dx;
      const y = py + dy;
      if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
        if (dx * dx + dy * dy <= r * r) {
          // Simple line of sight check
          if (hasLineOfSight(game.map, px, py, x, y)) {
            game.fogOfWar[y][x] = true;
          }
        }
      }
    }
  }
}

function hasLineOfSight(map, x0, y0, x1, y1) {
  // Bresenham's line - check if all tiles between are non-wall
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  let cx = x0, cy = y0;

  while (cx !== x1 || cy !== y1) {
    if (map[cy]?.[cx] === CELL.WALL && (cx !== x0 || cy !== y0)) {
      return false;
    }
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; cx += sx; }
    if (e2 < dx) { err += dx; cy += sy; }
  }
  return true;
}

// ── Movement & Actions ──────────────────────────────────────

export function movePlayer(game, dx, dy) {
  if (game.state !== 'playing') return;

  const nx = game.player.x + dx;
  const ny = game.player.y + dy;

  // Bounds check
  if (nx < 0 || nx >= MAP_WIDTH || ny < 0 || ny >= MAP_HEIGHT) return;

  // Wall check
  if (game.map[ny][nx] === CELL.WALL) return;

  // Enemy collision
  const enemy = game.enemies.find(e => e.x === nx && e.y === ny && e.hp > 0);
  if (enemy) {
    startCombat(game, enemy);
    return;
  }

  // Move
  game.player.x = nx;
  game.player.y = ny;
  game.turns++;

  // Check tile
  checkTile(game);
  updateFog(game);
}

function checkTile(game) {
  const { x, y } = game.player;

  // Item pickup
  const item = game.items.find(i => i.x === x && i.y === y);
  if (item) {
    game.items = game.items.filter(i => i !== item);
    game.map[y][x] = CELL.FLOOR;
    game.player.inventory.push(item);
    addLog(game, `Found: ${item.name} — ${item.description}`);
  }

  // Stairs
  if (game.stairs && x === game.stairs.x && y === game.stairs.y) {
    addLog(game, 'You descend deeper...');
    game.depth++;
    enterLevel(game);
    return;
  }

  // Encounter
  const enc = game.encounters.find(e => e.x === x && e.y === y && !e.triggered);
  if (enc) {
    triggerEncounter(game, enc);
  }
}

// ── Combat ──────────────────────────────────────────────────

function startCombat(game, enemy) {
  game.state = 'combat';
  game.combat = {
    enemy: { ...enemy },
    enemyRef: enemy,
    turn: 'player',
    log: [`A ${enemy.name} blocks your path!`, enemy.description],
  };
  addLog(game, `⚔ Combat: ${enemy.name}!`);
}

export function combatAction(game, action) {
  if (!game.combat || game.state !== 'combat') return;

  const c = game.combat;
  const p = game.player;
  const e = c.enemy;

  if (action === 'attack') {
    const weaponBonus = p.weapon ? p.weapon.attack : 0;
    const damage = Math.max(1, p.attack + weaponBonus - e.defense + Math.floor(Math.random() * 3) - 1);
    e.hp -= damage;
    c.log.push(`You strike for ${damage} damage.`);

    if (e.hp <= 0) {
      // Victory
      c.log.push(`The ${e.name} falls.`);
      addLog(game, `Defeated: ${e.name} (+${e.xp} XP)`);

      // Remove from map
      const ref = c.enemyRef;
      ref.hp = 0;
      game.map[ref.y][ref.x] = CELL.FLOOR;

      // XP & loot
      gainXP(game, e.xp);
      if (e.loot && e.loot.length > 0) {
        const lootKey = e.loot[Math.floor(Math.random() * e.loot.length)];
        if (ITEMS[lootKey]) {
          const loot = { ...ITEMS[lootKey], key: lootKey };
          p.inventory.push(loot);
          addLog(game, `Loot: ${loot.name}`);
        }
      }

      // Check if boss
      if (e.boss) {
        game.state = 'victory';
        game.victoryType = 'combat';
        return;
      }

      game.state = 'playing';
      game.combat = null;
      return;
    }
  } else if (action === 'defend') {
    c.log.push('You brace yourself.');
    // Halve incoming damage this turn
    c.defending = true;
  } else if (action === 'flee') {
    if (Math.random() < 0.5) {
      c.log.push('You escape!');
      addLog(game, 'Fled from combat.');
      game.state = 'playing';
      game.combat = null;
      // Move player back
      return;
    } else {
      c.log.push('You can\'t escape!');
    }
  } else if (action === 'use_item') {
    // Will be handled by item selection
    return;
  }

  // Enemy turn
  if (game.state === 'combat' && e.hp > 0) {
    const armorBonus = p.armor ? p.armor.defense : 0;
    const defenseTotal = p.defense + armorBonus + (c.defending ? 3 : 0);
    const eDamage = Math.max(1, e.attack - defenseTotal + Math.floor(Math.random() * 3) - 1);
    p.hp -= eDamage;
    c.log.push(`${e.name} strikes for ${eDamage} damage.`);
    c.defending = false;

    if (p.hp <= 0) {
      game.state = 'dead';
      addLog(game, DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)]);
    }
  }

  // Trim combat log
  if (c.log.length > 8) c.log = c.log.slice(-8);
}

// ── Encounters ──────────────────────────────────────────────

function triggerEncounter(game, enc) {
  const data = ENCOUNTERS[enc.key];
  if (!data) return;

  enc.triggered = true;
  game.map[enc.y][enc.x] = CELL.FLOOR;
  game.state = 'encounter';
  game.encounter = {
    ...data,
    key: enc.key,
  };
  addLog(game, `† ${data.title}`);
}

export function encounterChoice(game, choiceIndex) {
  if (game.state !== 'encounter' || !game.encounter) return;

  const choice = game.encounter.choices[choiceIndex];
  if (!choice) return;

  // Check requirements
  if (choice.requires) {
    const hasItem = game.player.inventory.some(i => i.key === choice.requires) || game.player.hasGreenSash;
    if (!hasItem) {
      addLog(game, 'You don\'t have what\'s needed for that.');
      return;
    }
  }

  // Show result text
  const resultText = RESULT_TEXT[choice.result];
  if (resultText) addLog(game, resultText);

  // Apply effect
  applyEffect(game, choice.effect);

  // Apply cost
  if (choice.cost) {
    if (choice.cost.hp) game.player.hp = Math.max(1, game.player.hp + choice.cost.hp);
    if (choice.cost.defense) game.player.defense += choice.cost.defense;
  }

  // Apply reward
  if (choice.reward) {
    applyEffect(game, choice.reward);
  }

  game.state = 'playing';
  game.encounter = null;
}

function applyEffect(game, effect) {
  if (!effect) return;

  switch (effect.type) {
    case 'heal':
      game.player.hp = Math.min(game.player.maxHp, game.player.hp + effect.value);
      addLog(game, `Healed ${effect.value} HP.`);
      break;
    case 'full_heal':
      game.player.hp = game.player.maxHp;
      addLog(game, 'Fully healed!');
      break;
    case 'damage':
      game.player.hp -= effect.value;
      addLog(game, `Took ${effect.value} damage!`);
      if (game.player.hp <= 0) {
        game.state = 'dead';
        addLog(game, DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)]);
      }
      break;
    case 'item':
      if (ITEMS[effect.item]) {
        const item = { ...ITEMS[effect.item], key: effect.item };
        game.player.inventory.push(item);
        addLog(game, `Received: ${item.name}`);
        if (effect.item === 'green_sash') game.player.hasGreenSash = true;
      }
      break;
    case 'xp':
      gainXP(game, effect.value);
      break;
    case 'buff':
      if (effect.stat === 'maxHp') {
        game.player.maxHp += effect.value;
        game.player.hp += effect.value;
      } else {
        game.player[effect.stat] = (game.player[effect.stat] || 0) + effect.value;
      }
      addLog(game, `${effect.stat} increased by ${effect.value}.`);
      break;
    case 'curse':
      game.player[effect.stat] = Math.max(1, (game.player[effect.stat] || 0) + effect.value);
      addLog(game, `${effect.stat} decreased!`);
      break;
    case 'karma':
      game.player.karma += effect.value;
      break;
    case 'combat':
      if (ENEMIES[effect.enemy]) {
        const template = ENEMIES[effect.enemy];
        const enemy = { ...template, key: effect.enemy, x: game.player.x, y: game.player.y, hp: template.hp };
        startCombat(game, enemy);
      }
      break;
    case 'reveal_map':
      // Reveal entire map
      for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
          game.fogOfWar[y][x] = true;
        }
      }
      addLog(game, 'The map reveals itself.');
      break;
    case 'random':
      if (Math.random() < 0.5) {
        applyEffect(game, effect.good);
      } else {
        applyEffect(game, effect.bad);
      }
      break;
    case 'final_test':
      game.state = 'victory';
      game.victoryType = effect.test;
      break;
    case 'none':
      break;
  }
}

// ── Inventory ───────────────────────────────────────────────

export function useItem(game, index) {
  const item = game.player.inventory[index];
  if (!item) return;

  if (item.type === 'consumable') {
    if (item.effect === 'heal') {
      game.player.hp = Math.min(game.player.maxHp, game.player.hp + item.value);
      addLog(game, `Used ${item.name}. Healed ${item.value} HP.`);
    }
    game.player.inventory.splice(index, 1);
  } else if (item.type === 'weapon') {
    // Swap weapons
    if (game.player.weapon) {
      game.player.inventory.push(game.player.weapon);
    }
    game.player.weapon = item;
    game.player.inventory.splice(index, 1);
    addLog(game, `Equipped: ${item.name} (+${item.attack} ATK)`);
  } else if (item.type === 'armor') {
    if (game.player.armor) {
      game.player.inventory.push(game.player.armor);
    }
    game.player.armor = item;
    game.player.inventory.splice(index, 1);
    addLog(game, `Equipped: ${item.name} (+${item.defense} DEF)`);
  } else if (item.type === 'charm') {
    if (game.player.charm) {
      game.player.inventory.push(game.player.charm);
    }
    game.player.charm = item;
    game.player.inventory.splice(index, 1);
    addLog(game, `Attuned: ${item.name}`);
    if (item.key === 'green_sash') game.player.hasGreenSash = true;
  }
}

// ── XP & Leveling ───────────────────────────────────────────

function gainXP(game, amount) {
  game.player.xp += amount;
  addLog(game, `+${amount} XP`);
  
  while (game.player.xp >= game.player.xpToLevel) {
    game.player.xp -= game.player.xpToLevel;
    game.player.level++;
    game.player.xpToLevel = Math.floor(game.player.xpToLevel * 1.5);
    game.player.maxHp += 8;
    game.player.hp = Math.min(game.player.hp + 8, game.player.maxHp);
    game.player.attack += 1;
    game.player.defense += 1;
    addLog(game, `⬆ Level ${game.player.level}! HP+8, ATK+1, DEF+1`);
  }
}

// ── Log ─────────────────────────────────────────────────────

function addLog(game, message) {
  game.log.push(message);
  if (game.log.length > 50) game.log = game.log.slice(-50);
}

// ── Utility ─────────────────────────────────────────────────

function seededRandom(seed) {
  let s = seed | 0;
  s = (s + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
