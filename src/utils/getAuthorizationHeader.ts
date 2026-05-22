import { AxiosHeaders } from 'axios';
import Cookies from 'js-cookie';

export default function getAuthorizationHeader(token: string | undefined = undefined) {
  const authToken = token || Cookies.get('authToken') || '';

  const headers = new AxiosHeaders();
  headers.set('Authorization', `Bearer ${authToken}`);
  headers.set('Content-Type', 'application/json');

  return headers;
}
