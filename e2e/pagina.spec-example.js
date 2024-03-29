// @ts-check
import  { test, expect } from '@playwright/test';

test('home has the right title', async ({ page }) => {
  await page.goto('localhost:12345');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Inicio Api/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});
