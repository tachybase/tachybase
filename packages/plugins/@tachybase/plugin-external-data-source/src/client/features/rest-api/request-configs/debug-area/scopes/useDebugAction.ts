import { useAPIClient } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import lodash from 'lodash';
import { useParams } from 'react-router-dom';

import { useContextRequestInfo } from '../../../contexts/RequestForm.context';
import { useContextResponseInfo } from '../../../contexts/ResponseInfo.context';

export const useDebugAction = () => {
  const field = useField();
  const apiClient = useAPIClient();
  const form = useForm();
  const { form: formValue, actionKey, requestActionForm } = useContextRequestInfo();

  const { name } = useParams();
  const { setRawResponse, setDebugResponse, setResponseValidationErrorMessage }: any = useContextResponseInfo();

  return {
    async run() {
      const actionValue = formValue?.values?.actions?.[actionKey];

      try {
        field.data = field?.data || {};
        field.data.loading = true;
        await requestActionForm.submit();

        const repo = apiClient.resource('dataSources.httpCollections', name);

        const debugVars = lodash.omit(form.values, 'responseTab');

        const {
          data: { data: responseData },
        } = await repo.runAction({
          values: {
            debug: true,
            inferFields: false,
            actionOptions: {
              ...actionValue,
              type: actionKey,
              responseTransformer: actionValue?.responseTransformer,
            },
            debugVars,
          },
        });

        field.data.loading = false;

        const { rawResponse, debugBody, responseValidationErrorMessage } = responseData;

        setRawResponse(rawResponse);
        setDebugResponse(debugBody);
        setResponseValidationErrorMessage(responseValidationErrorMessage);
      } catch (error) {
        field.data.loading = false;
        console.log(error);
      }
    },
  };
};
