import { AxiosHeaders, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export function getAuthorizationHeader() {
  const authToken = Cookies.get("authToken") || '';

  let headers = new AxiosHeaders();
  headers.set('Authorization', `Bearer ${authToken}`);
  headers.set('Content-Type', 'application/json');

  return headers;
}