'use client';

import CurrentEvents from './events/currentEventsComponent';
import SalesBar from './events/salesBarComponent';

export default function AdminSellersComponent() {
  return (
    <>
      <SalesBar />
      <CurrentEvents />
    </>
  );
}
