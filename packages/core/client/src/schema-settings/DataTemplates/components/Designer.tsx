import { Field } from '@tachybase/schema';
import { ISchema, observer, useField, useFieldSchema } from '@tachybase/schema';
import { error } from '@tachybase/utils/client';
import { Select } from 'antd';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GeneralSchemaDesigner, SchemaSettingsItem } from '../..';
import { useFormBlockContext } from '../../../block-provider';
import { useCollectionManager_deprecated } from '../../../collection-manager';
import { mergeFilter } from '../../../filter-provider/utils';
import { removeNullCondition, useCompile, useDesignable } from '../../../schema-component';
import { ITemplate } from '../../../schema-component/antd/form-v2/Templates';
import { SchemaSettingsDataScope } from '../../SchemaSettingsDataScope';

export const Designer = observer(
  () => {
    const { getCollectionFields, getCollectionField, getCollection, isTitleField } = useCollectionManager_deprecated();
    const field = useField<Field>();
    const fieldSchema = useFieldSchema();
    const { t } = useTranslation();
    const { dn } = useDesignable();
    const compile = useCompile();
    const { formSchema, data } = fieldSchema['x-designer-props'] as {
      formSchema: ISchema;
      data?: ITemplate;
    };
    const { form } = useFormBlockContext();

    // 在这里读取 resource 的值，当 resource 变化时，会触发该组件的更新
    const collectionName = field.componentProps.service.resource;

    const collection = getCollection(collectionName);
    const collectionFields = getCollectionFields(collectionName);

    if (!data) {
      error('data is required');
      return null;
    }

    const getFilter = () => data.config?.[collectionName]?.filter || {};
    const setFilter = (filter) => {
      try {
        _.set(data, `config.${collectionName}.filter`, removeNullCondition(filter));
      } catch (err) {
        error(err);
      }
    };
    const getTitleFIeld = () => data.config?.[collectionName]?.titleField || collection?.titleField || 'id';
    const setTitleField = (titleField) => {
      try {
        _.set(data, `config.${collectionName}.titleField`, titleField);
      } catch (err) {
        error(err);
      }
    };

    const options = collectionFields
      .filter((field) => isTitleField(field))
      .map((field) => ({
        value: field?.name,
        label: compile(field?.uiSchema?.title) || field?.name,
      }));

    return (
      <GeneralSchemaDesigner draggable={false}>
        <SchemaSettingsDataScope
          collectionName={collectionName}
          defaultFilter={getFilter()}
          form={form}
          onSubmit={({ filter }) => {
            setFilter(filter);

            try {
              // 不仅更新当前模板，也更新同级的其它模板
              field.query('fieldReaction.items.*.layout.dataId').forEach((item) => {
                if (item.componentProps.service.resource !== collectionName) {
                  return;
                }

                item.componentProps.service.params = {
                  filter: _.isEmpty(filter)
                    ? {}
                    : removeNullCondition(mergeFilter([filter, getSelectedIdFilter(field.value)], '$or')),
                };
              });
            } catch (err) {
              error(err);
            }
            formSchema['x-data-templates'] = data;
            dn.emit('patch', {
              schema: {
                ['x-uid']: formSchema['x-uid'],
                ['x-data-templates']: data,
              },
            });
            dn.refresh();
          }}
        />
        <SelectItem
          key="title-field"
          title={t('Title field')}
          options={options}
          value={getTitleFIeld()}
          onChange={(label) => {
            setTitleField(label);

            try {
              // 不仅更新当前模板，也更新同级的其它模板
              field.query('fieldReaction.items.*.layout.dataId').forEach((item) => {
                if (item.componentProps.service.resource !== collectionName) {
                  return;
                }

                item.componentProps.fieldNames.label = label;
                item.componentProps.targetField = getCollectionField(
                  `${collectionName}.${label || collection?.titleField || 'id'}`,
                );
              });
            } catch (err) {
              console.error(err);
            }
            formSchema['x-data-templates'] = data;

            const schema = {
              ['x-uid']: formSchema['x-uid'],
              ['x-data-templates']: data,
            };

            dn.emit('patch', {
              schema,
            });
            dn.refresh();
          }}
        />
      </GeneralSchemaDesigner>
    );
  },
  { displayName: 'Designer' },
);

export function getSelectedIdFilter(selectedId) {
  return selectedId
    ? {
        id: {
          $eq: selectedId,
        },
      }
    : null;
}

function SelectItem(props) {
  const { title, options, value, onChange, ...others } = props;

  return (
    <SchemaSettingsItem title={title} {...others}>
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        {title}
        <Select
          popupMatchSelectWidth={false}
          bordered={false}
          value={value}
          onChange={onChange}
          options={options}
          style={{ textAlign: 'right', minWidth: 100 }}
          {...others}
        />
      </div>
    </SchemaSettingsItem>
  );
}
