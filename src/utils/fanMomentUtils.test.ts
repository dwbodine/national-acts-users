import { describe, expect, it } from 'vitest';

import type { VipEvent } from '@/types/event';
import type { FanMoment } from '@/types/public';

import { filterEventsWithoutFanMomentFolders, getFanMomentEventIds } from './fanMomentUtils';

describe('fanMomentUtils', () => {
  it('collects valid fan moment event ids', () => {
    const fanMoments: FanMoment[] = [
      { images: [], key: { eventId: 10, momentDate: '2026-06-01' } },
      { images: [], key: { momentDate: '2026-06-02' } },
      { images: [], key: { eventId: Number.NaN, momentDate: '2026-06-03' } },
      { images: [], key: { eventId: 11, momentDate: '2026-06-04' } },
    ];

    expect(getFanMomentEventIds(fanMoments)).toEqual(new Set([10, 11]));
  });

  it('filters events that already have fan moment folders', () => {
    const events = [
      { eventId: 10, eventDate: '2026-06-01', title: 'Existing Gallery' },
      { eventId: 12, eventDate: '2026-06-02', title: 'Available Gallery' },
      { eventId: 11, eventDate: '2026-06-03', title: 'Another Existing Gallery' },
    ] as VipEvent[];

    const fanMoments: FanMoment[] = [
      { images: ['one.jpg'], key: { eventId: 10, momentDate: '2026-06-01' } },
      { images: ['two.jpg'], key: { eventId: 11, momentDate: '2026-06-03' } },
    ];

    expect(filterEventsWithoutFanMomentFolders(events, fanMoments)).toEqual([
      { eventId: 12, eventDate: '2026-06-02', title: 'Available Gallery' },
    ]);
  });

  it('handles empty inputs', () => {
    expect(filterEventsWithoutFanMomentFolders(undefined, undefined)).toEqual([]);
  });
});
