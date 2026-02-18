// ============================================================
// game.js — Classe Game : boucle principale, état global, score
// ============================================================

class Game {
  /**
   * Crée une instance du jeu.
   * @param {HTMLCanvasElement} canvas - Élément canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.player = new Player();
    this.enemyGrid = new EnemyGrid();
    this.score = 0;
    this.state = 'start'; // 'start', 'playing', 'gameover', 'victory'
    this.keys = {};
    this.animationId = null;

    this.bindEvents();
    this.loop = this.loop.bind(this);
    this.start();
  }

  /**
   * Attache les écouteurs clavier.
   */
  bindEvents() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      if (e.code === 'Space') {
        e.preventDefault();
        if (this.state === 'start') {
          this.state = 'playing';
        } else if (this.state === 'gameover' || this.state === 'victory') {
          this.restart();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  /**
   * Lance la boucle de jeu.
   */
  start() {
    this.loop(0);
  }

  /**
   * Boucle principale appelée à chaque frame via requestAnimationFrame.
   * @param {number} timestamp - Timestamp fourni par requestAnimationFrame
   */
  loop(timestamp) {
    this.animationId = requestAnimationFrame(this.loop);

    clearCanvas(this.ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

    switch (this.state) {
      case 'start':
        this.drawStartScreen();
        break;
      case 'playing':
        this.update(timestamp);
        this.draw();
        break;
      case 'gameover':
        this.drawGameOverScreen();
        break;
      case 'victory':
        this.drawVictoryScreen();
        break;
    }
  }

  /**
   * Met à jour la logique du jeu pour une frame.
   * @param {number} timestamp - Timestamp actuel (ms)
   */
  update(timestamp) {
    // Déplacement joueur
    if (this.keys['ArrowLeft']) this.player.moveLeft();
    if (this.keys['ArrowRight']) this.player.moveRight();
    if (this.keys['Space']) this.player.shoot();

    // Mise à jour missiles
    this.player.updateMissile();
    this.enemyGrid.update();
    this.enemyGrid.shoot(timestamp);
    this.enemyGrid.updateMissiles();

    // Collisions
    this.checkPlayerMissileHit();
    this.checkEnemyMissileHit();
    this.checkEnemyReachedPlayer();

    // Victoire
    if (this.enemyGrid.aliveEnemies().length === 0) {
      this.state = 'victory';
    }
  }

  /**
   * Vérifie si le missile du joueur touche un ennemi.
   */
  checkPlayerMissileHit() {
    const missile = this.player.missile;
    if (!missile) return;

    for (const enemy of this.enemyGrid.aliveEnemies()) {
      if (rectCollision(missile, enemy)) {
        enemy.alive = false;
        this.player.missile = null;
        this.score += enemy.points;
        this.enemyGrid.increaseSpeed();
        return;
      }
    }
  }

  /**
   * Vérifie si un missile ennemi touche le joueur.
   */
  checkEnemyMissileHit() {
    const missiles = this.enemyGrid.missiles;
    for (let i = missiles.length - 1; i >= 0; i--) {
      if (rectCollision(missiles[i], this.player)) {
        missiles.splice(i, 1);
        if (!this.player.hit()) {
          this.state = 'gameover';
        }
        return;
      }
    }
  }

  /**
   * Vérifie si un ennemi a atteint la ligne du joueur.
   */
  checkEnemyReachedPlayer() {
    if (this.enemyGrid.reachedPlayer(this.player.y)) {
      this.state = 'gameover';
    }
  }

  /**
   * Dessine tous les éléments du jeu pendant la partie.
   */
  draw() {
    this.player.draw(this.ctx);
    this.player.drawMissile(this.ctx);
    this.enemyGrid.draw(this.ctx);
    this.enemyGrid.drawMissiles(this.ctx);
    this.drawHUD();
  }

  /**
   * Dessine le HUD : score à gauche, vies à droite.
   */
  drawHUD() {
    const scoreText = `SCORE: ${String(this.score).padStart(3, '0')}`;
    drawText(this.ctx, scoreText, 20, 30, '#FFFFFF', '20px monospace', 'left');

    const hearts = '\u2665 '.repeat(this.player.lives).trim();
    const livesText = `VIES: ${hearts}`;
    drawText(this.ctx, livesText, CANVAS_WIDTH - 20, 30, '#FFFFFF', '20px monospace', 'right');
  }

  /**
   * Dessine l'écran de démarrage.
   */
  drawStartScreen() {
    drawText(this.ctx, 'SPACE INVADERS', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40,
      '#FFFFFF', 'bold 40px monospace', 'center');
    drawText(this.ctx, 'Appuie sur ESPACE pour jouer', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20,
      '#AAAAAA', '18px monospace', 'center');
  }

  /**
   * Dessine l'écran Game Over.
   */
  drawGameOverScreen() {
    drawText(this.ctx, 'GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40,
      '#FF0000', 'bold 40px monospace', 'center');
    drawText(this.ctx, `Score final : ${this.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10,
      '#FFFFFF', '22px monospace', 'center');
    drawText(this.ctx, 'ESPACE pour rejouer', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50,
      '#AAAAAA', '18px monospace', 'center');
  }

  /**
   * Dessine l'écran de victoire.
   */
  drawVictoryScreen() {
    drawText(this.ctx, 'VICTOIRE !', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40,
      '#00FF00', 'bold 40px monospace', 'center');
    drawText(this.ctx, `Score final : ${this.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10,
      '#FFFFFF', '22px monospace', 'center');
    drawText(this.ctx, 'ESPACE pour rejouer', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50,
      '#AAAAAA', '18px monospace', 'center');
  }

  /**
   * Redémarre une nouvelle partie.
   */
  restart() {
    this.score = 0;
    this.player.reset();
    this.enemyGrid.reset();
    this.state = 'playing';
  }
}
