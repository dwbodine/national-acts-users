'use client';

import { FaCalendar } from 'react-icons/fa';

import { ShowsListedWidgetProps } from '@/types/props';

export default function ShowsListedWidget(props: ShowsListedWidgetProps) {
  const totalShows = props.TotalShows ?? 0;

  return (
    <>
      <FaCalendar size="2em" />
      <div className="widget-text-title">Shows listed:</div>
      <span>{totalShows}</span>
    </>
  );
}
