import { useForm } from '@tachybase/schema';

import { message } from 'antd';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

import { useActionContext } from '../../../schema-component';
import { useFormValueContext } from './xlsxFormValueContextProvider';

export const setUpdateXlsxCollectionField = () => {
  const form = useForm();
  const { value, setFormValue } = useFormValueContext();
  const ctx = useActionContext();

  const handleFieldChange = (index: number, updatedField: any) => {
    const { t } = useTranslation();
    const updatedFieldData = [...value];
    if (updatedField.primaryKey) {
      const existingPrimaryKey = updatedFieldData.find((field, i) => field.primaryKey === true && i !== index);

      if (existingPrimaryKey) {
        message.error(t('existingPrimaryKeyError', { name: existingPrimaryKey.name }));
        return;
      }
    }
    updatedFieldData[index] = updatedField;
    setFormValue(updatedFieldData);
    ctx.setVisible(false);
  };

  return {
    async onClick() {
      await form.submit();
      const values = cloneDeep(form.values);
      if (values.autoCreateReverseField) {
      } else {
        delete values.reverseField;
      }
      delete values.autoCreateReverseField;
      const { index, ...updatedField } = values;
      if (index < 0 || index >= value.length) {
        message.error('Invalid field index');
        return;
      }
      await handleFieldChange(index, updatedField);
    },
  };
};
