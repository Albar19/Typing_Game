import { canvas, ctx } from '../core/canvas.js';
import { AudioFX } from '../core/audio.js';
import { SCREEN, renderBackground } from '../core/router.js';
import { renderScanlines } from '../rendering/effects.js';
import { renderEntity } from '../rendering/entity.js';
import { renderPlayer } from '../rendering/player.js';
import { renderHUD } from '../rendering/hud.js';

export const screenPlaying = {
  update(game, dt) {
    game.update(dt);
  },

  onEnter(game) {
    game.playBackgroundMusic();
  },

  onExit(game) {
    game.pauseAllMusic();
  },

  render(game) {
    renderBackground(game);

    ctx.save();
    ctx.translate(game.shakeX, game.shakeY);
    for (const e of game.entities) renderEntity(game, e);
    for (const b of game.bullets) b.render();
    for (const p of game.particles) p.render();
    renderPlayer(game);
    ctx.restore();

    renderScanlines(game);

    if (game.flashAlpha > 0) {
      ctx.fillStyle = game.flashColor;
      ctx.globalAlpha = game.flashAlpha;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }

    renderHUD(game);
  },

  handleKeyDown(game, e) {
    if (e.key === 'Escape') {
      game.router.go(SCREEN.PAUSED);
      return;
    }

    if (e.key === 'Backspace') {
      if (game.currentTarget) {
        game.currentTarget.isTargeted = false;
        game.currentTarget.typedIndex = 0;
        game.currentTarget = null;
      }
      return;
    }

    const key = e.key.toUpperCase();
    if (key.length !== 1 || key < 'A' || key > 'Z') return;

    const hasLaser = game.activeBuff && game.activeBuff.id === 'laser';

    if (game.currentTarget) {
      const nextChar = game.currentTarget.word[game.currentTarget.typedIndex];
      if (key === nextChar) {
        game.currentTarget.typedIndex++;
        
        game.combo++;
        if (game.combo > game.maxCombo) {
          game.maxCombo = game.combo;
        }
        
        AudioFX.playTyping();

        if (hasLaser) {
          game.currentTarget.typedIndex = game.currentTarget.word.length;
        }

        if (game.currentTarget.typedIndex >= game.currentTarget.word.length) {
          game.fireBullet(game.currentTarget);
          game.currentTarget.isTargeted = false;
          game.currentTarget = null;
        }
      } else {
        AudioFX.playErrorType();
        game.combo = 0;
        if (game.errorShakeEnabled) {
          game.shakeIntensity = Math.max(game.shakeIntensity, 4.5);
        }
      }
      return;
    }

    const matches = game.entities.filter(e =>
      e.alive && e.typedIndex === 0 && e.word[0] === key
    );
    if (matches.length === 0) {
      AudioFX.playErrorType();
      game.combo = 0;
      if (game.errorShakeEnabled) {
        game.shakeIntensity = Math.max(game.shakeIntensity, 4.5);
      }
      return;
    }

    matches.sort((a, b) => b.y - a.y);
    const target = matches[0];
    target.isTargeted = true;
    target.typedIndex = 1;
    game.currentTarget = target;
    
    game.combo++;
    if (game.combo > game.maxCombo) {
      game.maxCombo = game.combo;
    }
    
    AudioFX.playTyping();

    if (hasLaser) {
      target.typedIndex = target.word.length;
    }

    if (target.typedIndex >= target.word.length) {
      game.fireBullet(target);
      target.isTargeted = false;
      game.currentTarget = null;
    }
  },
};
