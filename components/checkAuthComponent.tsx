import Cookies from 'js-cookie';
import { authRoutes, protectedRoutes } from "../src/router/routes";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function CheckAuth() {
  const router = useRouter();
  const authTokenCookie = Cookies.get("authToken");

  useEffect(() => {    
    const pathName = router.asPath;

    if (protectedRoutes.includes(pathName) && !authTokenCookie) {
        Cookies.remove("authToken");
        router.push('/login');
        Cookies.remove("authToken");
    }

    if (authRoutes.includes(pathName) && authTokenCookie) {
        router.push('/');
    }
  }, [router, authTokenCookie]);  

  return (<></>);
}