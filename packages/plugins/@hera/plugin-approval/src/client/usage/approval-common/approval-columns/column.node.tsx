import { observer, useField, Field } from '@nocobase/schema';

export const NodeColumn = observer(
  () => {
    const field = useField<Field>();
    const fieldValue = field?.value;

    if (fieldValue?.title) {
      return fieldValue.title;
    } else if (fieldValue?.id) {
      return `#${fieldValue.id}`;
    }

    return '';
  },
  { displayName: 'NodeColumn' },
);
