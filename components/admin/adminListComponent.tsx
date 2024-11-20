import { SyntheticEvent, useEffect } from 'react';
import router from 'next/router';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';

export default function AdminList() {
  const dispatch = useDispatch();
  const { getUser } = useCurrentUser();
  const user = getUser();
  const isDennis = (user?.isAdmin ?? false) && (user?.username == 'dwbodine@gmail.com');

  const goToAdminPage = (e: SyntheticEvent) => {
    e.preventDefault();
    const id = e.currentTarget.id;
    switch (id) {
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
          <a id="view-log" className="admin-link" onClick={goToAdminPage}>
            View Logs
          </a>
        </li>
        <li>
          <a id="manage-roles" className="admin-link" onClick={goToAdminPage}>
            Manage Roles
          </a>
        </li>
        <li>
          <a id="manage-users" className="admin-link" onClick={goToAdminPage}>
            Manage Users
          </a>
        </li>
        <li>
          <a id="manage-refresh-data" className="admin-link" onClick={goToAdminPage}>
            Refresh Data From TicketSocket
          </a>
        </li>
        <li>
          <a id="manage-events" className="admin-link" onClick={goToAdminPage}>
            Manage Events/Orders
          </a>
        </li>
      </ul>
    </div>
  );
}
