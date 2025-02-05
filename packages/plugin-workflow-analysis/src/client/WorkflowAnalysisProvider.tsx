import { useContext } from 'react';
import { ExtendCollectionsProvider, SchemaComponent, SchemaComponentContext } from '@tachybase/client';
import { ExecutionLink } from '@tachybase/module-workflow/client';

import { jobsLink, jobversionColumn, jobWorkflowTitleColumn } from './componments/jobsCompoments';
import { ExecutionsCollection, ExecutionsPane } from './schemas/executionanalysis';
import { JobsCollection, JobsPane, nodesCollection, workflowCollection } from './schemas/jobanalysis';

export function ExecutionsProvider() {
  return (
    <ExtendCollectionsProvider collections={[ExecutionsCollection]}>
      <SchemaComponent
        schema={ExecutionsPane}
        components={{
          ExecutionLink,
        }}
        scope={{}}
      />
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
            jobversionColumn,
            jobWorkflowTitleColumn,
          }}
          scope={{}}
        />
      </SchemaComponentContext.Provider>
    </ExtendCollectionsProvider>
  );
}
