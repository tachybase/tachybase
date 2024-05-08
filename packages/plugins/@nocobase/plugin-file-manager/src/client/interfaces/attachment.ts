import { ISchema } from '@tachybase/schema';
import { uid } from '@tachybase/schema';
import { CollectionFieldInterface, interfacesProperties } from '@tachybase/client';
import { NAMESPACE } from '../locale';

export class AttachmentFieldInterface extends CollectionFieldInterface {
  name = 'attachment';
  type = 'object';
  group = 'media';
  title = `{{t("Attachment", { ns: "${NAMESPACE}" })}}`;
  isAssociation = true;
  default = {
    type: 'belongsToMany',
    target: 'attachments',
    // name,
    uiSchema: {
      type: 'array',
      // title,
      'x-component': 'Upload.Attachment',
      'x-component-props': {},
    },
  };
  availableTypes = ['belongsToMany'];
  schemaInitialize(schema: ISchema, { block, field }) {
    if (['Table', 'Kanban'].includes(block)) {
      schema['x-component-props'] = schema['x-component-props'] || {};
      schema['x-component-props']['size'] = 'small';
    }

    if (!schema['x-component-props']) {
      schema['x-component-props'] = {};
    }
    schema['x-component-props']['action'] = `${field.target}:create${
      field.storage ? `?attachmentField=${field.collectionName}.${field.name}` : ''
    }`;
  }
  initialize(values: any) {
    if (!values.through) {
      values.through = `t_${uid()}`;
    }
    if (!values.foreignKey) {
      values.foreignKey = `f_${uid()}`;
    }
    if (!values.otherKey) {
      values.otherKey = `f_${uid()}`;
    }
    if (!values.sourceKey) {
      values.sourceKey = 'id';
    }
    if (!values.targetKey) {
      values.targetKey = 'id';
    }
  }
  properties = {
    ...interfacesProperties.defaultProps,
    'uiSchema.x-component-props.accept': {
      type: 'string',
      title: `{{t("MIME type", { ns: "${NAMESPACE}" })}}`,
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      description: 'Example: image/png',
      default: 'image/*',
    },
    'uiSchema.x-component-props.multiple': {
      type: 'boolean',
      'x-content': `{{t('Allow uploading multiple files', { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
      default: true,
    },
    storage: {
      type: 'string',
      title: `{{t("Storage", { ns: "${NAMESPACE}" })}}`,
      description: `{{t('Default storage will be used when not selected', { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'RemoteSelect',
      'x-component-props': {
        service: {
          resource: 'storages',
          params: {
            // pageSize: -1
          },
        },
        manual: false,
        fieldNames: {
          label: 'title',
          value: 'name',
        },
      },
    },
  };
  filterable = {
    children: [
      {
        name: 'id',
        title: '{{t("Exists")}}',
        operators: [
          { label: '{{t("exists")}}', value: '$exists', noValue: true },
          { label: '{{t("not exists")}}', value: '$notExists', noValue: true },
        ],
        schema: {
          title: '{{t("Exists")}}',
          type: 'string',
          'x-component': 'Input',
        },
      },
      {
        name: 'filename',
        title: `{{t("Filename", { ns: "${NAMESPACE}" })}}`,
        operators: interfacesProperties.operators.string,
        schema: {
          title: `{{t("Filename", { ns: "${NAMESPACE}" })}}`,
          type: 'string',
          'x-component': 'Input',
        },
      },
    ],
  };
}
