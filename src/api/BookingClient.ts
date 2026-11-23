import { type APIRequestContext, expect } from '@playwright/test';

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
};

/** Thin typed client over the Restful Booker API. */
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  async token(): Promise<string> {
    const res = await this.request.post('/auth', {
      data: {
        username: process.env.BOOKER_USER ?? 'admin',
        password: process.env.BOOKER_PASSWORD ?? 'password123',
      },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.token, 'auth should return a token').toBeTruthy();
    return body.token;
  }

  create(booking: Booking) {
    return this.request.post('/booking', { data: booking });
  }

  get(id: number) {
    return this.request.get(`/booking/${id}`);
  }

  update(id: number, booking: Booking, token: string) {
    return this.request.put(`/booking/${id}`, { data: booking, headers: { Cookie: `token=${token}` } });
  }

  patch(id: number, partial: Partial<Booking>, token: string) {
    return this.request.patch(`/booking/${id}`, { data: partial, headers: { Cookie: `token=${token}` } });
  }

  delete(id: number, token?: string) {
    return this.request.delete(`/booking/${id}`, { headers: token ? { Cookie: `token=${token}` } : {} });
  }
}

export const newBooking = (overrides: Partial<Booking> = {}): Booking => ({
  firstname: 'Ada',
  lastname: `Lovelace-${Date.now()}`,
  totalprice: 250,
  depositpaid: true,
  bookingdates: { checkin: '2027-01-10', checkout: '2027-01-14' },
  additionalneeds: 'Breakfast',
  ...overrides,
});
