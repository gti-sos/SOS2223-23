// @ts-check
import  { test, expect } from '@playwright/test';

test('Ricardo Test', async ({ page }) => {
  await page.goto('localhost:12345/api/v2/ss-affiliates/loadInitialData');

  await page.goto('localhost:12345/ss-affiliates');

  await page.waitForLoadState('load');

  const EditButtons = await page.$$('button[name*="Editar"]');
  console.log(EditButtons)
  const numEditButtons =  EditButtons.length;
  console.log(numEditButtons);
  expect(numEditButtons).toBeGreaterThan(8);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});
