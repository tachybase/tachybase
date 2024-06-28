import { default as React, useCallback, useContext } from 'react';
import { SchemaComponent, useAPIClient, useFormBlockContext, useRequest } from '@tachybase/client';
import { useForm } from '@tachybase/schema';
import { uid } from '@tachybase/utils/client';

import { Spin } from 'antd';

import { DetailsBlockProvider, SimpleDesigner } from '../../../../../components';
import { FormBlockProvider } from '../../../common/Pd.FormBlock';
import { flatSchemaArray } from '../../../constants';
import { ContextApproverConfig } from '../Pd.ContextApproverConfig';
import { ActionBarProvider } from './Pd.ActionBarProvider';
import { ApprovalActionProvider } from './Pd.ApprovalActionProvider';
import { ContextApproverBlock } from './Pd.SchemaConfigButtonContext';
import { useApprovalFormBlockProps } from './useApprovalFormBlockProps';
import { ApprovalFormBlockProvider } from './VC.ApprovalFormBlockProvider';

export const ApproverBlock = ({ value: srcID, onChange }) => {
  const apiClient = useAPIClient();
  const { values, setValuesIn } = useForm();
  const { setFormValueChanged } = useContext(ContextApproverConfig) as any;
  const onChangeFunc = useCallback(
    (data) => {
      const flatSet = flatSchemaArray(
        data.toJSON(),
        (field) => field['x-decorator'] === 'ApprovalFormBlockProvider',
      ).reduce((accSet, curr) => {
        flatSchemaArray(curr, (field) => field['x-component'] === 'Action').forEach((field) => {
          accSet.add(Number.parseInt(field['x-action'], 10));
        });
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
        }}
        // @ts-ignore
        schema={schemaData}
        onChange={onChangeFunc}
      />
    </ContextApproverBlock.Provider>
  );
};
