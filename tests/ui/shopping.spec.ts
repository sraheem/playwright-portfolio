import { test, expect } from '../../src/fixtures';
import { shopper } from '../../src/data/users';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

test.describe('Shopping', () => {
  test('cart badge tracks add and remove', async ({ loggedIn }) => {
    await loggedIn.addToCart(BACKPACK);
    await loggedIn.addToCart(BIKE_LIGHT);
    await expect(loggedIn.cartBadge).toHaveText('2');
    await loggedIn.removeFromCart(BACKPACK);
    await expect(loggedIn.cartBadge).toHaveText('1');
  });

  test('sorts by price low to high and high to low', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');
    const asc = await loggedIn.prices();
    expect(asc).toEqual([...asc].sort((a, b) => a - b));

    await loggedIn.sortBy('hilo');
    const desc = await loggedIn.prices();
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  test('completes checkout end to end @smoke', async ({ loggedIn, cartPage, checkoutPage, page }) => {
    await loggedIn.addToCart(BACKPACK);
    await loggedIn.addToCart(BIKE_LIGHT);
    await loggedIn.openCart();
    await expect(cartPage.items).toHaveCount(2);

    await cartPage.checkout();
    await checkoutPage.fillInfo(shopper);
    // Backpack $29.99 + Bike Light $9.99
    await expect(checkoutPage.subtotal).toHaveText('Item total: $39.98');

    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(page).toHaveURL(/checkout-complete/);
  });

  test('checkout requires a postal code', async ({ loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.addToCart(BACKPACK);
    await loggedIn.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo({ ...shopper, postalCode: '' });
    await expect(checkoutPage.error).toContainText('Postal Code is required');
  });
});
