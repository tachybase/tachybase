import { EventSourceTrigger } from '.';
import { NAMESPACE } from '../locale';

export class CustomActionTrigger extends EventSourceTrigger {
  title = `{{t("Custom resource action", { ns: "${NAMESPACE}" })}}`;
  description = '{{t("api接口,用于指定自定义请求")}}';
  options = {
    resourceName: {
      type: 'string',
      title: 'Resource name',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    actionName: {
      type: 'string',
      title: 'Action name',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  };
}
