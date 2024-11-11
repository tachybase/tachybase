import * as executions from './executions';
import * as nodes from './nodes';
import * as workflows from './workflows';

function make(name, mod) {
  return Object.keys(mod).reduce(
    (result, key) => ({
      ...result,
      [`${name}:${key}`]: mod[key],
    }),
    {},
  );
}

export default function ({ app }) {
  app.actions({
    ...make('workflows', workflows),
    ...make('workflows.nodes', {
      create: nodes.create,
    }),
    ...make('flow_nodes', {
      update: nodes.update,
      destroy: nodes.destroy,
    }),
    ...make('executions', executions),
  });
}
