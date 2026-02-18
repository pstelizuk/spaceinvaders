// ============================================================
// enemies.js — Classe Enemy + Classe EnemyGrid : formation et comportement
// ============================================================

class Enemy {
  /**
   * Crée un ennemi individuel.
   * @param {number} x - Position X
   * @param {number} y - Position Y
   * @param {string} type - Type d'ennemi ('A', 'B' ou 'C')
   */
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 20;
    this.type = type;
    this.alive = true;

    switch (type) {
      case 'A':
        this.points = 30;
        this.color = '#FF0000';
        break;
      case 'B':
        this.points = 20;
        this.color = '#FFFF00';
        break;
      case 'C':
        this.points = 10;
        this.color = '#00FF00';
        break;
    }
  }

  /**
   * Dessine l'ennemi sur le canvas.
   * @param {CanvasRenderingContext2D} ctx - Contexte 2D du canvas
   */
  draw(ctx) {
    if (!this.alive) return;
    drawRect(ctx, this.x, this.y, this.width, this.height, this.color);
    // Yeux pour donner un look alien
    drawRect(ctx, this.x + 6, this.y + 6, 5, 5, '#000000');
    drawRect(ctx, this.x + 19, this.y + 6, 5, 5, '#000000');
  }
}

class EnemyGrid {
  /**
   * Crée la formation d'ennemis.
   */
  constructor() {
    this.enemies = [];
    this.direction = 1; // 1 = droite, -1 = gauche
    this.baseSpeed = 1;
    this.speed = this.baseSpeed;
    this.missiles = [];
    this.shootInterval = 2000; // ms entre chaque tir ennemi
    this.lastShotTime = 0;
    this.totalEnemies = 0;

    this.init();
  }

  /**
   * Initialise la grille de 5 colonnes × 3 lignes, centrée horizontalement.
   */
  init() {
    const cols = 5;
    const rows = 3;
    const spacingX = 70;
    const spacingY = 50;
    const gridWidth = (cols - 1) * spacingX + 30; // 30 = largeur d'un ennemi
    const startX = (CANVAS_WIDTH - gridWidth) / 2;
    const startY = 60;
    const types = ['A', 'B', 'C'];

    this.enemies = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * spacingX;
        const y = startY + row * spacingY;
        this.enemies.push(new Enemy(x, y, types[row]));
      }
    }

    this.totalEnemies = this.enemies.length;
    this.direction = 1;
    this.speed = this.baseSpeed;
    this.missiles = [];
    this.lastShotTime = 0;
  }

  /**
   * Retourne la liste des ennemis encore en vie.
   * @returns {Enemy[]}
   */
  aliveEnemies() {
    return this.enemies.filter(e => e.alive);
  }

  /**
   * Déplace la formation. Descend et inverse si un bord est touché.
   */
  update() {
    const alive = this.aliveEnemies();
    if (alive.length === 0) return;

    // Vérifie si un ennemi touche un bord
    let touchEdge = false;
    for (const enemy of alive) {
      const nextX = enemy.x + this.speed * this.direction;
      if (nextX <= 0 || nextX + enemy.width >= CANVAS_WIDTH) {
        touchEdge = true;
        break;
      }
    }

    if (touchEdge) {
      // Descendre et inverser
      for (const enemy of alive) {
        enemy.y += 20;
      }
      this.direction *= -1;
    } else {
      // Déplacement latéral
      for (const enemy of alive) {
        enemy.x += this.speed * this.direction;
      }
    }
  }

  /**
   * Augmente la vitesse en fonction du nombre d'ennemis détruits.
   * +10% par ennemi détruit par rapport à la vitesse de base.
   */
  increaseSpeed() {
    const destroyed = this.totalEnemies - this.aliveEnemies().length;
    this.speed = this.baseSpeed * Math.pow(1.1, destroyed);
  }

  /**
   * Tir aléatoire : un ennemi vivant tire un missile toutes les 2 secondes.
   * @param {number} timestamp - Timestamp actuel (ms)
   */
  shoot(timestamp) {
    if (timestamp - this.lastShotTime < this.shootInterval) return;

    const alive = this.aliveEnemies();
    if (alive.length === 0) return;

    const shooter = alive[randomInt(0, alive.length - 1)];
    this.missiles.push({
      x: shooter.x + shooter.width / 2 - 2,
      y: shooter.y + shooter.height,
      width: 4,
      height: 10,
      speed: 4,
      color: '#FF6666'
    });

    this.lastShotTime = timestamp;
  }

  /**
   * Met à jour les missiles ennemis. Supprime ceux qui sortent du canvas.
   */
  updateMissiles() {
    for (let i = this.missiles.length - 1; i >= 0; i--) {
      this.missiles[i].y += this.missiles[i].speed;
      if (this.missiles[i].y > CANVAS_HEIGHT) {
        this.missiles.splice(i, 1);
      }
    }
  }

  /**
   * Vérifie si un ennemi a atteint la ligne du joueur.
   * @param {number} playerY - Position Y du joueur
   * @returns {boolean}
   */
  reachedPlayer(playerY) {
    return this.aliveEnemies().some(e => e.y + e.height >= playerY);
  }

  /**
   * Dessine tous les ennemis vivants.
   * @param {CanvasRenderingContext2D} ctx - Contexte 2D du canvas
   */
  draw(ctx) {
    for (const enemy of this.enemies) {
      enemy.draw(ctx);
    }
  }

  /**
   * Dessine les missiles ennemis.
   * @param {CanvasRenderingContext2D} ctx - Contexte 2D du canvas
   */
  drawMissiles(ctx) {
    for (const m of this.missiles) {
      drawRect(ctx, m.x, m.y, m.width, m.height, m.color);
    }
  }

  /**
   * Réinitialise la grille d'ennemis.
   */
  reset() {
    this.init();
  }
}
