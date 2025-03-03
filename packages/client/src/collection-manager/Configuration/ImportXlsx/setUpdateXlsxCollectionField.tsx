import { useActionContext } from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { message } from 'antd';
import { cloneDeep } from 'lodash';

import { useFormValueContext } from './xlsxFormValueContextProvider';

export const setUpdateXlsxCollectionField = () => {
  const form = useForm();
  const { value, setFormValue } = useFormValueContext();
  const ctx = useActionContext();

  const handleFieldChange = (index: number, updatedField: any) => {
    const updatedFieldData = [...value];
    if (updatedField.primaryKey) {
      const existingPrimaryKey = updatedFieldData.find((field, i) => field.primaryKey === true && i !== index);

      if (existingPrimaryKey) {
        message.error(`已有主键字段: ${existingPrimaryKey.name}，请先取消其主键属性`);
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
      await handleFieldChange(index, updatedField);
    },
  };
};
