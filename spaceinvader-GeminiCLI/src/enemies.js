/**
 * @fileoverview Defines the Enemy and EnemyGrid classes for the Space Invaders game.
 * Manages enemy types, formation, movement, and missile firing.
 */

import { drawRect } from './utils.js';

/**
 * Represents an individual enemy alien.
 */
class Enemy {
  /**
   * Creates an instance of Enemy.
   * @param {number} x - The x-coordinate of the enemy.
   * @param {number} y - The y-coordinate of the enemy.
   * @param {string} type - The type of alien (e.g., 'A', 'B', 'C').
   * @param {number} points - The points awarded for destroying this enemy.
   * @param {string} color - The color of the enemy.
   */
  constructor(x, y, type, points, color) {
    this.x = x;
    this.y = y;
    this.width = 40; // Fixed width for all enemies
    this.height = 30; // Fixed height for all enemies
    this.type = type;
    this.points = points;
    this.color = color;
    this.isAlive = true;
  }

  /**
   * Draws the enemy on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  draw(ctx) {
    if (this.isAlive) {
      drawRect(ctx, this.x, this.y, this.width, this.height, this.color);
    }
  }
}

/**
 * Manages the grid of enemies, their movement, and firing.
 */
export class EnemyGrid {
  /**
   * Creates an instance of EnemyGrid.
   * @param {number} canvasWidth - The width of the game canvas.
   * @param {number} canvasHeight - The height of the game canvas.
   */
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.enemies = [];
    this.enemyMissiles = [];
    this.rows = 3;
    this.cols = 5;
    this.horizontalSpacing = 70; // Spacing between enemy x positions
    this.verticalSpacing = 50;   // Spacing between enemy y positions
    this.initialXOffset = 0; // Will be calculated to center the grid
    this.initialY = 50; // Starting Y position for the top row

    this.gridWidth = (this.cols - 1) * this.horizontalSpacing + new Enemy(0,0,'',0,'').width;
    this.initialXOffset = (canvasWidth - this.gridWidth) / 2;

    this.direction = 1; // 1 for right, -1 for left
    this.speed = 1;
    this.verticalDrop = 20; // How much they drop when hitting a wall
    this.enemyMissileSpeed = 4;
    this.lastShotTime = 0;
    this.shotInterval = 2000; // 2 seconds

    this.#createEnemies();
  }

  /**
   * Creates the initial grid of enemies based on types and colors.
   * @private
   */
  #createEnemies() {
    const enemyTypes = [
      { type: 'A', points: 30, color: 'red' },
      { type: 'B', points: 20, color: 'yellow' },
      { type: 'C', points: 10, color: 'green' },
    ];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const enemyType = enemyTypes[row];
        const x = this.initialXOffset + col * this.horizontalSpacing;
        const y = this.initialY + row * this.verticalSpacing;
        this.enemies.push(new Enemy(x, y, enemyType.type, enemyType.points, enemyType.color));
      }
    }
  }

  /**
   * Updates the state of all enemies and their missiles.
   * @param {number} deltaTime - The time elapsed since the last update in milliseconds.
   */
  update(deltaTime) {
    let hitBoundary = false;
    // Update enemy horizontal position
    this.enemies.forEach(enemy => {
      if (enemy.isAlive) {
        enemy.x += this.speed * this.direction;
        // Check if any enemy hits the canvas boundary
        if (enemy.x <= 0 || enemy.x + enemy.width >= this.canvasWidth) {
          hitBoundary = true;
        }
      }
    });

    // If a boundary is hit, drop down and reverse direction
    if (hitBoundary) {
      this.direction *= -1; // Reverse direction
      this.enemies.forEach(enemy => {
        if (enemy.isAlive) {
          enemy.y += this.verticalDrop; // Drop down
        }
      });
    }

    // Handle enemy missile firing
    this.#handleEnemyFiring(deltaTime);

    // Update enemy missiles
    this.enemyMissiles.forEach((missile, index) => {
      missile.y += this.enemyMissileSpeed;
      // Remove missile if it goes off-screen
      if (missile.y > this.canvasHeight) {
        this.enemyMissiles.splice(index, 1);
      }
    });
  }

  /**
   * Handles random enemy missile firing.
   * @param {number} deltaTime - The time elapsed since the last update in milliseconds.
   * @private
   */
  #handleEnemyFiring(deltaTime) {
    this.lastShotTime += deltaTime;
    if (this.lastShotTime >= this.shotInterval && this.enemies.some(enemy => enemy.isAlive)) {
      const aliveEnemies = this.enemies.filter(enemy => enemy.isAlive);
      if (aliveEnemies.length > 0) {
        const randomEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
        this.enemyMissiles.push({
          x: randomEnemy.x + randomEnemy.width / 2 - 2, // Centered on enemy
          y: randomEnemy.y + randomEnemy.height,
          width: 4,
          height: 10,
          speed: this.enemyMissileSpeed,
        });
      }
      this.lastShotTime = 0; // Reset timer for next shot
    }
  }

  /**
   * Draws all active enemies and their missiles on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  draw(ctx) {
    this.enemies.forEach(enemy => enemy.draw(ctx));
    this.enemyMissiles.forEach(missile => {
      drawRect(ctx, missile.x, missile.y, missile.width, missile.height, 'white'); // Enemy missile color
    });
  }

  /**
   * Marks an enemy as not alive and increases the grid speed.
   * @param {Enemy} enemy - The enemy object to be removed.
   */
  removeEnemy(enemy) {
    enemy.isAlive = false;
    this.speed *= 1.1; // Increase speed by 10%
  }

  /**
   * Checks for collision between a given object and any alive enemy.
   * @param {object} object - The object to check collision against (e.g., player missile).
   * @param {function} collisionCheckFn - The collision detection function (e.g., checkCollision from utils.js).
   * @returns {Enemy|null} - The colliding enemy object, or null if no collision.
   */
  checkEnemyCollision(object, collisionCheckFn) {
    for (const enemy of this.enemies) {
      if (enemy.isAlive && collisionCheckFn(object, enemy)) {
        return enemy;
      }
    }
    return null;
  }

  /**
   * Checks for collision between a given object and any enemy missile.
   * @param {object} object - The object to check collision against (e.g., player).
   * @param {function} collisionCheckFn - The collision detection function (e.g., checkCollision from utils.js).
   * @returns {object|null} - The colliding enemy missile object, or null if no collision.
   */
  checkMissileCollision(object, collisionCheckFn) {
    for (let i = 0; i < this.enemyMissiles.length; i++) {
      if (collisionCheckFn(object, this.enemyMissiles[i])) {
        const collidedMissile = this.enemyMissiles[i];
        this.enemyMissiles.splice(i, 1); // Remove missile on collision
        return collidedMissile;
      }
    }
    return null;
  }

  /**
   * Checks if any enemy has reached the player's line.
   * @param {number} playerY - The y-coordinate of the player.
   * @returns {boolean} - True if any enemy is below or at the player's line, false otherwise.
   */
  hasReachedPlayerLine(playerY) {
    return this.enemies.some(enemy => enemy.isAlive && enemy.y + enemy.height >= playerY);
  }

  /**
   * Checks if all enemies have been destroyed.
   * @returns {boolean} - True if no enemies are alive, false otherwise.
   */
  areAllEnemiesDestroyed() {
    return this.enemies.every(enemy => !enemy.isAlive);
  }
}
