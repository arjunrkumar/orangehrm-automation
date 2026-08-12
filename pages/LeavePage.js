class LeavePage {
  constructor(page) {
    this.page = page;
    this.leaveNavLink = page.getByRole('link', { name: 'Leave', exact: true });
    this.applyNavLink = page.getByRole('link', { name: 'Apply', exact: true });
    this.myLeaveNavLink = page.getByRole('link', { name: 'My Leave', exact: true });
    this.leaveTypeSelect = page.locator('.oxd-input-group', { hasText: 'Leave Type' }).locator('.oxd-select-text');
    this.fromDateInput = page.locator('.oxd-input-group', { hasText: 'From Date' }).getByRole('textbox');
    this.toDateInput = page.locator('.oxd-input-group', { hasText: 'To Date' }).getByRole('textbox');
    this.partialDaysSelect = page.locator('.oxd-input-group', { hasText: 'Partial Days' }).locator('.oxd-select-text');
    this.applyButton = page.getByRole('button', { name: 'Apply' });
  }

  async gotoApply() {
    await this.leaveNavLink.click();
    await this.applyNavLink.click();
  }

  async gotoMyLeave() {
    await this.leaveNavLink.click();
    await this.myLeaveNavLink.click();
  }

  async selectLeaveType(leaveType) {
    await this.leaveTypeSelect.click();
    await this.page.getByRole('option', { name: leaveType }).click();
  }

  async setDateRange(fromDate, toDate) {
    await this.fromDateInput.clear();
    await this.fromDateInput.fill(fromDate);
    await this.toDateInput.clear();
    await this.toDateInput.fill(toDate);
  }

  async apply() {
    await this.applyButton.click();
  }
}

module.exports = { LeavePage };