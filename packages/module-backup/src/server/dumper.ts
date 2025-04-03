import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import * as process from 'process';
import stream from 'stream';
import util from 'util';
import { isMainThread } from 'worker_threads';
import {
  Collection,
  CollectionGroupManager as DBCollectionGroupManager,
  DumpRulesGroupType,
} from '@tachybase/database';

import archiver from 'archiver';
import dayjs from 'dayjs';
import { default as _, default as lodash } from 'lodash';
import mkdirp from 'mkdirp';

import { AppMigrator } from './app-migrator';
import { FieldValueWriter } from './field-value-writer';
import { DUMPED_EXTENSION, humanFileSize, sqlAdapter } from './utils';

const finished = util.promisify(stream.finished);

type DumpOptions = {
  groups: Set<DumpRulesGroupType>;
  fileName?: string;
  appName?: string;
};

type BackUpStatusOk = {
  name: string;
  createdAt: Date;
  fileSize: string;
  status: 'ok';
};

type BackUpStatusDoing = {
  name: string;
  inProgress: true;
  status: 'in_progress';
};

type BackUpStatusError = {
  name: string;
  createdAt: Date;
  status: 'error';
};

export class Dumper extends AppMigrator {
  static dumpTasks: Map<string, Promise<any>> = new Map();

  direction = 'dump' as const;

  sqlContent: {
    [key: string]: {
      sql: string | string[];
      group: DumpRulesGroupType;
    };
  } = {};

  static getTaskPromise(taskId: string): Promise<any> | undefined {
    return this.dumpTasks.get(taskId);
  }

  static async getFileStatus(filePath: string): Promise<BackUpStatusOk | BackUpStatusDoing | BackUpStatusError> {
    const lockFile = filePath + '.lock';
    const fileName = path.basename(filePath);

    return fs.promises
      .stat(lockFile)
      .then((lockFileStat) => {
        if (lockFileStat.isFile()) {
          // 超过2小时认为是失败
          if (lockFileStat.ctime.getTime() < Date.now() - 2 * 60 * 60 * 1000) {
            return {
              name: fileName,
              createdAt: lockFileStat.ctime,
              status: 'error',
            } as BackUpStatusError;
          } else {
            return {
              name: fileName,
              inProgress: true,
              status: 'in_progress',
            } as BackUpStatusDoing;
          }
        } else {
          throw new Error('Lock file is not a file');
        }
      })
      .catch((error) => {
        // 如果 Lock 文件不存在，检查备份文件
        if (error.code === 'ENOENT') {
          return fs.promises.stat(filePath).then((backupFileStat) => {
            if (backupFileStat.isFile()) {
              return {
                name: fileName,
                createdAt: backupFileStat.ctime,
                fileSize: humanFileSize(backupFileStat.size),
                status: 'ok',
              } as BackUpStatusOk;
            } else {
              throw new Error('Path is not a file');
            }
          });
        }
        // 其他错误直接抛出
        throw error;
      });
  }

  static generateFileName() {
    return `backup_${dayjs().format(`YYYYMMDD_HHmmss_${Math.floor(1000 + Math.random() * 9000)}`)}.${DUMPED_EXTENSION}`;
  }

  writeSQLContent(
    key: string,
    data: {
      sql: string | string[];
      group: DumpRulesGroupType;
    },
  ) {
    this.sqlContent[key] = data;
  }

  getSQLContent(key: string) {
    return this.sqlContent[key];
  }

  async getCollectionsByDataTypes(groups: Set<DumpRulesGroupType>): Promise<string[]> {
    const dumpableCollectionsGroupByDataTypes = await this.collectionsGroupByDataTypes();

    return [...groups].reduce((acc, key) => {
      return acc.concat(dumpableCollectionsGroupByDataTypes[key] || []);
    }, []);
  }

  async dumpableCollections() {
    return (
      await Promise.all(
        [...this.app.db.collections.values()].map(async (c) => {
          try {
            const dumpRules = DBCollectionGroupManager.unifyDumpRules(c.options.dumpRules);

            const options: any = {
              name: c.name,
              title: c.options.title || c.name,
              options: c.options,
              group: dumpRules?.group,
              isView: c.isView(),
              origin: c.origin,
            };

            if (c.options.inherits && c.options.inherits.length > 0) {
              options.inherits = c.options.inherits;
            }

            return options;
          } catch (e) {
            console.error(e);
            throw new Error(`collection ${c.name} has invalid dumpRules option`, { cause: e });
          }
        }),
      )
    ).map((item) => {
      if (!item.group) {
        item.group = 'unknown';
      }

      return item;
    });
  }

  async collectionsGroupByDataTypes() {
    const grouped = lodash.groupBy(await this.dumpableCollections(), 'group');

    return Object.fromEntries(Object.entries(grouped).map(([key, value]) => [key, value.map((item) => item.name)]));
  }

  backUpStorageDir(appName?: string) {
    if (appName && appName !== 'main') {
      return path.resolve(process.cwd(), 'storage', 'backups', appName);
    }
    return path.resolve(process.cwd(), 'storage', 'backups');
  }

  async allBackUpFilePaths(options?: { includeInProgress?: boolean; dir?: string; appName?: string }) {
    const dirname = options?.dir || this.backUpStorageDir(options?.appName);
    const includeInProgress = options?.includeInProgress;

    try {
      const files = await fsPromises.readdir(dirname);

      const lockFilesSet = new Set(
        files.filter((file) => path.extname(file) === '.lock').map((file) => path.basename(file, '.lock')),
      );

      const filteredFiles = files
        .filter((file) => {
          const baseName = path.basename(file);
          const isLockFile = path.extname(file) === '.lock';
          const isDumpFile = path.extname(file) === `.${DUMPED_EXTENSION}`;

          return (includeInProgress && isLockFile) || (isDumpFile && !lockFilesSet.has(baseName));
        })
        .map(async (file) => {
          const filePath = path.resolve(dirname, file);
          const stats = await fsPromises.stat(filePath);
          return { filePath, birthtime: stats.birthtime.getTime() };
        });

      const filesData = await Promise.all(filteredFiles);

      filesData.sort((a, b) => b.birthtime - a.birthtime);

      return filesData.map((fileData) => fileData.filePath);
    } catch (error) {
      if (!error.message.includes('no such file or directory')) {
        console.error('Error reading directory:', error);
      }
      return [];
    }
  }

  backUpFilePath(fileName: string, appName?: string) {
    const dirname = this.backUpStorageDir(appName);
    return path.resolve(dirname, fileName);
  }

  lockFilePath(fileName: string, appName?: string) {
    const lockFile = fileName + '.lock';
    const dirname = this.backUpStorageDir(appName);
    return path.resolve(dirname, lockFile);
  }

  async writeLockFile(fileName: string, appName?: string) {
    const dirname = this.backUpStorageDir(appName);
    await mkdirp(dirname);

    const filePath = this.lockFilePath(fileName, appName);
    await fsPromises.writeFile(filePath, 'lock', 'utf8');
  }

  async cleanLockFile(fileName: string, appName?: string) {
    const filePath = this.lockFilePath(fileName, appName);
    await fsPromises.unlink(filePath);
  }

  async writeTempFile(options: Omit<DumpOptions, 'fileName'>) {
    const backupFileName = Dumper.generateFileName();
    await this.writeLockFile(backupFileName, options.appName);
    return backupFileName;
  }

  async runDumpTask(options: DumpOptions) {
    await this.dump({
      groups: options.groups,
      fileName: options.fileName,
      appName: options.appName,
    });
  }

  async dumpableCollectionsGroupByGroup() {
    return _(await this.dumpableCollections())
      .map((c) => _.pick(c, ['name', 'group', 'origin', 'title', 'isView', 'inherits']))
      .groupBy('group')
      .mapValues((items) => _.sortBy(items, (item) => item.name))
      .value();
  }

  async dump(options: DumpOptions) {
    const dumpingGroups = options.groups;
    dumpingGroups.add('required');

    const delayCollections = new Set();
    let backupFileName = '';
    let filePath = '';

    try {
      this.app.logger.info('Starting data backup...');
      const dumpedCollections = await this.getCollectionsByDataTypes(dumpingGroups);
      this.app.logger.info(`Backing up ${dumpedCollections.length} collections`);

      // 按批次处理集合，避免一次性加载太多数据
      const batchSize = 5; // 每批处理的集合数量
      for (let i = 0; i < dumpedCollections.length; i += batchSize) {
        const batchCollections = dumpedCollections.slice(i, i + batchSize);
        this.app.logger.info(
          `Processing batch ${Math.floor(i / batchSize) + 1}, total ${batchCollections.length} collections`,
        );

        // 使用 Promise.all 可以并行处理同一批次中的集合，但避免并行太多
        await Promise.all(
          batchCollections.map(async (collectionName) => {
            const collection = this.app.db.getCollection(collectionName);
            if (lodash.get(collection.options, 'dumpRules.delayRestore')) {
              delayCollections.add(collectionName);
            }

            return this.dumpCollection({
              name: collectionName,
            });
          }),
        );

        // 在批次之间暂停一下，让垃圾回收器有机会工作
        await new Promise((resolve) => setTimeout(resolve, 100));

        // 手动触发内存回收（如果环境支持）
        if (global.gc && typeof global.gc === 'function') {
          try {
            global.gc();
          } catch (e) {
            // 忽略GC错误
          }
        }
      }

      this.app.logger.info('Generating metadata...');
      await this.dumpMeta({
        dumpableCollectionsGroupByGroup: lodash.pick(await this.dumpableCollectionsGroupByGroup(), [...dumpingGroups]),
        dumpedGroups: [...dumpingGroups],
        delayCollections: [...delayCollections],
      });

      this.app.logger.info('Processing database special content...');
      await this.dumpDb(options);

      backupFileName = options.fileName || Dumper.generateFileName();
      this.app.logger.info(`Packaging backup file: ${backupFileName}...`);
      const result = await this.packDumpedDir(backupFileName, options.appName);
      filePath = result.filePath;

      this.app.logger.info(`Backup completed: ${filePath}`);
      return result;
    } catch (error) {
      this.app.logger.error(`Error during backup: ${error.message}`, error);

      // 如果已经创建了备份文件但未完成，尝试删除它
      if (backupFileName) {
        const backupFilePath = this.backUpFilePath(backupFileName, options.appName);
        try {
          if (fs.existsSync(backupFilePath)) {
            await fsPromises.unlink(backupFilePath);
            this.app.logger.info(`Deleted incomplete backup file: ${backupFilePath}`);
          }
        } catch (cleanupError) {
          this.app.logger.warn(`Failed to delete incomplete backup file: ${cleanupError.message}`);
        }
      }

      throw error;
    } finally {
      // 清理工作目录，释放空间
      this.app.logger.info('Cleaning up temporary work directory...');
      await this.clearWorkDir();
    }
  }

  async dumpDb(options: DumpOptions) {
    for (const collection of this.app.db.collections.values()) {
      const collectionOnDumpOption = this.app.db.collectionFactory.collectionTypes.get(
        collection.constructor as typeof Collection,
      )?.onDump;

      if (collectionOnDumpOption) {
        await collectionOnDumpOption(this, collection);
      }
    }

    if (this.hasSqlContent()) {
      const dbDumpPath = path.resolve(this.workDir, 'sql-content.json');

      await fsPromises.writeFile(
        dbDumpPath,
        JSON.stringify(
          Object.keys(this.sqlContent)
            .filter((key) => options.groups.has(this.sqlContent[key].group))
            .reduce((acc, key) => {
              acc[key] = this.sqlContent[key];
              return acc;
            }, {}),
        ),
        'utf8',
      );
    }
  }

  hasSqlContent() {
    return Object.keys(this.sqlContent).length > 0;
  }

  async dumpMeta(additionalMeta: object = {}) {
    const metaPath = path.resolve(this.workDir, 'meta');

    const metaObj = {
      version: await this.app.version.get(),
      dialect: this.app.db.sequelize.getDialect(),
      DB_UNDERSCORED: process.env.DB_UNDERSCORED,
      DB_TABLE_PREFIX: process.env.DB_TABLE_PREFIX,
      DB_SCHEMA: process.env.DB_SCHEMA,
      COLLECTION_MANAGER_SCHEMA: process.env.COLLECTION_MANAGER_SCHEMA,
      ...additionalMeta,
    };

    if (this.app.db.inDialect('postgres')) {
      if (this.app.db.inheritanceMap.nodes.size > 0) {
        metaObj['dialectOnly'] = true;
      }
    }

    if (this.hasSqlContent()) {
      metaObj['dialectOnly'] = true;
    }

    await fsPromises.writeFile(metaPath, JSON.stringify(metaObj), 'utf8');
  }

  async dumpCollection(options: { name: string }) {
    const app = this.app;
    const dir = this.workDir;
    const collectionName = options.name;
    app.logger.info(`Starting dump for collection ${collectionName}`);

    const collection = app.db.getCollection(collectionName);
    if (!collection) {
      this.app.logger.warn(`Collection ${collectionName} not found`);
      return;
    }

    const collectionOnDumpOption = this.app.db.collectionFactory.collectionTypes.get(
      collection.constructor as typeof Collection,
    )?.onDump;

    if (collectionOnDumpOption) {
      return;
    }

    // @ts-ignore
    const attributes = collection.model.tableAttributes;
    const columns: string[] = [...new Set(lodash.map(attributes, 'field'))];
    const collectionDataDir = path.resolve(dir, 'collections', collectionName);

    await fsPromises.mkdir(collectionDataDir, { recursive: true });

    let count = 0;
    const dataFilePath = path.resolve(collectionDataDir, 'data');
    const dataStream = fs.createWriteStream(dataFilePath);

    // 使用分批查询策略处理大量数据
    const batchSize = 1000; // 每批处理的记录数
    let offset = 0;
    let hasMoreRecords = true;
    let totalRecords = 0; // 记录总数，将通过处理过程中累计计算

    try {
      // 分批查询处理
      while (hasMoreRecords) {
        // 分批查询数据
        const query = sqlAdapter(
          app.db,
          `SELECT * FROM ${collection.isParent() ? 'ONLY' : ''} ${collection.quotedTableName()} LIMIT ${batchSize} OFFSET ${offset}`,
        );

        const rows = await app.db.sequelize.query(query, { type: 'SELECT' });

        if (!rows || rows.length <= 0) {
          hasMoreRecords = false;
          break;
        }

        app.logger.debug(`Processing batch for ${collectionName}: ${offset} to ${offset + rows.length}`);

        // 减少内存使用，处理一行释放一行
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const rowData = JSON.stringify(
            columns.map((col) => {
              const val = row[col];
              const field = collection.getField(col);
              return field ? FieldValueWriter.toDumpedValue(field, val) : val;
            }),
          );

          if (!dataStream.write(rowData + '\r\n', 'utf8')) {
            // 写入缓冲区已满，暂停处理，等待 'drain' 事件
            await new Promise<void>((resolve) => dataStream.once('drain', resolve));
          }

          count++;

          // 明确设置为null以帮助垃圾回收（对于大数据特别有效）
          rows[i] = null;
        }

        // 更新偏移量和总记录数
        totalRecords += rows.length;
        offset += rows.length;

        // 报告进度
        app.logger.debug(`Progress for ${collectionName}: processed ${offset} records so far`);
      }

      // 关闭数据流并等待完成
      dataStream.end();
      await finished(dataStream);

      app.logger.info(`Completed dumping collection ${collectionName}, total records: ${count}`);
    } catch (error) {
      app.logger.error(`Error dumping collection ${collectionName}: ${error.message}`, error);
      // 确保流被关闭
      dataStream.end();
      throw error;
    }

    const metaAttributes = lodash.mapValues(attributes, (attr, key) => {
      const collectionField = collection.getField(key);
      const fieldOptionKeys = ['field', 'primaryKey', 'autoIncrement', 'allowNull', 'defaultValue', 'unique'];

      if (collectionField) {
        const fieldAttributes: any = {
          field: attr.field,
          isCollectionField: true,
          type: collectionField.type,
          typeOptions: collectionField.options,
        };

        if (fieldAttributes.typeOptions?.defaultValue?.constructor?.name === 'UUIDV4') {
          delete fieldAttributes.typeOptions.defaultValue;
        }

        return fieldAttributes;
      }

      return {
        ...lodash.pick(attr, fieldOptionKeys),
        type: attr.type.constructor.toString(),
        isCollectionField: false,
        typeOptions: attr.type.options,
      };
    });

    const meta = {
      name: collectionName,
      tableName: collection.getTableNameWithSchema(),
      count,
      columns,
      attributes: metaAttributes,
    };

    if (collection.options.inherits) {
      meta['inherits'] = lodash.uniq(collection.options.inherits);
    }

    // @ts-ignore 获取 autoIncrement 信息
    const autoIncrAttr = collection.model.autoIncrementAttribute;
    if (autoIncrAttr && collection.model.rawAttributes[autoIncrAttr]?.autoIncrement) {
      const queryInterface = app.db.queryInterface;
      const autoIncrInfo = await queryInterface.getAutoIncrementInfo({
        tableInfo: {
          tableName: collection.model.tableName,
          schema: collection.collectionSchema(),
        },
        fieldName: autoIncrAttr,
      });

      meta['autoIncrement'] = {
        ...autoIncrInfo,
        fieldName: autoIncrAttr,
      };
    }

    // 写入 meta 文件
    await fsPromises.writeFile(path.resolve(collectionDataDir, 'meta'), JSON.stringify(meta), 'utf8');
  }

  async packDumpedDir(fileName: string, appName?: string) {
    const dirname = this.backUpStorageDir(appName);
    await mkdirp(dirname);

    const filePath = path.resolve(dirname, fileName);
    const output = fs.createWriteStream(filePath);

    const archive = archiver('zip', {
      zlib: { level: 9 }, // 设置最高压缩级别
    });

    // 创建一个完成承诺，在输出流关闭时解析
    const onClose = new Promise<boolean>((resolve, reject) => {
      // 使用一次性事件监听器，防止内存泄漏
      output.once('close', () => {
        this.app.logger.info('Backup file size: ' + humanFileSize(archive.pointer(), true));
        resolve(true);
      });

      output.once('end', () => {
        this.app.logger.debug('Data transfer completed');
      });

      // 一次性监听警告
      archive.once('warning', (err) => {
        if (err.code === 'ENOENT') {
          // 仅记录警告
          this.app.logger.warn('Packing warning (ENOENT):', err);
        } else {
          // 抛出其他警告作为错误
          this.app.logger.error('Packing error:', err);
          reject(err);
        }
      });

      // 一次性监听错误
      archive.once('error', (err) => {
        this.app.logger.error('Packing process error:', err);
        reject(err);
      });
    });

    try {
      // 设置归档大小限制触发事件
      const maxSize = 1024 * 1024 * 1024; // 1GB 警告阈值
      let lastReportSize = 0;
      archive.on('entry', () => {
        const currentSize = archive.pointer();
        // 每增加100MB报告一次进度
        if (currentSize - lastReportSize > 100 * 1024 * 1024) {
          this.app.logger.info(`Packing progress: ${humanFileSize(currentSize, true)}`);
          lastReportSize = currentSize;
        }

        if (currentSize > maxSize) {
          this.app.logger.warn(`Packing file has exceeded ${humanFileSize(maxSize, true)}`);
        }
      });

      // 将输出流连接到归档
      archive.pipe(output);

      // 添加整个工作目录到归档
      this.app.logger.debug(`Adding work directory ${this.workDir} to archive`);
      archive.directory(this.workDir, false);

      // 完成归档
      this.app.logger.debug('Finishing archive...');
      await archive.finalize();

      // 等待关闭事件
      await onClose;

      return {
        filePath,
        dirname,
      };
    } catch (error) {
      this.app.logger.error('Packing process error:', error);

      // 发生错误时，尝试清理资源
      try {
        // 如果归档还在运行，尝试中止
        archive.abort();
        // 关闭输出流
        output.end();

        // 如果文件已经创建但不完整，删除它
        if (fs.existsSync(filePath)) {
          await fsPromises.unlink(filePath);
          this.app.logger.info(`Deleted incomplete packing file: ${filePath}`);
        }
      } catch (cleanupError) {
        this.app.logger.error('Cleaning resources error:', cleanupError);
      }

      throw error;
    }
  }
}
