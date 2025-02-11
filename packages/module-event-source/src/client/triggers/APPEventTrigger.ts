import { EventSourceTrigger } from '.';
import { NAMESPACE, tval } from '../locale';

export class APPEventTrigger extends EventSourceTrigger {
  title = tval('App event');
  description = tval(
    'Application-related events, such as beforeStop: before the application stops, afterStart: after the application starts',
  );
  options = {
    eventName: {
      required: true,
      type: 'string',
      title: tval('Event name'),
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      // FIXME: 兼容相同eventName导致的bug
      'x-reactions': [
        '{{(field) => { const collection = field.query("options.collection").get("value"); const event = field.query("options.collectionEvent").get("value"); field.value = `${collection || ""}.${event || ""}`; }}}',
      ],
    },
  };
}
