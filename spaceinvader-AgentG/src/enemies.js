/**
 * @file src/enemies.js
 * @description Enemy and EnemyGrid classes for Space Invaders.
 */

import { Utils } from './utils.js';

class Enemy {
    /**
     * Create a new Enemy
     * @param {number} x - Initial X position
     * @param {number} y - Initial Y position
     * @param {string} type - Enemy type (A, B, C)
     * @param {number} score - Points awarded for destroying
     * @param {string} color - Color of the enemy
     */
    constructor(x, y, type, score, color) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.score = score;
        this.color = color;
        this.width = 40;
        this.height = 30;
        this.active = true;
    }

    /**
     * Draw the enemy
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        if (this.active) {
            Utils.drawRect(ctx, this.x, this.y, this.width, this.height, this.color);
        }
    }
}

export class EnemyGrid {
    /**
     * Create the EnemyGrid manager
     * @param {number} canvasWidth 
     * @param {number} canvasHeight 
     */
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.enemies = [];
        this.rows = 3;
        this.cols = 5;
        this.direction = 1; // 1 = right, -1 = left
        this.speed = 1;
        this.descendAmount = 20;
        this.missiles = [];
        this.lastShotTime = 0;
        this.shotInterval = 2000; // 2 seconds

        this.initEnemies();
    }

    /**
     * Initialize enemy formation
     */
    initEnemies() {
        const startX = (this.canvasWidth - (this.cols * 70)) / 2;
        const startY = 50;

        for (let row = 0; row < this.rows; row++) {
            let type, score, color;
            if (row === 0) { type = 'A'; score = 30; color = 'red'; } // Top
            if (row === 1) { type = 'B'; score = 20; color = 'yellow'; } // Middle
            if (row === 2) { type = 'C'; score = 10; color = 'green'; } // Bottom

            for (let col = 0; col < this.cols; col++) {
                const x = startX + col * 70;
                const y = startY + row * 50;
                this.enemies.push(new Enemy(x, y, type, score, color));
            }
        }
    }

    /**
     * Update enemy grid movement and shooting
     * @param {number} playerX - Player position for potential AI targeting (optional)
     * @returns {boolean} True if enemies reached bottom
     */
    update(playerX) {
        // Check for edge collision and change direction
        let hitEdge = false;
        for (const enemy of this.enemies) {
            if (!enemy.active) continue;
            if ((this.direction === 1 && enemy.x + enemy.width > this.canvasWidth) ||
                (this.direction === -1 && enemy.x < 0)) {
                hitEdge = true;
                break;
            }
        }

        if (hitEdge) {
            this.direction *= -1;
            for (const enemy of this.enemies) {
                enemy.y += this.descendAmount;
            }
        } else {
            for (const enemy of this.enemies) {
                enemy.x += this.speed * this.direction;
            }
        }

        // Handle missiles
        this.updateMissiles();

        // Random shooting
        const now = Date.now();
        if (now - this.lastShotTime > this.shotInterval) {
            this.shoot();
            this.lastShotTime = now;
        }

        // Check if any enemy reached bottom
        for (const enemy of this.enemies) {
            if (enemy.active && enemy.y + enemy.height >= this.canvasHeight - 50) { // arbitrary bottom limit
                return true; // Game Over
            }
        }
        return false;
    }

    /**
     * Enemy shoots a missile
     */
    shoot() {
        const activeEnemies = this.enemies.filter(e => e.active);
        if (activeEnemies.length === 0) return;

        const shooter = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];
        this.missiles.push({
            x: shooter.x + shooter.width / 2,
            y: shooter.y + shooter.height,
            width: 4,
            height: 10
        });
    }

    /**
     * Update missiles positions
     */
    updateMissiles() {
        for (let i = this.missiles.length - 1; i >= 0; i--) {
            const m = this.missiles[i];
            m.y += 4; // Enemy missile speed
            if (m.y > this.canvasHeight) {
                this.missiles.splice(i, 1);
            }
        }
    }

    /**
     * Draw enemies and missiles
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        for (const enemy of this.enemies) {
            enemy.draw(ctx);
        }
        for (const m of this.missiles) {
            Utils.drawRect(ctx, m.x, m.y, m.width, m.height, 'white');
        }
    }

    /**
     * Check collisions with player missile
     * @param {Object} missile 
     * @returns {number|null} Score if hit, null otherwise
     */
    checkCollision(missile) {
        for (const enemy of this.enemies) {
            if (enemy.active && Utils.checkCollision(missile, enemy)) {
                enemy.active = false;
                this.speed *= 1.1; // Increase speed by 10%
                return enemy.score;
            }
        }
        return null;
    }
}
