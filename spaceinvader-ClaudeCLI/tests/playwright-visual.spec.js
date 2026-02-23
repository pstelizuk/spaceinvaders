// @ts-check
const { test, expect } = require('@playwright/test');

const URL = '/tests/visual-tests.html';

test.describe('Space Invaders — Tests Visuels', () => {

  /**
   * TEST 1 — Missile joueur détruit un ennemi
   * Vérifie que le missile supprime l'ennemi, que le score vaut 20,
   * et que le missile est null après impact.
   */
  test('TEST 1 — Missile joueur détruit un ennemi', async ({ page }) => {
    await page.goto(URL);

    const log = page.locator('#log-panel');

    // Attendre que l'animation de vol se termine par un impact
    await expect(log.getByText('Impact détecté !')).toBeVisible({ timeout: 10000 });

    // Vérifier les 3 assertions du test canvas
    await expect(log.getByText("L'ennemi est retiré de la grille")).toBeVisible({ timeout: 5000 });
    await expect(log.getByText('Le score vaut exactement 20')).toBeVisible({ timeout: 5000 });
    await expect(log.getByText('Le missile est null après impact')).toBeVisible({ timeout: 5000 });

    // Aucun échec
    await expect(page.locator('.log-fail')).toHaveCount(0);
  });

  /**
   * TEST 2 — Envahisseur atteint la ligne joueur → Game Over
   * Vérifie que la condition Game Over est déclenchée quand un ennemi
   * atteint la ligne du joueur.
   */
  test('TEST 2 — Envahisseur atteint la ligne joueur → Game Over', async ({ page }) => {
    await page.goto(URL);

    const log = page.locator('#log-panel');

    // Attendre la fin de TEST 1 + pause + animation de descente de TEST 2
    await expect(log.getByText('Condition Game Over déclenchée !')).toBeVisible({ timeout: 20000 });

    // Vérifier les 2 assertions du test canvas
    await expect(log.getByText('La condition Game Over est déclenchée')).toBeVisible({ timeout: 5000 });
    await expect(log.getByText('Position ennemi confirme atteinte ligne joueur')).toBeVisible({ timeout: 5000 });

    // Vérifier le résumé final
    await expect(log.getByText('2/2 TESTS PASSÉS')).toBeVisible({ timeout: 10000 });

    // Aucun échec
    await expect(page.locator('.log-fail')).toHaveCount(0);
  });

});
