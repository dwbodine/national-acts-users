import { ActivePageKey } from '@/constants';
import AdminPage from '../../../components/common/adminPageComponent';
import AdminEventEdit from '../../../components/admin/events/adminEventEditComponent';
import { useEffect, useState } from 'react';

export default function AdminEventsEdit() {
  const title = 'Client Portal - Edit Event';
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
      AdminComponent={<AdminEventEdit Id={id} />}
    />
  );
}
