import { canvas, ctx } from '../canvas.js';
import { randFloat } from '../utils.js';

export class Star {
  constructor() { this.reset(true); }
  reset(randomY = false) {
    this.x = Math.random() * canvas.width;
    this.y = randomY ? Math.random() * canvas.height : -2;
    this.size = randFloat(0.5, 2.5);
    this.speed = this.size * 18 + 8; // bigger = faster
    this.opacity = randFloat(0.3, 0.9);
    this.twinkleSpeed = randFloat(1.5, 4);
    this.twinklePhase = Math.random() * Math.PI * 2;
  }
  update(dt) {
    this.y += this.speed * dt;
    this.twinklePhase += this.twinkleSpeed * dt;
    if (this.y > canvas.height + 5) this.reset(false);
  }
  render(time) {
    const alpha = this.opacity * (0.6 + 0.4 * Math.sin(this.twinklePhase));
    ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
