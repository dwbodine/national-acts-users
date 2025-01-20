import { useEffect } from 'react';
import router from 'next/router';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';

export default function AdminList() {
  const dispatch = useDispatch();
  const { getUser } = useCurrentUser();
  const user = getUser();
  const isDennis = (user?.isAdmin ?? false) && (user?.username == 'dwbodine@gmail.com');

  const goToAdminPage = (adminAction: string) => {
    switch (adminAction) {
      case 'manage-roles':
        router.push('/admin/roles/');
        break;
      case 'manage-users':
        router.push('/admin/users/');
        break;
      case 'manage-refresh-data':
        router.push('/admin/refresh-data/');
        break;
      case 'manage-events':
        router.push('/admin/events/');
        break;
      case 'view-log':
        router.push('/admin/log/');
        break;
      case 'manage-tours':
        router.push('/admin/tour');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(setIsLoading(false));
  }, [dispatch]);

  return (
    <div className="admin-container">
      <ul>
        <li hidden={!isDennis}>
          <a className="admin-link" onClick={() => goToAdminPage('view-log')}>
            View Logs
          </a>
        </li>
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
        <li>
          <a className="admin-link" onClick={() => goToAdminPage('manage-refresh-data')}>
            Refresh Data From TicketSocket
          </a>
        </li>
        <li>
          <a className="admin-link" onClick={() => goToAdminPage('manage-events')}>
            Manage Events/Orders
          </a>
        </li>
        <li>
          <a className="admin-link" onClick={() => goToAdminPage('manage-tours')}>
            Manage Tours
          </a>
        </li>
      </ul>
    </div>
  );
}
