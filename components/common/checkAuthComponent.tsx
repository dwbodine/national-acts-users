import { authRoutes, protectedRoutes, publicRoutes } from '../../src/router/routes';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export default function CheckAuth() {
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (pathName) {
      const authTokenCookie = Cookies.get('authToken');

      if (protectedRoutes.includes(pathName) && !authTokenCookie) {
        Cookies.remove('authToken');
        if (pathName === '/') {
          router.push('/login/');
        } else {
          let returnPath = `${pathName}`;
          const searchParams = new URLSearchParams(window.location.search);
          if (searchParams && searchParams.size > 0) {
            returnPath += '?';
            const keys = Array.from(searchParams.keys());
            keys.forEach((key, index) => {
              if (index > 0) {
                returnPath += '&';
              }
              returnPath += `${key}=${searchParams.get(key)}`;
            });
          }
          router.push(`/login/?returnPath=${encodeURI(returnPath)}`);
        }

        Cookies.remove('authToken');
      } else if (authRoutes.includes(pathName) || publicRoutes.includes(pathName)) {
        router.push(pathName);
      }
    }
  }, [router, pathName]);

  return <></>;
}
