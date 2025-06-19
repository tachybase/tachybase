import { useActionContext, useCollectionRecordData, useTranslation } from '@tachybase/client';
import { getWorkflowDetailPath, getWorkflowExecutionsPath } from '@tachybase/module-workflow/client';

import { Link } from 'react-router-dom';

export const executionVersionColumn = () => {
  const { workflowId } = useCollectionRecordData();
  const { setVisible } = useActionContext();
  return (
    <Link to={getWorkflowDetailPath(workflowId)} onClick={() => setVisible(false)}>
      {`#${workflowId}`}
    </Link>
  );
};

export const ExecutionLink = () => {
  const { t } = useTranslation();
  const { id } = useCollectionRecordData();
  const { setVisible } = useActionContext();
  return (
    <Link to={getWorkflowExecutionsPath(id)} onClick={() => setVisible(false)}>
      {t('View')}
    </Link>
  );
};
