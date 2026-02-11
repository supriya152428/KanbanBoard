import { test, expect } from '@playwright/test';

test('User can create a task', async ({ page }) => {

  await page.goto('http://localhost:5173');

  await page.fill('input[placeholder="Task title"]', 'Playwright Task');

  await page.click('text=Add Task');

  await expect(page.locator('text=Playwright Task')).toBeVisible();
});
