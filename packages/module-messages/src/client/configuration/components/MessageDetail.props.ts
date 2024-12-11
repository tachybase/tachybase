import { useCallback } from 'react';
import { useAPIClient, useRequest } from '@tachybase/client';
import { uid } from '@tachybase/utils/client';

export function useProps(props) {
  const { value: srcId, onChange } = props;
  const apiClient = useAPIClient();

  const handleSchemaChange = useCallback((sData) => {}, []);

  const { data: schemaData, loading } = useRequest(
    async () =>
      await requestSchemaData({
        srcId,
        onChange,
        apiClient,
      }),
  );

  return {
    schemaData,
    loading,
    handleSchemaChange,
  };
}

async function requestSchemaData({ srcId, onChange, apiClient }) {
  const id = srcId ?? uid();
  const newSchema = createNewSchema(id);

  if (srcId) {
    // 用户界面
    const remoteSchema = await fetchSchema({
      apiClient,
      srcId,
    });

    // 如果有能展示的界面, 直接返回展示界面
    if (remoteSchema['x-uid'] === srcId) {
      return remoteSchema;
    }
  } else {
    // 配置界面
    await instertSchema({
      apiClient,
      schema: newSchema,
    });

    onChange(id);
  }

  return newSchema;
}

function createNewSchema(id) {
  return {
    type: 'void',
    name: id,
    'x-uid': id,
    'x-component': 'Grid',
    'x-initializer': 'InitializerBlockMessage',
    properties: {},
  };
}

async function fetchSchema({ apiClient, srcId }): Promise<object> {
  const { data: serviceData } = await apiClient.request({ url: `uiSchemas:getJsonSchema/${srcId}` });

  const remoteSchema = serviceData.data ?? {};
  return remoteSchema;
}

async function instertSchema({ apiClient, schema }): Promise<void> {
  await apiClient.resource('uiSchemas').insert({ values: schema });
}
