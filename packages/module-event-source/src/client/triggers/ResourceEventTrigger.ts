import { EventSourceTrigger } from '.';
import { NAMESPACE } from '../locale';

export class ResourceEventTrigger extends EventSourceTrigger {
  constructor(title: string) {
    super();
    this.title = title;
  }
  // title = `{{t("Resource action before/after event", { ns: "${NAMESPACE}" })}}`;
  // description = `{{t("Resource action before/after event", { ns: "${NAMESPACE}" })}}`;
  options = {
    resourceName: {
      type: 'string',
      title: `{{t("Resource name", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    actionName: {
      type: 'string',
      title: `{{t("Action name", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  };
}
