import { useState } from 'react';
import {
  ActionContextProvider,
  IField,
  RecordProvider,
  SchemaComponent,
  useAPIClient,
  useCancelAction,
  useCollectionManager_deprecated,
  useCompile,
  useRequest,
} from '@tachybase/client';
import { ArrayTable } from '@tachybase/components';
import { ISchema, uid } from '@tachybase/schema';

import { cloneDeep, omit, set } from 'lodash';
import { useTranslation } from 'react-i18next';

import useDialect from '../../hooks/useDialect';
import * as components from '../components';
import { setUpdateXlsxCollectionField } from './setUpdateXlsxCollectionField';

export const XlsxEditFieldAction = (props) => {
  const {
    scope,
    getContainer,
    record,
    parentItem: parentRecord,
    children,
    handleUiSchemaChange,
    ...otherProps
  } = props;
  const { getInterface, collections, getCollection } = useCollectionManager_deprecated();
  const [visible, setVisible] = useState(false);
  const [schema, setSchema] = useState({});
  const api = useAPIClient();
  const { t } = useTranslation();
  const compile = useCompile();
  const [data, setData] = useState<any>({ record });
  const { isDialect } = useDialect();

  return (
    <RecordProvider record={record} parent={parentRecord}>
      <ActionContextProvider value={{ visible, setVisible }}>
        <a
          {...otherProps}
          onClick={async () => {
            setData(record);
            const interfaceConf = getInterface(record.interface);
            const defaultValues: any = cloneDeep(record) || {};
            if (!defaultValues?.reverseField) {
              defaultValues.autoCreateReverseField = false;
              defaultValues.reverseField = interfaceConf?.default?.reverseField;
              set(defaultValues.reverseField, 'name', record.name);
              set(defaultValues, 'uiSchema.title', record.uiSchema.title);
            }
            const schema = getSchema(
              {
                ...interfaceConf,
                default: defaultValues,
              },
              record,
              compile,
              getContainer,
            );
            setSchema(schema);
            setVisible(true);
          }}
        >
          {children || t('Edit')}
        </a>
        <SchemaComponent
          schema={schema}
          components={{ ...components, ArrayTable }}
          scope={{
            getContainer,
            useCancelAction,
            showReverseFieldConfig: !data?.reverseField,
            isDialect,
            setUpdateXlsxCollectionField,
            disabledJSONB: true,
            createMainOnly: true,
            ...scope,
          }}
        />
      </ActionContextProvider>
    </RecordProvider>
  );
};

const getSchema = (schema: IField, record: any, compile, getContainer): ISchema => {
  if (!schema) {
    return;
  }
  const properties = cloneDeep(schema.properties) as any;
  if (properties?.name) {
    properties.name['x-disabled'] = true;
  }
  if (schema.hasDefaultValue === true) {
    properties['defaultValue'] = cloneDeep(schema.default) || {};
    properties.defaultValue.required = false;
    properties['defaultValue']['title'] = compile('{{ t("Default value") }}');
    properties['defaultValue']['x-decorator'] = 'FormItem';
    properties['defaultValue']['x-reactions'] = [
      {
        dependencies: [
          'uiSchema.x-component-props.gmt',
          'uiSchema.x-component-props.showTime',
          'uiSchema.x-component-props.dateFormat',
          'uiSchema.x-component-props.timeFormat',
        ],
        fulfill: {
          state: {
            componentProps: {
              gmt: '{{$deps[0]}}',
              showTime: '{{$deps[1]}}',
              dateFormat: '{{$deps[2]}}',
              timeFormat: '{{$deps[3]}}',
            },
          },
        },
      },
      {
        dependencies: ['primaryKey', 'unique', 'autoIncrement'],
        when: '{{$deps[0]||$deps[1]||$deps[2]}}',
        fulfill: {
          state: {
            hidden: true,
            value: undefined,
          },
        },
        otherwise: {
          state: {
            hidden: false,
          },
        },
      },
    ];
  }

  return {
    type: 'object',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Action.Drawer',
        'x-component-props': {
          getContainer: getContainer,
        },
        'x-decorator': 'Form',
        'x-decorator-props': {
          useValues(options) {
            return useRequest(
              () =>
                Promise.resolve({
                  data: cloneDeep(omit(schema.default, ['uiSchema.rawTitle'])),
                }),
              options,
            );
          },
        },
        title: `${compile(record.uiSchema.title)} - ${compile('{{ t("Edit field") }}')}`,
        properties: {
          summary: {
            type: 'void',
            'x-component': 'FieldSummary',
            'x-component-props': {
              schemaKey: schema.name,
            },
          },
          // @ts-ignore
          ...properties,
          description: {
            type: 'string',
            title: '{{t("Description")}}',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
          },
          footer: {
            type: 'void',
            'x-component': 'Action.Drawer.Footer',
            properties: {
              action1: {
                title: '{{ t("Cancel") }}',
                'x-component': 'Action',
                'x-use-component-props': 'useCancelActionProps',
              },
              action2: {
                title: '{{ t("Submit") }}',
                'x-component': 'Action',
                'x-component-props': {
                  type: 'primary',
                },
                'x-use-component-props': 'setUpdateXlsxCollectionField',
              },
            },
          },
        },
      },
    },
  };
};
