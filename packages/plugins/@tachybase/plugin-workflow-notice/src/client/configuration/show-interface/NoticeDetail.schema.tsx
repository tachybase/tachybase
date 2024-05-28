import React from 'react';
import { Plugin, SchemaComponent, useAPIClient, useRequest } from '@tachybase/client';
import { useForm } from '@tachybase/schema';
import { uid } from '@tachybase/utils/client';

import { Spin } from 'antd';

import { NoticeDetailInitializer } from './NoticeDetail.initializer';

export class SCNoticeDetail extends Plugin {
  async load() {
    this.app.schemaInitializerManager.add(NoticeDetailInitializer);
  }
}

function createNewSchema(id) {
  return {
    type: 'void',
    name: id,
    'x-uid': id,
    'x-component': 'Grid',
    'x-initializer': 'NoticeDetailInitializer',
  };
}

export const NoticeDetail = (props) => {
  const { schemaData, loading, handleChange } = useAction(props);
  if (loading) {
    return <Spin />;
  }
  return (
    <SchemaComponent
      memoized={true}
      scope={
        {
          // useSubmit: () => {
          //   return { run() {} };
          // },
          // useApprovalFormBlockProps,
          // useDetailsBlockProps: useFormBlockContext,
        }
      }
      components={{}}
      schema={schemaData as any}
      onChange={handleChange}
    />
  );
};

function useAction(props) {
  const { value: srcID, onChange } = props;
  const apiClient = useAPIClient();
  const { values, setValuesIn } = useForm();
  const { data: schemaData, loading } = useRequest(async () => {
    if (srcID) {
      const remoteSchema = await fetchSchema(apiClient, srcID);
      if (remoteSchema['x-uid'] === srcID) {
        return remoteSchema;
      }
    }
    const id = srcID ?? uid();
    const newSchema = createNewSchema(id);
    await instertSchema(apiClient, newSchema);
    onChange(id);
    return newSchema;
  });

  const handleChange = (data) => {};

  return {
    schemaData,
    loading,
    handleChange,
  };
}

async function fetchSchema(apiClient, srcID): Promise<object> {
  const { data: serviceData } = await apiClient.request({ url: `uiSchemas:getJsonSchema/${srcID}` });

  const remoteSchema = serviceData.data ?? {};
  return remoteSchema;
}

async function instertSchema(apiClient, schema): Promise<void> {
  await apiClient.resource('uiSchemas').insert({ values: schema });
}
