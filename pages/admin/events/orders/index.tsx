import { ActivePageKey } from '@/constants';
import AdminPage from '../../../../components/common/adminPageComponent';
import AdminOrdersIndex from '../../../../components/admin/events/orders/adminOrderIndexComponent';
import { useEffect, useState } from 'react';

export default function AdminOrders() {
  const title = 'Client Portal - Admin Orders';
  const [id, setId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams) {
      const idRoute = searchParams.get('id');
      if (idRoute) {
        const idVal = parseInt(idRoute.toString());
        if (!isNaN(idVal)) {
          setId(idVal);
        }
      }
    }
  },[]);

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminOrdersIndex Id={id} />}
    />
  );
}
