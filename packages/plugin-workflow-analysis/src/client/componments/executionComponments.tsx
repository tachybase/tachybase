import { useActionContext, useCollectionRecordData } from '@tachybase/client';
import { getWorkflowDetailPath } from '@tachybase/module-workflow/client';

import { Link } from 'react-router-dom';

export const executionVersionColumn = () => {
  const { workflowId } = useCollectionRecordData();
  const { setVisible } = useActionContext();
  return (
    <Link to={getWorkflowDetailPath(workflowId)} onClick={() => setVisible(false)}>
      {' '}
      {`#${workflowId}`}
    </Link>
  );
};
