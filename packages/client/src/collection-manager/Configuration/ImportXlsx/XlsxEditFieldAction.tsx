import {
  useActionContext,
  useAPIClient,
  useCollectionManager_deprecated,
  useResourceActionContext,
} from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { cloneDeep } from 'lodash';

export const xlsxImportAction = () => {
  const form = useForm();
  const ctx = useActionContext();
  const field = useField();
  const api = useAPIClient();
  const { refresh } = useResourceActionContext();
  const { refreshCM } = useCollectionManager_deprecated();

  return {
    async onClick() {
      field.data = field.data || {};
      field.data.loading = true;
      try {
        await form.submit();
        const values = cloneDeep(form.values);
        const { collectionData, ...collections } = values;
        if (!collections.autoCreateReverseField) {
          delete collections.reverseField;
        }
        delete collections.autoCreateReverseField;
        await api.resource('collections').create({
          values: {
            logging: true,
            ...collections,
          },
        });
        api.resource(`${collections.name}`).create({
          values: collectionData,
        });
        ctx.setVisible(false);
        refresh?.();
        await refreshCM();
        field.data.loading = false;
      } catch (error) {
        field.data.loading = false;
      }
    },
  };
};
