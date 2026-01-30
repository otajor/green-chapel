// ═══════════════════════════════════════════════════════════════
// THE GREEN CHAPEL — Terminal-Style Renderer
// ═══════════════════════════════════════════════════════════════

import { MAP_WIDTH, MAP_HEIGHT, CELL } from './map.js';
import { VICTORY_MESSAGES } from './data.js';

const CELL_CHARS = {
  [CELL.WALL]: '█',
  [CELL.FLOOR]: '·',
  [CELL.DOOR]: '+',
  [CELL.STAIRS]: '▼',
  [CELL.SHRINE]: '†',
  [CELL.CHEST]: '■',
  [CELL.ENEMY]: '☠',
  [CELL.ITEM]: '♦',
};

const CELL_COLORS = {
  [CELL.WALL]: '#2a2a2a',
  [CELL.FLOOR]: '#444',
  [CELL.DOOR]: '#886',
  [CELL.STAIRS]: '#8cf',
  [CELL.SHRINE]: '#fc6',
  [CELL.CHEST]: '#fa0',
  [CELL.ENEMY]: '#f44',
  [CELL.ITEM]: '#4f4',
};

export function render(game, container) {
  switch (game.state) {
    case 'title': renderTitle(container); break;
    case 'playing': renderPlaying(game, container); break;
    case 'combat': renderCombat(game, container); break;
    case 'encounter': renderEncounter(game, container); break;
    case 'inventory': renderInventory(game, container); break;
    case 'dead': renderDead(game, container); break;
    case 'victory': renderVictory(game, container); break;
  }
}

function renderTitle(container) {
  container.innerHTML = `
    <div class="screen title-screen">
      <pre class="title-art">
╔═══════════════════════════════════════════════╗
║                                               ║
║            ⚔  THE GREEN CHAPEL  ⚔            ║
║                                               ║
║       A Roguelike of Honour and Peril         ║
║                                               ║
╠═══════════════════════════════════════════════╣
║                                               ║
║  A year ago, the Green Knight came to court.  ║
║  You took his challenge. You took his head.   ║
║  He picked it up and left.                    ║
║                                               ║
║  Now the year turns. You must find the        ║
║  Green Chapel and receive the return blow.    ║
║                                               ║
║  If you are brave. If you are honest.         ║
║                                               ║
╠═══════════════════════════════════════════════╣
║                                               ║
║           [ENTER] Begin your journey          ║
║                                               ║
║    Arrow keys / WASD to move                  ║
║    I = Inventory   U = Use item               ║
║    Space = Wait    ? = Help                   ║
║                                               ║
╚═══════════════════════════════════════════════╝
      </pre>
    </div>
  `;
}

function renderPlaying(game, container) {
  const mapHTML = renderMap(game);
  const statsHTML = renderStats(game);
  const logHTML = renderLog(game);
  const minimapHTML = renderMiniInfo(game);

  container.innerHTML = `
    <div class="screen game-screen">
      <div class="top-bar">
        <span class="biome-name">${game.biome.name}</span>
        <span class="depth">Depth: ${game.depth}/5</span>
        <span class="turns">Turn: ${game.turns}</span>
      </div>
      <div class="map-container">
        <pre class="map">${mapHTML}</pre>
      </div>
      <div class="bottom-panel">
        <div class="stats">${statsHTML}</div>
        <div class="log">${logHTML}</div>
      </div>
      <div class="hint">Move: ←↑↓→/WASD | I: Inventory | ?: Help</div>
    </div>
  `;
}

function renderMap(game) {
  let html = '';
  const { map, fogOfWar, player, enemies, items, encounters, stairs } = game;

  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (!fogOfWar[y][x]) {
        html += '<span class="fog"> </span>';
        continue;
      }

      // Player
      if (x === player.x && y === player.y) {
        html += '<span class="player">@</span>';
        continue;
      }

      // Living enemies
      const enemy = enemies.find(e => e.x === x && e.y === y && e.hp > 0);
      if (enemy) {
        html += `<span class="enemy" title="${enemy.name}">☠</span>`;
        continue;
      }

      // Items on ground
      const item = items.find(i => i.x === x && i.y === y);
      if (item) {
        html += `<span class="item" title="${item.name}">♦</span>`;
        continue;
      }

      // Encounters
      const enc = encounters.find(e => e.x === x && e.y === y && !e.triggered);
      if (enc) {
        html += '<span class="shrine">†</span>';
        continue;
      }

      // Stairs
      if (stairs && x === stairs.x && y === stairs.y) {
        html += '<span class="stairs">▼</span>';
        continue;
      }

      // Terrain
      const cell = map[y][x];
      const ch = CELL_CHARS[cell] || ' ';
      const color = CELL_COLORS[cell] || '#333';
      html += `<span style="color:${color}">${ch}</span>`;
    }
    html += '\n';
  }
  return html;
}

function renderStats(game) {
  const p = game.player;
  const hpPct = Math.max(0, p.hp / p.maxHp);
  const hpColor = hpPct > 0.6 ? '#4f4' : hpPct > 0.3 ? '#fa0' : '#f44';
  const xpPct = p.xp / p.xpToLevel;
  
  const weaponText = p.weapon ? `⚔ ${p.weapon.name} (+${p.weapon.attack})` : '⚔ Fists';
  const armorText = p.armor ? `🛡 ${p.armor.name} (+${p.armor.defense})` : '🛡 None';
  const charmText = p.charm ? `✧ ${p.charm.name}` : '';

  return `
    <div class="stat-line">
      <span style="color:${hpColor}">HP: ${p.hp}/${p.maxHp}</span>
      <span class="hp-bar"><span class="hp-fill" style="width:${hpPct * 100}%; background:${hpColor}"></span></span>
    </div>
    <div class="stat-line">
      <span>ATK: ${p.attack}${p.weapon ? '+' + p.weapon.attack : ''}</span>
      <span>DEF: ${p.defense}${p.armor ? '+' + p.armor.defense : ''}</span>
      <span>LVL: ${p.level}</span>
    </div>
    <div class="stat-line">
      <span class="xp-text">XP: ${p.xp}/${p.xpToLevel}</span>
      <span class="xp-bar"><span class="xp-fill" style="width:${xpPct * 100}%"></span></span>
    </div>
    <div class="equip-line">${weaponText} | ${armorText}${charmText ? ' | ' + charmText : ''}</div>
  `;
}

function renderLog(game) {
  const recent = game.log.slice(-6);
  return recent.map((msg, i) => {
    const opacity = 0.4 + (i / recent.length) * 0.6;
    return `<div class="log-line" style="opacity:${opacity}">${msg}</div>`;
  }).join('');
}

function renderMiniInfo(game) {
  return `<span>Depth ${game.depth}/5</span>`;
}

function renderCombat(game, container) {
  const c = game.combat;
  const e = c.enemy;
  const p = game.player;
  const eHpPct = Math.max(0, e.hp / e.maxHp);
  const pHpPct = Math.max(0, p.hp / p.maxHp);

  const hasConsumable = p.inventory.some(i => i.type === 'consumable');

  container.innerHTML = `
    <div class="screen combat-screen">
      <div class="combat-title">⚔ COMBAT ⚔</div>
      <div class="combatants">
        <div class="combatant enemy-side">
          <div class="combatant-name">${e.name}</div>
          <div class="combatant-desc">${e.description}</div>
          <div class="hp-display">
            <span>HP: ${e.hp}/${e.maxHp}</span>
            <span class="hp-bar"><span class="hp-fill enemy-hp" style="width:${eHpPct * 100}%"></span></span>
          </div>
        </div>
        <div class="vs">VS</div>
        <div class="combatant player-side">
          <div class="combatant-name">Sir Knight (You)</div>
          <div class="hp-display">
            <span>HP: ${p.hp}/${p.maxHp}</span>
            <span class="hp-bar"><span class="hp-fill" style="width:${pHpPct * 100}%"></span></span>
          </div>
        </div>
      </div>
      <div class="combat-log">${c.log.map(l => `<div>${l}</div>`).join('')}</div>
      <div class="combat-actions">
        <button onclick="window.gameAction('attack')" class="action-btn">[A] Attack</button>
        <button onclick="window.gameAction('defend')" class="action-btn">[D] Defend</button>
        <button onclick="window.gameAction('flee')" class="action-btn">[F] Flee</button>
        ${hasConsumable ? '<button onclick="window.gameAction(\'use_combat_item\')" class="action-btn">[U] Use Item</button>' : ''}
      </div>
    </div>
  `;
}

function renderEncounter(game, container) {
  const enc = game.encounter;
  if (!enc) return;

  const choicesHTML = enc.choices.map((c, i) => {
    const disabled = c.requires && !game.player.inventory.some(it => it.key === c.requires) && !game.player.hasGreenSash;
    return `<button onclick="window.gameChoice(${i})" class="choice-btn" ${disabled ? 'disabled title="Requires: ' + c.requires + '"' : ''}>[${i + 1}] ${c.text}</button>`;
  }).join('');

  container.innerHTML = `
    <div class="screen encounter-screen">
      <div class="encounter-title">† ${enc.title}</div>
      <div class="encounter-text">${enc.text.replace(/\n/g, '<br>')}</div>
      <div class="encounter-choices">${choicesHTML}</div>
    </div>
  `;
}

function renderInventory(game, container) {
  const p = game.player;
  const itemsHTML = p.inventory.length === 0
    ? '<div class="inv-empty">Your pack is empty.</div>'
    : p.inventory.map((item, i) => {
      const typeIcon = { consumable: '🧪', weapon: '⚔', armor: '🛡', charm: '✧', misc: '•' }[item.type] || '•';
      return `<button onclick="window.gameUseItem(${i})" class="inv-item">${typeIcon} ${item.name} <span class="inv-desc">${item.description}</span></button>`;
    }).join('');

  const equippedHTML = `
    <div class="equipped">
      <div class="equip-slot">⚔ Weapon: ${p.weapon ? p.weapon.name + ' (+' + p.weapon.attack + ' ATK)' : 'None'}</div>
      <div class="equip-slot">🛡 Armor: ${p.armor ? p.armor.name + ' (+' + p.armor.defense + ' DEF)' : 'None'}</div>
      <div class="equip-slot">✧ Charm: ${p.charm ? p.charm.name : 'None'}</div>
    </div>
  `;

  container.innerHTML = `
    <div class="screen inventory-screen">
      <div class="inv-title">📦 Inventory [ESC to close]</div>
      ${equippedHTML}
      <div class="inv-list">${itemsHTML}</div>
    </div>
  `;
}

function renderDead(game, container) {
  const lastLog = game.log.slice(-3);
  container.innerHTML = `
    <div class="screen death-screen">
      <pre class="death-art">
╔═══════════════════════════════════════════════╗
║                                               ║
║              YOU HAVE FALLEN                  ║
║                                               ║
╚═══════════════════════════════════════════════╝
      </pre>
      <div class="death-log">${lastLog.map(l => `<div>${l}</div>`).join('')}</div>
      <div class="death-stats">
        <div>Depth reached: ${game.depth}/5</div>
        <div>Turns survived: ${game.turns}</div>
        <div>Level: ${game.player.level}</div>
      </div>
      <div class="death-prompt">
        <button onclick="window.gameRestart()" class="action-btn">[ENTER] Try again</button>
      </div>
    </div>
  `;
}

function renderVictory(game, container) {
  const type = game.victoryType || 'courage';
  const text = VICTORY_MESSAGES[type] || VICTORY_MESSAGES.courage;

  container.innerHTML = `
    <div class="screen victory-screen">
      <div class="victory-text"><pre>${text}</pre></div>
      <div class="victory-stats">
        <div>Turns: ${game.turns} | Level: ${game.player.level} | Karma: ${game.player.karma}</div>
      </div>
      <div class="victory-prompt">
        <button onclick="window.gameRestart()" class="action-btn">[ENTER] Journey again</button>
      </div>
    </div>
  `;
}
