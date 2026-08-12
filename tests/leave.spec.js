const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { LeavePage } = require('../pages/LeavePage');

function formatDate(date) {
  return date.toISOString().split('T')[0]; // yyyy-mm-dd, matches the field's expected format
}

test.describe('Leave - Apply for leave', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
  });

  test('applies for full-day leave and finds it in My Leave', async ({ page }) => {
    const leavePage = new LeavePage(page);

    const daysAhead = 30 + (Date.now() % 200);
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() + daysAhead);
    const toDate = new Date(fromDate);
    toDate.setDate(toDate.getDate() + 1);

    const fromDateStr = formatDate(fromDate);
    const toDateStr = formatDate(toDate);

    await leavePage.gotoApply();
    await leavePage.selectLeaveType('CAN - Bereavement');
    await leavePage.setDateRange(fromDateStr, toDateStr);
    await leavePage.apply();

    // App's own confirmation the request was submitted
    await expect(page.getByText(/Successfully Saved/)).toBeVisible();

    await leavePage.gotoMyLeave();
    await expect(page.getByRole('row', { name: /CAN - Bereavement/ }).first()).toBeVisible();
  });
});