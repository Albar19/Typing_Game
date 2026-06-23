import { ctx } from '../core/canvas.js';

export function renderButton(x, y, w, h, label, isFocused, options = {}) {
  const {
    borderColor = isFocused ? '#ff3399' : 'rgba(255,255,255,0.2)',
    textColor = isFocused ? '#ff3399' : '#fff',
    fillColor = isFocused ? 'rgba(255,51,153,0.15)' : 'transparent',
    lineWidth = isFocused ? 2.5 : 1.5,
    fontSize = '13px',
    shadowColor = isFocused ? '#ff3399' : null,
  } = options;

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 5);
  if (isFocused) {
    ctx.fillStyle = fillColor;
    ctx.fill();
    if (shadowColor) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = shadowColor;
    }
  }
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = textColor;
  ctx.font = `bold ${fontSize} "Orbitron", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2);
}

export function renderToggle(x, y, w, h, label, selected) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 5);
  if (selected) {
    ctx.fillStyle = 'rgba(0,255,255,0.2)';
    ctx.fill();
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#0ff';
  } else {
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = selected ? '#0ff' : '#fff';
  ctx.font = 'bold 12px "Orbitron", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2);
}

export function renderArrowBtn(x, y, label, isFocused) {
  const s = 30;
  ctx.beginPath();
  ctx.roundRect(x, y, s, s, 5);
  ctx.strokeStyle = isFocused ? '#ff3399' : 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px "Orbitron", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + s / 2, y + s / 2);
}

export function renderLabel(text, x, y, isFocused, options = {}) {
  const { color = isFocused ? '#ff3399' : '#888', fontSize = '13px' } = options;
  ctx.font = `bold ${fontSize} "Orbitron", monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (isFocused) {
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#ff3399';
  }
  ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
}

export function renderProgressBar(x, y, w, h, value, color, isFocused) {
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.shadowBlur = isFocused ? 8 : 0;
  ctx.shadowColor = color;
  ctx.fillRect(x, y, w * value, h);
  ctx.shadowBlur = 0;
}
