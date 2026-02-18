/**
 * @fileoverview Defines the main Game class for Space Invaders.
 * Manages the game loop, overall state, player, enemies, score, and UI.
 */

import { Player } from './player.js';
import { EnemyGrid } from './enemies.js';
import { drawRect, drawText, checkCollision } from './utils.js';

export class Game {
  /**
   * Creates an instance of Game.
   * @param {HTMLCanvasElement} canvas - The HTML canvas element for the game.
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvasWidth = 800;
    this.canvasHeight = 600;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    this.player = null;
    this.enemyGrid = null;
    this.score = 0;
    this.gameState = 'start'; // 'start', 'playing', 'gameOver', 'victory'
    this.lastFrameTime = 0;
    this.keys = {}; // Object to track currently pressed keys

    this.#setupEventListeners();
    this.init();
  }

  /**
   * Initializes or resets the game state.
   */
  init() {
    this.player = new Player(this.canvasWidth, this.canvasHeight);
    this.enemyGrid = new EnemyGrid(this.canvasWidth, this.canvasHeight);
    this.score = 0;
    this.enemyGrid.speed = 1; // Reset enemy speed
    // this.gameState = 'start'; // Set in constructor, only reset to 'start' if restarting from game over
  }

  /**
   * Sets up keyboard event listeners for player input.
   * @private
   */
  #setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space' && (this.gameState === 'start' || this.gameState === 'gameOver' || this.gameState === 'victory')) {
        this.#startGame();
      }
    });
    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  /**
   * Starts the game or restarts if already ended.
   * @private
   */
  #startGame() {
    if (this.gameState !== 'playing') {
      this.init();
      this.gameState = 'playing';
      this.lastFrameTime = performance.now(); // Reset for a smooth start
      this.gameLoop(this.lastFrameTime);
    }
  }

  /**
   * The main game loop. Updates game state and redraws elements.
   * @param {DOMHighResTimeStamp} currentTime - The current time provided by requestAnimationFrame.
   */
  gameLoop(currentTime) {
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    if (this.gameState === 'playing') {
      this.update(deltaTime);
      this.draw();
    } else {
      // Draw static screens for start, game over, victory
      this.draw(); // To ensure HUD/screens are redrawn on state change
    }

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  /**
   * Updates all game logic: player, enemies, collisions, and game state.
   * @param {number} deltaTime - The time elapsed since the last frame in milliseconds.
   */
  update(deltaTime) {
    // Player movement
    if (this.keys['ArrowLeft']) {
      this.player.moveLeft();
    }
    if (this.keys['ArrowRight']) {
      this.player.moveRight();
    }
    if (this.keys['Space']) {
      this.player.fire();
    }

    this.player.update();
    this.enemyGrid.update(deltaTime);

    this.#checkCollisions();
    this.#checkGameEndConditions();
  }

  /**
   * Handles all collision detection logic.
   * @private
   */
  #checkCollisions() {
    // Player missile vs Enemies
    if (this.player.missile) {
      const hitEnemy = this.enemyGrid.checkEnemyCollision(this.player.missile, checkCollision);
      if (hitEnemy) {
        this.score += hitEnemy.points;
        this.enemyGrid.removeEnemy(hitEnemy);
        this.player.missile = null; // Destroy player missile
      }
    }

    // Enemy missile vs Player
    const hitPlayerMissile = this.enemyGrid.checkMissileCollision(this.player, checkCollision);
    if (hitPlayerMissile) {
      this.player.takeDamage();
    }
  }

  /**
   * Checks for game over or victory conditions.
   * @private
   */
  #checkGameEndConditions() {
    if (this.player.lives <= 0) {
      this.gameState = 'gameOver';
    } else if (this.enemyGrid.areAllEnemiesDestroyed()) {
      this.gameState = 'victory';
    } else if (this.enemyGrid.hasReachedPlayerLine(this.player.y)) {
      this.gameState = 'gameOver';
    }
  }

  /**
   * Draws all game elements on the canvas.
   */
  draw() {
    // Clear canvas
    drawRect(this.ctx, 0, 0, this.canvasWidth, this.canvasHeight, 'black'); // Background

    if (this.gameState === 'playing') {
      this.player.draw(this.ctx);
      this.enemyGrid.draw(this.ctx);
      this.#displayHUD();
    } else if (this.gameState === 'start') {
      this.#displayStartScreen();
    } else if (this.gameState === 'gameOver') {
      this.#displayGameOverScreen();
    } else if (this.gameState === 'victory') {
      this.#displayVictoryScreen();
    }
  }

  /**
   * Displays the Head-Up Display (score and lives).
   * @private
   */
  #displayHUD() {
    drawText(this.ctx, `SCORE: ${String(this.score).padStart(3, '0')}`, 10, 30, 'white', '20px Arial');
    const hearts = '♥ '.repeat(this.player.lives);
    drawText(this.ctx, `LIVES: ${hearts}`, this.canvasWidth - 10, 30, 'white', '20px Arial', 'right');
  }

  /**
   * Displays the start screen.
   * @private
   */
  #displayStartScreen() {
    drawText(this.ctx, 'SPACE INVADERS', this.canvasWidth / 2, this.canvasHeight / 2 - 50, 'white', '40px Arial', 'center');
    drawText(this.ctx, 'Appuie sur ESPACE pour jouer', this.canvasWidth / 2, this.canvasHeight / 2 + 10, 'white', '20px Arial', 'center');
  }

  /**
   * Displays the game over screen.
   * @private
   */
  #displayGameOverScreen() {
    drawText(this.ctx, 'GAME OVER', this.canvasWidth / 2, this.canvasHeight / 2 - 50, 'red', '40px Arial', 'center');
    drawText(this.ctx, `SCORE FINAL: ${String(this.score).padStart(3, '0')}`, this.canvasWidth / 2, this.canvasHeight / 2 + 10, 'white', '20px Arial', 'center');
    drawText(this.ctx, 'ESPACE pour rejouer', this.canvasWidth / 2, this.canvasHeight / 2 + 50, 'white', '20px Arial', 'center');
  }

  /**
   * Displays the victory screen.
   * @private
   */
  #displayVictoryScreen() {
    drawText(this.ctx, 'VICTOIRE !', this.canvasWidth / 2, this.canvasHeight / 2 - 50, 'gold', '40px Arial', 'center');
    drawText(this.ctx, `SCORE FINAL: ${String(this.score).padStart(3, '0')}`, this.canvasWidth / 2, this.canvasHeight / 2 + 10, 'white', '20px Arial', 'center');
    drawText(this.ctx, 'ESPACE pour rejouer', this.canvasWidth / 2, this.canvasHeight / 2 + 50, 'white', '20px Arial', 'center');
  }
}
