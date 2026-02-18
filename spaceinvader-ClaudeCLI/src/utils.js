/**
 * Utility functions for Space Invaders game
 */

/**
 * Detect collision between two rectangles
 * @param {Object} rect1 - Rectangle with x, y, width, height
 * @param {Object} rect2 - Rectangle with x, y, width, height
 * @returns {boolean} True if rectangles collide
 */
function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

/**
 * Draw a rectangle on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Rectangle width
 * @param {number} height - Rectangle height
 * @param {string} color - Fill color
 */
function drawRect(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

/**
 * Draw text on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} text - Text to draw
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {string} color - Text color
 * @param {string} font - Font style
 * @param {string} align - Text alignment (default: 'left')
 */
function drawText(ctx, text, x, y, color = 'white', font = '16px Arial', align = 'left') {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

/**
 * Clear the entire canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {string} color - Background color (default: black)
 */
function clearCanvas(ctx, width, height, color = 'black') {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
