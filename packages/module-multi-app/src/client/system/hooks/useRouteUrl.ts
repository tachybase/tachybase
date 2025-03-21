import { useApp } from '@tachybase/client';

export function useRouteUrl({ name, cname }) {
  const app = useApp();
  if (cname) {
    return `//${cname}`;
  }
  return app.getRouteUrl(`/apps/${name}/admin/`);
}
