import { EventSourceTrigger } from '.';

export class APPEventTrigger extends EventSourceTrigger {
  title = `App event`;
  type = 'applicationEvent';
  description = `{{t("Application after start before start")}}`;
  options = {
    resourceName: {
      type: 'string',
      title: 'resourceName',
      'x-decorator': 'FormItem',
    },
  };
}
