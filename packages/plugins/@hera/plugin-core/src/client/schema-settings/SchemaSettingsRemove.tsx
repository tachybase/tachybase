import { ISchema, useField, useFieldSchema, useForm } from '@formily/react';
import { SchemaSettingsItem, useFormActiveFields, useSchemaSettings } from '@nocobase/client';
import { App, ModalFuncProps } from 'antd';
import { FC } from 'react';
import { useTranslation } from '../locale';
import { Field } from '@formily/core';
import React from 'react';

export interface SchemaSettingsRemoveProps {
  confirm?: ModalFuncProps;
  removeParentsIfNoChildren?: boolean;
  breakRemoveOn?: ISchema | ((s: ISchema) => boolean);
}
export const SchemaSettingsRemove: FC<SchemaSettingsRemoveProps> = (props) => {
  const { confirm, removeParentsIfNoChildren, breakRemoveOn } = props;
  const { dn, template } = useSchemaSettings();
  const { t } = useTranslation();
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const form = useForm();
  const { modal } = App.useApp();
  const { removeActiveFieldName } = useFormActiveFields() || {};
  return (
    <SchemaSettingsItem
      title="Delete"
      eventKey="remove"
      onClick={() => {
        modal.confirm({
          title: t('Delete block'),
          content: t('Are you sure you want to delete it?'),
          ...confirm,
          async onOk() {
            const options = {
              removeParentsIfNoChildren,
              breakRemoveOn,
            };
            const name = fieldSchema.name as string;
            const fieldName = name.split('.')[1];
            const title = fieldSchema.title;
            if (field?.required) {
              field.required = false;
              fieldSchema['required'] = false;
            }
            await dn.remove(null, options);
            await confirm?.onOk?.();
            if (form.values['custom']) {
              delete form.values['custom'][fieldName];
            }
            for (const key in form.fields) {
              if (key.includes(name) && form.fields[key].title === title) {
                delete form.fields[key];
              }
            }
            removeActiveFieldName?.(fieldSchema.name as string);
            if (field?.setInitialValue && field?.reset) {
              field.setInitialValue(null);
              field.reset();
            }
          },
        });
      }}
    >
      {t('Delete')}
    </SchemaSettingsItem>
  );
};
