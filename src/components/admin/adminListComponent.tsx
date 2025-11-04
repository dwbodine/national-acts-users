'use client';

import { Col, Row } from 'rsuite';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { getUser } = useCurrentUser();
  const user = getUser();
  const isDennis = (user?.isAdmin ?? false) && user?.username === 'dwbodine@gmail.com';

  const goToAdminPage = (adminAction: string) => {
    switch (adminAction) {
      case 'manage-roles':
        router.push('/admin/roles');
        break;
      case 'manage-users':
        router.push('/admin/users');
        break;
      case 'manage-refresh-data':
        router.push('/admin/refresh-data');
        break;
      case 'manage-events':
        router.push('/admin/events');
        break;
      case 'manage-orders':
        router.push('/admin/events/orders/search');
        break;
      case 'view-log':
        router.push('/admin/log');
        break;
      case 'manage-tours':
        router.push('/admin/tour');
        break;
      case 'manage-site-settings':
        router.push('/admin/settings');
        break;
      case 'manage-venues':
        router.push('/admin/venues');
        break;
      case 'manage-global-seller-settings':
        router.push('/admin/sellers');
        break;
      case 'manage-pages':
        router.push('/admin/page-manager');
        break;
      case 'manage-order':
        router.push('/admin/page-manager/order');
        break;
      case 'manage-faqs':
        router.push('/admin/faqs');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(setIsLoading(false));
  }, [dispatch]);

  return (
    <Row className="admin-container">
      <Col>
        <Row hidden={!isDennis}>
          <Col>
            <h5>DevOps Only</h5>
            <ul>
              <li>
                <a className="admin-link" onClick={() => goToAdminPage('view-log')}>
                  View Logs
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>Site Admin</h5>
            <ul>
              <li>
                <a
                  className="admin-link"
                  onClick={() => goToAdminPage('manage-site-settings')}
                >
                  Manage Site Settings
                </a>
              </li>
              <li>
                <a
                  className="admin-link"
                  onClick={() => goToAdminPage('manage-global-seller-settings')}
                >
                  Manage Sellers
                </a>
              </li>
              <li>
                <a className="admin-link" onClick={() => goToAdminPage('manage-pages')}>
                  Manage Pages
                </a>
              </li>
              <li>
                <a className="admin-link" onClick={() => goToAdminPage('manage-order')}>
                  Manage Page Order
                </a>
              </li>
              <li>
                <a className="admin-link" onClick={() => goToAdminPage('manage-faqs')}>
                  Manage FAQs
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>User Admin</h5>
            <ul>
              <li>
                <a className="admin-link" onClick={() => goToAdminPage('manage-roles')}>
                  Manage Roles
                </a>
              </li>
              <li>
                <a className="admin-link" onClick={() => goToAdminPage('manage-users')}>
                  Manage Users
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>Event/Order Admin</h5>
            <ul>
              <li>
                <a
                  className="admin-link"
                  onClick={() => goToAdminPage('manage-refresh-data')}
                >
                  Refresh Data from TicketSocket
                </a>
              </li>
              <li>
                <a className="admin-link" onClick={() => goToAdminPage('manage-events')}>
                  Manage Events
                </a>
              </li>
              <li>
                <a className="admin-link" onClick={() => goToAdminPage('manage-orders')}>
                  Manage Orders
                </a>
              </li>
              <li>
                <a className="admin-link" onClick={() => goToAdminPage('manage-tours')}>
                  Manage Tours
                </a>
              </li>
              <li>
                <a className="admin-link" onClick={() => goToAdminPage('manage-venues')}>
                  Manage Venues
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
