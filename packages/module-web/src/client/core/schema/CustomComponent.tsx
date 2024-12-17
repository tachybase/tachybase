const customComponent = {
  Input: 'MInput',
  'Input.TextArea': 'MInput.TextArea',
  'Radio.Group': 'MRadio.Group',
  'Checkbox.Group': 'MCheckbox.Group',
  'Upload.Attachment': 'MImageUploader',
  DatePicker: 'MDatePicker',
  Select: 'MSelect',
  Cascader: 'MCascader',
};

export const canMobileField = (componentName: string) => customComponent[componentName];
