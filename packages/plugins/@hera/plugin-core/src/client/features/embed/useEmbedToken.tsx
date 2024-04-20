import { useAPIClient } from '@nocobase/client';

export function useEmbedToken() {
  const url = new URL(window.location.href);
  const api = useAPIClient();
  const token = url.searchParams.get('token');
  return token && api.auth.setToken(token), api.auth.getToken();
}
