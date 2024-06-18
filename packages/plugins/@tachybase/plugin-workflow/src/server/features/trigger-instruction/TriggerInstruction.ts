import { JOB_STATUS } from '../../constants';
import Instruction from '../../instructions';

export class TriggerInstruction extends Instruction {
  async run(node, input, processor) {
    const workflowKey = node.config.workflowKey;
    const wfRepo = this.workflow.db.getRepository('workflows');
    const wf = await wfRepo.findOne({ filter: { key: workflowKey, enabled: true } });
    const p = await this.workflow.trigger(wf, { data: 'not-support' });
    if (!p) {
      return {
        status: JOB_STATUS.FAILED,
      };
    }
    const { lastSavedJob } = processor;
    return {
      status: JOB_STATUS.RESOLVED,
      result: lastSavedJob.result,
    };
  }
}
