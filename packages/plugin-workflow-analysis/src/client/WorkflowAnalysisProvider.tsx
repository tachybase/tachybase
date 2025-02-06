import { useContext } from 'react';
import { ExtendCollectionsProvider, SchemaComponent, SchemaComponentContext } from '@tachybase/client';

import { ExecutionLink, executionVersionColumn } from './components/executionComponents';
import { jobsLink, jobVersionColumn, jobWorkflowTitleColumn } from './components/jobsComponents';
import { collectionWorkflows, ExecutionsCollection, ExecutionsPane } from './schemas/executionanalysis';
import { JobsCollection, JobsPane, nodesCollection, workflowCollection } from './schemas/jobanalysis';

export function ExecutionsProvider() {
  const ctx = useContext(SchemaComponentContext);
  return (
    <ExtendCollectionsProvider collections={[ExecutionsCollection, collectionWorkflows]}>
      <SchemaComponentContext.Provider value={{ ...ctx, designable: false }}>
        <SchemaComponent
          schema={ExecutionsPane}
          components={{
            ExecutionLink,
            executionVersionColumn,
          }}
          scope={{}}
        />
      </SchemaComponentContext.Provider>
    </ExtendCollectionsProvider>
  );
}

export function JobsProvider() {
  const ctx = useContext(SchemaComponentContext);
  return (
    <ExtendCollectionsProvider collections={[JobsCollection, nodesCollection, workflowCollection]}>
      <SchemaComponentContext.Provider value={{ ...ctx, designable: false }}>
        <SchemaComponent
          schema={JobsPane}
          components={{
            jobsLink,
            jobVersionColumn,
            jobWorkflowTitleColumn,
          }}
          scope={{}}
        />
      </SchemaComponentContext.Provider>
    </ExtendCollectionsProvider>
  );
}
