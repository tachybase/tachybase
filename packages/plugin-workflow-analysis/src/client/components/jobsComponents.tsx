import React from 'react';
import { useActionContext, useCollectionRecordData, useTranslation } from '@tachybase/client';
import { getWorkflowDetailPath, getWorkflowExecutionsPath } from '@tachybase/module-workflow/client';

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

export const jobVersionColumn = () => {
  const data = useCollectionRecordData();
  const { setVisible } = useActionContext();
  return (
    <Link to={getWorkflowDetailPath(data.node.workflowId)} onClick={() => setVisible(false)}>
      {`#${data.node.workflowId}`}
    </Link>
  );
};
