// ═══════════════════════════════════════════════════════════════
// THE GREEN CHAPEL — Procedural Map Generation
// ═══════════════════════════════════════════════════════════════

export const MAP_WIDTH = 48;
export const MAP_HEIGHT = 24;

export const CELL = {
  WALL: 0,
  FLOOR: 1,
  DOOR: 2,
  STAIRS: 3,
  SHRINE: 4,
  CHEST: 5,
  ENEMY: 6,
  ITEM: 7,
};

class Room {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.centerX = Math.floor(x + w / 2);
    this.centerY = Math.floor(y + h / 2);
    this.connected = false;
  }

  intersects(other, padding = 1) {
    return (
      this.x - padding < other.x + other.w &&
      this.x + this.w + padding > other.x &&
      this.y - padding < other.y + other.h &&
      this.y + this.h + padding > other.y
    );
  }
}

function rng(seed) {
  // Simple seeded RNG (mulberry32)
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateMap(depth, seed) {
  const rand = rng(seed + depth * 1000);
  const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;

  // Initialize grid
  const grid = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    grid[y] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      grid[y][x] = CELL.WALL;
    }
  }

  // Generate rooms
  const rooms = [];
  const numRooms = randInt(5, 8);
  const maxAttempts = 100;

  for (let i = 0; i < numRooms && rooms.length < numRooms; i++) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const w = randInt(4, 9);
      const h = randInt(3, 6);
      const x = randInt(1, MAP_WIDTH - w - 1);
      const y = randInt(1, MAP_HEIGHT - h - 1);
      const room = new Room(x, y, w, h);

      let valid = true;
      for (const existing of rooms) {
        if (room.intersects(existing, 2)) {
          valid = false;
          break;
        }
      }

      if (valid) {
        rooms.push(room);
        // Carve room
        for (let ry = room.y; ry < room.y + room.h; ry++) {
          for (let rx = room.x; rx < room.x + room.w; rx++) {
            grid[ry][rx] = CELL.FLOOR;
          }
        }
        break;
      }
    }
  }

  // Connect rooms with corridors
  for (let i = 1; i < rooms.length; i++) {
    const a = rooms[i - 1];
    const b = rooms[i];

    // L-shaped corridor
    if (rand() < 0.5) {
      carveHCorridor(grid, a.centerX, b.centerX, a.centerY);
      carveVCorridor(grid, a.centerY, b.centerY, b.centerX);
    } else {
      carveVCorridor(grid, a.centerY, b.centerY, a.centerX);
      carveHCorridor(grid, a.centerX, b.centerX, b.centerY);
    }
  }

  // Place entities
  const entities = { enemies: [], items: [], encounters: [], stairs: null, start: null };

  // Start position (first room center)
  entities.start = { x: rooms[0].centerX, y: rooms[0].centerY };

  // Stairs down (last room) — or Chapel on final level
  if (depth < 5) {
    const lastRoom = rooms[rooms.length - 1];
    entities.stairs = { x: lastRoom.centerX, y: lastRoom.centerY };
    grid[lastRoom.centerY][lastRoom.centerX] = CELL.STAIRS;
  }

  // Place enemies in middle rooms
  for (let i = 1; i < rooms.length - 1; i++) {
    if (rand() < 0.6) {
      const room = rooms[i];
      const ex = randInt(room.x + 1, room.x + room.w - 2);
      const ey = randInt(room.y + 1, room.y + room.h - 2);
      if (grid[ey][ex] === CELL.FLOOR) {
        entities.enemies.push({ x: ex, y: ey });
        grid[ey][ex] = CELL.ENEMY;
      }
    }
  }

  // Place items
  for (let i = 0; i < rooms.length; i++) {
    if (rand() < 0.3) {
      const room = rooms[i];
      const ix = randInt(room.x, room.x + room.w - 1);
      const iy = randInt(room.y, room.y + room.h - 1);
      if (grid[iy][ix] === CELL.FLOOR) {
        entities.items.push({ x: ix, y: iy });
        grid[iy][ix] = CELL.ITEM;
      }
    }
  }

  // Place one encounter per level
  if (rooms.length > 2) {
    const encounterRoom = rooms[randInt(1, rooms.length - 2)];
    entities.encounters.push({
      x: encounterRoom.centerX,
      y: encounterRoom.centerY,
    });
    grid[encounterRoom.centerY][encounterRoom.centerX] = CELL.SHRINE;
  }

  return { grid, rooms, entities, width: MAP_WIDTH, height: MAP_HEIGHT };
}

function carveHCorridor(grid, x1, x2, y) {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  for (let x = minX; x <= maxX; x++) {
    if (y >= 0 && y < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
      grid[y][x] = CELL.FLOOR;
    }
  }
}

function carveVCorridor(grid, y1, y2, x) {
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  for (let y = minY; y <= maxY; y++) {
    if (y >= 0 && y < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
      grid[y][x] = CELL.FLOOR;
    }
  }
}
