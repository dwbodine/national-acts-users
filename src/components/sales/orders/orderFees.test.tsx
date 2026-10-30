import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Order } from '@/types/event';

import OrderMobileRow from './orderMobileRowComponent';
import OrderRow from './orderRowComponent';

const order = {
  purchaserFirstName: 'Test',
  purchaserLastName: 'Buyer',
  isActive: true,
  stripeProcessingFee: 3.45,
  insurance: 1.23,
  radarFee: '0.07',
  netServiceFees: 2.34,
  serviceFeesUsd: 10,
} as Order;

describe.each([
  ['desktop', OrderRow],
  ['mobile', OrderMobileRow],
] as const)('%s order fees', (_, Component) => {
  it('shows fees for admins when service fees are visible', () => {
    render(
      <table>
        <tbody>
          <Component Order={order} IsAdmin HideRevenue HideServiceFees={false} />
        </tbody>
      </table>,
    );
    for (const amount of ['$3.45', '$1.23', '$0.07', '$2.34']) {
      expect(screen.getByText(amount)).toBeVisible();
    }
  });

  it.each([{}, { IsAdmin: true, ShowOnlyEmails: true }, { IsAdmin: true, ShowOnlyPhones: true }])(
    'omits fee data outside the admin detail view (%j)',
    (props) => {
      render(
        <table>
          <tbody>
            <Component Order={order} {...props} />
          </tbody>
        </table>,
      );
      expect(screen.queryByText('$3.45')).not.toBeInTheDocument();
    },
  );

  it('distinguishes zero from missing fees', () => {
    render(
      <table>
        <tbody>
          <Component
            Order={{ ...order, radarFee: undefined, insurance: 0 }}
            IsAdmin
            HideRevenue
            HideServiceFees={false}
          />
        </tbody>
      </table>,
    );
    expect(screen.queryByText('Unknown')).not.toBeInTheDocument();
    expect(
      screen.getAllByText('$0.00').filter((element) => !element.closest('[hidden]')),
    ).toHaveLength(1);
  });
});
