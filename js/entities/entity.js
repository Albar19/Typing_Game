import { CONFIG } from '../config/config.js';

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
    if (type === 'speedy') {
      this.size = CONFIG.ENTITY_SIZE * 0.8;
    } else if (type === 'tank') {
      this.size = CONFIG.ENTITY_SIZE * 1.35;
    }
    // Pulsing animation phase
    this.pulsePhase = Math.random() * Math.PI * 2;
  }
  /** Get center X/Y of this entity */
  get cx() { return this.x; }
  get cy() { return this.y; }
}
