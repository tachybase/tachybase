const custonComponent = {
  Input: 'MInput',
  'Input.TextArea': 'MInput.TextArea',
  'Radio.Group': 'MRadio.Group',
  'Checkbox.Group': 'MCheckbox.Group',
  'Upload.Attachment': 'MImageUploader',
  DatePicker: 'MDatePicker',
};

export const canMobileField = (componentName: string) => custonComponent[componentName];
