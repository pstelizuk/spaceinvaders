/**
 * @fileoverview Utility functions for the Space Invaders game.
 * Provides helper functions for drawing on the canvas and collision detection.
 */

/**
 * Draws a filled rectangle on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 * @param {string} color - The fill color of the rectangle (e.g., "red", "#00FF00").
 */
export function drawRect(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

/**
 * Draws text on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
 * @param {string} text - The text string to draw.
 * @param {number} x - The x-coordinate of the text.
 * @param {number} y - The y-coordinate of the text.
 * @param {string} color - The fill color of the text.
 * @param {string} font - The font style (e.g., "20px Arial").
 * @param {string} [align='left'] - The horizontal alignment of the text (e.g., "left", "center", "right").
 */
export function drawText(ctx, text, x, y, color, font, align = 'left') {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

/**
 * Checks for collision between two rectangles (Axis-Aligned Bounding Box collision detection).
 * @param {object} rect1 - The first rectangle with x, y, width, height properties.
 * @param {number} rect1.x - The x-coordinate of the top-left corner of the first rectangle.
 * @param {number} rect1.y - The y-coordinate of the top-left corner of the first rectangle.
 * @param {number} rect1.width - The width of the first rectangle.
 * @param {number} rect1.height - The height of the first rectangle.
 * @param {object} rect2 - The second rectangle with x, y, width, height properties.
 * @param {number} rect2.x - The x-coordinate of the top-left corner of the second rectangle.
 * @param {number} rect2.y - The y-coordinate of the top-left corner of the second rectangle.
 * @param {number} rect2.width - The width of the second rectangle.
 * @param {number} rect2.height - The height of the second rectangle.
 * @returns {boolean} - True if the rectangles are colliding, false otherwise.
 */
export function checkCollision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}
