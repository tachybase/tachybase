import { useRequest } from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

export const useGetCustomRequest = () => {
  const fieldSchema = useFieldSchema();
  const url = `customRequests:get/${fieldSchema['x-uid']}`;
  return useRequest<{ data: { options: any; title: string; roles: any[] } }>(
    {
      url,
      params: {
        appends: ['roles'],
      },
    },
    {
      manual: true,
      cacheKey: url,
    },
  );
};
