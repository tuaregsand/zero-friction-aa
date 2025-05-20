import { test, expect } from '@playwright/test';

test('onboarding flow', async ({ page }) => {
  await page.goto('http://localhost:4000/onboard');
  await page.getByLabel('Username').fill('tester');
  await page.getByLabel('Register').click();
  await page.locator('.h-12.w-12').waitFor();
  await page.getByLabel('Mint NFT').click();
  await expect(page.getByText('sent')).toBeVisible();
});
