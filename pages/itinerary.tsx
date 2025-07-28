import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import CheckAuth from '../components/common/checkAuthComponent';
import VipItinerary from '../components/sales/itinerary/vipItineraryComponent';

export default function EventPage() {
  const [detailHidden, setDetailHidden] = useState(true);
  const [id, setId] = useState(0);
  const router = useRouter();
  const [notLoggedIn, setNotLoggedIn] = useState(true);

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
        router.push('/login/');
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
    <>
      <CheckAuth />
      <VipItinerary SellerId={id} />
    </>
  );
}
