import React, { createContext, useMemo } from 'react';
import { ISchema, uid, useFieldSchema } from '@tachybase/schema';

import { useAPIClient, useRequest } from '../api-client';
import { Plugin } from '../application/Plugin';
import { BlockTemplate } from './BlockTemplate';
import { useSchemaTemplateManager } from './useSchemaTemplateManager';

export const SchemaTemplateManagerContext = createContext<any>({});
SchemaTemplateManagerContext.displayName = 'SchemaTemplateManagerContext';

export const SchemaTemplateManagerProvider: React.FC<any> = (props) => {
  const { templates, refresh } = props;
  return (
    <SchemaTemplateManagerContext.Provider value={{ templates, refresh }}>
      {props.children}
    </SchemaTemplateManagerContext.Provider>
  );
};

export const regenerateUid = (s: ISchema) => {
  s['name'] = s['x-uid'] = uid();
  Object.keys(s.properties || {}).forEach((key) => {
    regenerateUid(s.properties[key]);
  });
};

export const useSchemaTemplate = () => {
  const { getTemplateBySchema } = useSchemaTemplateManager();
  const fieldSchema = useFieldSchema();
  const schemaId = fieldSchema['x-uid'];
  const templateKey = fieldSchema['x-template-key'];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const result = useMemo(() => getTemplateBySchema(fieldSchema), [schemaId, templateKey]);
  return result;
};

const InternalRemoteSchemaTemplateManagerProvider = (props) => {
  const api = useAPIClient();
  const options = {
    resource: 'uiSchemaTemplates',
    action: 'list',
    params: {
      paginate: false,
    },
  };

  const service = useRequest<{
    data: any[];
  }>(options);

  if (service.loading && !service.data) {
    return;
  }

  return (
    <SchemaTemplateManagerProvider
      refresh={async () => {
        const { data } = await api.request(options);
        service.mutate(data);
      }}
      templates={service?.data?.data}
    >
      {props.children}
    </SchemaTemplateManagerProvider>
  );
};

export const RemoteSchemaTemplateManagerProvider = (props: { children?: React.ReactNode }) => {
  return <InternalRemoteSchemaTemplateManagerProvider>{props.children}</InternalRemoteSchemaTemplateManagerProvider>;
};

export class RemoteSchemaTemplateManagerPlugin extends Plugin {
  async load() {
    this.addComponents();
    this.app.addProviders([RemoteSchemaTemplateManagerProvider]);
  }

  addComponents() {
    this.app.addComponents({
      BlockTemplate,
    });
  }
}
