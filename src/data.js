// ═══════════════════════════════════════════════════════════════
// THE GREEN CHAPEL — Content Data
// ═══════════════════════════════════════════════════════════════

export const TILES = {
  WALL: '█',
  FLOOR: '·',
  DOOR: '▫',
  PLAYER: '@',
  ENEMY: '☠',
  ITEM: '♦',
  STAIRS: '▼',
  SHRINE: '†',
  CHEST: '■',
  CHAPEL: '⛪',
};

export const BIOMES = [
  {
    name: 'The Dark Forest',
    depth: [1, 2],
    description: 'Ancient oaks crowd the path. The canopy swallows the sky.',
    floorChar: '.',
    wallChar: '🌲',
    enemies: ['wolf', 'bandit', 'woodwose'],
    encounters: ['hermit', 'crossroads', 'strange_light'],
  },
  {
    name: 'The Ruined Abbey',
    depth: [2, 3],
    description: 'Broken stone and silence. Something watches from the belltower.',
    floorChar: '.',
    wallChar: '▓',
    enemies: ['revenant', 'false_monk', 'gargoyle'],
    encounters: ['altar', 'library', 'confession'],
  },
  {
    name: 'The Moors',
    depth: [3, 4],
    description: 'Fog rolls across flat nothing. The ground is uncertain beneath you.',
    floorChar: ',',
    wallChar: '~',
    enemies: ['barghest', 'will_o_wisp', 'bog_knight'],
    encounters: ['standing_stones', 'lost_traveler', 'the_ford'],
  },
  {
    name: 'The Caverns',
    depth: [4, 5],
    description: 'Dripping dark. The walls breathe.',
    floorChar: '.',
    wallChar: '░',
    enemies: ['cave_troll', 'blind_wyrm', 'shadow'],
    encounters: ['underground_lake', 'old_bones', 'echoes'],
  },
  {
    name: 'The Green Chapel',
    depth: [5, 5],
    description: 'A mound of earth split by a stream. Green moss covers everything. He is here.',
    floorChar: '.',
    wallChar: '♣',
    enemies: ['green_knight'],
    encounters: ['the_bargain'],
  },
];

export const ENEMIES = {
  wolf: {
    name: 'Hungry Wolf',
    hp: 12, maxHp: 12, attack: 4, defense: 1,
    description: 'Ribs showing. Desperate.',
    xp: 8,
    loot: ['wolf_pelt'],
  },
  bandit: {
    name: 'Forest Bandit',
    hp: 18, maxHp: 18, attack: 5, defense: 2,
    description: 'A man with hollow eyes and a rusted blade.',
    xp: 12,
    loot: ['stolen_coin', 'rusty_sword'],
  },
  woodwose: {
    name: 'Woodwose',
    hp: 25, maxHp: 25, attack: 6, defense: 3,
    description: 'A wild man of the woods, more bark than flesh.',
    xp: 18,
    loot: ['herb_pouch', 'wooden_charm'],
  },
  revenant: {
    name: 'Revenant',
    hp: 22, maxHp: 22, attack: 7, defense: 2,
    description: 'It died once. It did not take.',
    xp: 20,
    loot: ['grave_dust', 'tarnished_ring'],
  },
  false_monk: {
    name: 'False Monk',
    hp: 15, maxHp: 15, attack: 8, defense: 1,
    description: 'The robes are real. The prayers are not.',
    xp: 15,
    loot: ['prayer_beads', 'hidden_dagger'],
  },
  gargoyle: {
    name: 'Stone Gargoyle',
    hp: 30, maxHp: 30, attack: 6, defense: 5,
    description: 'It was decorative. Now it is not.',
    xp: 25,
    loot: ['stone_fragment'],
  },
  barghest: {
    name: 'Barghest',
    hp: 28, maxHp: 28, attack: 9, defense: 3,
    description: 'A black dog the size of a horse. Its eyes are fire.',
    xp: 30,
    loot: ['shadow_fang', 'dark_essence'],
  },
  will_o_wisp: {
    name: "Will-o'-the-Wisp",
    hp: 10, maxHp: 10, attack: 12, defense: 0,
    description: 'Beautiful. Lethal. It wants you to follow.',
    xp: 22,
    loot: ['wisp_light'],
  },
  bog_knight: {
    name: 'Bog Knight',
    hp: 35, maxHp: 35, attack: 8, defense: 4,
    description: 'Armor green with algae. Sword still sharp.',
    xp: 35,
    loot: ['waterlogged_shield', 'bog_iron_sword'],
  },
  cave_troll: {
    name: 'Cave Troll',
    hp: 45, maxHp: 45, attack: 10, defense: 5,
    description: 'It fills the passage. The smell alone is a weapon.',
    xp: 40,
    loot: ['troll_hide', 'crushed_helm'],
  },
  blind_wyrm: {
    name: 'Blind Wyrm',
    hp: 38, maxHp: 38, attack: 11, defense: 3,
    description: 'It hunts by vibration. Do not breathe.',
    xp: 38,
    loot: ['wyrm_scale', 'venom_sac'],
  },
  shadow: {
    name: 'Shadow',
    hp: 20, maxHp: 20, attack: 13, defense: 0,
    description: 'Your own silhouette, detached and hostile.',
    xp: 30,
    loot: ['shadow_essence'],
  },
  green_knight: {
    name: 'The Green Knight',
    hp: 100, maxHp: 100, attack: 15, defense: 6,
    description: 'Green from crown to heel. He smiles. He has been waiting.',
    xp: 0, // Final boss
    loot: [],
    boss: true,
  },
};

export const ITEMS = {
  // Healing
  herb_pouch: { name: 'Herb Pouch', type: 'consumable', effect: 'heal', value: 15, description: 'Fragrant. Restorative.' },
  bread_loaf: { name: 'Stale Bread', type: 'consumable', effect: 'heal', value: 8, description: 'Hard enough to break teeth, but it fills.' },
  healing_draught: { name: 'Healing Draught', type: 'consumable', effect: 'heal', value: 25, description: 'Tastes of iron and hope.' },
  
  // Weapons
  rusty_sword: { name: 'Rusty Sword', type: 'weapon', attack: 2, description: 'Better than fists. Barely.' },
  hidden_dagger: { name: 'Hidden Dagger', type: 'weapon', attack: 3, description: 'Small, sharp, and meant for backs.' },
  bog_iron_sword: { name: 'Bog Iron Sword', type: 'weapon', attack: 5, description: 'Dark metal. It hums faintly.' },
  blessed_blade: { name: 'Blessed Blade', type: 'weapon', attack: 7, description: 'Light as thought. The edge glows faintly.' },
  
  // Armor
  wolf_pelt: { name: 'Wolf Pelt', type: 'armor', defense: 1, description: 'Warm. Bloody.' },
  troll_hide: { name: 'Troll Hide', type: 'armor', defense: 3, description: 'Thick as old leather. Smells worse.' },
  waterlogged_shield: { name: 'Waterlogged Shield', type: 'armor', defense: 2, description: 'Heavy with centuries of water.' },
  wyrm_scale: { name: 'Wyrm Scale', type: 'armor', defense: 4, description: 'Iridescent. Hard as steel.' },
  
  // Special
  wooden_charm: { name: 'Wooden Charm', type: 'charm', effect: 'luck', description: 'Carved with old symbols. Feels warm.' },
  prayer_beads: { name: 'Prayer Beads', type: 'charm', effect: 'protection', description: 'Each bead a different saint.' },
  tarnished_ring: { name: 'Tarnished Ring', type: 'charm', effect: 'strength', description: 'Whose finger did this circle?' },
  wisp_light: { name: 'Captured Wisp', type: 'charm', effect: 'sight', description: 'Glows softly in its jar. Shows hidden things.' },
  shadow_essence: { name: 'Shadow Essence', type: 'charm', effect: 'stealth', description: 'Drink and become hard to see.' },
  green_sash: { name: 'Green Sash', type: 'charm', effect: 'immortality', description: 'Silk the color of spring. The lady said it would protect you.' },
  
  // Currency/misc
  stolen_coin: { name: 'Stolen Coin', type: 'misc', description: 'Gold, with someone else\'s face.' },
  grave_dust: { name: 'Grave Dust', type: 'misc', description: 'From a saint\'s tomb. Maybe.' },
  stone_fragment: { name: 'Stone Fragment', type: 'misc', description: 'Part of a gargoyle. Still warm.' },
  shadow_fang: { name: 'Shadow Fang', type: 'misc', description: 'Black as pitch. Cold to the touch.' },
  dark_essence: { name: 'Dark Essence', type: 'misc', description: 'Bottled darkness. It moves.' },
  venom_sac: { name: 'Venom Sac', type: 'misc', description: 'Handle with extreme care.' },
  crushed_helm: { name: 'Crushed Helm', type: 'misc', description: 'Someone was wearing this when...' },
};

export const ENCOUNTERS = {
  // Forest encounters
  hermit: {
    title: 'The Hermit',
    text: 'A ragged figure sits by a fire. He looks up.\n\n"Knight. You seek the Chapel. I can tell you this: the path splits ahead. One way is safe but long. The other is short but watched."',
    choices: [
      { text: 'Ask for the safe path', result: 'safe_path', effect: { type: 'reveal_map' } },
      { text: 'Ask for the short path', result: 'short_path', effect: { type: 'buff', stat: 'speed', value: 2 } },
      { text: 'Share your food', result: 'share_food', effect: { type: 'heal', value: 0 }, cost: { hp: -5 }, reward: { type: 'item', item: 'green_sash' } },
    ],
  },
  crossroads: {
    title: 'The Crossroads',
    text: 'A stone marker, old beyond reading. Three paths diverge.\n\nLeft smells of flowers. Right echoes with water. Straight ahead, silence.',
    choices: [
      { text: 'Go left (flowers)', result: 'flowers', effect: { type: 'heal', value: 10 } },
      { text: 'Go right (water)', result: 'water', effect: { type: 'item', item: 'healing_draught' } },
      { text: 'Go straight (silence)', result: 'silence', effect: { type: 'xp', value: 20 } },
    ],
  },
  strange_light: {
    title: 'Strange Light',
    text: 'Between the trees, a green glow pulses. It is beautiful and wrong.',
    choices: [
      { text: 'Follow the light', result: 'follow', effect: { type: 'random', good: { type: 'item', item: 'wisp_light' }, bad: { type: 'damage', value: 15 } } },
      { text: 'Turn away', result: 'turn_away', effect: { type: 'xp', value: 5 } },
    ],
  },
  // Abbey encounters
  altar: {
    title: 'The Broken Altar',
    text: 'The altar is cracked but not empty. A chalice sits there, filled with something dark.',
    choices: [
      { text: 'Drink from the chalice', result: 'drink', effect: { type: 'random', good: { type: 'heal', value: 30 }, bad: { type: 'damage', value: 20 } } },
      { text: 'Pray at the altar', result: 'pray', effect: { type: 'buff', stat: 'defense', value: 2 } },
      { text: 'Leave it alone', result: 'leave', effect: { type: 'none' } },
    ],
  },
  library: {
    title: 'The Ruined Library',
    text: 'Books rot on shelves. But one volume sits dry and clean on a reading stand, open to a page that seems to describe... you.',
    choices: [
      { text: 'Read the page', result: 'read', effect: { type: 'xp', value: 25 } },
      { text: 'Take the book', result: 'take', effect: { type: 'buff', stat: 'attack', value: 2 } },
      { text: 'Burn it', result: 'burn', effect: { type: 'random', good: { type: 'xp', value: 40 }, bad: { type: 'curse', stat: 'attack', value: -2 } } },
    ],
  },
  confession: {
    title: 'The Confessional',
    text: 'A voice from behind the screen: "Speak, child. What weighs on you?"\n\nYou did not enter a church.',
    choices: [
      { text: 'Confess your fears', result: 'confess', effect: { type: 'heal', value: 20 } },
      { text: '"Who are you?"', result: 'question', effect: { type: 'xp', value: 15 } },
      { text: 'Attack the screen', result: 'attack', effect: { type: 'combat', enemy: 'false_monk' } },
    ],
  },
  // Moor encounters
  standing_stones: {
    title: 'The Standing Stones',
    text: 'Seven stones in a circle. The air hums. You feel that stepping inside would change something.',
    choices: [
      { text: 'Step inside the circle', result: 'enter', effect: { type: 'random', good: { type: 'full_heal' }, bad: { type: 'teleport_random' } } },
      { text: 'Touch a stone', result: 'touch', effect: { type: 'buff', stat: 'maxHp', value: 5 } },
      { text: 'Walk around', result: 'avoid', effect: { type: 'xp', value: 10 } },
    ],
  },
  lost_traveler: {
    title: 'A Lost Traveler',
    text: 'A woman in fine clothes, shivering. "I\'ve been walking in circles for days. Please — which way is south?"',
    choices: [
      { text: 'Help her find south', result: 'help', effect: { type: 'xp', value: 20 }, cost: { turns: 3 } },
      { text: 'Give her your cloak', result: 'cloak', effect: { type: 'karma', value: 1 }, cost: { defense: -1 } },
      { text: '"I don\'t know either."', result: 'honest', effect: { type: 'none' } },
    ],
  },
  the_ford: {
    title: 'The Ford',
    text: 'A river crossing. The water is waist-deep and fast. On the far bank, something glints.',
    choices: [
      { text: 'Wade across', result: 'wade', effect: { type: 'random', good: { type: 'item', item: 'blessed_blade' }, bad: { type: 'damage', value: 10 } } },
      { text: 'Search for a bridge', result: 'bridge', effect: { type: 'xp', value: 10 } },
    ],
  },
  // Cave encounters
  underground_lake: {
    title: 'The Underground Lake',
    text: 'Still black water stretches into darkness. Something moves beneath the surface — slow, enormous.',
    choices: [
      { text: 'Swim across', result: 'swim', effect: { type: 'random', good: { type: 'xp', value: 30 }, bad: { type: 'combat', enemy: 'blind_wyrm' } } },
      { text: 'Follow the shore', result: 'shore', effect: { type: 'none' } },
      { text: 'Throw a stone in', result: 'stone', effect: { type: 'reveal_map' } },
    ],
  },
  old_bones: {
    title: 'Old Bones',
    text: 'A skeleton in rusted armor, propped against the wall. It died sitting down. A sword rests across its lap.',
    choices: [
      { text: 'Take the sword', result: 'take_sword', effect: { type: 'item', item: 'blessed_blade' } },
      { text: 'Pay respects', result: 'respect', effect: { type: 'heal', value: 15 } },
      { text: 'Search the body', result: 'search', effect: { type: 'random', good: { type: 'item', item: 'healing_draught' }, bad: { type: 'combat', enemy: 'revenant' } } },
    ],
  },
  echoes: {
    title: 'Echoes',
    text: 'Your footsteps echo... but the echoes don\'t match your steps. They\'re slightly ahead of you.',
    choices: [
      { text: 'Follow the echoes', result: 'follow', effect: { type: 'stairs_reveal' } },
      { text: 'Stop moving', result: 'stop', effect: { type: 'xp', value: 15 } },
      { text: 'Call out', result: 'call', effect: { type: 'random', good: { type: 'reveal_map' }, bad: { type: 'combat', enemy: 'shadow' } } },
    ],
  },
  // Final encounter
  the_bargain: {
    title: 'The Bargain',
    text: '"You came." The Green Knight stands before you, axe resting on his shoulder.\n\n"A year ago I let you take my head. Now — kneel."\n\nThis is what you came for. The return blow.',
    choices: [
      { text: 'Kneel. Accept the blow.', result: 'accept', effect: { type: 'final_test', test: 'courage' } },
      { text: 'Fight him.', result: 'fight', effect: { type: 'combat', enemy: 'green_knight' } },
      { text: 'Offer the green sash.', result: 'sash', effect: { type: 'final_test', test: 'honesty' }, requires: 'green_sash' },
    ],
  },
};

export const RESULT_TEXT = {
  safe_path: 'The hermit draws in the dirt. You memorize the turnings.',
  short_path: '"Run," he says. "Don\'t look back." Something in his voice makes you believe him.',
  share_food: 'He eats gratefully. From his rags he produces a green sash. "She gave this to me. I think it\'s meant for you."',
  flowers: 'The scent fills your lungs. For a moment, you forget why you\'re here. The forgetting heals.',
  water: 'A clear spring. You fill your flask. The water tastes of nothing — perfectly, blessedly nothing.',
  silence: 'The silence is not empty. It is full. You walk through it and come out knowing more.',
  follow: 'The light leads you to a hollow tree where something waits...',
  turn_away: 'You walk on. The light follows for a while, then gives up.',
  drink: 'You drink...',
  pray: 'The stone is cold. Your prayer is warm. Something shifts.',
  leave: 'Sometimes the wisest choice is no choice at all.',
  read: 'The words rearrange as you read them. By the end, you understand something you didn\'t before.',
  take: 'The book dissolves as you lift it, but the knowledge stays. Your strikes feel surer.',
  burn: 'The flame catches. The book screams — or the fire does.',
  confess: '"You are forgiven," says the voice. You feel lighter.',
  question: 'Silence. Then: "I am what remains." The confessional is empty when you look.',
  attack: 'The screen splinters. Behind it—',
  enter: 'The world tilts. When it settles, you are changed.',
  touch: 'The stone is warm. Your body absorbs something ancient.',
  avoid: 'You walk the long way. Sometimes that\'s enough.',
  help: 'She thanks you. As she leaves, she turns: "The Chapel is closer than you think."',
  cloak: 'She takes the cloak and vanishes. In the mud where she stood: nothing. Or something.',
  honest: 'She nods. "At least you\'re honest." She walks into the fog.',
  wade: 'The current pulls at you...',
  bridge: 'Half a mile upstream, a fallen tree. Not a bridge, but enough.',
  swim: 'The water is so cold it burns...',
  shore: 'The shore path is long but uneventful. Sometimes uneventful is a blessing.',
  stone: 'The ripples spread unnaturally. They map the lake — and beyond.',
  take_sword: 'The skeleton\'s grip releases easily. Too easily. But the blade is good.',
  respect: 'You close the skeleton\'s visor. "Rest, knight." The air warms.',
  search: 'You reach for the pouch at its belt...',
  follow_echoes: 'The echoes lead you down, always down. Then — a door.',
  stop: 'The echoes continue without you. Then stop. Then begin again, walking back toward you. Then stop.',
  call: 'Your voice returns to you. But the words are different.',
  accept: 'You kneel. The axe rises...',
  fight: 'Steel meets green steel.',
  sash: 'You hold out the sash. The Green Knight\'s smile changes.',
};

export const DEATH_MESSAGES = [
  'The forest takes you back.',
  'Your story ends here. Another will begin.',
  'The Chapel waits. You will not reach it. Not this time.',
  'Darkness. Then — something else.',
  'You fall. The ground is soft. That is the last kind thing.',
  'The birds go silent. Then, after a while, they sing again.',
];

export const VICTORY_MESSAGES = {
  courage: `The axe falls — and stops. A nick on your neck. A single drop of blood.

"You flinched," says the Green Knight. "But you did not run."

He lowers the axe. "That is enough. You kept your word, Sir Knight.
Most do not. Go now. Live well. Remember that you were tested,
and you did not fail."

The Green Chapel fades. The forest opens. Birdsong.

You walk home.

 ╔═══════════════════════════════════╗
 ║     YOU REACHED THE CHAPEL.      ║
 ║     THE BARGAIN IS FULFILLED.    ║
 ╚═══════════════════════════════════╝`,

  honesty: `You hold out the green sash.

"Ah," says the Green Knight. His smile is not cruel. It is sad.
"The lady's gift. You kept it. You were afraid."

A pause.

"But you brought it here. You showed me. That is something."

The axe swings twice — feints. The third time, a scratch.
"For the sash. For the small dishonesty. But courage
covers much."

He vanishes. The Chapel is just a hill again.
You tie the sash around your arm. You will wear it always.

 ╔═══════════════════════════════════╗
 ║     YOU REACHED THE CHAPEL.      ║
 ║     THE TRUTH SET YOU FREE.      ║
 ╚═══════════════════════════════════╝`,

  combat: `You fight the Green Knight. It is the hardest thing you have ever done.

When it ends — when the green armor finally cracks and the
impossible figure falls — the forest goes silent.

Then laughter. He rises. Of course he rises.

"Well struck," he says, whole again. "But that was never the test."

He walks away. The Chapel is empty.

You won. You also didn't.

 ╔═══════════════════════════════════╗
 ║     YOU REACHED THE CHAPEL.      ║
 ║     BUT AT WHAT COST?            ║
 ╚═══════════════════════════════════╝`,
};
