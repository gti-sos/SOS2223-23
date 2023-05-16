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

test('Pablo test title', async ({ page }) => {
  await page.goto('localhost:12345/density-population');

  // Expect the title to be "Datos API Densidad de Población".
  await expect(page).toHaveTitle('Datos API Densidad de Poblacion');
});

test('Pablo test data', async ({ page }) => {
  await page.goto('localhost:12345/api/v2/density-population/loadInitialData');

  await page.goto('localhost:12345/density-population');

  await page.waitForLoadState('load');

  await page.waitForTimeout(1000);

  await expect((await page.locator(".dataTable").all()).length).toBeGreaterThan(8);
});

test('Agustin Test', async ({ page }) => {

  await page.goto('localhost:12345/api/v2/hired-people/loadInitialData');

  await page.goto('localhost:12345/hired-people');

  await page.waitForLoadState('load');

  await page.waitForTimeout(1000);

  await expect((await page.locator(".tarjeta").all()).length).toBeGreaterThan(5);

});