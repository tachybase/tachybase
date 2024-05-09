import { useAPIClient, useRequest } from '@tachybase/client';
import dayjs from 'dayjs';
import { stringify } from 'flatted';
import { useEffect, useState } from 'react';

export function useCachedRequest<P>(params: {}, options = {}) {
  const cacheKey = stringify(params);
  return useRequest<P>(params, { cacheKey, ...options });
}

export const useLeaseItems = (planId, date) => {
  const [data, setData] = useState({});
  const api = useAPIClient();
  const day = date || new Date();
  const nowDay = dayjs(day).startOf('day').add(-1, 'minute');
  if (typeof planId !== 'object') return { data };
  planId?.forEach((value) => {
    if (!value) return;
    if (!data[value]) {
      api
        .request({
          resource: 'contract_plan_lease_items',
          action: 'list',
          params: {
            appends: ['new_products'],
            filter: {
              effect_contracts: {
                start_date: { $dateBefore: nowDay },
                end_date: { $dateAfter: nowDay },
                contract_id: {
                  $eq: value,
                },
              },
            },
            pageSize: 99999,
          },
        })
        .then((res) => {
          const result = { ...data };
          result[value] = res.data?.data;
          setData(result);
        })
        .catch(() => {
          return;
        });
    }
  });
  return { data };
};

export const useFeeItems = (planId, date) => {
  const [data, setData] = useState({});
  const api = useAPIClient();
  const day = date || new Date();
  const nowDay = dayjs(day).startOf('day').add(-1, 'minute');
  if (typeof planId !== 'object') return { data };
  planId?.forEach((value) => {
    if (!value) return;
    if (!data[value]) {
      api
        .request({
          resource: 'contract_plan_fee_items',
          action: 'list',
          params: {
            appends: ['new_fee_products'],
            filter: {
              effect_contracts: {
                start_date: { $dateBefore: nowDay },
                end_date: { $dateAfter: nowDay },
                contract_id: {
                  $eq: value,
                },
              },
            },
            pageSize: 99999,
          },
        })
        .then((res) => {
          const result = { ...data };
          result[value] = res.data?.data;
          setData(result);
        })
        .catch(() => {
          return;
        });
    }
  });
  return { data };
};

export const useProductFeeItems = (planId, date) => {
  const [data, setData] = useState({});
  const api = useAPIClient();
  const day = date || new Date();
  const nowDay = dayjs(day).startOf('day').add(-1, 'minute');
  if (typeof planId !== 'object') return { data };
  planId?.forEach((value) => {
    if (!value) return;
    if (!data[value]) {
      api
        .request({
          resource: 'contract_plan_lease_items',
          action: 'list',
          params: {
            appends: ['fee_items', 'new_products'],
            filter: {
              effect_contracts: {
                start_date: { $dateBefore: nowDay },
                end_date: { $dateAfter: nowDay },
                contract_id: {
                  $eq: value,
                },
              },
            },
            pageSize: 99999,
          },
        })
        .then((res) => {
          const result = { ...data };
          result[value] = res.data?.data;
          setData(result);
        })
        .catch(() => {
          return;
        });
    }
  });
  return { data };
};

export const useProducts = () => {
  const { data } = useCachedRequest<any>({
    resource: 'products',
    action: 'list',
    params: {
      pageSize: 99999,
    },
  });
  if (data?.data) {
    data.data.forEach((value) => {
      value['parentScopeId'] = selParentId(data.data, value, []);
    });
  }
  return { data: data?.data };
};

export const useCompany = (appends, id) => {
  const { data, loading, run } = useCachedRequest<any>(
    {
      resource: 'contracts',
      action: 'list',
      params: {
        filter: { id: { $eq: id } },
        appends,
      },
    },
    { manual: true },
  );
  useEffect(() => {
    if (id) {
      run();
    }
  }, [id]);
  return { data, loading };
};

const selParentId = (products, item, scopeId) => {
  scopeId.push(item.id);
  if (!item.parentId) {
    return scopeId;
  }
  const items = products.find((value) => value.id === item.parentId);
  if (!items) {
    return scopeId;
  }
  return selParentId(products, items, scopeId);
};
