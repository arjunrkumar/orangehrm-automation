const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

let loginPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
});

test('logs in successfully with valid credentials', async ({ page }) => {
    await loginPage.login('Admin', 'admin123');
    await expect(loginPage.dashboardHeader).toHaveText('Dashboard');
    await expect(page).toHaveURL(/dashboard/);
});

test('shows error with invalid credentials', async () => {
    await loginPage.login('Admin', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
});

test('shows validation for empty fields', async () => {
    await loginPage.login('', '');
    const requiredFields = await loginPage.page.locator('.oxd-input-group__message').count();
    expect(requiredFields).toBeGreaterThan(0);
});