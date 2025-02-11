import { EventSourceTrigger } from '.';
import { NAMESPACE, tval } from '../locale';

export class CustomActionTrigger extends EventSourceTrigger {
  title = tval('Custom resource action');
  description = tval('for creating custom requests, try not to duplicate with other requests');
  options = {
    resourceName: {
      type: 'string',
      title: tval('Resource name'),
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    actionName: {
      type: 'string',
      title: tval('Action name'),
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    triggerOnAssociation: {
      type: 'boolean',
      title: tval('Trigger on association'),
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
    },
  };
}
