import { EventSourceTrigger } from '.';

export class APIActionTrigger extends EventSourceTrigger {
  title = 'action';
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
  };
}
