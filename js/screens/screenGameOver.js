import { canvas, ctx } from '../core/canvas.js';
import { AudioFX } from '../core/audio.js';
import { renderBackground } from '../core/router.js';
import { renderScanlines } from '../rendering/effects.js';
import { renderEntity } from '../rendering/entity.js';
import { renderPlayer } from '../rendering/player.js';
import { renderHUD } from '../rendering/hud.js';

export const screenGameOver = {
  update(game, dt) {
    game.gameTime += dt;
    for (const star of game.stars) star.update(dt);
    for (let i = game.particles.length - 1; i >= 0; i--) {
      game.particles[i].update(dt);
      if (game.particles[i].life <= 0) game.particles.splice(i, 1);
    }
  },

  onEnter(game) {
    game.playLobbyMusic();
    AudioFX.playGameOver();
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

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.fillStyle = 'rgba(5, 0, 10, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#ff0044';
    ctx.fillStyle = '#ff0044';
    ctx.font = 'bold 60px "Orbitron", sans-serif';
    ctx.fillText(game.t('gameOver'), cx, cy - 70);
    ctx.shadowBlur = 0;

    ctx.font = '18px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(game.t('finalScore'), cx, cy - 10);
    ctx.font = 'bold 48px "Orbitron", sans-serif';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffd700';
    ctx.fillStyle = '#ffd700';
    ctx.fillText(`${game.score}`, cx, cy + 35);
    ctx.shadowBlur = 0;

    ctx.font = '14px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText(`${game.t('maxSpeed')}: ${game.gameSpeed.toFixed(2)}x  ·  ${game.t('level')}: ${game.speedLevel}`, cx, cy + 80);

    const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 400);
    ctx.font = 'bold 18px "Orbitron", sans-serif';
    ctx.fillStyle = `rgba(0, 255, 255, ${0.4 + 0.6 * pulse})`;
    ctx.shadowBlur = 10 * pulse;
    ctx.shadowColor = '#0ff';
    ctx.fillText(game.t('pressRestart'), cx, cy + 130);
    ctx.shadowBlur = 0;
  },

  handleKeyDown(game, e) {
    if (e.key === 'Enter') {
      game.reset();
    }
  },
};
