import { FlowNodeModel, IJob, Instruction, InstructionResult, JOB_STATUS, Processor } from '@tachybase/module-workflow';

export class MessageInstruction extends Instruction {
  async run(node: FlowNodeModel, input: any, processor: Processor): Promise<IJob> {
    console.log('my instruction runs!');

    const msgRepo = node.db.getRepository('messages');

    await msgRepo.create({
      values: {
        title: 'testing',
        content: 'testing',
      },
    });

    return {
      status: JOB_STATUS.RESOLVED,
    };
  }
}
