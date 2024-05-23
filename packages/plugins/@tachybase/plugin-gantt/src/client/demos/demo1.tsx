import React from 'react';
import { Gantt, SchemaComponent, SchemaComponentProvider, useGanttBlockProps } from '@tachybase/client';

const schema = {
  type: 'object',
  properties: {
    tasks: {
      type: 'void',
      'x-component': 'Gantt',
      'x-use-component-props': 'useGanttBlockProps',
      'x-component-props': {
        tasks: [
          {
            start: new Date(2020, 0, 1),
            end: new Date(2020, 2, 2),
            name: 'Redesign website',
            id: 'Task 0',
            progress: 45,
            type: 'task',
          },
        ],
      },
    },
  },
};

export default () => {
  return <div>TODO</div>;

  return (
    <SchemaComponentProvider components={{ Gantt }} scope={{ useGanttBlockProps }}>
      <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
  );
};
