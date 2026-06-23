import { ctx } from '../core/canvas.js';
import { CONFIG, IMAGES } from '../config/config.js';

export function renderPlayer(game) {
  const px = game.playerX;
  const py = game.playerY;
  const s = CONFIG.PLAYER_SIZE;

  if (IMAGES.player) {
    ctx.drawImage(IMAGES.player, px - s / 2, py - s / 2, s, s);
    return;
  }

  const pulse = 0.85 + 0.15 * Math.sin(game.gameTime * 4);

  ctx.shadowBlur = 25;
  ctx.shadowColor = '#0ff';
  ctx.fillStyle = `rgba(0, 255, 255, ${0.2 * pulse})`;
  ctx.beginPath();
  ctx.moveTo(px - s * 0.25, py + s * 0.3);
  ctx.lineTo(px, py + s * 0.6);
  ctx.lineTo(px + s * 0.25, py + s * 0.3);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 18;
  ctx.shadowColor = '#0ff';
  ctx.strokeStyle = `rgba(0, 255, 255, ${pulse})`;
  ctx.lineWidth = 2.5;
  ctx.fillStyle = 'rgba(0, 30, 50, 0.8)';

  ctx.beginPath();
  ctx.moveTo(px, py - s * 0.5);
  ctx.lineTo(px - s * 0.38, py + s * 0.3);
  ctx.lineTo(px - s * 0.12, py + s * 0.2);
  ctx.lineTo(px, py + s * 0.35);
  ctx.lineTo(px + s * 0.12, py + s * 0.2);
  ctx.lineTo(px + s * 0.38, py + s * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = `rgba(0, 255, 255, ${0.5 + 0.3 * pulse})`;
  ctx.beginPath();
  ctx.moveTo(px, py - s * 0.2);
  ctx.lineTo(px - s * 0.08, py);
  ctx.lineTo(px, py + s * 0.1);
  ctx.lineTo(px + s * 0.08, py);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;

  if (game.hasShield) {
    const shieldPulse = 0.6 + 0.4 * Math.sin(game.gameTime * 3);
    const shieldRadius = s * 0.65;
    ctx.beginPath();
    ctx.arc(px, py, shieldRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.strokeStyle = `rgba(0, 255, 136, ${0.5 * shieldPulse})`;
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#00ff88';
    ctx.stroke();
    ctx.fillStyle = `rgba(0, 255, 136, ${0.06 * shieldPulse})`;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  if (game.shieldFlashTimer > 0) {
    const t = game.shieldFlashTimer;
    const breakRadius = s * 0.65 + (1 - t) * 40;
    ctx.beginPath();
    ctx.arc(px, py, breakRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.strokeStyle = `rgba(0, 255, 136, ${t * 0.8})`;
    ctx.lineWidth = 3 * t;
    ctx.shadowBlur = 20 * t;
    ctx.shadowColor = '#00ff88';
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}
