export { getWordBanks } from './wordbanks/index.js';

// ─── ASSET CONFIGURATION ─────────────────────────────────────
export const PLAYER_SPACESHIP_SRC = 'assets/images/player.png';
export const ALIEN_ENEMY_SRC = 'assets/images/alien.png';
export const LUCKY_BOX_SRC = 'assets/images/luckybox.png';
export const HEART_SRC = 'assets/images/heart.png';

// Preload images only if paths are provided
export const IMAGES = {};
export function preloadImage(key, src) {
  if (!src) return;
  const img = new Image();
  img.src = src;
  img.onload = () => { IMAGES[key] = img; };
}
preloadImage('player', PLAYER_SPACESHIP_SRC);
preloadImage('alien', ALIEN_ENEMY_SRC);
preloadImage('lucky', LUCKY_BOX_SRC);
preloadImage('heart', HEART_SRC);

export const UI_TEXT = {
  en: {
    score: 'SCORE',
    speed: 'SPEED',
    lvl: 'LVL',
    titleLine1: 'NETRUNNER',
    titleLine2: 'TYPING ACADEMY',
    instruction1: 'Type the words above enemies to destroy them',
    instruction2: 'Collect Lucky Boxes for buffs & Hearts for HP',
    pressStart: '[ PRESS ENTER TO START ]',
    version: 'v1.1 — ENDLESS MODE',
    gameOver: 'GAME OVER',
    finalScore: 'FINAL SCORE',
    maxSpeed: 'MAX SPEED',
    level: 'LEVEL',
    pressRestart: '[ PRESS ENTER TO RESTART ]',
    hp: 'HP',
    buffSlowmo: 'SLOW MOTION',
    buffDouble: 'DOUBLE SCORE',
    buffBomb: 'BOMB!',
    buffShield: 'SHIELD',
    buffLaser: 'AUTO LASER',
    paused: 'GAME PAUSED',
    settings: 'SETTINGS',
    language: 'LANGUAGE',
    refreshRate: 'REFRESH RATE',
    musicVolume: 'MUSIC VOLUME',
    sfxVolume: 'SFX VOLUME',
    errorShake: 'ERROR SHAKE',
    unlimited: 'UNLIMITED',
    pressEscResume: '[ PRESS ESC/ENTER TO RESUME ]',
    typeHere: '[ TYPE WORD HERE ]',
    resume: 'RESUME',
  },
  id: {
    score: 'SCORE',
    speed: 'SPEED',
    lvl: 'LVL',
    titleLine1: 'NETRUNNER',
    titleLine2: 'BELAJAR MENGETIK',
    instruction1: 'Ketik kata di atas musuh untuk menghancurkannya',
    instruction2: 'Kumpulkan Kotak Buff & Hati untuk HP',
    pressStart: '[ TEKAN ENTER UNTUK MULAI ]',
    version: 'v1.1 — MODE TAK TERBATAS',
    gameOver: 'PERMAINAN BERAKHIR',
    finalScore: 'SKOR AKHIR',
    maxSpeed: 'KECEPATAN MAKS',
    level: 'LEVEL',
    pressRestart: '[ TEKAN ENTER UNTUK ULANG ]',
    hp: 'HP',
    buffSlowmo: 'GERAK LAMBAT',
    buffDouble: 'SKOR GANDA',
    buffBomb: 'BOM!',
    buffShield: 'PERISAI',
    buffLaser: 'LASER OTOMATIS',
    paused: 'PERMAINAN DIJEDA',
    settings: 'PENGATURAN',
    language: 'BAHASA',
    refreshRate: 'REFRESH RATE',
    musicVolume: 'VOLUME MUSIK',
    sfxVolume: 'VOLUME EFEK SUARA',
    errorShake: 'GETARAN ERROR',
    unlimited: 'UNLIMITED',
    pressEscResume: '[ TEKAN ESC/ENTER UNTUK LANJUT ]',
    typeHere: '[ KETIK KATA DI SINI ]',
    resume: 'LANJUTKAN',
  },
};

// ─── GAME CONFIGURATION ─────────────────────────────────────
export const CONFIG = {
  PLAYER_DEFAULT_HEARTS: 3,
  PLAYER_MAX_HEARTS: 5,
  BASE_FALL_SPEED: 30,           // pixels per second (slower for beginners)
  BULLET_SPEED: 1100,            // pixels per second
  BASE_ALIEN_SPAWN_MS: 5000,     // milliseconds (more breathing room)
  LUCKY_BOX_SPAWN_MS: 15000,
  HEART_SPAWN_MS: 22000,
  BUFF_DURATION_MS: 10000,
  SPEED_UP_INTERVAL: 50,         // every N points gameSpeed increases
  SPEED_UP_FACTOR: 1.05,         // multiplier per interval (5%)
  SCORE_PER_ALIEN: 10,
  ENTITY_SIZE: 42,
  PLAYER_SIZE: 52,
  MAX_PARTICLES: 200,
  STAR_COUNT: 120,
  MAX_ENTITIES: 5,               // max aliens on screen at once
};

// ─── BUFF DEFINITIONS ────────────────────────────────────────
export const BUFF_TYPES = [
  { id: 'slowmo', nameKey: 'buffSlowmo', color: '#00bfff' },
  { id: 'double', nameKey: 'buffDouble', color: '#ffd700' },
  { id: 'bomb', nameKey: 'buffBomb', color: '#ff4400', instant: true },
  { id: 'shield', nameKey: 'buffShield', color: '#00ff88', instant: true },
  { id: 'laser', nameKey: 'buffLaser', color: '#cc44ff' },
];
