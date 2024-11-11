import React, { useContext } from 'react';
import { Field, observer, SchemaOptionsContext, useField, useForm } from '@tachybase/schema';

import _ from 'lodash';

import { SchemaComponentOptions } from '../../';
import { useAssociationCreateActionProps as useCAP } from '../../../block-provider/hooks';
import { useCollection_deprecated } from '../../../collection-manager';
import { AssociationFieldProvider } from './AssociationFieldProvider';
import { AssociationSelect as Select } from './AssociationSelect';
import { CreateRecordAction } from './components/CreateRecordAction';
import { InternalFileManager } from './FileManager';
import { useAssociationFieldContext } from './hooks';
import { InternalCascader } from './InternalCascader';
import { InternalCascadeSelect } from './InternalCascadeSelect';
import { InternaDrawerSubTable } from './InternalDrawerSubTable';
import { InternalNester } from './InternalNester';
import { InternalPicker } from './InternalPicker';
import { InternaPopoverNester } from './InternalPopoverNester';
import { InternalSubTable } from './InternalSubTable';

const EditableAssociationField = observer(
  (props: any) => {
    const { multiple } = props;
    const field: Field = useField();
    const form = useForm();
    const { options: collectionField, currentMode } = useAssociationFieldContext();
    const { components } = useContext(SchemaOptionsContext);
    const AssociationSelect = _.get(components, 'AlternativeAssociationSelect') || Select;

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

export const Editable = observer(
  (props) => {
    return (
      <AssociationFieldProvider>
        <EditableAssociationField {...props} />
      </AssociationFieldProvider>
    );
  },
  { displayName: 'Editable' },
);
