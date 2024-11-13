import { VipEvent } from '@/types/event';
import React from 'react';
import moment from 'moment';
import { useGetLocation } from '@/hooks/common/useGetLocation';

export default function EventRow(props: any) {
  const vipEvent = props.VipEvent as VipEvent;
  const hideRevItem = props.HideRevenue as boolean;
  const hideServiceFees = props.HideServiceFees as boolean;
  const { getLocation } = useGetLocation();
  const id = `event_${vipEvent.ticketSocketEventId}`;

  let statusClass = '';
  if (props.VipEvent.isDeleted) {
    statusClass += 'event-deleted';
  } else if (!props.VipEvent.isActive) {
    statusClass += 'event-inactive';
  } else if (props.VipEvent.isHidden) {
    statusClass += 'event-hidden';
  }

  const venueName = vipEvent.venue?.name;
  let location = '';
  if (vipEvent.venue) {
    location = getLocation(vipEvent.venue);
  }

  const eventDate = moment(vipEvent.eventDate).format('MM/DD/YYYY');
  const revenue = new Number(vipEvent.totalRevenue).toFixed(2);
  const serviceFees = new Number(vipEvent.totalServiceFees).toFixed(2);
  const url = `/event/?id=${vipEvent.ticketSocketEventId}`;

  return (
    <tr className={statusClass} id={id}>
      <td>{eventDate}</td>
      <td>
        <a href={url} target="_blank">
          {vipEvent.title}
        </a>
      </td>
      <td>{venueName}</td>
      <td>{location}</td>
      <td className="pull-right">{vipEvent.totalTickets}</td>
      <td className="pull-right" hidden={hideRevItem}>
        {revenue}
      </td>
      <td className="pull-right no-print" hidden={hideServiceFees}>
        {serviceFees}
      </td>
    </tr>
  );
}
