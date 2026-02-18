/**
 * Enemy class - represents a single enemy
 */
class Enemy {
  /**
   * Create an enemy
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} type - Enemy type (1=red/30pts, 2=yellow/20pts, 3=green/10pts)
   */
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // 1, 2, or 3
    this.width = 25;
    this.height = 20;

    // Points based on type
    this.points = type === 1 ? 30 : type === 2 ? 20 : 10;

    // Color based on type
    this.color = type === 1 ? 'red' : type === 2 ? 'yellow' : 'lime';
  }

  /**
   * Get enemy bounding box for collision detection
   * @returns {Object} Rectangle with x, y, width, height
   */
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  /**
   * Draw enemy on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    drawRect(ctx, this.x, this.y, this.width, this.height, this.color);
  }
}

/**
 * EnemyGrid class - manages the formation of enemies
 */
class EnemyGrid {
  /**
   * Create enemy grid
   * @param {number} canvasWidth - Canvas width
   * @param {number} canvasHeight - Canvas height
   */
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.enemies = [];
    this.direction = 1; // 1 for right, -1 for left
    this.speed = 1;

    // Enemy missiles
    this.missiles = [];
    this.missileWidth = 5;
    this.missileHeight = 12;
    this.missileSpeed = 4;
    this.lastShootTime = 0;
    this.shootInterval = 2000; // 2 seconds in ms

    this.initialize();
  }

  /**
   * Initialize enemy formation (5 columns × 3 rows)
   */
  initialize() {
    this.enemies = [];
    const cols = 5;
    const rows = 3;
    const horizontalSpacing = 70;
    const verticalSpacing = 50;

    // Calculate starting position to center the formation
    const totalWidth = (cols - 1) * horizontalSpacing;
    const startX = (this.canvasWidth - totalWidth) / 2;
    const startY = 30;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * horizontalSpacing;
        const y = startY + row * verticalSpacing;
        // Type 1 (top), Type 2 (middle), Type 3 (bottom)
        const type = row + 1;
        this.enemies.push(new Enemy(x, y, type));
      }
    }
  }

  /**
   * Update enemy formation and missiles
   * @param {number} deltaTime - Time elapsed since last frame in ms
   */
  update(deltaTime) {
    // Move enemies horizontally
    for (let enemy of this.enemies) {
      enemy.x += this.speed * this.direction;
    }

    // Check if formation touches canvas edges
    const leftmost = Math.min(...this.enemies.map(e => e.x));
    const rightmost = Math.max(...this.enemies.map(e => e.x + e.width));

    if (leftmost <= 0 || rightmost >= this.canvasWidth) {
      // Reverse direction and move down
      this.direction *= -1;
      for (let enemy of this.enemies) {
        enemy.y += 20;
      }
    }

    // Random enemy shooting
    this.lastShootTime += deltaTime;
    if (this.lastShootTime >= this.shootInterval && this.enemies.length > 0) {
      this.randomShoot();
      this.lastShootTime = 0;
    }

    // Update enemy missiles
    for (let i = this.missiles.length - 1; i >= 0; i--) {
      this.missiles[i].y += this.missileSpeed;

      // Remove if off-screen
      if (this.missiles[i].y > this.canvasHeight) {
        this.missiles.splice(i, 1);
      }
    }
  }

  /**
   * Random enemy shoots a missile
   */
  randomShoot() {
    if (this.enemies.length === 0) return;

    const randomEnemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
    const missile = {
      x: randomEnemy.x + randomEnemy.width / 2 - this.missileWidth / 2,
      y: randomEnemy.y + randomEnemy.height,
      width: this.missileWidth,
      height: this.missileHeight
    };
    this.missiles.push(missile);
  }

  /**
   * Remove enemy and increase speed by 10%
   * @param {Enemy} enemy - Enemy to remove
   */
  removeEnemy(enemy) {
    const index = this.enemies.indexOf(enemy);
    if (index !== -1) {
      this.enemies.splice(index, 1);
      this.speed *= 1.1; // Increase speed by 10%
    }
  }

  /**
   * Check if any enemy missile collides with player
   * @param {Object} playerBounds - Player bounding box
   * @returns {boolean} True if collision detected
   */
  checkMissileCollisions(playerBounds) {
    for (let i = this.missiles.length - 1; i >= 0; i--) {
      if (checkCollision(this.missiles[i], playerBounds)) {
        this.missiles.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Check if any enemy reached the bottom
   * @param {number} playerY - Player Y position
   * @returns {boolean} True if enemy reached player level
   */
  checkEnemiesReachedBottom(playerY) {
    return this.enemies.some(e => e.y + e.height >= playerY);
  }

  /**
   * Check if all enemies are defeated
   * @returns {boolean} True if no enemies left
   */
  allDefeated() {
    return this.enemies.length === 0;
  }

  /**
   * Draw all enemies and missiles
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    // Draw enemies
    for (let enemy of this.enemies) {
      enemy.draw(ctx);
    }

    // Draw enemy missiles
    for (let missile of this.missiles) {
      drawRect(ctx, missile.x, missile.y, missile.width, missile.height, 'red');
    }
  }
}
