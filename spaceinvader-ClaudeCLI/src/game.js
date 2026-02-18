/**
 * Game class - main game loop and state management
 */
class Game {
  /**
   * Create a game instance
   * @param {HTMLCanvasElement} canvas - Canvas element
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 800;
    this.height = 600;

    // Game state
    this.state = 'start'; // 'start', 'playing', 'gameOver', 'victory'
    this.score = 0;
    this.lastFrameTime = Date.now();

    // Game objects
    this.player = new Player(this.width, this.height);
    this.enemies = new EnemyGrid(this.width, this.height);

    // Keyboard event listeners
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));

    // Start game loop
    this.gameLoop();
  }

  /**
   * Handle key down events
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyDown(event) {
    if (this.state === 'playing') {
      this.player.handleInput(event.key, true);
    } else if ((this.state === 'start' || this.state === 'gameOver' || this.state === 'victory') && event.key === ' ') {
      event.preventDefault();
      this.restart();
    }
  }

  /**
   * Handle key up events
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyUp(event) {
    if (this.state === 'playing') {
      this.player.handleInput(event.key, false);
    }
  }

  /**
   * Restart the game
   */
  restart() {
    this.state = 'playing';
    this.score = 0;
    this.player = new Player(this.width, this.height);
    this.enemies = new EnemyGrid(this.width, this.height);
  }

  /**
   * Update game logic
   */
  update() {
    if (this.state !== 'playing') return;

    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Update player
    this.player.update();

    // Update enemies
    this.enemies.update(deltaTime);

    // Check player missile vs enemies
    const playerMissileBounds = this.player.getMissileBounds();
    if (playerMissileBounds !== null) {
      for (let i = this.enemies.enemies.length - 1; i >= 0; i--) {
        const enemy = this.enemies.enemies[i];
        if (checkCollision(playerMissileBounds, enemy.getBounds())) {
          // Enemy hit
          this.score += enemy.points;
          this.enemies.removeEnemy(enemy);
          this.player.removeMissile();
          break; // Only one enemy can be hit per frame
        }
      }
    }

    // Check enemy missiles vs player
    if (this.enemies.checkMissileCollisions(this.player.getBounds())) {
      this.player.takeDamage();
      if (!this.player.isAlive()) {
        this.state = 'gameOver';
      }
    }

    // Check if enemies reached bottom
    if (this.enemies.checkEnemiesReachedBottom(this.player.y)) {
      this.state = 'gameOver';
    }

    // Check victory condition
    if (this.enemies.allDefeated()) {
      this.state = 'victory';
    }
  }

  /**
   * Draw game screen
   */
  draw() {
    // Clear canvas
    clearCanvas(this.ctx, this.width, this.height);

    if (this.state === 'start') {
      this.drawStartScreen();
    } else if (this.state === 'playing') {
      this.drawGameScreen();
    } else if (this.state === 'gameOver') {
      this.drawGameOverScreen();
    } else if (this.state === 'victory') {
      this.drawVictoryScreen();
    }
  }

  /**
   * Draw start screen
   */
  drawStartScreen() {
    drawText(this.ctx, 'SPACE INVADERS', this.width / 2, 150, 'white', 'bold 48px Arial', 'center');
    drawText(this.ctx, 'Press SPACE to play', this.width / 2, 250, 'white', '24px Arial', 'center');
  }

  /**
   * Draw game screen with HUD
   */
  drawGameScreen() {
    // Draw game objects
    this.player.draw(this.ctx);
    this.enemies.draw(this.ctx);

    // Draw HUD
    this.drawHUD();
  }

  /**
   * Draw HUD (score and lives)
   */
  drawHUD() {
    const scoreText = `SCORE: ${String(this.score).padStart(3, '0')}`;
    drawText(this.ctx, scoreText, 20, 25, 'white', '16px Arial', 'left');

    const livesText = `LIVES: ${this.player.lives}`;
    drawText(this.ctx, livesText, this.width - 150, 25, 'white', '16px Arial', 'left');
  }

  /**
   * Draw game over screen
   */
  drawGameOverScreen() {
    drawText(this.ctx, 'GAME OVER', this.width / 2, 150, 'white', 'bold 48px Arial', 'center');
    drawText(this.ctx, `SCORE: ${String(this.score).padStart(3, '0')}`, this.width / 2, 220, 'white', '24px Arial', 'center');
    drawText(this.ctx, 'Press SPACE to play again', this.width / 2, 300, 'white', '18px Arial', 'center');
  }

  /**
   * Draw victory screen
   */
  drawVictoryScreen() {
    drawText(this.ctx, 'VICTORY!', this.width / 2, 150, 'white', 'bold 48px Arial', 'center');
    drawText(this.ctx, `SCORE: ${String(this.score).padStart(3, '0')}`, this.width / 2, 220, 'white', '24px Arial', 'center');
    drawText(this.ctx, 'Press SPACE to play again', this.width / 2, 300, 'white', '18px Arial', 'center');
  }

  /**
   * Main game loop
   */
  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }
}
