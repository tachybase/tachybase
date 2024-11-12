import { Instruction } from '.';
import { JOB_STATUS } from '../constants';
import { NAMESPACE } from '../locale';

export default class extends Instruction {
  title = `{{t("End process", { ns: "${NAMESPACE}" })}}`;
  type = 'end';
  group = 'control';
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
  };
  end = true;
}
