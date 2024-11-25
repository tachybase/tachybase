import { FlowNodeModel, IJob, Instruction, InstructionResult, JOB_STATUS, Processor } from '@tachybase/module-workflow';

export async function parsePerson(node, processor) {
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

// 将类似 欢迎{{$context.roleName}} 的变量替换为实际值
// 比如欢迎{{$context.data.name}},{{$context.roleName}}  => '欢迎张三,管理员'
export function replaceContextVariables(content: string, context: any) {
  const reg = /\{\{\s*\$context\.([^{}]+)\s*\}\}/g;
  return content.replace(reg, (match, key) => {
    return context[key] || '';
  });
}

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
