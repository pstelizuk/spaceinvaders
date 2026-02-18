# Gameplay — Space Invaders

## Contrôles joueur
| Touche | Action |
|--------|--------|
| ← Flèche gauche | Déplacer le vaisseau à gauche |
| → Flèche droite | Déplacer le vaisseau à droite |
| Espace | Tirer un missile |

## Le joueur
- Vaisseau positionné en bas du canvas, centré au démarrage
- Vitesse de déplacement : 5 px par frame
- Ne peut pas sortir du canvas
- 3 vies au départ
- Un seul missile à la fois à l'écran (ne peut pas retirer avant que le précédent disparaisse)
- Missile vitesse : 8 px vers le haut

## Les ennemis
- Formation initiale : 5 colonnes × 3 lignes = 15 ennemis
- Espacés de 70px horizontalement, 50px verticalement
- Formation centrée horizontalement dans le canvas

### Types d'ennemis (par ligne)
| Ligne | Type | Points | Couleur suggérée |
|-------|------|--------|-----------------|
| 1 (haut) | Alien A | 30 pts | Rouge |
| 2 (milieu) | Alien B | 20 pts | Jaune |
| 3 (bas) | Alien C | 10 pts | Vert |

### Comportement des ennemis
- Se déplacent latéralement en bloc (tous ensemble)
- Vitesse initiale : 1 px par frame
- Quand la formation touche le bord gauche ou droit : descend de 20px et inverse la direction
- Vitesse augmente de 10% chaque fois qu'un ennemi est détruit
- Tir aléatoire : un ennemi aléatoire tire toutes les 2 secondes
- Missile ennemi vitesse : 4 px vers le bas

## Conditions de fin de partie

### Game Over
- Un ennemi atteint la ligne du joueur (bas du canvas)
- Le joueur est touché et n'a plus de vies

### Victoire
- Tous les ennemis sont détruits

## HUD (affichage)
- En haut à gauche : `SCORE: 000`
- En haut à droite : `VIES: ♥ ♥ ♥`
- Fond noir, texte blanc

## Écrans
- **Démarrage** : titre + "Appuie sur ESPACE pour jouer"
- **Game Over** : "GAME OVER" + score final + "ESPACE pour rejouer"
- **Victoire** : "VICTOIRE !" + score final + "ESPACE pour rejouer"

## Roadmap futures features (ne pas implémenter maintenant)
- Niveaux progressifs (vitesse et formation augmentent)
- Boss tous les 3 niveaux
- Boucliers destructibles entre le joueur et les ennemis
- Power-ups (tir double, invincibilité)
- Sons et musique
- Highscore sauvegardé en localStorage
