import React, { useCallback, useContext } from 'react';
import {
  SchemaComponent,
  SchemaComponentContext,
  SchemaComponentProvider,
  useAPIClient,
  useFormBlockContext,
  useFormBlockProps,
  useRequest,
} from '@tachybase/client';
import { DetailsBlockProvider, SimpleDesigner } from '@tachybase/module-workflow/client';
import { useForm } from '@tachybase/schema';
import { uid } from '@tachybase/utils/client';

import { Spin } from 'antd';

import { FormBlockProvider } from '../../../../common/components/FormBlock.provider';
import { flatSchemaArray } from '../../../../common/tools/flatSchemaArray';
import { useContextApproverConfig } from '../../contexts/ApproverConfig';
import { ApprovalFormBlockProvider } from './ApprovalFormBlockProvider.view';
import { ProviderApprovalUpdateForm } from './ApprovalUpdateForm.provider';

// 审批节点-添加卡片
export const ViewApplyShowDetailAddBlock = (props) => {
  const { value: srcID, onChange } = props;
  const apiClient = useAPIClient();
  const { values, setValuesIn } = useForm();
  const { setFormValueChanged } = useContextApproverConfig();
  const { components } = useContext(SchemaComponentContext);

  const { data: remoteSchema, loading } = useRequest<any>(async () => {
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
      'x-initializer': 'ApproverShowDetailInitializer',
      properties: {},
    };

    await apiClient.resource('uiSchemas').insert({ values: schema });

    onChange(id);

    return schema;
  });

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

  if (loading) {
    return <Spin />;
  }

  return (
    <SchemaComponentProvider components={components} designable={true}>
      <SchemaComponent
        memoized={true}
        onChange={onChangeFunc}
        schema={remoteSchema}
        components={{
          FormBlockProvider,
          ApprovalFormBlockProvider,
          ActionBarProvider: ({ children }) => children,
          ApprovalActionProvider: ({ children }) => children,
          DetailsBlockProvider,
          SimpleDesigner,
          ProviderApprovalUpdateForm,
        }}
        scope={{
          useSubmit: () => {
            return { run() {} };
          },
          useApprovalFormBlockProps,
          useFormBlockProps,
          useDetailsBlockProps: useFormBlockContext,
        }}
      />
    </SchemaComponentProvider>
  );
};

function useApprovalFormBlockProps() {
  const { form } = useFormBlockContext();
  return { form };
}
