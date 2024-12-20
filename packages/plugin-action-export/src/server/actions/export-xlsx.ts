import { Context, Next } from '@tachybase/actions';
import { Repository } from '@tachybase/database';
import Application from '@tachybase/server';
import { dayjs } from '@tachybase/utils';

import xlsx from 'node-xlsx';

import ExportPlugin from '..';
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
    // ctx.throw(400, `Too many records to export: ${count}`);
    const app = ctx.app as Application;
    if (!app.worker?.available) {
      ctx.throw(400, `Too many records to export: ${count} > ${EXPORT_LENGTH_MAX}`);
    }
    // 调用工作线程返回文件路径
    const fileWithPath = await app.worker.callPluginMethod({
      plugin: ExportPlugin,
      method: 'workerExportXlsx', // TODO: 这样不够优雅
      concurrency: 1,
      globalCurrency: 1,
      params: {
        title,
        filter,
        sort,
        fields,
        except,
        columns,
        resourceName,
        resourceOf,
        appends,
        timezone: ctx.get('X-Timezone'),
      },
    });
    if (!fileWithPath) {
      ctx.throw(500, 'Export failed');
    }
    ctx.body = {
      filename: `/${fileWithPath}`,
    };
    return next();
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
  const { rows, ranges } = await render(
    { columns, fields: collectionFields, data, utcOffset: ctx.get('X-Timezone') },
    ctx.db,
  );
  const timezone = ctx.get('x-timezone');
  // TODO: 合并到render中处理
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
