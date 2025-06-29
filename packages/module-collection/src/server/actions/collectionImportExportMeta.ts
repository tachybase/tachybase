import fsPromises from 'node:fs/promises';
import os from 'node:os';
import { Context } from '@tachybase/actions';
import { ResourceOptions } from '@tachybase/resourcer';
import { koaMulter as multer, uid } from '@tachybase/utils';

export const collectionImportExportMeta: ResourceOptions = {
  name: 'collections',
  middleware: async (ctx, next) => {
    if (ctx.action.actionName === 'importMeta') {
      const storage = multer.diskStorage({
        destination: os.tmpdir(),
        filename: function (req, file, cb) {
          const randomName = Date.now().toString() + Math.random().toString().slice(2); // 随机生成文件名
          cb(null, randomName);
        },
      });

      const upload = multer({ storage }).single('file');
      return upload(ctx, next);
    } else {
      return next();
    }
  },
  actions: {
    async exportMeta(ctx: Context, next) {
      // todo: define property name;
      const { collectionName } = ctx.action.params;

      const Collections = ctx.db.getCollection('collections');

      const metaList = [];

      async function getAssociationCollection(name: string) {
        if (metaList.some((item) => item.name === name)) {
          return;
        }
        const metaRecord = await Collections.repository.findOne({
          filterByTk: name,
          context: ctx,
          appends: ['category', 'fields'],
        });
        if (!metaRecord) {
          return;
        }
        const meta = metaRecord.toJSON();
        if (meta.inherits) {
          for (const inherit of meta.inherits) {
            await getAssociationCollection(inherit);
          }
        }
        if (meta.view) {
          const collection = ctx.db.getCollection(meta.viewName);
          const viewDef = await ctx.db.queryInterface.viewDef(collection.getTableNameWithSchemaAsString());
          const viewSql = [
            `DROP VIEW IF EXISTS ${collection.getTableNameWithSchemaAsString()}`,
            `CREATE VIEW ${collection.getTableNameWithSchemaAsString()} AS ${viewDef}`,
          ];
          meta.viewSql = viewSql;
        }
        metaList.push(meta);
        const fields = meta.fields;
        for (const field of fields) {
          if (field?.options?.target) {
            await getAssociationCollection(field?.options?.target);
          }
        }
      }

      await getAssociationCollection(collectionName);

      ctx.body = metaList;
      await next();
    },
    async importMeta(ctx: Context, next) {
      const { file } = ctx;
      const category = ((ctx.request as any).body as { category?: string })?.category;
      if (!file) {
        throw new Error('file not found');
      }

      let metaList = null;
      try {
        metaList = JSON.parse(await fsPromises.readFile(file.path, 'utf8'));
      } catch (e) {
        ctx.logger.info(e);
        throw new Error('file is not a valid json file');
      }

      let createCount = 0;
      const reverseKeys = [];
      // 检查field是否已经存在
      const fieldRepo = ctx.db.getCollection('fields');

      // old name => new name
      const collectionNameMap = {};
      const completedCollections = new Set();

      const existCollections = await ctx.db.getCollection('collections').repository.find({
        filter: {
          $or: {
            name: { $in: metaList.map((item) => item.name) },
            key: { $in: metaList.map((item) => item.key) },
          },
        },
        context: ctx,
      });

      const allFieldKeys = [];
      for (const meta of metaList) {
        allFieldKeys.push(...meta.fields.map((item) => item.key));
      }

      const views = [];
      const CollectionRepo = ctx.db.getCollection('collections');

      async function importCollection(meta) {
        if (!meta) {
          return;
        }
        if (completedCollections.has(meta.name)) {
          return;
        }
        if (meta.inherits && meta.inherits.length > 0) {
          for (const inherit of meta.inherits) {
            if (!completedCollections.has(inherit)) {
              const inheritCollection = metaList.find((v) => v.name === inherit);
              await importCollection(inheritCollection);
            }
          }
        }
        let collection = existCollections.find((v) => v.key === meta.key);
        // key和name完全相同的两个collection, 出现重复
        if (collection && collection.name === meta.name) {
          completedCollections.add(collection.name);
          return;
        }

        // key一样 name不一样则需要生成新的key
        if (collection && collection.name !== meta.name) {
          meta.key = uid();
          return;
        } else {
          collection = existCollections.find((v) => v.name === meta.name);
          if (collection) {
            // 重复导入则放过
            collection.name = `t_${uid()}`;
            collectionNameMap[meta.name] = collection.name;
            meta.name = collection.name;
            // if (meta.category && meta.category.length) {
            //   meta.category.forEach((v) => {
            //     v.collectionCategory.collectionName = collection.name;
            //   });
            // }
          }
        }

        const normalFieldKeys = [];
        if (meta.fields) {
          for (const field of meta.fields) {
            if (!field.reverseKey) {
              if (field.collectionName && collectionNameMap[field.collectionName]) {
                field.collectionName = collectionNameMap[field.collectionName];
              }
              if (field.target && collectionNameMap[field.target]) {
                field.target = collectionNameMap[field.target];
              }
              normalFieldKeys.push(field);
            } else if (!reverseKeys.some((v) => v === field.key || v === field.reverseKey)) {
              reverseKeys.push({ ...field, collectionName: meta.key });
            }
          }
          meta.fields = normalFieldKeys;
        }

        // 视图
        if (meta.view) {
          views.push(meta);
          return;
        }
        if (category) {
          meta.category = {
            id: +category,
          };
        }
        await CollectionRepo.repository.create({
          values: meta,
          context: ctx,
        });
        completedCollections.add(meta.name);
        createCount++;
      }

      for (const meta of metaList) {
        await importCollection(meta);
      }

      for (const meta of views) {
        if (!meta.viewSql || !meta.viewSql.length) {
          continue;
        }
        for (const sql of meta.viewSql) {
          await ctx.db.sequelize.query(sql);
        }
        await CollectionRepo.repository.create({
          values: meta,
          context: ctx,
        });
        createCount++;
      }

      for (const reverseKey of reverseKeys) {
        await fieldRepo.repository.create(reverseKey);
      }

      if (!createCount) {
        throw new Error('no collection created, please check the name');
      }

      ctx.body = { count: createCount };
      await next();
    },
  },
};
