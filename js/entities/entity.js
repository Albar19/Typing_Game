import { CONFIG } from '../config.js';

export class Entity {
  constructor(type, x, word) {
    this.type = type;         // 'alien' | 'luckybox' | 'heart'
    this.x = x;
    this.y = -50;
    this.word = word.toUpperCase();
    this.typedIndex = 0;      // how many letters typed
    this.isTargeted = false;
    this.alive = true;
    this.spawnTime = performance.now();
    this.size = CONFIG.ENTITY_SIZE;
    // Pulsing animation phase
    this.pulsePhase = Math.random() * Math.PI * 2;
  }
  /** Get center X/Y of this entity */
  get cx() { return this.x; }
  get cy() { return this.y; }
}
