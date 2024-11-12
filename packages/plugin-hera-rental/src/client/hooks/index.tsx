import { useEffect } from 'react';
import { useRequest } from '@tachybase/client';

import { stringify } from 'flatted';

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

export const useProductFeeItems = (planId) => {
  const feeParams = {
    resource: 'contract_plan_fee_items',
    action: 'list',
    params: {
      appends: ['fee_product'],
      filter: {
        contract_plan_id: planId,
      },
      pageSize: 99999,
    },
  };

  const { data, loading, run } = useCachedRequest<any>(feeParams, {
    manual: true,
  });
  useEffect(() => {
    if (planId) {
      run();
    }
  }, [planId]);
  return { data, loading };
};

export const useFeeItems = (categoryId, planId) => {
  const { data, loading, run } = useCachedRequest<any>(
    {
      resource: 'contract_plan_lease_items',
      action: 'list',
      params: {
        appends: ['fee_items', 'products'],
        filter: {
          $and: [
            {
              contract_plan_id: planId,
            },
            {
              products: {
                category_id: categoryId ?? -1,
              },
            },
          ],
        },
        pageSize: 99999,
      },
    },
    {
      manual: true,
    },
  );

  useEffect(() => {
    if (planId && categoryId) {
      run();
    }
  }, [planId, categoryId]);
  return { data, loading };
};
