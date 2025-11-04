'use client';

import { MdDashboard, MdFingerprint, MdModeEditOutline } from 'react-icons/md';
import { VscCalendar, VscTable } from 'react-icons/vsc';
import CubesIcon from '@rsuite/icons/legacy/Cubes';
import { Icon } from '@rsuite/icons';

export const appNavs = [
  {
    eventKey: 'dashboard',
    icon: <Icon as={MdDashboard} />,
    title: 'Dashboard',
    to: '/dashboard',
  },
  {
    eventKey: 'calendar',
    icon: <Icon as={VscCalendar} />,
    title: 'Calendar',
    to: '/calendar',
  },
  {
    children: [
      {
        eventKey: 'members',
        title: 'Members',
        to: '/table-members',
      },
      {
        eventKey: 'virtualized',
        title: 'Virtualized Table',
        to: '/table-virtualized',
      },
    ],
    eventKey: 'tables',
    icon: <Icon as={VscTable} />,
    title: 'Tables',
    to: '/table-members',
  },
  {
    children: [
      {
        eventKey: 'form-basic',
        title: 'Basic',
        to: '/form-basic',
      },
      {
        eventKey: 'form-wizard',
        title: 'Wizard',
        to: '/form-wizard',
      },
    ],
    eventKey: 'forms',
    icon: <Icon as={MdModeEditOutline} />,
    title: 'Forms',
    to: '/form-basic',
  },
  {
    children: [
      {
        eventKey: 'sign-in',
        title: 'Sign In',
        to: '/sign-in',
      },

      {
        eventKey: 'sign-up',
        title: 'Sign Up',
        to: '/sign-up',
      },
      {
        eventKey: 'error403',
        title: 'Error 403',
        to: '/error-403',
      },
      {
        eventKey: 'error404',
        title: 'Error 404',
        to: '/error-404',
      },
      {
        eventKey: 'error500',
        title: 'Error 500',
        to: '/error-500',
      },
      {
        eventKey: 'error503',
        title: 'Error 503',
        to: '/error-503',
      },
    ],
    eventKey: 'authentication',
    icon: <Icon as={MdFingerprint} />,
    title: 'Authentication',
  },

  {
    eventKey: 'components',
    href: 'https://rsuitejs.com/components/overview/',
    icon: <CubesIcon />,
    target: '_blank',
    title: 'Components',
  },
];
