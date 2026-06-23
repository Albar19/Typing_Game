import { canvas, ctx } from '../core/canvas.js';

export function drawHeartShape(cx, cy, size) {
  const w = size, h = size;
  ctx.beginPath();
  ctx.moveTo(cx, cy - h * 0.15);
  ctx.bezierCurveTo(cx, cy - h * 0.55, cx - w * 0.55, cy - h * 0.55, cx - w * 0.55, cy - h * 0.15);
  ctx.bezierCurveTo(cx - w * 0.55, cy + h * 0.15, cx, cy + h * 0.35, cx, cy + h * 0.55);
  ctx.bezierCurveTo(cx, cy + h * 0.35, cx + w * 0.55, cy + h * 0.15, cx + w * 0.55, cy - h * 0.15);
  ctx.bezierCurveTo(cx + w * 0.55, cy - h * 0.55, cx, cy - h * 0.55, cx, cy - h * 0.15);
  ctx.closePath();
}

export function renderGrid() {
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  const gridSize = 80;
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
}

export function renderScanlines(game) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
  for (let y = game.scanlineOffset; y < canvas.height; y += 4) {
    ctx.fillRect(0, y, canvas.width, 2);
  }
}
