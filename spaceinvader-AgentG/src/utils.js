/**
 * @file src/utils.js
 * @description Utility functions for Space Invaders game.
 */

export class Utils {
    /**
     * Check for AABB collision between two rectangular objects
     * @param {Object} rect1 - First object with x, y, width, height
     * @param {Object} rect2 - Second object with x, y, width, height
     * @returns {boolean} True if collision detected
     */
    static checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    /**
     * Draw a rectangle on the canvas
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {string} color 
     */
    static drawRect(ctx, x, y, width, height, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }

    /**
     * Draw text on the canvas
     * @param {CanvasRenderingContext2D} ctx 
     * @param {string} text 
     * @param {number} x 
     * @param {number} y 
     * @param {string} color 
     * @param {string} font 
     */
    static drawText(ctx, text, x, y, color, font = "20px Arial") {
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.fillText(text, x, y);
    }
}
