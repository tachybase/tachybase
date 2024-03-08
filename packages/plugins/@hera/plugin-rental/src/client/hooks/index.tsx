import { useRequest } from '@nocobase/client';
import { stringify } from 'flatted';
import { useEffect } from 'react';

export function useCachedRequest<P>(params: {}, options = {}) {
  const cacheKey = stringify(params);
  return useRequest<P>(params, { cacheKey, ...options });
}

export const useLeaseItems = (planId) => {
  const params = {
    resource: 'contract_plan_lease_items',
    action: 'list',
    params: {
      appends: ['products'],
      filter: {
        contract_plan_id: planId,
      },
      pageSize: 99999,
    },
  };
  const { data, loading, run } = useCachedRequest<any>(params, {
    manual: true,
  });
  useEffect(() => {
    if (planId) {
      run();
    }
  }, [planId]);
  return { data, loading };
};
