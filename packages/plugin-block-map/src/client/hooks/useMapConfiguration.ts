import { useMemo } from 'react';
import { useRequest } from '@tachybase/client';

export const MapConfigurationResourceKey = 'map-configuration';
export const getSSKey = (type) => {
  return `TACHYBASE_PLUGIN_MAP_CONFIGURATION_${type}`;
};

export const useMapConfiguration = (type: string, caching = true) => {
  // cache
  const config = useMemo(() => {
    const d = sessionStorage.getItem(getSSKey(type));
    if (d) {
      return JSON.parse(d);
    }
    return d;
  }, [type]);

  const { data } = useRequest<{
    data: any;
  }>(
    {
      resource: MapConfigurationResourceKey,
      action: 'get',
      params: {
        isRaw: !caching,
        type,
      },
    },
    {
      onSuccess(data) {
        if (!caching) {
          return;
        }
        sessionStorage.setItem(getSSKey(type), JSON.stringify(data?.data));
      },
      refreshOnWindowFocus: false,
      refreshDeps: [],
      manual: config && caching ? true : false,
    },
  );

  if (config && caching) return config;

  return data?.data;
};
