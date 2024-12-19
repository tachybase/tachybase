import { FlowNodeModel, IJob, Instruction, JOB_STATUS, Processor } from '@tachybase/module-workflow';

import { replaceContextVariables } from './tools';

export class MessageInstruction extends Instruction {
  async run(node: FlowNodeModel, input: any, processor: Processor): Promise<IJob> {
    const notifiedPersonList = await parsePerson(node, processor);

    const context = processor.execution.context;
    if (notifiedPersonList && notifiedPersonList.length > 0) {
      const msgDataPromises = notifiedPersonList.map(async (userId) => {
        const title = await replaceContextVariables(
          node.config.title || '',
          {
            nodeId: node.id,
            userId,
          },
          processor,
        );
        const content = await replaceContextVariables(
          node.config.content || '',
          {
            nodeId: node.id,
            userId,
          },
          processor,
        );
        return {
          userId,
          title,
          content,
          schemaName: node.config.showMessageDetail,
          snapshot: context.data,
        };
      });

      const msgData = await Promise.all(msgDataPromises);

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
