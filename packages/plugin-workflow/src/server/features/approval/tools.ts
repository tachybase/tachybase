import _ from 'lodash';

interface ParamsType {
  summaryConfig: Array<string>;
  data: object;
}

export function getSummary(params: ParamsType): object {
  const { summaryConfig = [], data } = params;

  const result = summaryConfig.reduce((summary, key) => {
    const value = _.get(data, key);
    const realValue = Object.prototype.toString.call(value) === '[object Object]' ? value?.['name'] : value;
    return {
      ...summary,
      [key]: realValue,
    };
  }, {});

  return result;
}

export async function parsePerson({ node, processor, keyName }) {
  const configPerson = processor
    .getParsedValue(node.config?.[keyName] ?? [], node.id)
    .flat()
    .filter(Boolean);

  const targetPerson = new Set();
  const UserRepo = processor.options.plugin.app.db.getRepository('users');
  for (const item of configPerson) {
    if (typeof item === 'object') {
      const users = await UserRepo.find({
        ...item,
        fields: ['id'],
        transaction: processor.transaction,
      });
      users.forEach((userData) => targetPerson.add(userData.id));
    } else {
      targetPerson.add(item);
    }
  }
  return [...targetPerson];
}
