import { ctx } from '../canvas.js';
import { randFloat } from '../utils.js';

export class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 300;
    this.vy = (Math.random() - 0.5) * 300;
    this.life = 1.0;
    this.decay = randFloat(0.8, 2.5);
    this.color = color;
    this.size = randFloat(1.5, 5);
  }
  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vx *= (1 - 1.5 * dt); // drag
    this.vy *= (1 - 1.5 * dt);
    this.life -= this.decay * dt;
  }
  render() {
    if (this.life <= 0) return;
    ctx.globalAlpha = this.life;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}
