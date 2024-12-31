import { useCallback, useEffect, useState } from 'react';
import {
  compatibleDataId,
  findFormBlock,
  RemoteSelect,
  useAPIClient,
  useCollectionManager,
  useFormBlockContext,
} from '@tachybase/client';
import { useFieldSchema, useForm } from '@tachybase/schema';
import { error, forEach } from '@tachybase/utils/client';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

export interface ITemplate {
  config?: {
    [key: string]: {
      /** 设置的数据范围 */
      filter?: any;
      /** 设置的标题字段 */
      titleField?: string;
    };
  };
  items: {
    key: string;
    title: string;
    collection: string;
    dataId?: number;
    fields: string[];
    default?: boolean;
    dataScope?: object;
    titleField?: string;
  }[];
  /** 是否在 Form 卡片显示模板选择器 */
  display: boolean;
}

export const useDataTemplates = () => {
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const { duplicateData } = useFormBlockContext();
  const cm = useCollectionManager();
  if (duplicateData) {
    return duplicateData;
  }
  const { items = [], display = true } = findDataTemplates(fieldSchema);
  // 过滤掉已经被删除的字段
  items.forEach((item) => {
    try {
      item.fields = item.fields
        ?.map((field) => {
          const joinField = cm.getCollectionField(`${item.collection}.${field}`);
          if (joinField) {
            return field;
          }
          return '';
        })
        .filter(Boolean);
    } catch (err) {
      error(err);
      item.fields = [];
    }
  });

  const templates: any = [
    {
      key: 'none',
      title: t('None'),
    },
  ].concat(
    items.map<any>((t, i) => ({
      key: i,
      ...t,
      isLeaf: t.dataId !== null && t.dataId !== undefined,
      titleCollectionField: t?.titleField && cm.getCollectionField(`${t.collection}.${t.titleField}`),
    })),
  );
  const defaultTemplate = items.find((item) => item.default);
  return {
    templates,
    display,
    defaultTemplate,
    enabled: items.length > 0 && items.every((item) => item.dataId || item.dataScope),
  };
};

export const DataSelect = ({ style = {}, templateKey = 'none', collection }) => {
  const form = useForm();
  const { templates, enabled, defaultTemplate } = useDataTemplates();
  const cm = useCollectionManager();
  const templateOptions = compatibleDataId(templates);
  const targetTemplate = templateKey;
  const [targetTemplateData, setTemplateData] = useState(null);
  const api = useAPIClient();
  const { t } = useTranslation();
  useEffect(() => {
    if (enabled && defaultTemplate) {
      (form as any).__template = true;
      if (defaultTemplate.key === 'duplicate') {
        handleTemplateDataChange(defaultTemplate.dataId, defaultTemplate);
      }
    }
  }, []);
  useEffect(() => {
    if (!templateOptions?.some((v) => v.key === targetTemplate)) {
      handleTemplateChange('none');
    }
  }, [templateOptions]);

  const handleTemplateChange = useCallback(async (value) => {
    setTemplateData(null);
    form?.reset();
  }, []);

  const handleTemplateDataChange: any = useCallback(async (value, option) => {
    const template = { ...option, dataId: value };
    setTemplateData(option);
    fetchTemplateData(api, template, t)
      .then((data) => {
        if (form && data) {
          // 切换之前先把之前的数据清空
          form.reset();
          (form as any).__template = true;

          forEach(data, (value, key) => {
            if (value) {
              form.values[key] = value;
              form?.setInitialValuesIn?.(key, value);
            }
          });
        }
        return data;
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (!enabled) {
    return null;
  }
  const template = templateOptions?.find((v) => v.key === targetTemplate);
  if (template && collection) {
    template.collection = collection;
  }
  return (
    targetTemplate !== 'none' &&
    template && (
      <RemoteSelect
        fieldNames={{ label: template?.titleField, value: 'id' }}
        target={template?.collection}
        value={targetTemplateData}
        objectValue
        service={{
          resource: template?.collection,
          params: {
            filter: template?.dataScope,
          },
        }}
        onChange={(value) => handleTemplateDataChange(value?.id, { ...value, ...template })}
        targetField={cm.getCollectionField(`${template?.collection}.${template.titleField}`)}
      />
    )
  );
};

function findDataTemplates(fieldSchema): ITemplate {
  const formSchema = findFormBlock(fieldSchema);
  if (formSchema) {
    return _.cloneDeep(formSchema['x-data-templates']) || {};
  }
  return {} as ITemplate;
}

export async function fetchTemplateData(api, template: { collection: string; dataId: number; fields: string[] }, t) {
  if (template.fields.length === 0 || !template.dataId) {
    return;
  }
  return api
    .resource(template.collection)
    .get({
      filterByTk: template.dataId,
      fields: template.fields,
      isTemplate: true,
    })
    .then((data) => {
      return data.data?.data;
    });
}
