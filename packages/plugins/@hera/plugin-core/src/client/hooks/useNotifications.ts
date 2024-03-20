import { useRequest } from '@nocobase/client';
export const useLinkKey = () => {
  const { data } = useRequest<{
    data: any;
  }>({
    resource: 'link-manage',
    action: 'get',
    params: {
      name: 'Notifications',
    },
  });
  return data?.data[0];
};
export const useInitializationLinkKey = () => {
  useRequest<{
    data: any;
  }>({
    resource: 'link-manage',
    action: 'init',
    params: {
      name: 'Notifications',
    },
  });
};
