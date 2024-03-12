import { Field } from '@formily/core';
import { connect, mapReadPretty, observer, useField, useFieldSchema, useForm } from '@formily/react';
import React from 'react';
import {
  SchemaComponentOptions,
  useCollection_deprecated,
  useAssociationCreateActionProps as useCAP,
  Action,
  __UNSAFE__,
} from '@nocobase/client';
import { InternaDrawerSubTable } from './InternalDrawerSubTable';
import { AssociationSelect } from './AssociationSelect';
const {
  CreateRecordAction,
  useAssociationFieldContext,
  InternalPicker,
  InternalNester,
  AssociationFieldProvider,
  InternaPopoverNester,
  InternalSubTable,
  InternalCascader,
  InternalFileManager,
  InternalCascadeSelect,
  SubTable,
  ReadPretty,
  Nester,
} = __UNSAFE__;

const EditableAssociationField = observer(
  (props: any) => {
    const { multiple } = props;
    const field: Field = useField();
    const form = useForm();
    const { options: collectionField, currentMode } = useAssociationFieldContext();

    const useCreateActionProps = () => {
      const { onClick } = useCAP();
      const actionField: any = useField();
      const { getPrimaryKey } = useCollection_deprecated();
      const primaryKey = getPrimaryKey();
      return {
        async onClick() {
          await onClick();
          const { data } = actionField.data?.data?.data || {};
          if (data) {
            if (['m2m', 'o2m'].includes(collectionField?.interface) && multiple !== false) {
              const values = form.getValuesIn(field.path) || [];
              if (!values.find((v) => v[primaryKey] === data[primaryKey])) {
                values.push(data);
                form.setValuesIn(field.path, values);
                field.onInput(values);
              }
            } else {
              form.setValuesIn(field.path, data);
              field.onInput(data);
            }
          }
        },
      };
    };
    return (
      <SchemaComponentOptions scope={{ useCreateActionProps }} components={{ CreateRecordAction }}>
        {currentMode === 'Picker' && <InternalPicker {...props} />}
        {currentMode === 'Nester' && <InternalNester {...props} />}
        {currentMode === 'PopoverNester' && <InternaPopoverNester {...props} />}
        {currentMode === 'Select' && <AssociationSelect {...props} />}
        {currentMode === 'SubTable' && <InternalSubTable {...props} />}
        {currentMode === 'FileManager' && <InternalFileManager {...props} />}
        {currentMode === 'CascadeSelect' && <InternalCascadeSelect {...props} />}
        {currentMode === 'DrawerSubTable' && <InternaDrawerSubTable {...props} />}
        {currentMode === 'Cascader' && <InternalCascader {...props} />}
      </SchemaComponentOptions>
    );
  },
  { displayName: 'EditableAssociationField' },
);

const ExtendedEditable = observer(
  (props) => {
    return (
      <AssociationFieldProvider>
        <EditableAssociationField {...props} />
      </AssociationFieldProvider>
    );
  },
  { displayName: 'ExtendedEditable' },
);

export const ExtendedAssociationField: any = connect(ExtendedEditable, mapReadPretty(ReadPretty));
ExtendedAssociationField.SubTable = SubTable;
ExtendedAssociationField.Nester = Nester;
ExtendedAssociationField.AddNewer = Action.Container;
ExtendedAssociationField.Selector = Action.Container;
ExtendedAssociationField.Viewer = Action.Container;
ExtendedAssociationField.InternalSelect = InternalPicker;
