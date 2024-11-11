import { JOB_STATUS } from '../../constants';
import Instruction from '../../instructions';

export class VariablesInstruction extends Instruction {
  async run(node, prevJob, processor) {
    const { target, value } = node.config;
    const result = processor.getParsedValue(value, node.id);
    if (target) {
      const targetNode = processor.nodes.find((item) => item.key === target);
      if (!targetNode) {
        throw new Error(`target node by key "${target}" is not found`);
      }
      await processor.saveJob({
        status: JOB_STATUS.RESOLVED,
        result,
        nodeId: targetNode.id,
        nodeKey: target,
        upstreamId: (prevJob && prevJob.id) || null,
      });
    }
    return {
      status: JOB_STATUS.RESOLVED,
      result,
    };
  }
}
