import { canvas, ctx } from '../core/canvas.js';
import { SCREEN } from '../core/router.js';
import { renderBackground } from '../core/router.js';
import { renderScanlines } from '../rendering/effects.js';

export const screenMenu = {
  update(game, dt) {
    for (const star of game.stars) star.update(dt);
    game.gameTime += dt;
  },

  render(game) {
    renderBackground(game);
    renderScanlines(game);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#0ff';
    ctx.fillStyle = '#0ff';
    ctx.font = 'bold 48px "Orbitron", sans-serif';
    ctx.fillText(game.t('titleLine1'), cx, cy - 90);
    ctx.font = 'bold 56px "Orbitron", sans-serif';
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#ff3399';
    ctx.fillText(game.t('titleLine2'), cx, cy - 35);
    ctx.shadowBlur = 0;

    const lineW = 300;
    const grad = ctx.createLinearGradient(cx - lineW / 2, 0, cx + lineW / 2, 0);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.3, '#0ff');
    grad.addColorStop(0.7, '#ff3399');
    grad.addColorStop(1, 'transparent');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - lineW / 2, cy + 5);
    ctx.lineTo(cx + lineW / 2, cy + 5);
    ctx.stroke();

    ctx.font = '15px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.fillText(game.t('instruction1'), cx, cy + 50);
    ctx.fillText(game.t('instruction2'), cx, cy + 75);

    const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 400);
    ctx.font = 'bold 20px "Orbitron", sans-serif';
    ctx.fillStyle = `rgba(0, 255, 255, ${0.4 + 0.6 * pulse})`;
    ctx.shadowBlur = 12 * pulse;
    ctx.shadowColor = '#0ff';
    ctx.fillText(game.t('pressStart'), cx, cy + 130);
    ctx.shadowBlur = 0;

    ctx.font = '11px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillText(game.t('version'), cx, canvas.height - 30);
  },

  handleKeyDown(game, e) {
    if (e.key === 'Enter') {
      game.reset();
    }
  },
};
