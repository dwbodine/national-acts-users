import { describe, expect, it } from 'vitest';

import { exportVipItineraryToCSV, exportVipItineraryToHtml } from './exportVipItinerary';

describe('exportVipItinerary', () => {
  const events = [
    {
      eventDate: '2026-05-01T12:00:00Z',
      externalEventId: 1,
      externalUrl: 'https://tickets.example.com',
      isActive: true,
      isAddedToBandsInTown: true,
      isDeleted: false,
      isExternal: false,
      ticketSocketUrl: 'https://vip.example.com',
      title: 'Show One',
      venue: {
        address1: '1 Main St',
        city: 'Denver',
        name: 'Red Rocks',
        postalCode: '80014',
        state: 'CO',
      },
    },
    {
      eventDate: '2026-05-02T12:00:00Z',
      externalEventId: 2,
      isActive: true,
      isAddedToBandsInTown: false,
      isDeleted: false,
      isExternal: false,
      title: 'Show Two',
      venue: {
        address1: '2 Main St',
        city: 'Austin',
        name: 'ACL',
        postalCode: '73301',
        state: 'TX',
      },
    },
    {
      eventDate: '2026-05-03T12:00:00Z',
      externalEventId: 3,
      isActive: true,
      isDeleted: true,
      isExternal: false,
      title: 'Deleted Show',
      venue: {
        address1: '3 Main St',
        city: 'Dallas',
        name: 'Venue',
        postalCode: '75001',
        state: 'TX',
      },
    },
  ] as never;

  it('exports itinerary HTML with seller home page and live/no-vip statuses', async () => {
    const html = await exportVipItineraryToHtml(
      events,
      'VIP Itinerary',
      'https://portal.example.com',
      false,
    );

    expect(html).toContain('VIP Itinerary');
    expect(html).toContain('https://portal.example.com');
    expect(html).toContain('Live');
    expect(html).toContain('NO VIP');
    expect(html).not.toContain('Deleted Show');
  });

  it('exports itinerary CSV and skips deleted events', async () => {
    const csv = await exportVipItineraryToCSV(events, false);

    expect(csv).toContain('"Date","Venue","City / State"');
    expect(csv).toContain('"05/01/2026","Red Rocks","Denver, CO"');
    expect(csv).toContain('"Live"');
    expect(csv).toContain('"NO VIP"');
    expect(csv).not.toContain('Deleted Show');
  });
});
