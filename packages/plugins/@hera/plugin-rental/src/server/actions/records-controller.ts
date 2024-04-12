import { Context } from '@nocobase/actions';
import { QueryTypes, Op } from 'sequelize';
import { RecordPdfService } from '../services/record-pdf-service';
import { SystemSettingService, SqlLoader } from '@hera/plugin-core';
import { Action, Controller, Inject } from '@nocobase/utils';
import { Movement } from '../../utils/constants';
import _ from 'lodash';
import { FilterParser, Repository } from '@nocobase/database';
import { CollectionRepository } from '@nocobase/plugin-collection-manager';
@Controller('records')
export class RecordPreviewController {
  @Inject(() => SqlLoader)
  private sqlLoader: SqlLoader;

  @Inject(() => SystemSettingService)
  private systemSetting: SystemSettingService;

  @Inject(() => RecordPdfService)
  private recordPdfService: RecordPdfService;

  @Action('group')
  async group(ctx: Context) {
    const { collection: collectionName, filter } = ctx.action.params.values;
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
        [sequelize.fn('sum', sequelize.col('items.count')), 'count'],
        [sequelize.col('items.product_id'), 'product_id'],
        [sequelize.col('records.movement'), 'movement'],
      ],
      include: [
        {
          association: 'items',
          attributes: [],
        },
        ...parsedFilterInclude,
      ],
      group: [sequelize.col('items.product_id'), sequelize.col('records.movement')],
      order: [],
      subQuery: false,
      raw: true,
    } as any;
    const records = await ctx.db.getModel('records').findAll(query);
    if (records) {
      const allProducts = await ctx.db.getRepository('product').find({ appends: ['category'] });
      if (!allProducts) return;
      const items = {} as { [key: string]: { name: string; sort: number; out: number; in: number; total: number } };
      records.forEach((item) => {
        const product = allProducts.find((p) => p.id === item?.product_id);
        if (!product) return;
        if (!items[product.name]) {
          items[product.name] = {
            name: product.name,
            sort: product.category.sort,
            out: 0,
            in: 0,
            total: 0,
          };
        }
        const count = product.category.convertible ? item.count * product.ratio : item.count;
        if (item.movement === Movement.in) {
          items[product.name].in += count;
          items[product.name].total += count;
        } else {
          items[product.name].out += count;
          items[product.name].total -= count;
        }
      });
      const result = {
        labels: ['名称', '出库数量', '入库数量', '小计'],
        values: [],
      };
      _.toArray(items)
        .sort((a, b) => a.sort - b.sort)
        .forEach((item) => result.values.push([item.name, item.out, item.in, item.total]));
      ctx.body = { ...result };
    }
  }
  @Action('allweight')
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
  @Action('allprice')
  async groupPrice(ctx: Context) {
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
        [sequelize.fn('sum', sequelize.col('records.all_price')), 'all_price'],
        [sequelize.col('records.movement'), 'movement'],
      ],
      group: [sequelize.col('records.movement')],
      include: [...parsedFilterInclude],
      order: [],
      subQuery: false,
      raw: true,
    } as any;
    const records = await ctx.db.getModel('records').findAll(query);

    const inNum = records.find((item) => item.movement === Movement.in)?.all_price ?? 0;
    const outNum = records.find((item) => item.movement === Movement.out)?.all_price ?? 0;
    const data = {
      labels: ['名称', '收入', '支出', '小计'],
      values: [['总金额', outNum, inNum, outNum - inNum]],
    };
    ctx.body = data;
  }

  /**
   * 注意点
   * 1. 正常租赁产品
   * 2. 租赁产品的维修赔偿
   * 3. 无关联产品的维修赔偿（实际总重量，出入库量）
   * 4. 无关联产品的维修赔偿（人工录入
   * 5. 报价
   */
  @Action('pdf')
  async printPreview(ctx: Context) {
    const {
      params: { recordId: id, isDouble, settingType, margingTop },
    } = ctx.action;
    // 查询合同订单中间表，获得订单id，合同id，出入库信息
    const intermediate = await ctx.db.getRepository('new_contract').findOne({ filter: { id } });
    const recordId = intermediate.record_id;
    // 订单基本数据
    const baseRecord = await ctx.db.getRepository('records').findOne({
      filter: { id: recordId },
      appends: [
        'vehicles',
        'in_stock',
        'in_stock.company',
        'in_stock.contacts',
        'out_stock',
        'out_stock.company',
        'out_stock.contacts',
      ],
    });
    const userID = baseRecord.createdById || baseRecord.updatedById;
    const user = await ctx.db.getRepository('users').findOne({ filter: { id: userID } });
    baseRecord.nickname = user?.nickname || '';
    baseRecord.userPhone = user?.phone || '';
    // 拉侧面文字说明
    const pdfExplain = await ctx.db.getRepository('basic_configuration').find();
    baseRecord.pdfExplain = pdfExplain[0]?.out_of_storage_explain;
    // 租金数据
    const leaseData: any = await ctx.db.sequelize.query(this.sqlLoader.sqlFiles['pdf_record_product_item'], {
      replacements: {
        recordId,
      },
      type: QueryTypes.SELECT,
    });
    // 租金赔偿数据
    const leaseFeeData: any = await ctx.db.sequelize.query(this.sqlLoader.sqlFiles['pdf_record_product_fee_item'], {
      replacements: {
        recordId,
      },
      type: QueryTypes.SELECT,
    });
    // 合同基本数据
    const contracts = await ctx.db.getRepository('contracts').findOne({
      filter: {
        id: intermediate.contract_id,
      },
      appends: ['first_party', 'first_party.projects', 'party_b', 'party_b.projects'],
    });
    contracts.movement = intermediate.movement;
    // 合同方案数据
    const contractPLan = await ctx.db.getRepository('contract_items').findOne({
      filter: {
        contract_id: intermediate.contract_id,
        start_date: { [Op.lte]: baseRecord.date },
        end_date: { [Op.gte]: baseRecord.date },
      },
      appends: [
        'contract_plan',
        'contract_plan.lease_items',
        'contract_plan.lease_items.new_porducts',
        'contract_plan.lease_items.conversion_logic',
        'contract_plan.lease_items.conversion_logic.weight_items',
        'contract_plan.lease_items.fee_items',
        'contract_plan.lease_items.fee_items.conversion_logic',
        'contract_plan.lease_items.fee_items.conversion_logic.weight_items',
        'contract_plan.fee_items',
        'contract_plan.fee_items.new_fee_products',
        'contract_plan.fee_items.conversion_logic',
        'contract_plan.fee_items.conversion_logic.weight_items',
      ],
    });
    const double = isDouble === '0' || isDouble === '1' ? isDouble : pdfExplain[0].record_columns;
    const printSetup =
      settingType === '0' || settingType === '1' || settingType === '2'
        ? settingType
        : pdfExplain[0]?.record_print_setup;

    ctx.body = await this.recordPdfService.transformPdfV2(
      intermediate,
      contractPLan,
      baseRecord,
      leaseData,
      leaseFeeData,
      contracts,
      { isDouble: double, printSetup },
    );
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
