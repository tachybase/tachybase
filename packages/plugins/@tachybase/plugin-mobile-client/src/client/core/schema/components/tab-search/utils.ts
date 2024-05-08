import { dayjs } from '@tachybase/utils/client';

const canBeOptionalFields = ['select', 'multipleSelect', 'radioGroup', 'checkboxGroup'];
const canBeRelatedFields = ['oho', 'obo', 'o2m', 'm2o', 'm2m'];
const canBeDataFields = ['datetime'];

const canBeSearchFields = [
  'input',
  'textarea',
  'phone',
  'email',
  'url',
  'percent',
  'password',
  'color',
  'icon',
  'formula',
  'sequence',
];

const canBeCalculatedFields = ['integer', 'number'];

export const isTabSearchCollapsibleInputItem = (component: string) =>
  component === 'TabSearchCollapsibleInputItem' || component === 'TabSearchCollapsibleInputMItem';

export const canBeOptionalField = (_interface: string) => canBeOptionalFields.includes(_interface);
export const canBeRelatedField = (_interface: string) => canBeRelatedFields.includes(_interface);
export const canBeDataField = (_interface: string) => canBeDataFields.includes(_interface);
export const canBeSearchField = (_interface: string) => canBeSearchFields.includes(_interface);
export const canBeCalculatedField = (_interface: string) => canBeCalculatedFields.includes(_interface);

export const convertFormat = (currentDate) => {
  return dayjs(currentDate).format('YYYY-MM-DD');
};

export const changFormat = (currentDate) => {
  return JSON.stringify(dayjs(currentDate));
};
