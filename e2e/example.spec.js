// @ts-check
import  { test, expect } from '@playwright/test';

test('Ricardo Test', async ({ page }) => {

  await page.goto('localhost:12345/api/v2/ss-affiliates/loadInitialData');

  await page.goto('localhost:12345/ss-affiliates');

  await page.waitForLoadState('load');

  await page.waitForTimeout(1000);

  const links = await page.$$('a');

  const linkTexts = [];

  for (const link of links) {
    const linkText = await link.textContent(); // obtener el texto del enlace
    linkTexts.push(linkText); // añadir el texto a la lista
  }

  const numEditLink = linkTexts.filter((linkText) => linkText === 'Editar').length;
  
  expect(numEditLink).toBeGreaterThan(8);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});
