'use client';

import { Icon } from '@rsuite/icons';
import {
  MdCalendarMonth,
  MdDashboard,
  MdEvent,
  MdMoneyOff,
  MdOutlineMoney,
  MdOutlineVerifiedUser,
  MdReport,
  MdSupervisedUserCircle,
  MdWebAsset,
} from 'react-icons/md';

export const userAppNavs = [
  {
    eventKey: 'sales',
    icon: <Icon as={MdOutlineMoney} />,
    title: 'Sales Overview',
    to: '/sellers',
  },
];

export const adminAppNavs = [
  {
    eventKey: 'dashboard',
    icon: <Icon as={MdDashboard} />,
    title: 'Dashboard',
    to: '/dashboard',
  },
  {
    eventKey: 'events',
    icon: <Icon as={MdCalendarMonth} />,
    title: 'Events',
    to: '/events',
  },
  {
    eventKey: 'sales',
    icon: <Icon as={MdMoneyOff} />,
    title: 'Sales Overview',
    to: '/sellers',
  },
  {
    children: [
      {
        eventKey: 'site-settings',
        title: 'Manage Site Settings',
        to: '/admin/settings',
      },
      {
        eventKey: 'site-sellers',
        title: 'Manage Sellers',
        to: '/admin/sellers',
      },
      {
        eventKey: 'site-pages',
        title: 'Manage Pages',
        to: '/admin/pages',
      },
      {
        eventKey: 'site-order',
        title: 'Manage Page Order',
        to: '/admin/pages/order',
      },
      {
        eventKey: 'site-faqs',
        title: 'Manage FAQs',
        to: '/admin/faqs',
      },
      {
        eventKey: 'site-featured-artists',
        title: 'Manage Featured Artists',
        to: '/admin/featured-artists',
      },
    ],
    eventKey: 'site-admin',
    icon: <Icon as={MdWebAsset} />,
    title: 'Site Admin',
    to: '',
  },
  {
    children: [
      {
        eventKey: 'user-roles',
        title: 'Manage Roles',
        to: '/admin/roles',
      },
      {
        eventKey: 'user-users',
        title: 'Manage Users',
        to: '/admin/users',
      },
    ],
    eventKey: 'user-admin',
    icon: <Icon as={MdOutlineVerifiedUser} />,
    title: 'User Admin',
    to: '',
  },
  {
    children: [
      {
        eventKey: 'event-refresh',
        title: 'Refresh Data',
        to: '/admin/refresh-data',
      },
      {
        eventKey: 'event-events',
        title: 'Manage Events',
        to: '/admin/events',
      },
      {
        eventKey: 'event-orders',
        title: 'Manage Orders',
        to: '/admin/events/orders/search',
      },
      {
        eventKey: 'event-tour',
        title: 'Manage Tours',
        to: '/admin/tour',
      },
      {
        eventKey: 'event-venues',
        title: 'Manage Venues',
        to: '/admin/venues',
      },
    ],
    eventKey: 'event-admin',
    icon: <Icon as={MdEvent} />,
    title: 'Event/Order Admin',
    to: '',
  },
  {
    children: [
      {
        eventKey: 'report-customer-export',
        title: 'Export Customer Data',
        to: '/reports/customer-export',
      },
      {
        eventKey: 'report-missing-venues',
        title: 'Missing Venue Report',
        to: '/reports/missing-venues',
      },
    ],
    eventKey: 'reports',
    icon: <Icon as={MdReport} />,
    title: 'Reports',
    to: '/reports',
  },
  {
    eventKey: 'users',
    icon: <Icon as={MdSupervisedUserCircle} />,
    title: 'Users',
    to: '/users',
  },
];
