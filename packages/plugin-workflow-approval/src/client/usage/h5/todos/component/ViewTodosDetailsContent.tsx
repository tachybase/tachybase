import { SchemaComponent } from '@tachybase/client';

import { useParams } from 'react-router-dom';

import { ViewActionTodosContent } from './ViewActionTodosContent';
import { ViewTodosUserJobsContent } from './ViewTodosUserJobsContent';
import { ViewTodosWorkflowNoticeContent } from './ViewTodosWorkflowNoticeContent';

export const ViewTodosDetailsContent = () => {
  const params = useParams();
  const { id, type } = params;
  const schema = {
    type: 'void',
    name: 'TabProcessedItem',
    title: 'TodosDetails',
    'x-component': component[type],
    'x-component-props': {
      id,
    },
  };

  return (
    <SchemaComponent
      schema={schema}
      components={{
        ViewActionTodosContent,
        ViewTodosUserJobsContent,
        ViewTodosWorkflowNoticeContent,
      }}
    />
  );
};

const component = {
  approvalRecords: 'ViewActionTodosContent',
  users_jobs: 'ViewTodosUserJobsContent',
  workflowNotice: 'ViewTodosWorkflowNoticeContent',
};
