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
      title: 'actionName',
      'x-decorator': 'FormItem',
    },
    actionNames: {
      type: 'string',
      title: 'actionNames',
      'x-decorator': 'FormItem',
    },
    actionName1: {
      type: 'string',
      title: 'actionName1',
      'x-decorator': 'FormItem',
    },
  };
}
