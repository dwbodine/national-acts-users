"use client";

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import EventDetail from '../orders/eventDetailComponent';
import NavBar from '../../common/navBarComponent';
import { redirect } from 'next/navigation';


export default function ClientEventComponent() {
  const [detailHidden, setDetailHidden] = useState(true);
  const [id, setId] = useState(0);
  const [notLoggedIn, setNotLoggedIn] = useState(true);

  useEffect(() => {
    const authTokenCookie = Cookies.get('authToken');
    const searchParams = new URLSearchParams(window.location.search);
    if (!authTokenCookie) {
      setNotLoggedIn(true);
      let idParam = searchParams.get('id');
      if (idParam) {
        idParam = `/event/?id=${idParam}`;
        redirect(`/login/?returnPath=${encodeURI(idParam)}`);
      } else {
        redirect('/login/');
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
  }, [detailHidden, setDetailHidden, id, setId]);

  return (
    <>
      <NavBar Hidden={notLoggedIn} />
      <EventDetail Id={id} />
    </>
  );
}
