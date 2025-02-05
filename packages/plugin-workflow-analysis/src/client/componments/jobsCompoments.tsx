import React from 'react';
import { useActionContext, useCollectionRecordData } from '@tachybase/client';
import { getWorkflowDetailPath, getWorkflowExecutionsPath } from '@tachybase/module-workflow/client';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const jobsLink = () => {
  const { t } = useTranslation();
  const { executionId } = useCollectionRecordData();
  const { setVisible } = useActionContext();
  return (
    <Link to={getWorkflowExecutionsPath(executionId)} onClick={() => setVisible(false)}>
      {t('View')}
    </Link>
  );
};

export const jobWorkflowTitleColumn = () => {
  const { node } = useCollectionRecordData();
  const workflowTitle = node.workflow?.title;
  return <span style={{ textAlign: 'center', cursor: 'pointer' }}>{workflowTitle}</span>;
};

// export const jobNodeTitleColumn = () => {
//     const { node } = useCollectionRecordData();
//     const nodeTitle = node.title;
//     return <span style={{ textAlign: 'center', cursor: 'pointer' }}>{nodeTitle}</span>;
// };

export const jobversionColumn = () => {
  const data = useCollectionRecordData();
  const { setVisible } = useActionContext();
  return (
    <Link to={getWorkflowDetailPath(data.node.workflowId)} onClick={() => setVisible(false)}>
      {' '}
      {`#${data.node.workflowId}`}
    </Link>
  );
};
