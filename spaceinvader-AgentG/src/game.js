/**
 * @file src/game.js
 * @description Main Game class for Space Invaders.
 */

import { Player } from './player.js';
import { EnemyGrid } from './enemies.js';
import { Utils } from './utils.js';

export class Game {
    /**
     * Create the Game instance
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.score = 0;
        this.state = 'START'; // START, PLAY, GAMEOVER, WIN

        this.player = new Player(this.width, this.height);
        this.enemyGrid = new EnemyGrid(this.width, this.height);

        // Bind loop
        this.loop = this.loop.bind(this);

        // Input for game state control
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (this.state === 'START' || this.state === 'GAMEOVER' || this.state === 'WIN') {
                    this.reset();
                    this.state = 'PLAY';
                }
            }
        });

        // Start loop
        requestAnimationFrame(this.loop);
    }

    /**
     * Reset game data
     */
    reset() {
        this.score = 0;
        this.player.reset();
        this.enemyGrid = new EnemyGrid(this.width, this.height); // Re-initialize enemies
        this.player.lives = 3;
    }

    /**
     * Main game loop
     */
    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(this.loop);
    }

    /**
     * Update game logic based on state
     */
    update() {
        if (this.state === 'PLAY') {
            this.player.update();
            const gameOver = this.enemyGrid.update(this.player.x);

            if (gameOver || this.player.lives <= 0) {
                this.state = 'GAMEOVER';
            }

            // Check Player Missile vs Enemies
            if (this.player.missile) {
                // Check against each enemy
                let hitScore = null;
                // We need to iterate over enemies in grid
                const enemies = this.enemyGrid.enemies;
                for (let i = 0; i < enemies.length; i++) {
                    if (enemies[i].active && Utils.checkCollision(this.player.missile, enemies[i])) {
                        hitScore = enemies[i].score;
                        enemies[i].active = false;
                        this.enemyGrid.speed *= 1.1; // Speed up
                        this.player.missile = null; // Destroy missile
                        break;
                    }
                }

                if (hitScore !== null) {
                    this.score += hitScore;
                    // Check if all enemies destroyed
                    if (this.enemyGrid.enemies.every(e => !e.active)) {
                        this.state = 'WIN';
                    }
                }
            }

            // Check Enemy Missiles vs Player
            for (let i = 0; i < this.enemyGrid.missiles.length; i++) {
                const m = this.enemyGrid.missiles[i];
                if (Utils.checkCollision(m, this.player)) {
                    this.player.lives--;
                    this.enemyGrid.missiles.splice(i, 1);
                    if (this.player.lives <= 0) {
                        this.state = 'GAMEOVER';
                    }
                }
            }
        }
    }

    /**
     * Render the game
     */
    draw() {
        // Clear screen
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (this.state === 'START') {
            Utils.drawText(this.ctx, 'SPACE INVADERS', this.width / 2 - 100, this.height / 2 - 20, 'white', '30px Arial');
            Utils.drawText(this.ctx, 'Press SPACE to Play', this.width / 2 - 90, this.height / 2 + 20, 'white', '20px Arial');
        } else if (this.state === 'PLAY') {
            this.player.draw(this.ctx);
            this.enemyGrid.draw(this.ctx);

            // HUD
            Utils.drawText(this.ctx, `SCORE: ${this.score}`, 10, 30, 'white');
            Utils.drawText(this.ctx, `LIVES: ${'♥ '.repeat(this.player.lives)}`, this.width - 120, 30, 'white');
        } else if (this.state === 'GAMEOVER') {
            Utils.drawText(this.ctx, 'GAME OVER', this.width / 2 - 60, this.height / 2 - 20, 'red', '30px Arial');
            Utils.drawText(this.ctx, `Final Score: ${this.score}`, this.width / 2 - 70, this.height / 2 + 20, 'white', '20px Arial');
            Utils.drawText(this.ctx, 'Press SPACE to Restart', this.width / 2 - 100, this.height / 2 + 60, 'white', '20px Arial');
        } else if (this.state === 'WIN') {
            Utils.drawText(this.ctx, 'VICTORY!', this.width / 2 - 60, this.height / 2 - 20, 'green', '30px Arial');
            Utils.drawText(this.ctx, `Final Score: ${this.score}`, this.width / 2 - 70, this.height / 2 + 20, 'white', '20px Arial');
            Utils.drawText(this.ctx, 'Press SPACE to Play Again', this.width / 2 - 110, this.height / 2 + 60, 'white', '20px Arial');
        }
    }
}
