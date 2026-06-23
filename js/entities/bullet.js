import { ctx } from '../core/canvas.js';
import { CONFIG } from '../config/config.js';

export class Bullet {
  constructor(startX, startY, target) {
    this.x = startX;
    this.y = startY;
    this.target = target;
    this.speed = CONFIG.BULLET_SPEED;
    this.alive = true;
    this.trail = []; // stores past positions for trail effect
  }
  update(dt) {
    // Store trail point
    this.trail.push({ x: this.x, y: this.y, life: 1 });
    if (this.trail.length > 12) this.trail.shift();

    // Move toward target entity
    const tx = this.target.cx;
    const ty = this.target.cy;
    const dx = tx - this.x;
    const dy = ty - this.y;
    const d = Math.hypot(dx, dy);

    if (d < 18) return true; // HIT

    const move = this.speed * dt;
    this.x += (dx / d) * move;
    this.y += (dy / d) * move;

    // Decay trail
    for (const t of this.trail) t.life -= 3 * dt;

    return false;
  }
  render() {
    // Draw trail
    for (const t of this.trail) {
      if (t.life <= 0) continue;
      ctx.globalAlpha = t.life * 0.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0ff';
      ctx.strokeStyle = '#0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(t.x, t.y);
      ctx.lineTo(t.x, t.y + 8);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // Draw bullet head
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#0ff';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - 8);
    ctx.lineTo(this.x, this.y + 8);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}
