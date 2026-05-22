import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EventTabView } from '@/types/user';

import getFileNameFromReportAdminSelection from './getFileNameFromAdminReportSelection';
import getFileNameFromDashboardReportSelection from './getFileNameFromDashboardReportSelection';
import getFileNameFromEvent from './getFileNameFromEvent';
import { getCsvFileNameFromReportSelection } from './getFileNameFromReportSelection';
import getSelectedAdminEventDateRange from './getSelectedAdminEventDateRange';

describe('file name and date utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-23T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('builds report filenames from admin and dashboard selections', () => {
    const hash = Math.floor(new Date('2026-04-23T12:00:00Z').getTime() / 1000);

    expect(
      getFileNameFromReportAdminSelection('activity', {
        end: 200,
        reloadData: false,
        start: 100,
      }),
    ).toBe(`activity_100_200_${hash}.csv`);

    expect(
      getFileNameFromDashboardReportSelection('dashboard', {
        end: 400,
        reloadOrders: false,
        start: 300,
      }),
    ).toBe(`dashboard_300_400_${hash}.csv`);
  });

  it('builds event and user report filenames', () => {
    const hash = Math.floor(new Date('2026-04-23T12:00:00Z').getTime() / 1000);

    expect(
      getFileNameFromEvent(
        {
          eventDate: '2026-05-01T00:00:00Z',
          externalEventId: 1,
          isActive: true,
          isDeleted: false,
          isExternal: false,
          title: 'VIP / Event!',
        },
        'orders',
      ),
    ).toBe(`VIP_Event__orders_${hash}.csv`);

    expect(
      getCsvFileNameFromReportSelection(
        {
          seller: {
            sellerId: 7,
            sellerName: 'National Acts',
          },
          end: 20,
          start: 10,
        },
        'summary',
      ),
    ).toBe(`National Acts_summary_10_20_${hash}.csv`);

    expect(
      getFileNameFromEvent({
        eventDate: '2026-05-01T00:00:00Z',
        externalEventId: 1,
        isActive: true,
        isDeleted: false,
        isExternal: false,
        title: 'VIP / Event!',
      }),
    ).toBe(`VIP_Event__${hash}.csv`);

    expect(
      getCsvFileNameFromReportSelection({
        seller: {
          sellerId: 7,
          sellerName: 'National Acts',
        },
        end: 20,
        start: 10,
      }),
    ).toBe(`National Acts_10_20_${hash}.csv`);
  });

  it('returns empty filenames when required selection data is missing', () => {
    expect(getFileNameFromReportAdminSelection('activity', undefined)).toBe('');
    expect(getFileNameFromDashboardReportSelection('dashboard', undefined)).toBe('');
    expect(getCsvFileNameFromReportSelection(undefined)).toBe('');
    expect(
      getCsvFileNameFromReportSelection({
        seller: {
          sellerId: 0,
          sellerName: 'Nobody',
        },
      }),
    ).toBe('');
  });

  it('computes date ranges for week, month, and agenda views', () => {
    const selectedUnixDate = 1715731200;

    const weekRange = getSelectedAdminEventDateRange(selectedUnixDate, EventTabView.Week);
    expect(weekRange.start).toBe(weekRange.periodStart);
    expect(weekRange.start).toBeLessThanOrEqual(selectedUnixDate);
    expect(weekRange.end).toBeGreaterThan(selectedUnixDate);

    const monthRange = getSelectedAdminEventDateRange(selectedUnixDate, EventTabView.Month);
    expect(monthRange.periodStart).toBeLessThanOrEqual(selectedUnixDate);
    expect(monthRange.start).toBeLessThanOrEqual(monthRange.periodStart ?? 0);
    expect(monthRange.end).toBeGreaterThan(selectedUnixDate);

    const agendaRange = getSelectedAdminEventDateRange(selectedUnixDate, EventTabView.Agenda);
    expect(agendaRange.start).toBe(agendaRange.periodStart);
    expect(agendaRange.end).toBeGreaterThan(agendaRange.start);
  });
});
