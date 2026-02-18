# Space Invaders

Un clone de Space Invaders en JavaScript vanilla avec Canvas HTML5. Zéro dépendance externe.

## Jouer

Ouvrir `index.html` dans un navigateur, ou lancer un serveur local :

```bash
npx serve .
```

Puis ouvrir `http://localhost:3000`

## Contrôles

| Touche | Action |
|--------|--------|
| ← Flèche gauche | Déplacer le vaisseau à gauche |
| → Flèche droite | Déplacer le vaisseau à droite |
| Espace | Tirer / Lancer la partie / Rejouer |

## Règles

- 3 vies, un seul missile à la fois
- 15 ennemis (5×3) avec 3 types : rouge (30 pts), jaune (20 pts), vert (10 pts)
- Les ennemis se déplacent en bloc et accélèrent à chaque élimination (+10%)
- **Victoire** : tous les ennemis détruits
- **Game Over** : plus de vies ou un ennemi atteint le bas

## Structure du projet

```
space-invaders/
├── index.html        — Page principale avec le canvas
├── tests.html        — Tests unitaires (37 tests, vanilla JS)
├── src/
│   ├── utils.js      — Fonctions utilitaires (collisions, dessin, helpers)
│   ├── player.js     — Classe Player (déplacement, tir, vies)
│   ├── enemies.js    — Classes Enemy + EnemyGrid (formation, comportement)
│   └── game.js       — Classe Game (boucle principale, état, score)
├── docs/
│   └── GAMEPLAY.md   — Spécifications détaillées du gameplay
└── CLAUDE.md         — Instructions pour l'IA
```

## Architecture

### utils.js
Fonctions partagées et constantes globales :
- `rectCollision(a, b)` — Détection de collision AABB
- `drawRect()` / `drawText()` / `clearCanvas()` — Helpers de rendu
- `clamp()` / `randomInt()` — Utilitaires mathématiques
- `CANVAS_WIDTH` (800) / `CANVAS_HEIGHT` (600)

### player.js
Classe `Player` :
- Position centrée en bas du canvas, vitesse 5 px/frame
- Tir d'un missile unique (8 px/frame vers le haut)
- Gestion des vies (3) et reset

### enemies.js
Classe `Enemy` — Ennemi individuel avec type (A/B/C), points et couleur.

Classe `EnemyGrid` — Gestion de la formation :
- Déplacement latéral en bloc, descente + inversion au bord
- Accélération progressive (+10% par ennemi détruit)
- Tir aléatoire toutes les 2 secondes

### game.js
Classe `Game` — Orchestration :
- Machine à états : `start` → `playing` → `gameover` / `victory`
- Boucle `requestAnimationFrame`
- Gestion des collisions (missile joueur→ennemi, missile ennemi→joueur)
- HUD (score + vies) et écrans (démarrage, game over, victoire)

## Tests

Ouvrir `tests.html` dans un navigateur ou via :

```
http://localhost:3000/tests.html
```

37 tests couvrent : utils, player, enemies et game.

## Stack technique

- JavaScript vanilla ES6
- Canvas HTML5 (800×600)
- Aucune dépendance externe
