import { EventSourceTrigger } from '.';
import { NAMESPACE, tval } from '../locale';

export class ResourceEventTrigger extends EventSourceTrigger {
  constructor(title: string, description: string) {
    super();
    this.title = title;
    this.description = description;
  }
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
