import { useCallback, useContext } from 'react';
import { uid } from '@tachybase/schema';

import { cloneDeep } from 'lodash';

import { useAPIClient } from '../api-client';
import { useCollectionManager_deprecated } from '../collection-manager';
import { DEFAULT_DATA_SOURCE_KEY } from '../data-source';
import { regenerateUid, SchemaTemplateManagerContext } from './SchemaTemplateManagerProvider';

export const useSchemaTemplateManager = () => {
  const { getInheritCollections } = useCollectionManager_deprecated();
  const { refresh, templates = [] } = useContext(SchemaTemplateManagerContext);
  const api = useAPIClient();
  return {
    templates,
    refresh,
    async getTemplateSchemaByMode(options) {
      const { mode, template } = options;
      if (mode === 'copy') {
        const { data } = await api.request({
          url: `/uiSchemas:getJsonSchema/${template.uid}?includeAsyncNode=true`,
        });
        const s = data?.data || {};
        regenerateUid(s);
        return cloneDeep(s);
      } else if (mode === 'reference') {
        return {
          type: 'void',
          'x-component': 'BlockTemplate',
          'x-component-props': {
            templateId: template.key,
          },
        };
      }
    },
    async copyTemplateSchema(template) {
      const { data } = await api.request({
        url: `/uiSchemas:getJsonSchema/${template.uid}?includeAsyncNode=true`,
      });
      const s = data?.data || {};
      regenerateUid(s);
      return cloneDeep(s);
    },
    async saveAsTemplate(values) {
      const { uid: schemaId } = values;
      const key = uid();
      await api.resource('uiSchemas').saveAsTemplate({
        filterByTk: schemaId,
        values: {
          key,
          ...values,
        },
      });
      await refresh();
      return { key };
    },
    getTemplateBySchema: useCallback(
      (schema) => {
        if (!schema) return;
        const templateKey = schema['x-template-key'];
        if (templateKey) {
          return templates?.find((template) => template.key === templateKey);
        }
        const schemaId = schema['x-uid'];
        if (schemaId) {
          return templates?.find((template) => template.uid === schemaId);
        }
      },
      [templates],
    ),
    getTemplateBySchemaId(schemaId) {
      if (!schemaId) {
        return null;
      }
      return templates?.find((template) => template.uid === schemaId);
    },
    getTemplateById(key) {
      return templates?.find((template) => template.key === key);
    },
    getTemplatesByCollection(dataSource: string, collectionName: string) {
      const parentCollections = getInheritCollections(collectionName, dataSource);
      const totalCollections = parentCollections.concat([collectionName]);
      const items = templates?.filter?.(
        (template) =>
          (template.dataSourceKey || DEFAULT_DATA_SOURCE_KEY) === dataSource &&
          totalCollections.includes(template.collectionName),
      );
      return items || [];
    },
    getTemplatesByComponentName(componentName: string): Array<any> {
      const items = templates?.filter?.((template) => template.componentName === componentName);
      return items || [];
    },
  };
};
