/**
 * @fileoverview Defines the Player class for the Space Invaders game.
 * Manages player movement, firing, lives, and drawing.
 */

import { drawRect } from './utils.js';

/**
 * Represents the player's spaceship.
 */
export class Player {
  /**
   * Creates an instance of Player.
   * @param {number} canvasWidth - The width of the game canvas.
   * @param {number} canvasHeight - The height of the game canvas.
   */
  constructor(canvasWidth, canvasHeight) {
    this.width = 50;
    this.height = 20;
    this.x = (canvasWidth - this.width) / 2; // Centered horizontally
    this.y = canvasHeight - this.height - 10; // Bottom of the canvas, with some padding
    this.speed = 5;
    this.lives = 3;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.missile = null; // Stores the active missile object
    this.missileSpeed = 8;
  }

  /**
   * Moves the player spaceship to the left, within canvas bounds.
   */
  moveLeft() {
    this.x = Math.max(0, this.x - this.speed);
  }

  /**
   * Moves the player spaceship to the right, within canvas bounds.
   */
  moveRight() {
    this.x = Math.min(this.canvasWidth - this.width, this.x + this.speed);
  }

  /**
   * Fires a missile if no other player missile is currently active.
   */
  fire() {
    if (!this.missile) {
      this.missile = {
        x: this.x + this.width / 2 - 2, // Centered on player, 4px width missile
        y: this.y,
        width: 4,
        height: 10,
        speed: this.missileSpeed,
      };
    }
  }

  /**
   * Updates the player's state, primarily the missile's position.
   */
  update() {
    if (this.missile) {
      this.missile.y -= this.missile.speed;
      // Remove missile if it goes off-screen
      if (this.missile.y + this.missile.height < 0) {
        this.missile = null;
      }
    }
  }

  /**
   * Draws the player spaceship and its active missile on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  draw(ctx) {
    drawRect(ctx, this.x, this.y, this.width, this.height, 'white'); // Player color

    if (this.missile) {
      drawRect(ctx, this.missile.x, this.missile.y, this.missile.width, this.missile.height, 'yellow'); // Missile color
    }
  }

  /**
   * Decrements player lives and handles game over condition (not implemented here).
   */
  takeDamage() {
    this.lives--;
    // Logic for what happens when lives run out will be in Game class
  }
}
