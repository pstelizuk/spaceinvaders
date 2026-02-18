/**
 * @file src/player.js
 * @description Player class for Space Invaders.
 */

import { Utils } from './utils.js';

export class Player {
    /**
     * Create a new Player instance
     * @param {number} canvasWidth 
     * @param {number} canvasHeight 
     */
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.width = 40;
        this.height = 20;
        this.x = (this.canvasWidth - this.width) / 2;
        this.y = this.canvasHeight - this.height - 10;
        this.speed = 5;
        this.lives = 3;
        this.missile = null; // Can only have one missile at a time

        // Key states
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false,
            Space: false
        };

        // Event listeners
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.keyupListener = (e) => this.handleKeyUp(e); // Needed for cleanup if required
        window.addEventListener('keyup', window.keyupListener);
    }

    /**
     * Handle key down events
     * @param {KeyboardEvent} e 
     */
    handleKeyDown(e) {
        if (e.code === 'ArrowLeft') this.keys.ArrowLeft = true;
        if (e.code === 'ArrowRight') this.keys.ArrowRight = true;
        if (e.code === 'Space') {
            this.shoot();
        }
    }

    /**
     * Handle key up events
     * @param {KeyboardEvent} e 
     */
    handleKeyUp(e) {
        if (e.code === 'ArrowLeft') this.keys.ArrowLeft = false;
        if (e.code === 'ArrowRight') this.keys.ArrowRight = false;
    }

    /**
     * Update player state
     */
    update() {
        // Movement
        if (this.keys.ArrowLeft && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.keys.ArrowRight && this.x < this.canvasWidth - this.width) {
            this.x += this.speed;
        }

        // Missile movement
        if (this.missile) {
            this.missile.y -= 8; // Missile speed 8 px up
            if (this.missile.y < 0) {
                this.missile = null;
            }
        }
    }

    /**
     * Draw the player and missile
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        // Draw Player
        Utils.drawRect(ctx, this.x, this.y, this.width, this.height, 'lime');

        // Draw Missile
        if (this.missile) {
            Utils.drawRect(ctx, this.missile.x, this.missile.y, this.missile.width, this.missile.height, 'red');
        }
    }

    /**
     * Fire a missile if none exists
     */
    shoot() {
        if (!this.missile) {
            this.missile = {
                x: this.x + this.width / 2 - 2, // Centered
                y: this.y,
                width: 4,
                height: 10
            };
        }
    }

    /**
     * Reset player position and missile
     */
    reset() {
        this.x = (this.canvasWidth - this.width) / 2;
        this.missile = null;
        this.keys.ArrowLeft = false;
        this.keys.ArrowRight = false;
    }
}
