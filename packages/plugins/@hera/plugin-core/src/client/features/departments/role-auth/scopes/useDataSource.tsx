import { useRequest } from '@tachybase/client';

export const useDataSource = (props) => {
  const params = {
    resource: 'departments',
    action: 'list',
    params: {
      appends: ['roles', 'parent(recursively=true)'],
      sort: ['createdAt'],
    },
  };
  const service = useRequest(params, props);
  return { ...service, defaultRequest: params };
};
