import { useEffect, useState } from 'react';
import { ActivePageKey } from '@/constants';
import AdminEventEdit from '../../../components/admin/events/adminEventEditComponent';
import AdminPage from '../../../components/common/adminPageComponent';

export default function AdminEventsEdit() {
  const title = 'Client Portal - Edit Event';
  const [id, setId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams) {
      const idRoute = searchParams.get('id');
      if (idRoute) {
        const idVal = parseInt(idRoute);
        if (!isNaN(idVal)) {
          setId(idVal);
        }
      }
    }
  }, []);

  return (
    <AdminPage
      Title={title}
      ActiveKey={ActivePageKey.Admin}
      AdminComponent={<AdminEventEdit Id={id} />}
    />
  );
}
