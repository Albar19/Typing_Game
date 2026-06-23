import { canvas, ctx } from '../core/canvas.js';
import { CONFIG } from '../config/config.js';
import { drawHeartShape } from './effects.js';

function renderHearts(game) {
  const pad = 20;
  const heartSize = 10;
  const gap = 6;
  const startX = pad;
  const y = canvas.height - 20;

  ctx.font = '11px "Share Tech Mono", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText('HP', startX, y - heartSize - 2);

  for (let i = 0; i < CONFIG.PLAYER_MAX_HEARTS; i++) {
    const hx = startX + i * (heartSize * 2 + gap) + heartSize;
    const hy = y;

    if (i < game.hearts) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff1493';
      ctx.fillStyle = '#ff1493';
      ctx.strokeStyle = '#ff69b4';
    } else {
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(60, 20, 30, 0.6)';
      ctx.strokeStyle = 'rgba(255, 105, 180, 0.25)';
    }

    ctx.lineWidth = 1.5;
    drawHeartShape(hx, hy, heartSize);
    ctx.fill();
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
}

function renderTypingBox(game) {
  const cx = canvas.width / 2;
  const w = 360;
  const h = 42;
  const bx = cx - w / 2;
  const by = canvas.height - 70;

  ctx.fillStyle = 'rgba(10, 10, 25, 0.85)';
  ctx.beginPath();
  ctx.roundRect(bx, by, w, h, 6);
  ctx.fill();

  const hasTarget = !!game.currentTarget;
  if (hasTarget) {
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#0ff';
  } else {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 0;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.textBaseline = 'middle';
  if (!hasTarget) {
    ctx.font = '13px "Orbitron", monospace';
    ctx.fillStyle = 'rgba(0, 255, 255, 0.4)';
    ctx.textAlign = 'center';
    ctx.fillText(game.t('typeHere'), cx, by + h / 2);
  } else {
    const word = game.currentTarget.word;
    ctx.font = 'bold 20px "Share Tech Mono", monospace';
    ctx.textAlign = 'center';

    const totalWidth = ctx.measureText(word).width;
    let startX = cx - totalWidth / 2;

    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      const charW = ctx.measureText(ch).width;

      ctx.textAlign = 'left';
      if (i < game.currentTarget.typedIndex) {
        ctx.fillStyle = '#39ff14';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#39ff14';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.shadowBlur = 0;
      }
      ctx.fillText(ch, startX, by + h / 2);
      startX += charW;
    }
    ctx.shadowBlur = 0;
  }
}



function renderCombo(game) {
  if (game.combo === 0) return;

  const pad = 20;
  const rx = canvas.width - pad;
  const ry = canvas.height - 20;

  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';

  ctx.font = '11px "Share Tech Mono", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText('STREAK', rx, ry - 32);

  ctx.font = 'bold 28px "Orbitron", monospace';
  const isHighCombo = game.combo >= 10;
  if (isHighCombo) {
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#39ff14';
    ctx.fillStyle = '#39ff14';
  } else {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 0;
  }
  ctx.fillText(`x${game.combo}`, rx, ry - 6);
  ctx.shadowBlur = 0;

  ctx.font = '10px "Share Tech Mono", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillText(`MAX: ${game.maxCombo}`, rx, ry);

  const multiplierProgress = (game.combo % 10) / 10;
  const lineW = 60;
  const lx = rx - lineW;
  const ly = ry - 4;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lx, ly);
  ctx.lineTo(rx, ly);
  ctx.stroke();

  if (multiplierProgress > 0) {
    ctx.strokeStyle = isHighCombo ? '#39ff14' : '#0ff';
    if (isHighCombo) {
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#39ff14';
    }
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(lx + lineW * multiplierProgress, ly);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

export function renderHUD(game) {
  const pad = 20;

  ctx.font = 'bold 22px "Orbitron", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#0ff';
  ctx.fillStyle = '#0ff';
  ctx.fillText(game.t('score'), pad, pad);
  ctx.font = 'bold 32px "Orbitron", monospace';
  ctx.fillText(`${game.score}`, pad, pad + 26);
  ctx.shadowBlur = 0;

  ctx.font = '14px "Share Tech Mono", monospace';
  ctx.fillStyle = '#888';
  ctx.fillText(`${game.t('speed')}: ${game.gameSpeed.toFixed(2)}x`, pad, pad + 64);
  ctx.fillText(`${game.t('lvl')}: ${game.speedLevel}`, pad, pad + 82);

  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.font = 'bold 16px "Orbitron", monospace';
  ctx.fillStyle = '#ffd700';
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#ffd700';
  ctx.fillText(`HI-SCORE: ${game.highScore}`, canvas.width - pad, pad);
  ctx.shadowBlur = 0;

  ctx.font = '13px "Share Tech Mono", monospace';
  ctx.fillStyle = game.currentFPS >= 50 ? '#39ff14' : game.currentFPS >= 25 ? '#ffd700' : '#ff3333';
  ctx.fillText(`${game.currentFPS} FPS`, canvas.width - pad, pad + 24);

  renderHearts(game);
  renderCombo(game);

  let buffBarBottomY = pad + 10;
  if (game.activeBuff) {
    const bx = canvas.width / 2;
    const by = pad + 10;
    const buffText = `⚡ ${game.activeBuff.name} (${game.activeBuff.timer.toFixed(1)}s)`;
    ctx.font = 'bold 16px "Orbitron", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const bw = ctx.measureText(buffText).width + 32;
    const bh = 32;
    const boxX = bx - bw / 2;
    const boxY = by;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, bw, bh, 6);
    ctx.fill();

    ctx.strokeStyle = game.activeBuff.color;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 8;
    ctx.shadowColor = game.activeBuff.color;
    ctx.stroke();

    ctx.fillStyle = game.activeBuff.color;
    ctx.fillText(buffText, bx, boxY + bh / 2);

    const progress = game.activeBuff.timer / (CONFIG.BUFF_DURATION_MS / 1000);
    ctx.fillStyle = game.activeBuff.color;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(boxX + 2, boxY + bh - 5, (bw - 4) * progress, 3);
    ctx.globalAlpha = 1;

    ctx.shadowBlur = 0;
    buffBarBottomY = by + bh + 6;
  }

  if (game.hasShield) {
    const bx = canvas.width / 2;
    const by = buffBarBottomY;
    const shieldLabel = game.t('buffShield');
    const shieldText = `🛡 ${shieldLabel}`;
    ctx.font = 'bold 14px "Orbitron", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const sw = ctx.measureText(shieldText).width + 28;
    const sh = 28;
    const sBoxX = bx - sw / 2;
    const sBoxY = by;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.roundRect(sBoxX, sBoxY, sw, sh, 5);
    ctx.fill();

    const shieldPulse = 0.6 + 0.4 * Math.sin(game.gameTime * 3);
    ctx.strokeStyle = `rgba(0, 255, 136, ${shieldPulse})`;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00ff88';
    ctx.stroke();

    ctx.fillStyle = `rgba(0, 255, 136, ${0.7 + 0.3 * shieldPulse})`;
    ctx.fillText(shieldText, bx, sBoxY + sh / 2);
    ctx.shadowBlur = 0;
  }

  renderTypingBox(game);
}
