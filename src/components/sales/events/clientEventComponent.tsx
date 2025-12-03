'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import EventDetail from '../orders/eventDetailComponent';

export default function ClientEventComponent() {
  const [detailHidden, setDetailHidden] = useState(true);
  const [id, setId] = useState(0);
  const [notLoggedIn, setNotLoggedIn] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authTokenCookie = Cookies.get('authToken');
    const searchParams = new URLSearchParams(window.location.search);
    if (!authTokenCookie) {
      setNotLoggedIn(true);
      let idParam = searchParams.get('id');
      if (idParam) {
        idParam = `/event/?id=${idParam}`;
        router.push(`/login/?returnPath=${encodeURI(idParam)}`);
      } else {
        router.push('/login');
      }
    }

    setDetailHidden(true);

    if (searchParams) {
      const idRoute = searchParams.get('id');
      if (idRoute) {
        const idVal = parseInt(idRoute.toString());
        if (!isNaN(idVal)) {
          setNotLoggedIn(false);
          setId(idVal);
          setDetailHidden(false);
        }
      }
    }
  }, [detailHidden, setDetailHidden, id, setId, router]);

  return (
    <div hidden={notLoggedIn}>
      <EventDetail Id={id} />
    </div>
  );
}
