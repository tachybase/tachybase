import {
  FormDialog,
  SchemaComponent,
  SchemaComponentOptions,
  SchemaInitializerItem,
  gridRowColWrap,
  useCollectionManager_deprecated,
  useDesignable,
  useGlobalTheme,
  HTMLEncode,
  useSchemaInitializerItem,
  i18n,
  GeneralSchemaDesigner,
  SchemaSettingsDivider,
  EditDescription,
  EditDefaultValue,
  cx,
  css,
  ACLCollectionFieldProvider,
  BlockItem,
  FormItem,
  SchemaSettingsDataScope,
  EditComponent,
  useFormBlockContext,
  removeNullCondition,
  useAPIClient,
} from '@nocobase/client';
import { ConfigProvider } from 'antd';
import React, { memo, useCallback, useContext, useMemo } from 'react';
import { Schema, SchemaOptionsContext, observer, useField, useFieldSchema } from '@formily/react';
import { FormLayout } from '@formily/antd-v5';
import { uid } from '@formily/shared';
import { Field } from '@formily/core';
import { EditFormulaTitleField, EditTitle, EditTitleField } from '../../components/SchemaSettingOptions';
import _ from 'lodash';
import { SchemaSettingsRemove } from '../../components/FormFilter/SchemaSettingsRemove';
import { useTranslation } from '../../locale';

export const useFieldComponents = () => {
  const { t } = useTranslation();
  const options = [
    { label: t('Input'), value: 'Input' },
    { label: t('Select'), value: 'Select' },
  ];
  return {
    options,
    values: options.map((option) => option.value),
  };
};

export const FilterCustomItemInitializer: React.FC<{
  insert?: any;
}> = memo((props) => {
  const { locale } = useContext(ConfigProvider.ConfigContext);
  const { t } = useTranslation();
  const { scope, components } = useContext(SchemaOptionsContext);
  const { theme } = useGlobalTheme();
  const { insert } = props;
  const itemConfig = useSchemaInitializerItem();
  const { getInterface } = useCollectionManager_deprecated();
  const { collections } = useCollectionManager_deprecated();
  collections.forEach((value) => {
    value['label'] = value.name;
    value['value'] = value.name;
  });
  const { options: fieldComponents, values: fieldComponentValues } = useFieldComponents();
  const api = useAPIClient();
  const handleClick = useCallback(async () => {
    const values = await FormDialog(
      t('Add custom field'),
      () => (
        <SchemaComponentOptions scope={{ ...scope, useCollectionManager_deprecated }} components={{ ...components }}>
          <FormLayout layout={'vertical'}>
            <ConfigProvider locale={locale}>
              <SchemaComponent
                schema={{
                  properties: {
                    name: {
                      type: 'string',
                      required: true,
                    },
                    title: {
                      type: 'string',
                      title: t('Field title'),
                      'x-component': 'Input',
                      'x-decorator': 'FormItem',
                      required: true,
                    },
                    component: {
                      type: 'string',
                      title: t('Field component'),
                      'x-component': 'Select',
                      'x-decorator': 'FormItem',
                      required: true,
                      enum: fieldComponents,
                    },
                    collection: {
                      type: 'string',
                      title: t('Field collection'),
                      'x-decorator': 'FormItem',
                      'x-component': 'Select',
                      enum: collections,
                      description: t('Select a collection field to use metadata of the field'),
                      required: true,
                    },
                  },
                }}
              />
            </ConfigProvider>
          </FormLayout>
        </SchemaComponentOptions>
      ),
      theme,
    ).open({
      values: {
        name: `f_${uid()}`,
      },
    });
    const { name, title, component, collection } = values;
    const defaultSchema = getInterface(component)?.default?.uiSchema || {};
    const res = await api.request({
      url: collection + ':list',
      params: {
        pageSize: 99999,
      },
    });
    const option = res.data.data.map((value) => {
      return value;
    });
    insert(
      gridRowColWrap({
        'x-component': component,
        ...defaultSchema,
        type: 'string',
        title: title,
        name: 'custom.' + collection,
        required: false,
        'x-designer': 'FilterItemCustomDesigner',
        'x-decorator': 'FilterFormItem',
        'x-decorator-props': collection,
        'x-component-props': {
          ...(defaultSchema['x-component-props'] || {}),
          options: option,
          fieldNames: {
            label: 'name',
            value: 'id',
          },
        },
        'x-compoent-custom': true,
      }),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);
  return <SchemaInitializerItem {...itemConfig} {...props} onClick={handleClick} />;
});

export const FilterFormItemCustom = () => {
  const { insertAdjacent } = useDesignable();
  return <FilterCustomItemInitializer insert={(s: Schema) => insertAdjacent('beforeEnd', s)} />;
};

export const FilterItemCustomDesigner: React.FC = () => {
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const fieldName = fieldSchema['name'] as string;
  const name = fieldName.includes('custom') ? fieldSchema['x-decorator-props'] : fieldName;
  const { form } = useFormBlockContext();
  const field = useField();
  const { dn } = useDesignable();
  return (
    <GeneralSchemaDesigner>
      <EditTitle />
      <EditDescription />
      <EditDefaultValue />
      <SchemaSettingsDataScope
        collectionName={name}
        defaultFilter={fieldSchema?.['x-decorator-props']?.params?.filter || {}}
        form={form}
        onSubmit={({ filter }) => {
          filter = removeNullCondition(filter);
          _.set(fieldSchema, 'x-decorator-props.params.filter', filter);
          field.decoratorProps.params = { ...fieldSchema['x-decorator-props'].params };
          dn.emit('patch', {
            schema: {
              ['x-uid']: fieldSchema['x-uid'],
              'x-decorator-props': fieldSchema['x-decorator-props'],
            },
          });
        }}
      />
      <EditComponent />
      <EditTitleField />
      <EditFormulaTitleField />
      <SchemaSettingsDivider />
      <SchemaSettingsRemove
        key="remove"
        confirm={{
          title: t('Delete field'),
        }}
        removeParentsIfNoChildren
        breakRemoveOn={{
          'x-component': 'Grid',
        }}
      />
    </GeneralSchemaDesigner>
  );
};

export const useCollectionJoinFieldTitle = (name: string) => {
  const { getCollection, getCollectionField } = useCollectionManager_deprecated();
  return useMemo(() => {
    if (!name) {
      return;
    }
    const [collectionName, ...fieldNames] = name.split('.');
    if (!fieldNames?.length) {
      return;
    }
    const collection = getCollection(collectionName);
    let cName: any = collectionName;
    let field: any;
    let title = Schema.compile(collection?.title, { t: i18n.t });
    while (cName && fieldNames.length > 0) {
      const fileName = fieldNames.shift();
      field = getCollectionField(`${cName}.${fileName}`);
      const fieldTitle = field?.uiSchema?.title || field?.name;
      if (fieldTitle) {
        title += ` / ${Schema.compile(fieldTitle, { t: i18n.t })}`;
      }
      if (field?.target) {
        cName = field.target;
      } else {
        cName = null;
      }
    }
    return title;
  }, [name]);
};

export const FilterFormItem = observer(
  (props: any) => {
    const field = useField<Field>();
    const schema = useFieldSchema();
    const showTitle = schema['x-decorator-props']?.showTitle ?? true;
    const extra = useMemo(() => {
      return typeof field.description === 'string' ? (
        <div
          dangerouslySetInnerHTML={{
            __html: HTMLEncode(field.description).split('\n').join('<br/>'),
          }}
        />
      ) : (
        field.description
      );
    }, [field.description]);
    const className = useMemo(() => {
      return cx(
        css`
          & .ant-space {
            flex-wrap: wrap;
          }
        `,
        {
          [css`
            > .ant-formily-item-label {
              display: none;
            }
          `]: showTitle === false,
        },
      );
    }, [showTitle]);

    return (
      <ACLCollectionFieldProvider>
        <BlockItem className={'nb-form-item'}>
          <FormItem className={className} {...props} extra={extra} />
        </BlockItem>
      </ACLCollectionFieldProvider>
    );
  },
  { displayName: 'FilterFormItem' },
);
