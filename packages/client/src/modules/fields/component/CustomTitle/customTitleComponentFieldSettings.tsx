import _ from 'lodash';

import { SchemaSettings } from '../../../../application/schema-settings/SchemaSettings';
import {
  useIsAssociationField,
  useIsFieldReadPretty,
  useIsMuiltipleAble,
  useIsSelectFieldMode,
} from '../../../../schema-component/antd/form-item/FormItem.Settings';
import { useColumnSchema } from '../../../../schema-component/antd/table-v2/Table.Column.Decorator';
import { EditFormulaTitleField, useFormulaTitleVisible } from '../../../../schema-settings';
import { useIsShowMultipleSwitch } from '../../../../schema-settings/hooks/useIsShowMultipleSwitch';
import {
  allowMultiple,
  CustomTitle,
  enableLink,
  fieldComponent,
  quickCreate,
  setDefaultSortingRules,
  setTheDataScope,
  titleField,
} from '../Select/selectComponentFieldSettings';

export const CustomTitleComponentFieldSettings = new SchemaSettings({
  name: 'fieldSettings:component:CustomTitle',
  items: [
    {
      ...fieldComponent,
      useVisible: useIsMuiltipleAble,
    },
    { ...CustomTitle, useVisible: useIsMuiltipleAble },
    {
      ...setTheDataScope,
      useVisible() {
        const isSelectFieldMode = useIsSelectFieldMode();
        const isFieldReadPretty = useIsFieldReadPretty();
        return isSelectFieldMode && !isFieldReadPretty;
      },
    },
    {
      ...setDefaultSortingRules,
      useComponentProps() {
        const { fieldSchema } = useColumnSchema();
        return {
          fieldSchema,
        };
      },
      useVisible() {
        const isSelectFieldMode = useIsSelectFieldMode();
        const isFieldReadPretty = useIsFieldReadPretty();
        return isSelectFieldMode && !isFieldReadPretty;
      },
    },
    {
      ...quickCreate,
      useVisible() {
        const isAssociationField = useIsAssociationField();
        const readPretty = useIsFieldReadPretty();
        const { fieldSchema } = useColumnSchema();
        return isAssociationField && !fieldSchema && !readPretty;
      },
    },
    {
      ...allowMultiple,
      useVisible() {
        const isAssociationField = useIsAssociationField();
        const IsShowMultipleSwitch = useIsShowMultipleSwitch();
        return isAssociationField && IsShowMultipleSwitch();
      },
    },
    {
      ...enableLink,
      useVisible() {
        const readPretty = useIsFieldReadPretty();
        return useIsAssociationField() && readPretty;
      },
    },
  ],
});
