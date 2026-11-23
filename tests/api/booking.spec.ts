import { test, expect } from '@playwright/test';
import { BookingClient, newBooking } from '../../src/api/BookingClient';

test.describe('Booking API', () => {
  let api: BookingClient;
  test.beforeEach(({ request }) => {
    api = new BookingClient(request);
  });

  test('health check responds @smoke', async ({ request }) => {
    const res = await request.get('/ping');
    expect(res.status()).toBe(201);
  });

  test('creates and reads back a booking', async () => {
    const booking = newBooking();
    const created = await api.create(booking);
    expect(created.status()).toBe(200);
    const { bookingid, booking: echoed } = await created.json();
    expect(bookingid).toEqual(expect.any(Number));
    expect(echoed).toMatchObject(booking);

    const fetched = await api.get(bookingid);
    expect(fetched.ok()).toBeTruthy();
    expect(await fetched.json()).toMatchObject(booking);
  });

  test('full CRUD lifecycle with auth', async () => {
    const token = await api.token();
    const { bookingid } = await (await api.create(newBooking())).json();

    const updated = newBooking({ totalprice: 999, additionalneeds: 'Late checkout' });
    const put = await api.update(bookingid, updated, token);
    expect(put.status()).toBe(200);
    expect(await put.json()).toMatchObject(updated);

    const patch = await api.patch(bookingid, { firstname: 'Grace' }, token);
    expect((await patch.json()).firstname).toBe('Grace');

    const del = await api.delete(bookingid, token);
    expect(del.status()).toBe(201); // Restful Booker returns 201 Created on delete
    expect((await api.get(bookingid)).status()).toBe(404);
  });

  test('rejects update without a token', async () => {
    const { bookingid } = await (await api.create(newBooking())).json();
    const res = await api.update(bookingid, newBooking(), 'not-a-real-token');
    expect(res.status()).toBe(403);
  });

  test('rejects bad credentials', async ({ request }) => {
    const res = await request.post('/auth', { data: { username: 'admin', password: 'wrong' } });
    expect(await res.json()).toEqual({ reason: 'Bad credentials' });
  });
});
