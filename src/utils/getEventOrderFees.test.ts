import { describe, expect, it } from 'vitest';

import { Order } from '@/types/event';

import getEventOrderFees from './getEventOrderFees';

describe('getEventOrderFees', () => {
  it('totals each fee independently and formats decimal strings and zero', () => {
    const orders = [
      {
        stripeProcessingFee: 1.25,
        insurance: 0,
        radarFee: '0.07',
        partnerProcessingFee: 1,
        netServiceFees: 2,
      },
      {
        stripeProcessingFee: 2.5,
        insurance: 0,
        radarFee: '0.08',
        partnerProcessingFee: 2,
        netServiceFees: 3,
      },
    ] as Order[];
    expect(getEventOrderFees(orders).map((fee) => fee.display)).toEqual([
      '$3.00',
      '$3.75',
      '$0.00',
      '$0.15',
      '$5.00',
    ]);
  });

  it('does not present partial fee coverage as a complete total', () => {
    const orders = [
      { stripeProcessingFee: 1.25, insurance: 0, radarFee: '0.07', netServiceFees: 2 },
      { stripeProcessingFee: 2.5, insurance: 0, netServiceFees: 3 },
    ] as Order[];
    expect(getEventOrderFees(orders).map((fee) => fee.display)).toEqual([
      '',
      '$3.75',
      '$0.00',
      '',
      '$5.00',
    ]);
  });

  it.each([undefined, []])('leaves fees blank when order data is unavailable (%j)', (orders) => {
    expect(getEventOrderFees(orders).every((fee) => fee.display === '')).toBe(true);
  });
});
