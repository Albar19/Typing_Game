import { ctx } from '../core/canvas.js';
import { CONFIG, IMAGES } from '../config/config.js';
import { drawHeartShape } from './effects.js';

function renderTargetReticle(game, cx, cy, size) {
  const r = size * 0.7;
  const angle = game.gameTime * 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#0ff';

  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.rotate((Math.PI / 2) * i);
    ctx.beginPath();
    ctx.moveTo(r, r * 0.4);
    ctx.lineTo(r, r);
    ctx.lineTo(r * 0.4, r);
    ctx.stroke();
    ctx.restore();
  }

  ctx.shadowBlur = 0;
  ctx.restore();
}

function renderWordLabel(e) {
  const word = e.word;
  const fontSize = 16;
  ctx.font = `bold ${fontSize}px 'Share Tech Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';

  const labelY = e.cy - e.size * 0.55 - 8;

  const textWidth = ctx.measureText(word).width;
  const pillPadX = 8, pillPadY = 4;
  const pillX = e.cx - textWidth / 2 - pillPadX;
  const pillY = labelY - fontSize - pillPadY;
  const pillW = textWidth + pillPadX * 2;
  const pillH = fontSize + pillPadY * 2;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 5);
  ctx.fill();

  const borderColors = {
    alien: 'rgba(255, 50, 50, 0.6)',
    speedy: 'rgba(0, 255, 255, 0.6)',
    tank: 'rgba(204, 0, 255, 0.6)',
    zigzag: 'rgba(0, 255, 102, 0.6)',
    luckybox: 'rgba(255, 215, 0, 0.6)',
    heart: 'rgba(255, 105, 180, 0.6)',
  };
  if (e.isTargeted) {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#0ff';
  } else {
    ctx.strokeStyle = borderColors[e.type] || 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  const totalWidth = ctx.measureText(word).width;
  let startX = e.cx - totalWidth / 2;

  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    const charW = ctx.measureText(ch).width;

    if (i < e.typedIndex) {
      ctx.fillStyle = '#39ff14';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#39ff14';
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowBlur = 0;
    }
    ctx.textAlign = 'left';
    ctx.fillText(ch, startX, labelY);
    startX += charW;
  }
  ctx.shadowBlur = 0;
  ctx.textAlign = 'center';
}

export function renderEntity(game, e) {
  const s = e.size;
  const pulse = 0.8 + 0.2 * Math.sin(e.pulsePhase);
  const cx = e.cx;
  const cy = e.cy;

  if (e.isTargeted) {
    renderTargetReticle(game, cx, cy, s);
  }

  if (game.isAlien(e.type)) {
    if (IMAGES.alien) {
      ctx.save();
      if (e.type === 'speedy') {
        ctx.filter = 'hue-rotate(180deg) saturate(1.5)';
      } else if (e.type === 'tank') {
        ctx.filter = 'hue-rotate(270deg) brightness(1.2) saturate(1.3)';
      } else if (e.type === 'zigzag') {
        ctx.filter = 'hue-rotate(90deg)';
      }
      ctx.drawImage(IMAGES.alien, cx - s / 2, cy - s / 2, s, s);
      ctx.restore();
    } else {
      const themes = {
        alien: { shadow: '#ff3333', stroke: 'rgba(255, 50, 50, ', fill: 'rgba(80, 10, 10, 0.7)', core: 'rgba(255, 80, 80, ' },
        speedy: { shadow: '#00ffff', stroke: 'rgba(0, 255, 255, ', fill: 'rgba(10, 80, 80, 0.7)', core: 'rgba(100, 255, 255, ' },
        tank: { shadow: '#cc00ff', stroke: 'rgba(204, 0, 255, ', fill: 'rgba(60, 10, 80, 0.7)', core: 'rgba(255, 120, 255, ' },
        zigzag: { shadow: '#00ff66', stroke: 'rgba(0, 255, 102, ', fill: 'rgba(10, 80, 30, 0.7)', core: 'rgba(100, 255, 150, ' }
      };
      
      const theme = themes[e.type] || themes.alien;
      
      ctx.shadowBlur = 14;
      ctx.shadowColor = theme.shadow;
      ctx.strokeStyle = theme.stroke + pulse + ')';
      ctx.fillStyle = theme.fill;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = cx + (s * 0.45) * Math.cos(angle);
        const hy = cy + (s * 0.45) * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = theme.core + pulse + ')';
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
  else if (e.type === 'luckybox') {
    if (IMAGES.lucky) {
      ctx.drawImage(IMAGES.lucky, cx - s / 2, cy - s / 2, s, s);
    } else {
      const rotAngle = game.gameTime * 1.5;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotAngle);
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#ffd700';
      ctx.strokeStyle = `rgba(255, 215, 0, ${pulse})`;
      ctx.fillStyle = 'rgba(80, 60, 0, 0.6)';
      ctx.lineWidth = 2.5;
      const hs = s * 0.38;
      ctx.beginPath();
      ctx.moveTo(0, -hs);
      ctx.lineTo(hs, 0);
      ctx.lineTo(0, hs);
      ctx.lineTo(-hs, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = `rgba(255, 255, 150, ${0.5 * pulse})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -hs * 0.5); ctx.lineTo(0, hs * 0.5);
      ctx.moveTo(-hs * 0.5, 0); ctx.lineTo(hs * 0.5, 0);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }
  else if (e.type === 'heart') {
    if (IMAGES.heart) {
      ctx.drawImage(IMAGES.heart, cx - s / 2, cy - s / 2, s, s);
    } else {
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#ff69b4';
      ctx.strokeStyle = `rgba(255, 105, 180, ${pulse})`;
      ctx.fillStyle = 'rgba(100, 20, 50, 0.6)';
      ctx.lineWidth = 2;
      drawHeartShape(cx, cy, s * 0.45);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  renderWordLabel(e);
}
