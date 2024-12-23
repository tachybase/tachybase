import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { Repository } from '@tachybase/database';
import { InstallOptions, Plugin } from '@tachybase/server';
import { dayjs } from '@tachybase/utils';

import xlsx from 'node-xlsx';

import { exportXlsx } from './actions';
import { EXPORT_WORKER_PAGESIZE } from './constants';
import render from './renders';

export class ExportPlugin extends Plugin {
  beforeLoad() {}

  async load() {
    this.app.resourcer.registerActionHandler('export', exportXlsx);
    this.app.acl.setAvailableAction('export', {
      displayName: '{{t("Export")}}',
      allowConfigureFields: true,
    });
  }

  async install(options: InstallOptions) {}

  public static defaultSavePath = 'storage/uploads';

  xlsxStorageDir() {
    return path.resolve(process.cwd(), ExportPlugin.defaultSavePath);
  }

  async workerExportXlsx(params) {
    const { title, filter, sort, fields, except, appends, resourceName, resourceOf, timezone } = params;
    let columns = params?.columns || params?.columns;
    if (typeof columns === 'string') {
      columns = JSON.parse(columns);
    }
    const repository = this.db.getRepository<any>(resourceName, resourceOf) as Repository;
    const collection = repository.collection;
    columns = columns?.filter((col) => collection.hasField(col.dataIndex[0]) && col?.dataIndex?.length > 0);
    // 分页处理
    let page = 1;
    const pageSize = EXPORT_WORKER_PAGESIZE;
    let data = [];
    let hasMore = true;

    while (hasMore) {
      const pageData = await repository.find({
        filter,
        fields,
        appends,
        except,
        sort,
        offset: (page - 1) * pageSize,
        limit: pageSize,
      });

      data = data.concat(pageData);
      hasMore = pageData.length === pageSize;
      page++;
    }
    const collectionFields = columns.map((col) => collection.fields.get(col.dataIndex[0]));
    const { rows, ranges } = await render({ columns, fields: collectionFields, data, utcOffset: timezone }, this.db);
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
    const stream = xlsx.build([
      {
        name: 'Sheet 1',
        data: rows,
        options: {
          '!merges': ranges,
        },
      },
    ]);
    const savePath = this.xlsxStorageDir();
    if (!existsSync(savePath)) {
      mkdirSync(savePath, { recursive: true });
    }
    const fileName = `${resourceName}_${dayjs().format('YYYYMMDDHHmm')}.xlsx`;
    const rawFile = `${savePath}/${fileName}`;
    writeFileSync(rawFile, Buffer.from(stream));
    return `${ExportPlugin.defaultSavePath}/${fileName}`;
  }
}

export default ExportPlugin;
