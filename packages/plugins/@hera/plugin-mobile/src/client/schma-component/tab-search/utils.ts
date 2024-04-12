const canBeOptionalFields = ['select', 'multipleSelect', 'radioGroup', 'checkboxGroup'];
const canBeRelatedFields = ['oho', 'obo', 'o2m', 'm2o', 'm2m'];

const canBeSearchFields = [
  'input',
  'textarea',
  'phone',
  'email',
  'url',
  'integer',
  'number',
  'percent',
  'password',
  'color',
  'icon',
  'formula',
];

export const isTabSearchCollapsibleInputItem = (component: string) =>
  component === 'TabSearchCollapsibleInputItem' || component === 'TabSearchCollapsibleInputMItem';

export const canBeOptionalField = (_interface: string) => canBeOptionalFields.includes(_interface);
export const canBeRelatedField = (_interface: string) => canBeRelatedFields.includes(_interface);

export const canBeSearchField = (_interface: string) => canBeSearchFields.includes(_interface);
