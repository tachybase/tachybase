import { Field, observer, useField } from '@tachybase/schema';

import { useTranslation } from '../../../../locale';

export const ColumnWorkflow = observer(
  () => {
    const { t } = useTranslation();
    const { value: workflow } = useField<Field>();
    const title = workflow?.title || `#${workflow?.id}`;

    if (workflow?.enabled) {
      return title;
    } else {
      return <span title={t('Disabled')}>{`${title}*`}</span>;
    }
  },
  { displayName: 'ColumnWorkflow' },
);
