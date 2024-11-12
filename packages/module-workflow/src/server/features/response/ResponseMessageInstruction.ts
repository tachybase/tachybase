import { JOB_STATUS } from '../../constants';
import Instruction from '../../instructions';

export class ResponseInstruction extends Instruction {
  async run(node, prevJob, processor) {
    const { httpContext } = processor.options;
    if (!httpContext.state) {
      httpContext.state = {};
    }
    if (!httpContext.state.messages) {
      httpContext.state.messages = [];
    }
    const message = processor.getParsedValue(node.config.message, node.id);
    if (message) {
      httpContext.state.messages.push({ message });
    }
    return {
      status: JOB_STATUS.RESOLVED,
      result: message,
    };
  }
}
