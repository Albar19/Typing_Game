import { canvas, ctx } from './canvas.js';
import { CONFIG, UI_TEXT, BUFF_TYPES } from '../config/config.js';
import { getWordBanks } from '../config/wordbanks/index.js';
import { AudioFX, setVolume as setAudioVolume } from './audio.js';
import { randInt, clamp } from './utils.js';
import { Star } from '../entities/star.js';
import { Particle } from '../entities/particle.js';
import { Entity } from '../entities/entity.js';
import { Bullet } from '../entities/bullet.js';
import { Router, SCREEN } from './router.js';
import { setupInputListeners } from './input.js';

export class Game {
  constructor() {
    this.language = 'en';

    const savedMusicVolume = localStorage.getItem('typing_space_shooter_music_volume');
    this.musicVolume = savedMusicVolume !== null ? parseFloat(savedMusicVolume) : 0.5;
    const savedSfxVolume = localStorage.getItem('typing_space_shooter_sfx_volume');
    this.sfxVolume = savedSfxVolume !== null ? parseFloat(savedSfxVolume) : 0.5;
    setAudioVolume(this.sfxVolume);
    const savedErrorShake = localStorage.getItem('typing_space_shooter_error_shake');
    this.errorShakeEnabled = savedErrorShake !== null ? savedErrorShake === 'true' : true;
    const savedHighScore = localStorage.getItem('typing_space_shooter_highscore');
    this.highScore = savedHighScore ? parseInt(savedHighScore, 10) : 0;

    this.router = new Router(this);
    this.initGameState();
    this.initStars();
    this.initAudio();
    this.initFPSTracking();

    this.scanlineOffset = 0;
  }

  initGameState() {
    this.entities = [];
    this.bullets = [];
    this.particles = [];
    this.playerX = canvas.width / 2;
    this.playerY = canvas.height - 135;
    this.hearts = CONFIG.PLAYER_DEFAULT_HEARTS;
    this.currentTarget = null;
    this.score = 0;
    this.gameSpeed = 1.0;
    this.speedLevel = 1;
    this.lastSpeedUpScore = 0;
    this.hasPlayedScore50Sound = false;
    this.activeBuff = null;
    this.hasShield = false;
    this.shieldFlashTimer = 0;
    this.alienSpawnTimer = 0;
    this.luckySpawnTimer = 0;
    this.heartSpawnTimer = 0;
    this.shakeIntensity = 0;
    this.shakeX = 0;
    this.shakeY = 0;
    this.flashAlpha = 0;
    this.flashColor = '#ff0000';
    this.gameTime = 0;
    this.pauseMenuSelectedRow = 0;

    // Combo system
    this.combo = 0;
    this.maxCombo = 0;
  }

  isAlien(type) {
    return ['alien', 'speedy', 'tank', 'zigzag'].includes(type);
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
      this.stars.push(new Star());
    }
  }

  initAudio() {
    this.lobbyMusic = new Audio('assets/audio/lobyMusic.mp3');
    this.lobbyMusic.loop = true;
    this.lobbyMusic.volume = this.musicVolume;
    this.backgroundMusic = new Audio('assets/audio/backgroundMusic.mp3');
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = this.musicVolume;
  }

  initFPSTracking() {
    this.targetFPS = 60;
    this.currentFPS = 0;
    this.fpsFrameCount = 0;
    this.fpsAccumulator = 0;
    this.fpsLimiterAccumulator = 0;
    this.lastRenderTime = 0;
    this.lastFPSCalculationTime = 0;
    this.lastTimestamp = 0;
  }

  playLobbyMusic() {
    this.backgroundMusic.pause();
    this.lobbyMusic.play().catch(() => {});
  }

  playBackgroundMusic() {
    this.lobbyMusic.pause();
    this.backgroundMusic.play().catch(() => {});
  }

  pauseAllMusic() {
    this.lobbyMusic.pause();
    this.backgroundMusic.pause();
  }

  setMusicVolume(vol) {
    this.musicVolume = clamp(vol, 0, 1);
    this.lobbyMusic.volume = this.musicVolume;
    this.backgroundMusic.volume = this.musicVolume;
    localStorage.setItem('typing_space_shooter_music_volume', this.musicVolume);
  }

  setSfxVolume(vol) {
    this.sfxVolume = clamp(vol, 0, 1);
    setAudioVolume(this.sfxVolume);
    localStorage.setItem('typing_space_shooter_sfx_volume', this.sfxVolume);
  }

  setErrorShake(enabled) {
    this.errorShakeEnabled = enabled;
    localStorage.setItem('typing_space_shooter_error_shake', enabled);
  }

  setFPS(fps) {
    this.targetFPS = fps;
    this.lastTimestamp = 0;
  }

  setLanguage(lang) {
    this.language = lang;
    if (this.currentTarget) {
      this.currentTarget.isTargeted = false;
      this.currentTarget = null;
    }
    this.entities = [];
    this.alienSpawnTimer = 0;
    this.luckySpawnTimer = 0;
    this.heartSpawnTimer = 0;
  }

  reset() {
    this.initGameState();
    this.router.go(SCREEN.PLAYING);
    this.playBackgroundMusic();
  }

  getDifficultyTier() {
    if (this.score < 100) return 'easy';
    if (this.score < 250) return 'medium';
    if (this.score < 500) return 'hard';
    return 'expert';
  }

  getWord(isSpecial = false, forceTier = null) {
    let tier = forceTier || this.getDifficultyTier();
    if (isSpecial && !forceTier) {
      const order = ['easy', 'medium', 'hard', 'expert'];
      const idx = order.indexOf(tier);
      tier = order[Math.min(idx + 1, order.length - 1)];
    }
    const banks = getWordBanks(this.language);
    const pool = banks[tier];
    const activeWords = new Set(this.entities.map(e => e.word));
    const activeFirstLetters = new Set(this.entities.map(e => e.word[0]));

    let candidates = pool.filter(w => !activeWords.has(w.toUpperCase()) && !activeFirstLetters.has(w[0].toUpperCase()));
    if (candidates.length === 0) {
      candidates = pool.filter(w => !activeWords.has(w.toUpperCase()));
    }
    if (candidates.length === 0) candidates = pool;

    return candidates[randInt(0, candidates.length - 1)];
  }

  spawnEntity(type) {
    const isAlien = this.isAlien(type);
    const isSpecial = !isAlien;

    let forceTier = null;
    if (type === 'speedy') forceTier = 'easy';
    else if (type === 'tank') forceTier = Math.random() < 0.5 ? 'hard' : 'expert';

    const word = this.getWord(isSpecial, forceTier);
    const padding = 60;
    const x = randInt(padding, canvas.width - padding);
    const entity = new Entity(type, x, word);
    this.entities.push(entity);
  }

  explode(x, y, type) {
    const colors = {
      alien: ['#ff3333', '#ff6600', '#ff9900', '#ffffff'],
      speedy: ['#00ffff', '#00bfff', '#00e5ff', '#ffffff'],
      tank: ['#cc00ff', '#8800ff', '#b300ff', '#ffffff'],
      zigzag: ['#00ff66', '#33ff33', '#99ff33', '#ffffff'],
      luckybox: ['#ffd700', '#ffaa00', '#fff5a0', '#ffffff'],
      heart: ['#ff69b4', '#ff1493', '#ffb6c1', '#ffffff'],
    };
    const palette = colors[type] || colors.alien;
    const count = randInt(18, 30);
    for (let i = 0; i < count && this.particles.length < CONFIG.MAX_PARTICLES; i++) {
      this.particles.push(new Particle(x, y, palette[randInt(0, palette.length - 1)]));
    }
  }

  applyScoreMultiplier(pts) {
    return (this.activeBuff && this.activeBuff.id === 'double') ? pts * 2 : pts;
  }

  fireBullet(target) {
    this.bullets.push(new Bullet(this.playerX, this.playerY - CONFIG.PLAYER_SIZE / 2, target));
    AudioFX.playLaser();
  }

  handleHit(entity) {
    if (!entity.alive) return;
    entity.alive = false;
    this.explode(entity.cx, entity.cy, entity.type);

    if (this.isAlien(entity.type)) {
      let basePts = CONFIG.SCORE_PER_ALIEN;
      if (entity.type === 'speedy') basePts = 15;
      else if (entity.type === 'zigzag') basePts = 20;
      else if (entity.type === 'tank') basePts = 30;

      const comboMultiplier = Math.min(1 + Math.floor(this.combo / 10) * 0.1, 2.0);
      const addedScore = Math.round(this.applyScoreMultiplier(basePts) * comboMultiplier);
      this.score += addedScore;
      
      AudioFX.playExplosion();
    } else if (entity.type === 'luckybox') {
      this.applyBuff(entity);
    } else if (entity.type === 'heart') {
      if (this.hearts < CONFIG.PLAYER_MAX_HEARTS) {
        this.hearts++;
        AudioFX.playHeal();
        this.flashColor = '#ff69b4';
        this.flashAlpha = 0.2;
      } else {
        this.score += this.applyScoreMultiplier(10);
        AudioFX.playHeal();
        this.flashColor = '#ffd700';
        this.flashAlpha = 0.3;
      }
    }

    this.checkSpeedUp();

    if (this.score >= 50 && !this.hasPlayedScore50Sound) {
      AudioFX.playScoreUp();
      this.hasPlayedScore50Sound = true;
    }
  }

  applyBuff(entity) {
    const buffDef = BUFF_TYPES[randInt(0, BUFF_TYPES.length - 1)];
    const t = UI_TEXT[this.language];

    if (buffDef.id === 'bomb') {
      for (let i = this.entities.length - 1; i >= 0; i--) {
        const ent = this.entities[i];
        if (ent.alive && this.isAlien(ent.type)) {
          ent.alive = false;
          this.explode(ent.cx, ent.cy, ent.type);
          
          let basePts = CONFIG.SCORE_PER_ALIEN;
          if (ent.type === 'speedy') basePts = 15;
          else if (ent.type === 'zigzag') basePts = 20;
          else if (ent.type === 'tank') basePts = 30;

          this.score += this.applyScoreMultiplier(basePts);
          if (ent === this.currentTarget) this.currentTarget = null;
        }
      }
      AudioFX.playExplosion();
      this.shakeIntensity = 22;
      this.flashColor = '#ff4400';
      this.flashAlpha = 0.45;
    } else if (buffDef.id === 'shield') {
      if (this.hasShield) {
        this.score += this.applyScoreMultiplier(10);
      } else {
        this.hasShield = true;
      }
      AudioFX.playBuff();
      this.flashColor = buffDef.id === 'shield' ? '#00ff88' : '#ffd700';
      this.flashAlpha = 0.3;
    } else {
      this.activeBuff = {
        id: buffDef.id,
        name: t[buffDef.nameKey],
        color: buffDef.color,
        timer: CONFIG.BUFF_DURATION_MS / 1000,
      };
      AudioFX.playBuff();
      this.flashColor = buffDef.color;
      this.flashAlpha = 0.25;
    }
  }

  checkSpeedUp() {
    this.speedLevel = Math.max(1, Math.floor(this.gameSpeed * 2) - 1);
  }

  loseHeart() {
    if (this.hasShield) {
      this.hasShield = false;
      this.shieldFlashTimer = 1.0;
      this.shakeIntensity = 8;
      this.flashColor = '#00ff88';
      this.flashAlpha = 0.3;
      AudioFX.playBuff();
      return;
    }

    this.hearts--;
    this.shakeIntensity = 14;
    this.flashColor = '#ff0000';
    this.flashAlpha = 0.35;
    AudioFX.playHit();
    this.combo = 0;

    if (this.hearts <= 0) {
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('typing_space_shooter_highscore', this.highScore);
      }
      this.router.go(SCREEN.GAME_OVER);
    }
  }

  update(dt) {
    this.gameTime += dt;

    // Smooth Dino-style continuous speed increase (0.12% speedup per second, capped at 2.2x)
    this.gameSpeed = Math.min(1.0 + this.gameTime * 0.0012, 2.2);
    this.speedLevel = Math.max(1, Math.floor(this.gameSpeed * 2) - 1);

    this.playerX = canvas.width / 2;
    this.playerY = canvas.height - 135;

    if (this.shakeIntensity > 0) {
      this.shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeY = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity *= Math.pow(0.05, dt);
      if (this.shakeIntensity < 0.3) { this.shakeIntensity = 0; this.shakeX = 0; this.shakeY = 0; }
    }

    if (this.flashAlpha > 0) {
      this.flashAlpha -= dt * 1.2;
      if (this.flashAlpha < 0) this.flashAlpha = 0;
    }

    if (this.activeBuff) {
      this.activeBuff.timer -= dt;
      if (this.activeBuff.timer <= 0) this.activeBuff = null;
    }

    if (this.shieldFlashTimer > 0) {
      this.shieldFlashTimer -= dt * 2;
      if (this.shieldFlashTimer < 0) this.shieldFlashTimer = 0;
    }

    const dtMs = dt * 1000;
    this.alienSpawnTimer += dtMs;
    this.luckySpawnTimer += dtMs;
    this.heartSpawnTimer += dtMs;

    const alienInterval = CONFIG.BASE_ALIEN_SPAWN_MS / Math.sqrt(this.gameSpeed);
    if (this.alienSpawnTimer >= alienInterval) {
      this.alienSpawnTimer -= alienInterval;
      
      // Determine type selection based on elapsed gameTime
      let chosenType = 'alien';
      const rand = Math.random();
      const t = this.gameTime;

      if (t < 40) {
        chosenType = 'alien';
      } else if (t < 80) {
        chosenType = rand < 0.85 ? 'alien' : 'speedy';
      } else if (t < 140) {
        if (rand < 0.75) chosenType = 'alien';
        else if (rand < 0.90) chosenType = 'speedy';
        else chosenType = 'zigzag';
      } else {
        if (rand < 0.65) chosenType = 'alien';
        else if (rand < 0.80) chosenType = 'speedy';
        else if (rand < 0.92) chosenType = 'zigzag';
        else chosenType = 'tank';
      }
      
      this.spawnEntity(chosenType);
    }
    
    if (this.luckySpawnTimer >= CONFIG.LUCKY_BOX_SPAWN_MS) {
      this.luckySpawnTimer -= CONFIG.LUCKY_BOX_SPAWN_MS;
      this.spawnEntity('luckybox');
    }
    if (this.heartSpawnTimer >= CONFIG.HEART_SPAWN_MS) {
      this.heartSpawnTimer -= CONFIG.HEART_SPAWN_MS;
      this.spawnEntity('heart');
    }

    const slowMultiplier = (this.activeBuff && this.activeBuff.id === 'slowmo') ? 0.4 : 1.0;
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const e = this.entities[i];
      if (!e.alive) {
        if (e === this.currentTarget) this.currentTarget = null;
        this.entities.splice(i, 1);
        continue;
      }

      let speedMod = 1.0;
      if (e.type === 'speedy') speedMod = 1.25;
      else if (e.type === 'tank') speedMod = 0.45;
      else if (e.type === 'zigzag') speedMod = 0.75;
      else if (e.type === 'luckybox' || e.type === 'heart') speedMod = 0.6;

      e.y += CONFIG.BASE_FALL_SPEED * this.gameSpeed * speedMod * slowMultiplier * dt;
      
      if (e.type === 'zigzag') {
        const elapsedSec = (performance.now() - e.spawnTime) / 1000;
        e.x += Math.sin(elapsedSec * 4.0) * 150 * dt;
        e.x = clamp(e.x, 40, canvas.width - 40);
      }
      
      e.pulsePhase += 3 * dt;

      if (e.y > canvas.height + 20) {
        e.alive = false;
        if (e === this.currentTarget) this.currentTarget = null;
        if (this.isAlien(e.type)) {
          this.loseHeart();
        }
        this.entities.splice(i, 1);
      }
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      const hit = b.update(dt);
      if (hit) {
        this.handleHit(b.target);
        this.bullets.splice(i, 1);
      } else if (!b.target.alive) {
        this.bullets.splice(i, 1);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(dt);
      if (this.particles[i].life <= 0) this.particles.splice(i, 1);
    }

    for (const star of this.stars) star.update(dt);
    this.scanlineOffset = (this.scanlineOffset + 30 * dt) % 4;
  }

  t(key) {
    return UI_TEXT[this.language][key] || UI_TEXT.en[key] || key;
  }

  gameLoop(timestamp) {
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      this.lastRenderTime = timestamp;
      this.fpsFrameCount = 0;
      this.fpsLimiterAccumulator = 0;
      this.lastFPSCalculationTime = timestamp;
      this.queueNextFrame();
      return;
    }

    let elapsed = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    if (elapsed > 200) {
      elapsed = 0;
      this.lastRenderTime = timestamp;
    }

    if (this.targetFPS > 0) {
      this.fpsLimiterAccumulator += elapsed;
      const targetInterval = 1000 / this.targetFPS;
      if (this.fpsLimiterAccumulator < targetInterval - 1.0) {
        this.queueNextFrame();
        return;
      }
      this.fpsLimiterAccumulator -= targetInterval;
      if (this.fpsLimiterAccumulator > targetInterval) {
        this.fpsLimiterAccumulator = 0;
      }
    }

    const dt = Math.min((timestamp - this.lastRenderTime) / 1000, 0.1);
    this.lastRenderTime = timestamp;

    this.fpsFrameCount++;
    const fpsElapsed = timestamp - this.lastFPSCalculationTime;
    if (fpsElapsed >= 1000) {
      this.currentFPS = Math.round((this.fpsFrameCount * 1000) / fpsElapsed);
      this.fpsFrameCount = 0;
      this.lastFPSCalculationTime = timestamp;
    }

    this.router.update(dt);
    this.router.render();
    this.queueNextFrame();
  }

  queueNextFrame() {
    if (this.targetFPS === 0) {
      setTimeout(() => this.gameLoop(performance.now()), 0);
    } else {
      requestAnimationFrame((t) => this.gameLoop(t));
    }
  }

  start() {
    this.router.go(SCREEN.MENU);
    setupInputListeners(this);
    requestAnimationFrame((t) => this.gameLoop(t));
  }
}
