import { canvas, ctx } from './canvas.js';
import { CONFIG, UI_TEXT, BUFF_TYPES, getWordBanks } from './config.js';
import { AudioFX } from './audio.js';
import { randInt, clamp } from './utils.js';
import { renderGrid, renderScanlines, renderPlayer, renderEntity, renderHUD, renderMenu, renderGameOver, renderPauseMenu } from './rendering.js';
import { setupInputListeners } from './input.js';
import { Star } from './entities/star.js';
import { Particle } from './entities/particle.js';
import { Entity } from './entities/entity.js';
import { Bullet } from './entities/bullet.js';

export class Game {
  constructor() {
    this.state = 'menu';

    this.pauseMenuSelectedRow = 0;

    this.language = 'en';

    const savedMusicVolume = localStorage.getItem('typing_space_shooter_music_volume');
    this.musicVolume = savedMusicVolume !== null ? parseFloat(savedMusicVolume) : 0.5;
    const savedSfxVolume = localStorage.getItem('typing_space_shooter_sfx_volume');
    this.sfxVolume = savedSfxVolume !== null ? parseFloat(savedSfxVolume) : 0.5;
    const savedErrorShake = localStorage.getItem('typing_space_shooter_error_shake');
    this.errorShakeEnabled = savedErrorShake !== null ? savedErrorShake === 'true' : true;

    this.entities = [];
    this.bullets = [];
    this.particles = [];
    this.stars = [];

    this.playerX = 0;
    this.playerY = 0;
    this.hearts = CONFIG.PLAYER_DEFAULT_HEARTS;

    this.currentTarget = null;

    this.score = 0;
    this.gameSpeed = 1.0;
    this.speedLevel = 1;
    this.lastSpeedUpScore = 0;
    this.hasPlayedScore50Sound = false;

    const savedHighScore = localStorage.getItem('typing_space_shooter_highscore');
    this.highScore = savedHighScore ? parseInt(savedHighScore, 10) : 0;

    this.activeBuff = null;

    this.hasShield = false;
    this.shieldFlashTimer = 0;

    this.alienSpawnTimer = 0;
    this.luckySpawnTimer = 0;
    this.heartSpawnTimer = 0;

    this.targetFPS = 60;
    this.currentFPS = 0;
    this.fpsFrameCount = 0;
    this.fpsAccumulator = 0;
    this.fpsLimiterAccumulator = 0;
    this.lastFPSCalculationTime = 0;

    this.lastTimestamp = 0;

    this.shakeIntensity = 0;
    this.shakeX = 0;
    this.shakeY = 0;

    this.flashAlpha = 0;
    this.flashColor = '#ff0000';

    this.gameTime = 0;

    for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
      this.stars.push(new Star());
    }

    this.lobbyMusic = new Audio('assets/audio/lobyMusic.mp3');
    this.lobbyMusic.loop = true;
    this.lobbyMusic.volume = this.musicVolume;
    this.backgroundMusic = new Audio('assets/audio/backgroundMusic.mp3');
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = this.musicVolume;

    this.scanlineOffset = 0;
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
    localStorage.setItem('typing_space_shooter_sfx_volume', this.sfxVolume);
  }

  setErrorShake(enabled) {
    this.errorShakeEnabled = enabled;
    localStorage.setItem('typing_space_shooter_error_shake', enabled);
  }

  reset() {
    this.entities = [];
    this.bullets = [];
    this.particles = [];
    this.currentTarget = null;
    this.score = 0;
    this.gameSpeed = 1.0;
    this.speedLevel = 1;
    this.lastSpeedUpScore = 0;
    this.hasPlayedScore50Sound = false;
    this.hearts = CONFIG.PLAYER_DEFAULT_HEARTS;
    this.activeBuff = null;
    this.hasShield = false;
    this.shieldFlashTimer = 0;
    this.alienSpawnTimer = 0;
    this.luckySpawnTimer = 0;
    this.heartSpawnTimer = 0;
    this.shakeIntensity = 0;
    this.flashAlpha = 0;
    this.gameTime = 0;
    this.playerX = canvas.width / 2;
    this.playerY = canvas.height - 135;
    this.pauseMenuSelectedRow = 0;
    this.fpsLimiterAccumulator = 0;
    this.lastFPSCalculationTime = 0;
    this.state = 'playing';
    this.playBackgroundMusic();
  }

  getDifficultyTier() {
    if (this.score < 100) return 'easy';
    if (this.score < 250) return 'medium';
    if (this.score < 500) return 'hard';
    return 'expert';
  }

  getWord(isSpecial = false) {
    let tier = this.getDifficultyTier();
    if (isSpecial) {
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
    const isSpecial = (type !== 'alien');
    const word = this.getWord(isSpecial);
    const padding = 60;
    const x = randInt(padding, canvas.width - padding);
    const entity = new Entity(type, x, word);
    this.entities.push(entity);
  }

  explode(x, y, type) {
    const colors = {
      alien: ['#ff3333', '#ff6600', '#ff9900', '#ffffff'],
      luckybox: ['#ffd700', '#ffaa00', '#fff5a0', '#ffffff'],
      heart: ['#ff69b4', '#ff1493', '#ffb6c1', '#ffffff'],
    };
    const palette = colors[type] || colors.alien;
    const count = randInt(18, 30);
    for (let i = 0; i < count && this.particles.length < CONFIG.MAX_PARTICLES; i++) {
      this.particles.push(new Particle(x, y, palette[randInt(0, palette.length - 1)]));
    }
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

  setFPS(fps) {
    this.targetFPS = fps;
    this.lastTimestamp = 0;
  }

  fireBullet(target) {
    this.bullets.push(new Bullet(this.playerX, this.playerY - CONFIG.PLAYER_SIZE / 2, target));
    AudioFX.playLaser();
  }

  handleHit(entity) {
    if (!entity.alive) return;
    entity.alive = false;
    this.explode(entity.cx, entity.cy, entity.type);

    if (entity.type === 'alien') {
      let pts = CONFIG.SCORE_PER_ALIEN;
      if (this.activeBuff && this.activeBuff.id === 'double') pts *= 2;
      this.score += pts;
      AudioFX.playExplosion();
    }
    else if (entity.type === 'luckybox') {
      const buffDef = BUFF_TYPES[randInt(0, BUFF_TYPES.length - 1)];
      const t = UI_TEXT[this.language];

      if (buffDef.id === 'bomb') {
        for (let i = this.entities.length - 1; i >= 0; i--) {
          const ent = this.entities[i];
          if (ent.alive && ent.type === 'alien') {
            ent.alive = false;
            this.explode(ent.cx, ent.cy, 'alien');
            let pts = CONFIG.SCORE_PER_ALIEN;
            if (this.activeBuff && this.activeBuff.id === 'double') pts *= 2;
            this.score += pts;
            if (ent === this.currentTarget) this.currentTarget = null;
          }
        }
        AudioFX.playExplosion();
        this.shakeIntensity = 22;
        this.flashColor = '#ff4400';
        this.flashAlpha = 0.45;
      }
      else if (buffDef.id === 'shield') {
        if (this.hasShield) {
          let pts = 10;
          if (this.activeBuff && this.activeBuff.id === 'double') pts *= 2;
          this.score += pts;
          AudioFX.playBuff();
          this.flashColor = '#ffd700';
          this.flashAlpha = 0.3;
        } else {
          this.hasShield = true;
          AudioFX.playBuff();
          this.flashColor = '#00ff88';
          this.flashAlpha = 0.3;
        }
      }
      else {
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
    else if (entity.type === 'heart') {
      if (this.hearts < CONFIG.PLAYER_MAX_HEARTS) {
        this.hearts++;
        AudioFX.playHeal();
        this.flashColor = '#ff69b4';
        this.flashAlpha = 0.2;
      } else {
        let pts = 10;
        if (this.activeBuff && this.activeBuff.id === 'double') pts *= 2;
        this.score += pts;
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

  checkSpeedUp() {
    const interval = CONFIG.SPEED_UP_INTERVAL;
    while (this.score >= this.lastSpeedUpScore + interval) {
      this.lastSpeedUpScore += interval;
      this.gameSpeed = Math.min(this.gameSpeed * CONFIG.SPEED_UP_FACTOR, 4.0);
      this.speedLevel++;
    }
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

    if (this.hearts <= 0) {
      this.state = 'gameover';
      this.playLobbyMusic();
      AudioFX.playGameOver();
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('typing_space_shooter_highscore', this.highScore);
      }
    }
  }

  update(dt) {
    this.gameTime += dt;

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
      this.spawnEntity('alien');
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

      let speedMod = (e.type === 'alien') ? 1.0 : 0.7;
      e.y += CONFIG.BASE_FALL_SPEED * this.gameSpeed * speedMod * slowMultiplier * dt;

      e.pulsePhase += 3 * dt;

      if (e.y > canvas.height + 20) {
        e.alive = false;
        if (e === this.currentTarget) { this.currentTarget = null; }

        if (e.type === 'alien') {
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

  t(key) { return UI_TEXT[this.language][key] || UI_TEXT.en[key] || key; }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(this.shakeX, this.shakeY);

    for (const star of this.stars) star.render(this.gameTime);
    renderGrid();

    if (this.state === 'playing' || this.state === 'gameover') {
      for (const e of this.entities) renderEntity(this, e);
      for (const b of this.bullets) b.render();
      for (const p of this.particles) p.render();
      renderPlayer(this);
    }

    ctx.restore();

    renderScanlines(this);

    if (this.flashAlpha > 0) {
      ctx.fillStyle = this.flashColor;
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }

    if (this.state === 'playing' || this.state === 'gameover' || this.state === 'paused') {
      renderHUD(this);
    }

    if (this.state === 'menu') renderMenu(this);
    if (this.state === 'gameover') renderGameOver(this);
    if (this.state === 'paused') renderPauseMenu(this);
  }

  gameLoop(timestamp) {
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      this.fpsFrameCount = 0;
      this.fpsLimiterAccumulator = 0;
      this.lastFPSCalculationTime = timestamp;
      this.queueNextFrame();
      return;
    }

    let elapsed = timestamp - this.lastTimestamp;

    if (elapsed > 200) {
      this.lastTimestamp = timestamp;
      elapsed = 0;
    }

    if (this.targetFPS > 0) {
      this.fpsLimiterAccumulator += elapsed;
      const targetInterval = 1000 / this.targetFPS;
      if (this.fpsLimiterAccumulator < targetInterval - 1.0) {
        this.lastTimestamp = timestamp;
        this.queueNextFrame();
        return;
      }
      this.fpsLimiterAccumulator -= targetInterval;
      if (this.fpsLimiterAccumulator > targetInterval) {
        this.fpsLimiterAccumulator = 0;
      }
    }

    this.lastTimestamp = timestamp;

    const dt = Math.min(elapsed / 1000, 0.1);

    this.fpsFrameCount++;
    const fpsElapsed = timestamp - this.lastFPSCalculationTime;
    if (fpsElapsed >= 1000) {
      this.currentFPS = Math.round((this.fpsFrameCount * 1000) / fpsElapsed);
      this.fpsFrameCount = 0;
      this.lastFPSCalculationTime = timestamp;
    }

    if (this.state === 'playing') {
      this.update(dt);
    } else {
      for (const star of this.stars) star.update(dt);
      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].update(dt);
        if (this.particles[i].life <= 0) this.particles.splice(i, 1);
      }
      this.gameTime += dt;
    }

    this.render();
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
    setupInputListeners(this);
    requestAnimationFrame((t) => this.gameLoop(t));
  }
}
