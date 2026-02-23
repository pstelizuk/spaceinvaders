# Tests — Space Invaders

Deux jeux de tests visuels, animés frame par frame, avec assertions en temps réel.

---

## 1. Simple Browser (VS Code intégré)

Lance le serveur HTTP + ouvre automatiquement le Simple Browser dans VS Code.

```bash
powershell.exe -ExecutionPolicy Bypass -File tests/open-tests.ps1
```

- Le serveur démarre sur `http://localhost:8765` (si pas déjà actif)
- VS Code passe au premier plan
- Le Simple Browser s'ouvre avec la page de tests
- Les 2 tests démarrent automatiquement sans interaction

---

## 2. Playwright (Chrome externe)

Lance les 2 tests dans un vrai Chrome visible, avec assertions Playwright.

```bash
cd tests && npm test
```

> **Première fois** : `npm install` est nécessaire avant `npm test`

- Chrome s'ouvre en mode headed
- TEST 1 puis TEST 2 s'exécutent séquentiellement
- Résultat affiché dans le terminal (`2 passed`)

---

## Ce que testent les 2 tests

| # | Scénario | Assertions |
|---|----------|-----------|
| TEST 1 | Missile joueur détruit un ennemi | ennemi retiré · score = 20 · missile null |
| TEST 2 | Envahisseur atteint la ligne joueur | condition Game Over déclenchée · position confirmée |

---

## Prérequis

- Python (serveur HTTP) — `python -m http.server`
- Node.js + npm (Playwright)
- Google Chrome installé
- VS Code (pour le Simple Browser)
