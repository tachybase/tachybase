import { EventSourceTrigger } from '.';
import { NAMESPACE } from '../locale';

export class APPEventTrigger extends EventSourceTrigger {
  title = `{{t("App event", { ns: "${NAMESPACE}" })}}`;
  description = '{{t("Application after start before start")}}';
  options = {
    eventName: {
      required: true,
      type: 'string',
      title: `{{t("App event", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { label: 'afterStart', value: 'afterStart' },
        { label: 'beforeStop', value: 'beforeStop' },
      ],
    },
  };
}
