import { config } from "dotenv";
config({ path: ".env.local" });
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', { name: 'Try a Guest Account' }).click();
})
test('update user bio', async ({ page }) => {
  // navigate to user profile
  await page.getByTestId('userOptions').click();
  await page.getByRole('menuitem', { name: 'Profile' }).click();

  await page.waitForURL('http://localhost:3000/Guest123');
  await expect(page.getByText('@Guest123')).toBeVisible();
  await expect(page.getByText('Default Bio')).toBeVisible();
  await page.getByRole('button', { name: 'Update bio' }).click();
  await page.getByPlaceholder('Enter Bio').fill('Default Bio (Edited)');
  await page.getByRole('button', { name: 'Update', exact: true }).click();
  await expect(page.getByText('Default Bio (Edited)')).toBeVisible();

  await page.getByRole('button', { name: 'Update bio' }).click();
  await page.getByPlaceholder('Enter Bio').fill('Default Bio');
  await page.getByRole('button', { name: 'Update', exact: true }).click();
  await expect(page.getByText('Default Bio')).toBeVisible();
  // log out
  await page.getByTestId('userOptions').click();
  await page.getByRole('button', {name: 'Sign Out'}).click();
});
