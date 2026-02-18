/**
 * Player class - manages the spaceship and its behavior
 */
class Player {
  /**
   * Create a player
   * @param {number} canvasWidth - Canvas width
   * @param {number} canvasHeight - Canvas height
   */
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Player properties
    this.width = 30;
    this.height = 25;
    this.x = canvasWidth / 2 - this.width / 2;
    this.y = canvasHeight - 40;

    this.speed = 5;
    this.lives = 3;

    // Missile properties
    this.missile = null;
    this.missileWidth = 5;
    this.missileHeight = 15;
    this.missileSpeed = 8;

    // Input state
    this.keys = {
      left: false,
      right: false,
      shoot: false
    };
  }

  /**
   * Handle keyboard input
   * @param {string} key - Key pressed
   * @param {boolean} isPressed - True if pressed, false if released
   */
  handleInput(key, isPressed) {
    if (key === 'ArrowLeft') this.keys.left = isPressed;
    if (key === 'ArrowRight') this.keys.right = isPressed;
    if (key === ' ') this.keys.shoot = isPressed;
  }

  /**
   * Update player position and missile
   */
  update() {
    // Move player left/right
    if (this.keys.left) {
      this.x -= this.speed;
    }
    if (this.keys.right) {
      this.x += this.speed;
    }

    // Keep player in canvas bounds
    this.x = clamp(this.x, 0, this.canvasWidth - this.width);

    // Handle shooting
    if (this.keys.shoot && this.missile === null) {
      this.shoot();
      this.keys.shoot = false; // Prevent continuous shooting
    }

    // Update missile position
    if (this.missile !== null) {
      this.missile.y -= this.missileSpeed;

      // Remove missile if it leaves the canvas
      if (this.missile.y < 0) {
        this.missile = null;
      }
    }
  }

  /**
   * Create a missile at player position
   */
  shoot() {
    this.missile = {
      x: this.x + this.width / 2 - this.missileWidth / 2,
      y: this.y,
      width: this.missileWidth,
      height: this.missileHeight
    };
  }

  /**
   * Get player bounding box for collision detection
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
   * Get missile bounding box for collision detection
   * @returns {Object|null} Rectangle or null if no missile
   */
  getMissileBounds() {
    if (this.missile === null) return null;
    return {
      x: this.missile.x,
      y: this.missile.y,
      width: this.missile.width,
      height: this.missile.height
    };
  }

  /**
   * Remove missile
   */
  removeMissile() {
    this.missile = null;
  }

  /**
   * Take damage and lose a life
   */
  takeDamage() {
    this.lives--;
  }

  /**
   * Check if player is alive
   * @returns {boolean} True if lives > 0
   */
  isAlive() {
    return this.lives > 0;
  }

  /**
   * Draw player and missile on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    // Draw player ship (triangle)
    ctx.fillStyle = 'cyan';
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y); // Top point
    ctx.lineTo(this.x + this.width, this.y + this.height); // Bottom right
    ctx.lineTo(this.x, this.y + this.height); // Bottom left
    ctx.closePath();
    ctx.fill();

    // Draw missile
    if (this.missile !== null) {
      drawRect(ctx, this.missile.x, this.missile.y, this.missile.width, this.missile.height, 'yellow');
    }
  }
}
