import { default as React, useCallback, useContext } from 'react';
import { SchemaComponent, useAPIClient, useFormBlockContext, useRequest } from '@tachybase/client';
import { DetailsBlockProvider, SimpleDesigner } from '@tachybase/module-workflow/client';
import { useForm } from '@tachybase/schema';
import { uid } from '@tachybase/utils/client';

import { Spin } from 'antd';

import { FormBlockProvider } from '../../../../usage/pc/common/FormBlock.provider';
import { flatSchemaArray } from '../../../../usage/pc/constants';
import { useContextApproverConfig } from '../../contexts/ApproverConfig';
import { ActionBarProvider } from './ActionBar.provider';
import { ApprovalActionProvider } from './ApprovalAction.provider';
import { ApprovalFormBlockProvider } from './ApprovalFormBlockProvider.view';
import { ProviderApprovalUpdateForm } from './ApprovalUpdateForm.provider';
import { ContextApproverBlock } from './SchemaConfigButtonContext.provider';
import { useApprovalFormBlockProps } from './useApprovalFormBlockProps';

export const ApproverBlock = ({ value: srcID, onChange }) => {
  const apiClient = useAPIClient();
  const { values, setValuesIn } = useForm();
  const { setFormValueChanged } = useContextApproverConfig();
  const onChangeFunc = useCallback(
    (data) => {
      const arr = flatSchemaArray(data.toJSON(), (field) => field['x-decorator'] === 'ApprovalFormBlockProvider');

      const flatSet = arr.reduce((accSet, curr) => {
        const currArr = flatSchemaArray(curr, (field) => field['x-component'] === 'Action');

        for (const field of currArr) {
          accSet.add(Number.parseInt(field['x-action'], 10));
        }

        return accSet;
      }, new Set());

      if (flatSet.size !== values.actions?.length || !values.actions.every((action) => flatSet.has(action))) {
        setFormValueChanged(true);
      }
      setValuesIn('actions', [...flatSet]);
    },
    [setFormValueChanged, setValuesIn, values.actions],
  );

  const { data: schemaData, loading } = useRequest(async () => {
    if (srcID) {
      const { data: serviceData } = await apiClient.request({ url: `uiSchemas:getJsonSchema/${srcID}` });
      if (serviceData?.data?.['x-uid'] === srcID) {
        return serviceData.data;
      }
    }
    const id = srcID ?? uid();
    const schema = {
      type: 'void',
      name: id,
      'x-uid': id,
      'x-component': 'Grid',
      'x-initializer': 'ApproverAddBlockInitializer',
      properties: {},
    };

    await apiClient.resource('uiSchemas').insert({ values: schema });

    onChange(id);

    return schema;
  });

  if (loading) {
    return <Spin />;
  }

  return (
    <ContextApproverBlock.Provider value={values}>
      <SchemaComponent
        memoized={true}
        scope={{
          useSubmit: () => {
            return { run() {} };
          },
          useApprovalFormBlockProps,
          useDetailsBlockProps: useFormBlockContext,
        }}
        components={{
          FormBlockProvider,
          ApprovalFormBlockProvider,
          ActionBarProvider,
          ApprovalActionProvider,
          DetailsBlockProvider,
          SimpleDesigner,
          ProviderApprovalUpdateForm,
        }}
        // @ts-ignore
        schema={schemaData}
        onChange={onChangeFunc}
      />
    </ContextApproverBlock.Provider>
  );
};
