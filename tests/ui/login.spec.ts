import { test, expect } from '../../src/fixtures';
import { users } from '../../src/data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user lands on the inventory page @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard);
    await inventoryPage.expectLoaded();
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('locked-out user sees a clear error', async ({ loginPage, page }) => {
    await loginPage.login(users.lockedOut);
    await loginPage.expectError('Sorry, this user has been locked out.');
    await expect(page).not.toHaveURL(/inventory/);
  });

  const invalid = [
    { name: 'empty username', user: '', password: 'secret_sauce', error: 'Username is required' },
    { name: 'empty password', user: users.standard, password: '', error: 'Password is required' },
    { name: 'wrong password', user: users.standard, password: 'nope', error: 'do not match any user' },
  ];

  for (const c of invalid) {
    test(`rejects ${c.name}`, async ({ loginPage }) => {
      await loginPage.login(c.user, c.password);
      await loginPage.expectError(c.error);
    });
  }

  test('inventory is protected when not logged in', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await loginPage.expectError("You can only access '/inventory.html' when you are logged in.");
  });
});
