import { Migration } from '@tachybase/server';

/** n个嵌套的Not Exists(Not Exists(abc)) 取出中间的abc值 */
function extractInnermost(expression) {
  let trimmed = expression.trim();

  // 正则提取 NOT EXISTS ( ... ) 的内部
  const regex = /^NOT\s+EXISTS\s*\(\s*(.+)\s*\)$/i;

  while (regex.test(trimmed)) {
    trimmed = trimmed.match(regex)[1]; // 提取括号内部分
  }

  return trimmed;
}

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<1.2.7';

  async up() {
    const repo = this.db.getRepository('applications');
    const list = await repo.find({
      filter: {
        tmpl: {
          $includes: 'Not Exists',
        },
      },
      raw: true,
    });
    if (!list.length) {
      this.app.logger.info('multi app fix tmpl 0 rows');
      return;
    }
    let count = 0;
    for (const item of list) {
      const originName = extractInnermost(item.tmpl);
      if (originName === item.tmpl) {
        continue;
      }
      await repo.update({
        filterByTk: item.name,
        values: {
          tmpl: originName,
        },
      });
      count++;
    }
    this.app.logger.info(`multi app fix tmpl ${count} rows`);
  }
}
