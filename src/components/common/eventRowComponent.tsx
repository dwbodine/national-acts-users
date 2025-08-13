"use client";

import { getEventStatusSlug, getEventStatusText } from '@/utils/eventUtils';
import { EventRowProps } from '@/types/props';
import React from 'react';
import moment from 'moment';
import { useGetLocation } from '@/hooks/common/useGetLocation';

export default function EventRow(props: EventRowProps) {
  const vipEvent = props.VipEvent;
  const hideRevItem = props.HideRevenue;
  const hideServiceFees = props.HideServiceFees;
  const showNotes = props.ShowNotes;
  const showNoteDialog = props.OnShowNoteDialog;
  const { getLocation } = useGetLocation();
  const id = `event_${vipEvent.externalEventId}`;

  const venueName = vipEvent.venue?.name;
  let location = '';
  if (vipEvent.venue) {
    location = getLocation(vipEvent.venue);
  }

  const eventDate = moment(vipEvent.eventDate).format('MM/DD/YYYY');
  const revenue = Number((vipEvent.totalRevenue ?? 0) - (vipEvent.revenueRefunded ?? 0)).toFixed(2);
  const serviceFees = Number((vipEvent.totalServiceFees ?? 0) - (vipEvent.serviceFeeRevenueRefunded ?? 0)).toFixed(2);
  const url = `/event/?id=${vipEvent.externalEventId}`;

  const statusSlug = getEventStatusSlug(vipEvent);
  const statusText = getEventStatusText(vipEvent);
  let statusClass = '';
  if (statusSlug !== 'active') {
    statusClass = `event-${statusSlug}`
  }

  return (
    <tr className={statusClass} id={id}>
      <td>{eventDate}</td>
      <td>
        {(vipEvent.orders?.length ?? 0) > 0 ?
          <a href={url} target="_blank">
            {vipEvent.title}
          </a>
        :
        vipEvent.title
        }
        
      </td>
      <td>{venueName}</td>
      <td>{location}</td>
      <td>{statusText}</td>
      <td className="pull-right">{vipEvent.totalTickets}</td>
      <td className="pull-right">{vipEvent.numTicketsRefunded ?? 0}</td>
      <td className="pull-right">{vipEvent.numTicketsComped ?? 0}</td>
      <td className="pull-right" hidden={hideRevItem}>
        {revenue}
      </td>
      <td className="pull-right no-print" hidden={hideServiceFees}>
        {serviceFees}
      </td>
      <td hidden={!showNotes}>
        <a onClick={() => showNoteDialog ? showNoteDialog(vipEvent.externalEventId) : null}>Notes</a>
      </td>
    </tr>
  );
}
