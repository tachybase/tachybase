import { EventSourceTrigger } from '.';

export class APIActionTrigger extends EventSourceTrigger {
  title = 'action';
  description = 'api action,指定records:test';
  options = {
    resourceName: {
      type: 'string',
      title: 'resourceName',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    actionName: {
      type: 'string',
      title: 'actionName',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  };
}
