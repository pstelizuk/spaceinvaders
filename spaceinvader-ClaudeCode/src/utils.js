// ============================================================
// utils.js — Fonctions utilitaires : collisions, dessin, helpers
// ============================================================

/**
 * Détecte une collision entre deux rectangles (AABB).
 * @param {Object} a - Premier rectangle { x, y, width, height }
 * @param {Object} b - Second rectangle { x, y, width, height }
 * @returns {boolean} true si les deux rectangles se chevauchent
 */
function rectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Dessine un rectangle plein sur le canvas.
 * @param {CanvasRenderingContext2D} ctx - Contexte 2D du canvas
 * @param {number} x - Position X
 * @param {number} y - Position Y
 * @param {number} width - Largeur
 * @param {number} height - Hauteur
 * @param {string} color - Couleur de remplissage
 */
function drawRect(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

/**
 * Dessine du texte sur le canvas.
 * @param {CanvasRenderingContext2D} ctx - Contexte 2D du canvas
 * @param {string} text - Texte à afficher
 * @param {number} x - Position X
 * @param {number} y - Position Y
 * @param {string} [color='#FFFFFF'] - Couleur du texte
 * @param {string} [font='20px monospace'] - Police du texte
 * @param {string} [align='left'] - Alignement horizontal
 */
function drawText(ctx, text, x, y, color = '#FFFFFF', font = '20px monospace', align = 'left') {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

/**
 * Efface entièrement le canvas avec une couleur de fond.
 * @param {CanvasRenderingContext2D} ctx - Contexte 2D du canvas
 * @param {number} width - Largeur du canvas
 * @param {number} height - Hauteur du canvas
 * @param {string} [color='#000000'] - Couleur de fond
 */
function clearCanvas(ctx, width, height, color = '#000000') {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Limite une valeur entre un minimum et un maximum.
 * @param {number} value - Valeur à limiter
 * @param {number} min - Borne inférieure
 * @param {number} max - Borne supérieure
 * @returns {number} Valeur limitée
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Retourne un entier aléatoire entre min (inclus) et max (inclus).
 * @param {number} min - Borne inférieure (incluse)
 * @param {number} max - Borne supérieure (incluse)
 * @returns {number} Entier aléatoire
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Constantes du jeu
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
