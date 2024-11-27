import { Context, Next } from '@tachybase/actions';
import { Repository } from '@tachybase/database';
import { dayjs } from '@tachybase/utils';

import xlsx from 'node-xlsx';

import { EXPORT_LENGTH_MAX } from '../constants';
import render from '../renders';
import { columns2Appends } from '../utils';

export async function exportXlsx(ctx: Context, next: Next) {
  const { title, filter, sort, fields, except } = ctx.action.params;
  const { resourceName, resourceOf } = ctx.action;
  let columns = ctx.action.params.values?.columns || ctx.action.params?.columns;
  if (typeof columns === 'string') {
    columns = JSON.parse(columns);
  }
  const repository = ctx.db.getRepository<any>(resourceName, resourceOf) as Repository;
  const collection = repository.collection;
  columns = columns?.filter((col) => collection.hasField(col.dataIndex[0]) && col?.dataIndex?.length > 0);
  const appends = columns2Appends(columns, ctx);
  const count = await repository.count({
    filter,
    context: ctx,
  });
  if (count > EXPORT_LENGTH_MAX) {
    ctx.throw(400, `Too many records to export: ${count}`);
  }
  const data = await repository.find({
    filter,
    fields,
    appends,
    except,
    sort,
    context: ctx,
  });
  const collectionFields = columns.map((col) => collection.fields.get(col.dataIndex[0]));
  const { rows, ranges } = await render({ columns, fields: collectionFields, data }, ctx);
  const timezone = ctx.get('x-timezone');
  if (timezone) {
    for (const data of rows) {
      for (const key in data) {
        if (data[key] instanceof Date) {
          data[key] = dayjs(data[key]).utcOffset(timezone).format('YYYY-MM-DD HH:mm:ss');
        }
      }
    }
  }
  ctx.body = xlsx.build([
    {
      name: 'Sheet 1',
      data: rows,
      options: {
        '!merges': ranges,
      },
    },
  ]);

  ctx.set({
    'Content-Type': 'application/octet-stream',
    // to avoid "invalid character" error in header (RFC)
    'Content-Disposition': `attachment; filename=${encodeURI(title)}.xlsx`,
  });

  await next();
}
