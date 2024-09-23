import fsPromises from 'fs/promises';
import os from 'os';
import { Readable } from 'stream';
import { Context } from '@tachybase/actions';
import { ResourceOptions } from '@tachybase/resourcer';
import { koaMulter as multer, uid } from '@tachybase/utils';

import lodash from 'lodash';

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
        const meta = await Collections.repository.findOne({
          filterByTk: name,
          context: ctx,
          appends: ['category', 'fields'],
        });
        if (!meta) {
          return;
        }
        metaList.push(meta);
        const fields = meta.dataValues.fields;
        for (const field of fields) {
          ctx.logger.info('field.dataValues', field.dataValues);
          if (field?.dataValues?.options?.target) {
            await getAssociationCollection(field?.dataValues?.options?.target);
          }
        }
      }

      await getAssociationCollection(collectionName);

      ctx.body = metaList;
      await next();
    },
    async importMeta(ctx: Context, next) {
      const { file } = ctx;
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

      async function importCollection(meta) {
        const CollectionRepo = ctx.db.getCollection('collections');
        // 检查表是否存在
        let collection = await CollectionRepo.repository.findOne({
          filterByTk: meta.name,
          context: ctx,
        });
        if (collection) {
          return;
          throw new Error('collection name already exists, please change the name');
        }
        collection = await CollectionRepo.repository.findOne({
          filter: { key: meta.key },
          context: ctx,
        });
        if (collection) {
          return;
          throw new Error('collection key already exists, please change the key');
        }

        // generate unique key
        // meta.fields.forEach((field) => {
        //   field.key = uid();
        // });

        // 检查field是否已经存在
        const fieldRepo = ctx.db.getCollection('fields');
        const fieldKeys = meta.fields.map((field) => field.key);

        const existFields = await fieldRepo.repository.findOne({
          filter: { key: { $in: fieldKeys } },
          context: ctx,
        });
        if (existFields) {
          return;
          throw new Error('field key already exists, please change the key');
        }

        await CollectionRepo.repository.create({
          values: meta,
          context: ctx,
        });
        createCount++;
      }

      for (const meta of metaList) {
        await importCollection(meta);
      }

      if (!createCount) {
        throw new Error('no collection created, please check the key or name');
      }

      ctx.body = { count: createCount };
      await next();
    },
  },
};
