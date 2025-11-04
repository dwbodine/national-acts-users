'use client';

import { FaCheck, FaX } from 'react-icons/fa6';
import { setFocusControl, setReloadEvents } from '@/lib/reportSelectionSlice';
import { AttendeeRowProps } from '@/types/props';
import { ModifyTicketResponse } from '@/types/responses';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useSetTicketsCheckedIn } from '@/hooks/order/useSetTicketsCheckedIn';

export default function AttendeeRow(props: AttendeeRowProps) {
  const canCheckInTickets = props.CanCheckInTickets;
  const ticket = props.Ticket;
  const router = useRouter();
  const ticketId = ticket?.ticketSocketOrderTicketId ?? 0;
  const dispatch = useDispatch();
  let attendeeName = `${ticket?.attendeeFirstName} ${ticket?.attendeeLastName}`;
  const currentCheckIn = ticket?.isCheckedIn;
  const checkedInDate =
    currentCheckIn && ticket ? moment(ticket.checkedInDate).format('MM/DD/YYYY') : '';
  const checkedInTime =
    currentCheckIn && ticket ? moment(ticket.checkedInDate).format('h:mm a') : '';
  if (currentCheckIn) {
    attendeeName += ` (${checkedInTime})`;
  }
  const id = `ticket_${ticket?.ticketSocketOrderTicketId}`;
  const className = canCheckInTickets
    ? currentCheckIn
      ? 'attendee-check-highlight'
      : 'attendee-check'
    : currentCheckIn
      ? 'attendee-highlight'
      : 'attendee';
  const { setTicketsCheckedIn } = useSetTicketsCheckedIn();
  let titleText: string = '';

  const checkIn = (checkedIn: boolean) => {
    setTicketsCheckedIn([ticketId], checkedIn).then((response: ModifyTicketResponse) => {
      if (response.success) {
        dispatch(setFocusControl(id));
        dispatch(setReloadEvents(true));
      } else if (response.statusCode === 401 || response.statusCode === 422) {
        router.push('/logout');
      }
    });
  };

  const handleClick = () => {
    if (canCheckInTickets) {
      checkIn(!ticket?.isCheckedIn);
    }
  };

  if (canCheckInTickets) {
    titleText = currentCheckIn
      ? `Checked in at ${checkedInTime} on ${checkedInDate}`
      : `Check in ${attendeeName}`;
  }

  let checkOutClass = 'check-out-hide';
  let checkInClass = 'check-in-hide';

  if (canCheckInTickets) {
    checkOutClass = currentCheckIn ? 'check-out-show' : 'check-out-hide';
    checkInClass = currentCheckIn ? 'check-in-hide' : 'check-in-show';
  }

  checkInClass += ' no-print';
  checkOutClass += ' no-print';

  return (
    <>
      <div
        onClick={handleClick}
        className={className}
        title={titleText}
        id={id}
        tabIndex={0}
      >
        <FaCheck className={checkOutClass} />
        <FaX className={checkInClass} />
        <span>{attendeeName}</span>
      </div>
    </>
  );
}
