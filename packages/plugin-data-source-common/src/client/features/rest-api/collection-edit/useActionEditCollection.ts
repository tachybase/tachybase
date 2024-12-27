import {
  useActionContext,
  useAPIClient,
  useCollectionManager_deprecated,
  useDataSourceManager,
  useRecord,
  useResourceActionContext,
  useResourceContext,
} from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import lodash from 'lodash';
import { useParams } from 'react-router-dom';

import { filterObjectWithMethodAndPath } from '../utils/filterObjectWithMethodAndPath';
import { getRequestActions } from '../utils/getRequestActions';

export const useActionEditCollection = (e) => {
  const apiClient = useAPIClient();
  const dm = useDataSourceManager();
  const { refreshCM } = useCollectionManager_deprecated();
  const { refresh } = useResourceActionContext();
  const form = useForm();
  const ctx = useActionContext();
  const { targetKey } = useResourceContext();
  const { name } = useParams();

  const { [targetKey]: keyValue } = useRecord();
  const targetRepo = apiClient.resource('dataSources.collections', name);

  return {
    async run() {
      await form.submit();

      const cloneValue = lodash.cloneDeep(form.values);
      const actionValue = filterObjectWithMethodAndPath(cloneValue?.actions);
      const requestActionsRestMethod = getRequestActions(Object.keys(actionValue));

      const pickedFormValues = lodash.pick(form.values, ['fields', 'name', 'title', 'filterTargetKey', 'description']);

      const targetMethod = requestActionsRestMethod[0];

      if (targetMethod) {
        form.query(`*.actions.${targetMethod}`).take((formVal) => {
          formVal.setComponentProps({
            style: {
              border: '1px solid #ff4d4f',
            },
          });
        });

        await form[targetMethod].submit();
      } else {
        await targetRepo.update({
          filterByTk: keyValue,
          values: {
            ...pickedFormValues,
            actions: actionValue,
          },
        });
        ctx.setVisible(false);

        const dataSource = dm.getDataSource(name);

        if (!dataSource?.reload) {
          dataSource.reload.call(dataSource);
        }

        await form.reset();

        refresh();

        await refreshCM();
      }
    },
  };
};
