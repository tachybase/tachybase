import Jobs from '../../collections/2-jobs';
import { JOB_STATUS } from '../../constants';
import Instruction from '../../instructions';
import Processor from '../../Processor';

export class TriggerInstruction extends Instruction {
  async run(node, input, processor: Processor) {
    const workflowKey = node.config.workflowKey;
    const wfRepo = this.workflow.db.getRepository('workflows');
    const wf = await wfRepo.findOne({ filter: { key: workflowKey, enabled: true } });
    if (wf.sync) {
      const p = await this.workflow.trigger(wf, input.result, processor.options);
      if (!p) {
        return {
          status: JOB_STATUS.FAILED,
        };
      }
      const { lastSavedJob } = p;
      return {
        status: JOB_STATUS.RESOLVED,
        result: lastSavedJob?.result,
      };
    } else {
      this.workflow.trigger(wf, input.result, {
        ...processor.options,
        parentNode: node.id,
        parent: processor.execution,
      });
      return {
        status: JOB_STATUS.PENDING,
      };
    }
  }

  async resume(node, prevJob, processor: Processor) {
    prevJob.set('result', prevJob.result);
    prevJob.set('status', prevJob.status);
    return prevJob;
  }
}
