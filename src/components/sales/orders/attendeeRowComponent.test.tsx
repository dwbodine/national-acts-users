import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Ticket } from '@/types/event';

const mocks = vi.hoisted(() => ({ dispatch: vi.fn(), checkIn: vi.fn(), push: vi.fn() }));

vi.mock('react-redux', () => ({ useDispatch: () => mocks.dispatch }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push }) }));
vi.mock('@/hooks/order/useSetTicketsCheckedIn', () => ({
  useSetTicketsCheckedIn: () => ({ setTicketsCheckedIn: mocks.checkIn }),
}));

import AttendeeRow from './attendeeRowComponent';

describe('attendee check-in', () => {
  beforeEach(() => {
    mocks.checkIn.mockResolvedValue({ success: true });
  });

  it.each([false, true])(
    'uses the partner ticket ID when checked-in state is %s',
    async (isCheckedIn) => {
      const ticket: Ticket = {
        originalTicketId: 9003,
        ticketPartnerOrderTicketId: 303,
        ticketPartnerOrderId: 202,
        ticketType: 'VIP',
        attendeeFirstName: 'Jane',
        attendeeLastName: 'Doe',
        isCheckedIn,
        checkedInDate: '2026-10-17',
      };
      render(<AttendeeRow Ticket={ticket} CanCheckInTickets />);
      fireEvent.click(screen.getByText('Doe, Jane'));

      await waitFor(() => expect(mocks.checkIn).toHaveBeenCalledWith([303], !isCheckedIn));
      await waitFor(() =>
        expect(mocks.dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: 'ticket_303',
          }),
        ),
      );
    },
  );
});
