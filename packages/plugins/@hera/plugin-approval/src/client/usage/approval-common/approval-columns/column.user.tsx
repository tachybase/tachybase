import { Field, observer, useField } from '@tachybase/schema';

export const UserColumn = observer(
  () => {
    const field = useField<Field>();
    const fieldValue = field?.value;

    if (fieldValue?.nickname) {
      return fieldValue.nickname;
    } else if (fieldValue?.id !== undefined) {
      return fieldValue.id;
    }
    return '';
  },
  { displayName: 'UserColumn' },
);
