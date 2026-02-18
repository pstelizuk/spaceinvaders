// ============================================================
// player.js — Classe Player : déplacement, tir, vies
// ============================================================

class Player {
  /**
   * Crée une instance du joueur.
   */
  constructor() {
    this.width = 40;
    this.height = 20;
    this.x = CANVAS_WIDTH / 2 - this.width / 2;
    this.y = CANVAS_HEIGHT - 50;
    this.speed = 5;
    this.lives = 3;
    this.color = '#00FF00';
    this.missile = null;
  }

  /**
   * Déplace le joueur vers la gauche, sans sortir du canvas.
   */
  moveLeft() {
    this.x = clamp(this.x - this.speed, 0, CANVAS_WIDTH - this.width);
  }

  /**
   * Déplace le joueur vers la droite, sans sortir du canvas.
   */
  moveRight() {
    this.x = clamp(this.x + this.speed, 0, CANVAS_WIDTH - this.width);
  }

  /**
   * Tire un missile si aucun n'est déjà actif.
   */
  shoot() {
    if (this.missile) return;
    this.missile = {
      x: this.x + this.width / 2 - 2,
      y: this.y,
      width: 4,
      height: 10,
      speed: 8,
      color: '#FFFFFF'
    };
  }

  /**
   * Met à jour la position du missile actif.
   * Le supprime s'il sort du canvas par le haut.
   */
  updateMissile() {
    if (!this.missile) return;
    this.missile.y -= this.missile.speed;
    if (this.missile.y + this.missile.height < 0) {
      this.missile = null;
    }
  }

  /**
   * Retire une vie au joueur.
   * @returns {boolean} true si le joueur est encore en vie
   */
  hit() {
    this.lives -= 1;
    return this.lives > 0;
  }

  /**
   * Réinitialise le joueur au centre du canvas.
   */
  reset() {
    this.x = CANVAS_WIDTH / 2 - this.width / 2;
    this.y = CANVAS_HEIGHT - 50;
    this.lives = 3;
    this.missile = null;
  }

  /**
   * Dessine le joueur sur le canvas.
   * @param {CanvasRenderingContext2D} ctx - Contexte 2D du canvas
   */
  draw(ctx) {
    // Corps du vaisseau
    drawRect(ctx, this.x, this.y, this.width, this.height, this.color);
    // Tourelle centrale
    drawRect(ctx, this.x + this.width / 2 - 4, this.y - 8, 8, 8, this.color);
  }

  /**
   * Dessine le missile actif du joueur.
   * @param {CanvasRenderingContext2D} ctx - Contexte 2D du canvas
   */
  drawMissile(ctx) {
    if (!this.missile) return;
    const m = this.missile;
    drawRect(ctx, m.x, m.y, m.width, m.height, m.color);
  }
}
