import { FlowNodeModel, IJob, Instruction, JOB_STATUS, Processor } from '@tachybase/module-workflow';

import { replaceContextVariables } from './tools';

export class MessageInstruction extends Instruction {
  async run(node: FlowNodeModel, input: any, processor: Processor): Promise<IJob> {
    const notifiedPerson = await parsePerson(node, processor);

    const context = processor.execution.context;
    if (notifiedPerson && notifiedPerson.length > 0) {
      const msgData = notifiedPerson.map((userId) => ({
        userId,
        title: replaceContextVariables(node.config.title || '', context),
        content: replaceContextVariables(node.config.content || '', context),
        schemaName: node.config.showMessageDetail,
        snapshot: context.data,
      }));
      for (const message of msgData) {
        this.workflow.app.messageManager.sendMessage(+message.userId, message);
      }
    }

    return {
      status: JOB_STATUS.RESOLVED,
    };
  }
}

async function parsePerson(node, processor) {
  const configPerson = processor
    .getParsedValue(node.config.notifiedPerson ?? [], node.id)
    .flat()
    .filter(Boolean);

  const notifiedPerson = new Set();
  const UserRepo = processor.options.plugin.app.db.getRepository('users');
  for (const item of configPerson) {
    if (typeof item === 'object') {
      const result = await UserRepo.find({
        ...item,
        fields: ['id'],
        transaction: processor.transaction,
      });
      result.forEach((item2) => notifiedPerson.add(item2.id));
    } else {
      notifiedPerson.add(item);
    }
  }
  return [...notifiedPerson];
}
