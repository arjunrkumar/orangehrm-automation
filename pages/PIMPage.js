class PIMPage {
  constructor(page) {
    this.page = page;
    this.pimNavLink = page.getByRole('link', { name: 'PIM' });
    this.employeeNameSearch = page.getByRole('textbox', { name: 'Type for hints...' }).first();
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.addButton = page.getByRole('button', { name: ' Add' });
  }

  async goto() {
    await this.pimNavLink.click();
  }

  async searchByName(name) {
    await this.employeeNameSearch.fill(name);
    await this.searchButton.click();
  }

  async clickAddEmployee() {
    await this.addButton.click();
  }

  // Cell-level match, not row-level — a row's accessible name bakes in
  // the auto-generated Employee ID, which changes every run.
  getEmployeeNameCell(name) {
    return this.page.getByRole('cell', { name });
  }
}

module.exports = { PIMPage };