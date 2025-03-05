import { JOB_STATUS } from '../constants';
import { NAMESPACE } from '../locale';
import { Instruction } from './default-node/interface';

export default class extends Instruction {
  title = `{{t("End process", { ns: "${NAMESPACE}" })}}`;
  type = 'end';
  group = 'control';
  icon = 'LogoutOutlined';
  color = '#2659a1';
  description = `{{t("End the process immediately, with set status.", { ns: "${NAMESPACE}" })}}`;
  fieldset = {
    endStatus: {
      type: 'number',
      title: `{{t("End status", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      enum: [
        { label: `{{t("Succeeded", { ns: "${NAMESPACE}" })}}`, value: JOB_STATUS.RESOLVED },
        { label: `{{t("Failed", { ns: "${NAMESPACE}" })}}`, value: JOB_STATUS.FAILED },
      ],
      required: true,
      default: JOB_STATUS.RESOLVED,
    },
    remarks: {
      type: 'string',
      title: `{{t("Remarks", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        autoSize: {
          minRows: 3,
        },
        placeholder: `{{t("Input remarks", { ns: "${NAMESPACE}" })}}`,
      },
    },
  };
  end = true;
}
