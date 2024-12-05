import { Context } from '@tachybase/actions';
import { Cache } from '@tachybase/cache';
import { FilterParser, Repository } from '@tachybase/database';
import { CollectionRepository } from '@tachybase/plugin-collection-manager';
import { Action, Controller, Inject } from '@tachybase/utils';

import { SqlLoader, SystemSettingService } from '@hera/plugin-core';
import { stringify } from 'flatted';
import getStream from 'get-stream';
import _ from 'lodash';
import { QueryTypes } from 'sequelize';

import { Movement } from '../../utils/constants';
import { RecordPdfService } from '../services/record-pdf-service';

@Controller('records')
export class RecordPreviewController {
  @Inject(() => SqlLoader)
  private sqlLoader: SqlLoader;

  @Inject(() => SystemSettingService)
  private systemSetting: SystemSettingService;

  @Inject(() => RecordPdfService)
  private recordPdfService: RecordPdfService;

  async groupWeight(ctx: Context) {
    const { filter } = ctx.action.params.values;
    const collectionName = 'records';
    const collection = ctx.db.getCollection(collectionName);
    const fields = collection.fields;
    const filterParser = new FilterParser(filter, {
      collection,
    });
    const { sequelize } = ctx.db;
    const { where, include } = filterParser.toSequelizeParams();
    const parsedFilterInclude =
      include?.map((item) => {
        if (fields.get(item.association)?.type === 'belongsToMany') {
          item.through = { attributes: [] };
        }
        return item;
      }) || [];
    const query = {
      where: where || {},
      attributes: [
        [sequelize.fn('sum', sequelize.col('records.weight')), 'weight'],
        [sequelize.col('records.movement'), 'movement'],
      ],
      group: [sequelize.col('records.movement')],
      include: [...parsedFilterInclude],
      order: [],
      subQuery: false,
      raw: true,
    } as any;
    const records = await ctx.db.getModel('records').findAll(query);
    const inNum = records.find((item) => item.movement === Movement.in)?.weight ?? 0;
    const outNum = records.find((item) => item.movement === Movement.out)?.weight ?? 0;
    const data = {
      labels: ['名称', '出库数量（吨）', '入库数量（吨）', '小计（吨）'],
      values: [['实际重量（吨）', outNum, inNum, inNum - outNum]],
    };
    ctx.body = data;
  }

  async printPreview(ctx: Context) {
    const {
      params: { recordId, isDouble, settingType, margingTop, styleId = -1 },
    } = ctx.action;
    // 拉侧面文字说明
    const pdfExplain = await ctx.db.getRepository('basic_configuration').find();
    // 租金数据
    const leaseData = await ctx.db.sequelize.query(this.sqlLoader.sqlFiles['pdf_record_lease'], {
      replacements: {
        recordId,
      },
      type: QueryTypes.SELECT,
    });
    // 记录单数据
    const records = await ctx.db.sequelize.query(this.sqlLoader.sqlFiles['pdf_record'], {
      replacements: {
        recordId,
      },
      type: QueryTypes.SELECT,
    });
    const record = records[0] as any;
    // 拉标题
    const systemSetting = await this.systemSetting.get();
    record.systemTitle = systemSetting?.title || '异常数据，请联系相关负责人！';
    const userID = record.createdById || record.updatedById;
    const user = await ctx.db.getRepository('users').findOne({ filter: { id: userID } });
    record.nickname = user?.nickname || '';
    record.userPhone = user?.phone || '';
    record.pdfExplain = pdfExplain[0]?.out_of_storage_explain;
    if (Number(margingTop)) {
      record.margingTop = Number(margingTop);
    } else {
      // 查询当前用户信息
      const currentUser = await ctx.db.getRepository('users').findOne({ filter: { id: ctx.state.currentUser.id } });
      record.margingTop = Number(currentUser?.pdf_top_margin) || 0;
    }

    // 费用数据
    const feeData = await ctx.db.sequelize.query(this.sqlLoader.sqlFiles['pdf_record_fee'], {
      replacements: {
        recordId,
      },
      type: QueryTypes.SELECT,
    });
    // 订单打印选项
    const printSetup =
      settingType === '0' || settingType === '1' || settingType === '2'
        ? settingType
        : pdfExplain[0]?.record_print_setup;
    const double = isDouble === '0' || isDouble === '1' ? isDouble : pdfExplain[0].record_columns;

    const cache = ctx.app.cacheManager.getCache('@hera/plugin-rental') as Cache;
    const key = stringify({
      record,
      leaseData,
      feeData,
      settings: { isDouble: double, printSetup, styleId: Number(styleId) },
    });

    const result = await cache.get(key);
    if (result) {
      if (Buffer.isBuffer(result)) {
        ctx.body = result;
      } else {
        // @ts-ignore
        ctx.body = Buffer.from(result.data);
      }
    } else {
      const buf = await getStream.buffer(
        // @ts-ignore
        await this.recordPdfService.transformPdfV2(record, leaseData, feeData, {
          isDouble: double,
          printSetup,
          styleId: Number(styleId),
        }),
      );
      ctx.body = buf;
      await cache.set(key, buf);
    }
  }

  @Action('unused')
  async unusedRecords(ctx: Context) {
    const repo = ctx.db.getRepository<CollectionRepository>('collections');
    const record = await repo.findOne({ filter: { name: 'records' }, appends: ['fields'] });
    const numberField = record.fields.find((field) => field.name === 'number');
    const seqRepo = ctx.db.getRepository<Repository>('sequences');
    const sequence = await seqRepo.findOne({
      filter: {
        collection: 'records',
        field: 'number',
        key: numberField.options.patterns[0].options.key,
      },
    });
    const current = sequence.current;
    // 找从 200000 到 current 中有哪个没有的
    const recordsRepo = ctx.db.getRepository<Repository>('records');
    const records = await recordsRepo.find({
      fields: ['number'],
    });
    const shouldBe = Array(current - 200001)
      .fill(0)
      .map((_, i) => 200001 + i);
    const numbers = records.map((record) => Number(record.number));
    ctx.body = _.difference(shouldBe, numbers);
  }
}
