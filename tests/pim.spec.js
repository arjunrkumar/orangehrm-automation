const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { PIMPage } = require('../pages/PIMPage');
const { AddEmployeePage } = require('../pages/AddEmployeePage');

test.describe('PIM - Add and find employee', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
  });

  test('adds a new employee and finds them via search', async ({ page }) => {
    const pimPage = new PIMPage(page);
    const addEmployeePage = new AddEmployeePage(page);

    const firstName = 'Ark';
    const lastName = `Automation${Date.now()}`; // unique per run — avoids collisions on the demo
    const fullName = `${firstName} ${lastName}`;

    await pimPage.goto();
    await pimPage.clickAddEmployee();
    await addEmployeePage.fillDetails({ firstName, lastName });
    await addEmployeePage.save();

    await expect(page.getByRole('heading', { name: fullName })).toBeVisible({timeout: 30000}); //Demo can be slow to render the profile page after save — generous timeout to avoid flaky failures

    await pimPage.goto();
    await pimPage.searchByName(fullName);
    await expect(pimPage.getEmployeeNameCell(lastName)).toBeVisible();
  });
});