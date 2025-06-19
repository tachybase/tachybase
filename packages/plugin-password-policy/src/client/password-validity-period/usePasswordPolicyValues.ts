import { useAPIClient, useRequest } from '@tachybase/client';
import { createForm } from '@tachybase/schema';

import { COLLECTION_PASSWORD_POLICY } from '../../constants';

export const usePasswordPolicyValues = () => {
  const api = useAPIClient();
  const { data } = useRequest(() =>
    api
      .resource(COLLECTION_PASSWORD_POLICY)
      .get()
      .then((res) => res.data?.data),
  );
  const form = createForm({
    values: data,
  });
  return { form };
};
