import {
  useActionContext,
  useAPIClient,
  useCollectionManager_deprecated,
  useDataSourceManager,
  useResourceActionContext,
} from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import lodash from 'lodash';
import { useParams } from 'react-router-dom';

import { useTranslation } from '../../../locale';
import { filterObjectWithMethodAndPath } from '../utils/filterObjectWithMethodAndPath';
import { getRequestActions } from '../utils/getRequestActions';

export function useActionCreateCollection() {
  const form = useForm();
  const { refreshCM: refreshCM } = useCollectionManager_deprecated();
  const ctx = useActionContext();
  const { refresh: refresh } = useResourceActionContext();

  const apiClient = useAPIClient();
  const { name: name } = useParams();
  const targetCollectionRepo = apiClient.resource('dataSources.collections', name);
  const field = useField();
  const dm = useDataSourceManager();

  useTranslation();

  return {
    async run() {
      field.data = field.data || {};
      field.data.loading = true;

      try {
        await form.submit();
        const cloneFormValues = lodash.cloneDeep(form.values);
        const requestActionsForm = filterObjectWithMethodAndPath(cloneFormValues?.actions);
        const requestActionsRestMethod = getRequestActions(Object.keys(requestActionsForm));

        const pickedFormValues = lodash.pick(cloneFormValues, ['fields', 'name', 'title', 'filterTargetKey']);

        const targetMethod = requestActionsRestMethod[0];

        if (targetMethod) {
          form.query(`*.actions.${targetMethod}`).take((field) => {
            field.setComponentProps({
              style: { border: '1px solid #ff4d4f' },
            });
          });

          await form[targetMethod].submit();
        } else {
          await targetCollectionRepo.create({
            values: {
              logging: true,
              ...pickedFormValues,
              actions: requestActionsForm,
            },
          });

          ctx.setVisible(false);
          await form.reset();

          field.data.loading = false;
          refresh();
          await refreshCM();
          dm.getDataSource(name).reload();
        }
      } catch (error) {
        console.error(error);

        field.data.loading = false;
      }
    },
  };
}
