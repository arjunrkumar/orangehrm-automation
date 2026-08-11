class AddEmployeePage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.middleNameInput = page.getByRole('textbox', { name: 'Middle Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.employeeIdInput = page.getByRole('textbox', { name: 'Employee Id' }); // verify this per note above
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async fillDetails({ firstName, middleName, lastName, employeeId }) {
    await this.firstNameInput.fill(firstName);
    if (middleName) await this.middleNameInput.fill(middleName);
    await this.lastNameInput.fill(lastName);
    if (employeeId) await this.employeeIdInput.fill(employeeId);
  }

  async save() {
    await this.saveButton.click();
  }
}

module.exports = { AddEmployeePage };