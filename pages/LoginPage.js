class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator("input[name='username']");
        this.passwordInput = page.locator("input[name='password']");
        this.loginButton = page.locator("button[type='submit']");
        this.errorMessage = page.locator('p.oxd-alert-content-text');
        this.dashboardHeader = page.locator('h6.oxd-topbar-header-breadcrumb-module');
    }

    async goto() {
        await this.page.goto('/web/index.php/auth/login');
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}

module.exports = { LoginPage };