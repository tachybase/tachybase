import React, { useContext, useState } from 'react';
import { ActionContext, useAPIClient } from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { Button } from 'antd';
import lodash from 'lodash';
import { useParams } from 'react-router-dom';

import { useTranslation } from '../../../../../locale';
import { TooltipContainer } from './TooltipContainer';
import { useContextRequestInfo } from '../../../contexts/RequestForm.context';
import { useContextResponseInfo } from '../../../contexts/ResponseInfo.context';

export const ExtractFieldMetadata = () => {
  const form = useForm();
  const apiClient = useAPIClient();
  const { t } = useTranslation();

  const { setVisible } = useContext(ActionContext);
  const { name } = useParams();
  const { rawResponse, responseValidationErrorMessage } = useContextResponseInfo();
  const { form: formValue, actionKey } = useContextRequestInfo();
  const { fields } = formValue.values;

  const [loading, setLoading] = useState(false);

  const debugVars = lodash.omit(form.values, 'responseTab');

  const handleClick = async () => {
    try {
      setLoading(true);

      const actionValue = formValue?.values?.actions?.[actionKey];

      const repo = apiClient.resource('dataSources.httpCollections', name);

      const {
        data: { data: resData },
      } = await repo.runAction({
        values: {
          debug: false,
          inferFields: true,
          actionOptions: {
            ...actionValue,
            type: actionKey,
            responseTransformer: actionValue?.responseTransformer,
          },
          debugVars,
        },
      });

      setVisible(false);
      setLoading(false);

      const { transformedResponse, fields: fieldsList, filterTargetKey } = resData;

      if (filterTargetKey) {
        formValue.setValuesIn('filterTargetKey', filterTargetKey);
      }

      if (fieldsList) {
        const fieldVal = lodash.unionBy(fields, fieldsList, 'name');
        formValue.setValuesIn('fields', fieldVal);
      }

      if (typeof transformedResponse?.data == 'object') {
        let responseData = [];
        if (actionKey === 'get') {
          responseData = [transformedResponse?.data];
        } else {
          responseData = transformedResponse?.data;
        }

        formValue.setValuesIn('preview', responseData);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  if (!['list', 'get'].includes(actionKey)) {
    return null;
  }

  return (
    <TooltipContainer>
      <Button
        type="primary"
        disabled={!rawResponse || responseValidationErrorMessage}
        loading={loading}
        onClick={handleClick}
      >
        {t('Extract field metadata')}
      </Button>
    </TooltipContainer>
  );
};
