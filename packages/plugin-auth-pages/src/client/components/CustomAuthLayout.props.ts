import { useAPIClient, useRequest, useSystemSettings } from '@tachybase/client';

export function useProps() {
  const { data: systemSetttingResponse } = useSystemSettings();
  const api = useAPIClient();
  const { data: authenticators = [], error } = useRequest(() =>
    api
      .resource('authenticators')
      .publicList()
      .then((res) => {
        return res?.data?.data || [];
      }),
  );

  const { data: systemSettingData } = systemSetttingResponse || {};
  const { title } = systemSettingData || {};

  return {
    title,
    authenticators,
    error,
  };
}
