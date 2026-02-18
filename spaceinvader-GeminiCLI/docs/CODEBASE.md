# Codebase Documentation - Space Invaders

This document provides a high-level overview of the JavaScript codebase for the Space Invaders game. Detailed API documentation for classes and functions can be found directly within the JSDoc comments of each respective `.js` file.

## Structure des Fichiers

The project follows the specified structure:

```
space-invaders/
├── index.html       — Main entry point, sets up the canvas and loads the game.
├── src/
│   ├── game.js      — The core Game class managing the game loop, state, and interactions.
│   ├── player.js    — Defines the Player (spaceship) class, handling movement, firing, and lives.
│   ├── enemies.js   — Contains the Enemy and EnemyGrid classes, managing alien formation, movement, and attacks.
│   └── utils.js     — Utility functions for drawing on the canvas and collision detection.
└── docs/
    ├── GAMEPLAY.md  — Detailed gameplay specifications and rules.
    └── CODEBASE.md  — This document.
```

## Module Descriptions

### `src/utils.js`
This module provides fundamental helper functions used throughout the game for canvas rendering and basic game mechanics.

-   **`drawRect(ctx, x, y, width, height, color)`**: Draws a filled rectangle on the canvas. Used for rendering all game entities (player, enemies, missiles) as simple shapes.
-   **`drawText(ctx, text, x, y, color, font, align)`**: Draws text on the canvas. Essential for displaying the HUD (score, lives) and game state screens (start, game over, victory).
-   **`checkCollision(rect1, rect2)`**: Performs Axis-Aligned Bounding Box (AABB) collision detection between two rectangular objects. Crucial for determining hits between missiles and entities.

### `src/player.js`
This module defines the `Player` class, representing the user-controlled spaceship.

-   **`Player` Class**:
    -   **Purpose**: Manages the player's position, movement, firing mechanism, and remaining lives.
    -   **Key Properties**: `x`, `y` (position), `width`, `height`, `speed`, `lives`, `missile` (active player missile), `missileSpeed`.
    -   **Key Methods**:
        -   `constructor(canvasWidth, canvasHeight)`: Initializes the player at the bottom center of the canvas.
        -   `moveLeft()` / `moveRight()`: Updates the player's horizontal position, respecting canvas boundaries.
        -   `fire()`: Creates a player missile if one is not already active.
        -   `update()`: Updates the state of the player, primarily moving its missile.
        -   `draw(ctx)`: Renders the player spaceship and its missile on the canvas.
        -   `takeDamage()`: Decrements player lives.

### `src/enemies.js`
This module contains two classes: `Enemy` for individual aliens and `EnemyGrid` for managing their collective behavior.

-   **`Enemy` Class**:
    -   **Purpose**: Represents a single alien invader, holding its type, points value, color, and state.
    -   **Key Properties**: `x`, `y` (position), `width`, `height`, `type`, `points`, `color`, `isAlive`.
    -   **Key Methods**:
        -   `constructor(x, y, type, points, color)`: Initializes an enemy with its specific attributes.
        -   `draw(ctx)`: Renders the enemy on the canvas if it's alive.

-   **`EnemyGrid` Class**:
    -   **Purpose**: Manages the formation, collective movement, and missile firing of all enemies.
    -   **Key Properties**: `enemies` (array of `Enemy` instances), `enemyMissiles` (array of active enemy missiles), `direction`, `speed`, `verticalDrop`.
    -   **Key Methods**:
        -   `constructor(canvasWidth, canvasHeight)`: Initializes the grid, creating all enemies in their starting formation.
        -   `update(deltaTime)`: Moves the entire enemy formation, handles boundary collisions (dropping down and reversing direction), and triggers random enemy missile firing.
        -   `draw(ctx)`: Renders all live enemies and their missiles.
        -   `removeEnemy(enemy)`: Marks an enemy as destroyed and increases the overall enemy grid speed.
        -   `checkEnemyCollision(object, collisionCheckFn)`: Checks if a given object collides with any alive enemy.
        -   `checkMissileCollision(object, collisionCheckFn)`: Checks if a given object collides with any enemy missile, removing the missile upon collision.
        -   `hasReachedPlayerLine(playerY)`: Determines if any enemy has reached or passed the player's vertical position.
        -   `areAllEnemiesDestroyed()`: Checks if all enemies in the grid have been eliminated.

### `src/game.js`
This module defines the central `Game` class, which orchestrates the entire game experience.

-   **`Game` Class**:
    -   **Purpose**: Acts as the main controller, handling the game loop, managing game states (start, playing, game over, victory), updating all game entities, detecting collisions, rendering the display, and processing user input.
    -   **Key Properties**: `canvas`, `ctx` (canvas rendering context), `player` (instance of `Player`), `enemyGrid` (instance of `EnemyGrid`), `score`, `gameState`, `keys` (for input tracking).
    -   **Key Methods**:
        -   `constructor(canvas)`: Sets up the canvas, initializes game components, and attaches event listeners.
        -   `init()`: Resets the game to its initial state for a new round.
        -   `gameLoop(currentTime)`: The primary animation loop, calculating `deltaTime` and orchestrating `update()` and `draw()` calls.
        -   `update(deltaTime)`: Processes all game logic, including player input, entity updates, and collision detection.
        -   `draw()`: Clears the canvas and renders all game elements, including the HUD and different game state screens.
        -   `#setupEventListeners()`: Configures keyboard event handlers.
        -   `#startGame()`: Transitions the game state from a menu to active play.
        -   `#checkCollisions()`: Manages collision logic between player missiles and enemies, and enemy missiles and the player.
        -   `#checkGameEndConditions()`: Determines if the game has ended due to victory or game over conditions.
        -   `#displayHUD()`: Renders the score and player lives.
        -   `#displayStartScreen()`, `#displayGameOverScreen()`, `#displayVictoryScreen()`: Render the respective game state screens.

This documentation, combined with the detailed JSDoc comments within each source file, should provide a comprehensive understanding of the Space Invaders codebase.