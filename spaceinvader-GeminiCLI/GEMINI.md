# Space Invaders — Instructions Claude

## Specs gameplay et règles
@docs/GAMEPLAY.md

---

## Stack technique
- JavaScript vanilla ES6, zéro dépendance externe
- Canvas HTML5 uniquement (pas de DOM manipulation pour le rendu)
- Canvas size : 800 x 600 px
- Architecture en classes ES6

## Structure des fichiers
```
space-invaders/
├── index.html       — page principale, inclut le canvas et les scripts
├── src/
│   ├── game.js      — classe Game : boucle principale, état global, score
│   ├── player.js    — classe Player : déplacement, tir, vies
│   ├── enemies.js   — classe Enemy + classe EnemyGrid : formation et comportement
│   └── utils.js     — fonctions utilitaires : collisions, dessin, helpers
└── docs/
    └── GAMEPLAY.md  — specs détaillées du gameplay (référencé ici)
```

## Conventions de code
- `const` et `let` uniquement, jamais `var`
- Noms de variables et fonctions en anglais
- JSDoc obligatoire sur chaque méthode de classe
- Une classe par fichier
- Pas de code dans index.html sauf les balises `<script>`

## Workflow attendu
- Créer les fichiers un par un dans l'ordre : utils.js → player.js → enemies.js → game.js → index.html
- Après chaque fichier, attendre la validation avant de passer au suivant
- Proposer les tests unitaires une fois le jeu fonctionnel

## Ce que tu NE dois PAS faire
- Mettre toute la logique dans un seul fichier
- Utiliser des librairies externes (Phaser, p5.js, etc.)
- Utiliser `document.getElementById` pour le rendu (uniquement pour récupérer le canvas au démarrage)
