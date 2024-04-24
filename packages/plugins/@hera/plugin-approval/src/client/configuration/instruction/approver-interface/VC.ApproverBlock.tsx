import { SchemaComponent, useAPIClient, useFormBlockContext, useRequest } from '@nocobase/client';
import { uid } from '@nocobase/utils/client';
import { default as React, useCallback, useContext } from 'react';
import { useForm } from '@nocobase/schema';
import { Spin } from 'antd';
import { flatSchemaArray } from '../../../constants';

import { ApprovalFormBlockProvider } from './VC.ApprovalFormBlockProvider';
import { FormBlockProvider } from '../../../common/Pd.FormBlock';
import { ActionBarProvider } from './Pd.ActionBarProvider';
import { ApprovalActionProvider } from './Pd.ApprovalActionProvider';
import { DetailsBlockProvider, SimpleDesigner } from '@nocobase/plugin-workflow/client';
import { ContextApproverBlock } from './Pd.SchemaConfigButtonContext';
import { useApprovalFormBlockProps } from './useApprovalFormBlockProps';
import { ContextApproverConfig } from '../Pd.ContextApproverConfig';

export const ApproverBlock = ({ value: srcID, onChange }) => {
  const apiClient = useAPIClient();
  // const workflowPlugin = usePlugin(PluginWorkflow);
  const { values, setValuesIn } = useForm();
  const { setFormValueChanged } = useContext(ContextApproverConfig) as any;
  // const current = useNodeContext();
  // const nodes = useAvailableUpstreams(current);
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

  const { data, loading } = useRequest(async () => {
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
        schema={data}
        onChange={onChangeFunc}
      />
    </ContextApproverBlock.Provider>
  );
};
