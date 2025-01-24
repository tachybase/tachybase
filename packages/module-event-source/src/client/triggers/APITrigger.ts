import { EventSourceTrigger } from '.';

export class APITrigger extends EventSourceTrigger {
  title = 'resource';
  options = {
    resourceName: {
      type: 'string',
      title: 'resourceName',
      'x-decorator': 'FormItem',
    },
    actionName: {
      type: 'string',
      title: 'resourceName',
      'x-decorator': 'FormItem',
    },
  };
}
