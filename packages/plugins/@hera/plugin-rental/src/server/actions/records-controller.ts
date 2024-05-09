import { Context } from '@tachybase/actions';
import { QueryTypes } from 'sequelize';
import { RecordPdfService } from '../services/record-pdf-service';
import { SystemSettingService, SqlLoader } from '@hera/plugin-core';
import { Action, Controller, Inject } from '@tachybase/utils';
import { Movement } from '../../utils/constants';
import _ from 'lodash';
import { FilterParser, Repository } from '@tachybase/database';
import { CollectionRepository } from '@nocobase/plugin-collection-manager';
import { Cache } from '@tachybase/cache';
import getStream from 'get-stream';
import { stringify } from 'flatted';

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
        [sequelize.fn('sum', sequelize.col('record.items.count')), 'count'],
        [sequelize.col('record.items.new_product_id'), 'new_product_id'],
        [sequelize.col('view_records_contracts.movement'), 'movement'],
      ],
      include: [
        {
          association: 'record',
          attributes: [],
          include: [
            {
              association: 'items',
              attributes: [],
            },
          ],
        },
        ...parsedFilterInclude,
      ],
      group: [sequelize.col('record.items.new_product_id'), sequelize.col('view_records_contracts.movement')],
      order: [],
      subQuery: false,
      raw: true,
    } as any;
    const records = await ctx.db.getModel('view_records_contracts').findAll(query);
    if (records) {
      const allProducts = await ctx.db.getRepository('products').find();
      if (!allProducts) return;
      const items = {} as { [key: string]: { name: string; out: number; in: number; total: number } };
      records.forEach((item) => {
        const product = allProducts.find((p) => p.id === item?.new_product_id);
        if (!product) return;
        const parent = allProducts.find((p) => p.id === product.parentId);
        const name = parent?.name || product.name;
        if (!items[name]) {
          items[name] = {
            name: name,
            out: 0,
            in: 0,
            total: 0,
          };
        }
        // 根据产品找父级产品的分类
        const count = parent?.convertible || product.convertible ? item.count * product.ratio : item.count;
        if (item.movement === Movement.in) {
          items[name].in += count;
          items[name].total += count;
        } else {
          items[name].out += count;
          items[name].total -= count;
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
    const collectionName = 'view_records_contracts';
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
        [sequelize.fn('sum', sequelize.col('record.weight')), 'weight'],
        [sequelize.col('view_records_contracts.movement'), 'movement'],
      ],
      group: [sequelize.col('view_records_contracts.movement')],
      include: [
        {
          association: 'record',
          attributes: [],
        },
        ...parsedFilterInclude,
      ],
      order: [],
      subQuery: false,
      raw: true,
    } as any;
    const records = await ctx.db.getModel('view_records_contracts').findAll(query);
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
    const collectionName = 'view_records_contracts';
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
        [sequelize.fn('sum', sequelize.col('record.all_price')), 'all_price'],
        [sequelize.col('view_records_contracts.movement'), 'movement'],
      ],
      group: [sequelize.col('view_records_contracts.movement')],
      include: [
        {
          association: 'record',
          attributes: [],
        },
        ...parsedFilterInclude,
      ],
      order: [],
      subQuery: false,
      raw: true,
    } as any;
    const records = await ctx.db.getModel('view_records_contracts').findAll(query);
    const inNum = records.find((item) => item.movement === Movement.in)?.all_price ?? 0;
    const outNum = records.find((item) => item.movement === Movement.out)?.all_price ?? 0;
    const data = {
      labels: ['名称', '收入', '支出', '小计'],
      values: [['总金额', outNum, inNum, outNum - inNum]],
    };
    ctx.body = data;
  }

  @Action('pdf')
  async printPreview(ctx: Context) {
    // 中间表id，盘点单id，单双列展示，人工/全部/带金额，距上边距，纸张，字体，注解
    const {
      params: { recordId: id, stockId, isDouble, settingType, margingTop, paper, font, annotate },
    } = ctx.action;

    // #region 样式参数
    let pdfTop: number;
    if (Number(margingTop)) {
      pdfTop = Number(margingTop);
    } else {
      const currentUser = await ctx.db.getRepository('users').findOne({ filter: { id: ctx.state.currentUser.id } });
      pdfTop = Number(currentUser?.pdf_top_margin);
    }
    const isAnnotate = annotate === 'true' ? true : false;
    const pdfExplain = await ctx.db.getRepository('basic_configuration').find();

    const double = isDouble === '0' || isDouble === '1' ? isDouble : pdfExplain[0].record_columns;
    const printSetup =
      settingType === '0' || settingType === '1' || settingType === '2'
        ? settingType
        : pdfExplain[0]?.record_print_setup;
    // #endregion 样式参数

    // #region 查询视图前执行更新视图，用来确定所有产品的相关父级id
    const products_view = this.sqlLoader.sqlFiles['products_search_rule_special'];
    await ctx.db.sequelize.query(products_view);
    // #endregion

    // 1.盘点单 只需要 leaseData
    // 2.租赁/购销单 需要 leaseData、leaseFeeData、noLeaseProductFeeData、noRuleexcluded
    // 3.暂存单 只需要 leaseData
    let leaseData = [];
    let leaseFeeData = [];
    let noLeaseProductFeeData = [];
    let noRuleexcluded = [];
    let contracts = {};
    let intermediate: any;
    let baseRecord: any;
    if (stockId !== 'undefined') {
      // 盘点单
      leaseData = await ctx.db.sequelize.query(
        `
        select 
          p.id AS products_id,
          p2.id AS "parentId",
          ri."comment",
          p2.name AS "parentName",
          p2.name || '[' || p.name || ']' AS "name",
          p2.unit,
          p2.convertible,
          p2.conversion_unit,
          p.weight AS products_weight,
          p.ratio AS products_ratio,
          ri.count,
          2 as conversion_logic_id
        from record_stock rs
        join record_items ri on ri.stock_id = rs.id
        join products p on p.id = ri.new_product_id 
        left join products p2 on p2.id = p."parentId"
        where rs.id = :stockId`,
        {
          replacements: {
            stockId,
          },
          type: QueryTypes.SELECT,
        },
      );
      const record_stock = await ctx.db
        .getRepository('record_stock')
        .findOne({ where: { id: stockId }, appends: ['project'] });
      const userID = record_stock.createdById || record_stock.updatedById || 6; // 记得将盘点用户信息补全
      const user = await ctx.db.getRepository('users').findOne({ filter: { id: userID } });
      baseRecord = {
        number: record_stock.id, // 记得生成单号替换
        date: record_stock.date,
        pdfExplain: pdfExplain[0]?.out_of_storage_explain,
        nickname: user.nickname,
        userPhone: user.phone,
        systemName: pdfExplain[0]?.name,
        plate: record_stock.project.name,
      };
    } else {
      // 租赁/购销/暂存单
      // 判断是外部视图查看还是表单中间表查看
      let model = 'record_contract';
      let isStock = false;
      if (id.split('_').length > 1) {
        // 视图的情况
        model = 'view_records_contracts';
      }
      intermediate = await ctx.db.getRepository(model).findOne({ filter: { id } }); // 中间表/出入库视图
      const recordId = intermediate.record_id; // 订单id
      const contractId = intermediate.contract_id; // 合同id
      let intermediateId = intermediate.id; // 中间表id

      if (id.split('_').length > 1) {
        // 视图的情况
        intermediateId = parseInt(id.split('_')[1]);
      }
      baseRecord = await ctx.db.getRepository('records').findOne({
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
      let number;
      if (intermediate.number) {
        // 视图查看
        number = intermediate.number;
      } else if (!intermediate.number && model === 'record_contract') {
        const view = await ctx.db
          .getRepository('view_records_contracts')
          .findOne({ filter: { rc_id: intermediateId } });
        number = view.number;
      }
      baseRecord.number = number || baseRecord.number;
      // 3.拼接订单的pdf基础数据， 用户信息
      const userID = baseRecord.createdById || baseRecord.updatedById;
      const user = await ctx.db.getRepository('users').findOne({ filter: { id: userID } });
      baseRecord.nickname = user?.nickname || '';
      baseRecord.userPhone = user?.phone || '';
      // 侧面栏提示信息
      baseRecord.pdfExplain = pdfExplain[0]?.out_of_storage_explain;
      baseRecord.systemName = pdfExplain[0]?.name;

      isStock = intermediate.record_category === '3'; // 判断是否为暂存单
      if (isStock) {
        contracts['record_category'] = '3';
        const company = await ctx.db.getRepository('company').findOne({
          filter: {
            id: intermediate.company_id,
          },
          appends: ['projects'],
        });
        contracts['first_party'] = company;
        const movement = company.projects.find((item) => item.id === baseRecord.in_stock_id) ? '1' : '-1';
        contracts['movement'] = movement;
        // 暂存单只需要leaseDate
        leaseData = await ctx.db.sequelize.query(
          `
          select 
              p.id AS products_id,
              p2.id AS "parentId",
              ri."comment",
              p2.name AS "parentName",
              p2.name || '[' || p.name || ']' AS "name",
              p2.unit,
              p2.convertible,
              p2.conversion_unit,
              p.weight AS products_weight,
              p.ratio AS products_ratio,
              ri.count,
              2 as conversion_logic_id
          from records r
          join record_items ri on ri.record_id = r.id
          join products p on p.id = ri.new_product_id 
          left join products p2 on p2.id = p."parentId"
          where r.id = :recordId`,
          {
            replacements: {
              recordId,
            },
            type: QueryTypes.SELECT,
          },
        );
      } else {
        contracts = await ctx.db.getRepository('contracts').findOne({
          filter: {
            id: intermediate.contract_id,
          },
          appends: ['first_party', 'first_party.projects', 'party_b', 'party_b.projects'],
        });
        contracts['movement'] = intermediate.movement;
        // 租赁/购销
        leaseData = await ctx.db.sequelize.query(this.sqlLoader.sqlFiles['pdf_record_product_item'], {
          replacements: {
            recordId,
            contractId,
          },
          type: QueryTypes.SELECT,
        });
        // 租金产品赔偿
        leaseFeeData = await ctx.db.sequelize.query(this.sqlLoader.sqlFiles['pdf_record_product_fee_item'], {
          replacements: {
            intermediateId: parseInt(intermediateId),
          },
          type: QueryTypes.SELECT,
        });

        // 无关联数据
        noLeaseProductFeeData = await ctx.db.sequelize.query(this.sqlLoader.sqlFiles['pdf_record_no_porduct_fees'], {
          replacements: {
            recordId,
            contractId,
          },
          type: QueryTypes.SELECT,
        });

        // 比如运费按照出入库量，但是录单存在排除的情况，特殊处理
        noRuleexcluded = await ctx.db.sequelize.query(
          `
          select
            rfin.count ,
            rfin."comment" ,
            rfin.new_fee_product_id,
            p2.name || '[' || p.name || ']' as fee_name,
            p.custom_name,
            rfin.is_excluded
          from record_contract rc
          join record_fee_items_new rfin on rfin.record_contract_id = rc.id and rfin.is_excluded is true and rfin.new_product_id is null
          join products p on p.id = rfin.new_fee_product_id
          left join products p2 on p."parentId" = p2.id
          where rc.id = :intermediateId
        `,
          {
            replacements: {
              intermediateId: parseInt(intermediateId),
            },
            type: QueryTypes.SELECT,
          },
        );
      }
    }

    // #endregion
    const cache = ctx.app.cacheManager.getCache('@hera/plugin-rental') as Cache;
    const key = stringify({
      intermediate,
      baseRecord,
      leaseData,
      leaseFeeData,
      noLeaseProductFeeData,
      noRuleexcluded,
      contracts,
      settings: { isDouble: double, printSetup, margingTop: pdfTop, paper, font, isAnnotate },
    });

    const result = await cache.get(key);
    if (result) {
      if (Buffer.isBuffer(result)) {
        ctx.body = result;
      } else {
        //@ts-ignore
        ctx.body = Buffer.from(result.data);
      }
    } else {
      const buf = await getStream.buffer(
        //@ts-ignore
        await this.recordPdfService.transformPdfV2(
          intermediate,
          baseRecord,
          leaseData,
          leaseFeeData,
          noLeaseProductFeeData,
          noRuleexcluded,
          contracts,
          { isDouble: double, printSetup, margingTop: pdfTop, paper, font, isAnnotate },
        ),
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
