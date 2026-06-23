import { canvas, ctx } from './canvas.js';
import { renderGrid } from '../rendering/effects.js';

export const SCREEN = Object.freeze({
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameover',
});

export class Router {
  constructor(game) {
    this.game = game;
    this.current = null;
    this.previous = null;
    this.screens = new Map();
  }

  register(name, screen) {
    this.screens.set(name, screen);
  }

  go(name) {
    const prev = this.current;
    if (prev && this.screens.get(prev)?.onExit) {
      this.screens.get(prev).onExit(this.game);
    }
    this.previous = prev;
    this.current = name;
    if (this.screens.get(name)?.onEnter) {
      this.screens.get(name).onEnter(this.game);
    }
  }

  update(dt) {
    this.screens.get(this.current)?.update?.(this.game, dt);
  }

  render() {
    this.screens.get(this.current)?.render?.(this.game);
  }

  handleKeyDown(e) {
    this.screens.get(this.current)?.handleKeyDown?.(this.game, e);
  }

  handleClick(e) {
    this.screens.get(this.current)?.handleClick?.(this.game, e);
  }
}

export function renderBackground(game) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0a0a12';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const star of game.stars) star.render(game.gameTime);
  renderGrid();
}
