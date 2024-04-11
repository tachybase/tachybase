import { Context } from '@nocobase/actions';
import { QueryTypes, Op } from 'sequelize';
import { RecordPdfService } from '../services/record-pdf-service';
import { SystemSettingService, SqlLoader } from '@hera/plugin-core';
import { Action, Controller, Inject } from '@nocobase/utils';
import { ConversionLogics, Movement, SourcesType } from '../../utils/constants';
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
   * 4. 无关联产品的维修赔偿（人工录入） ！！！还未做
   * 5. 报价
   */
  @Action('pdf')
  async printPreview(ctx: Context) {
    const {
      params: { recordId: id, isDouble, settingType, margingTop },
    } = ctx.action;
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

    const contracts = await ctx.db.getRepository('contracts').findOne({
      filter: {
        id: intermediate.contract_id,
      },
      appends: ['first_party', 'first_party.projects', 'party_b', 'party_b.projects'],
    });
    contracts.movement = intermediate.movement;
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

    // 手工录入的费用规则还未取!!!!!!!!!!!!!!
    const allProductsFeeRules = contractPLan.contract_plan.fee_items.filter(
      (item) =>
        item.count_source === SourcesType.inAndOut ||
        (item.count_source === SourcesType.outbound && intermediate.movement === '0') ||
        (item.count_source === SourcesType.inbound && intermediate.movement === '1'),
    );
    const actual_weight = allProductsFeeRules.filter(
      (item) => item.conversion_logic_id === ConversionLogics.ActualWeight,
    );
    const no_product_fee_arr = [];
    actual_weight.forEach((item) => {
      const data = {
        name: item.new_fee_products.name,
        total: baseRecord.weight * 1000,
        conversion_unit: 'KG',
        unit_price: item.unit_price,
        isFee: true,
      };
      no_product_fee_arr.push(data);
    });
    const leaseFees = [];
    const no_product_fee = {};
    for (const leaseItem of leaseData) {
      console.log(leaseItem, '产品数据');

      const itemTreeIds: any = await ctx.db.sequelize.query(
        `
        WITH RECURSIVE tree AS ( SELECT id, "parentId"
          FROM products
          WHERE id = :dataId
          UNION ALL
          SELECT p.id, p."parentId"
          FROM tree up
          JOIN products p ON up."parentId" = p.id
        ) select id from tree
      `,
        {
          replacements: {
            dataId: leaseItem.product_id,
          },
          type: QueryTypes.SELECT,
        },
      );
      const contract_Plans = contractPLan.contract_plan.lease_items.filter((plan) =>
        itemTreeIds.some((item) => item.id === plan.new_porducts.id),
      );
      let contract_Plan;
      itemTreeIds.some((item) => {
        // 方案可能出现：祖/父/子，祖/夫
        // 1. 如果产品是子，那一定是要使用【祖/父/子】这个方案
        const find = contract_Plans.find((plan) => plan.new_products_id === item.id);
        if (find) {
          contract_Plan = find;
          return true; // 返回 true 停止循环
        }
      });

      if (contract_Plan) {
        if (contract_Plan.conversion_logic_id > 4 && contract_Plan.conversion_logic.weight_items.length) {
          const weights = contract_Plan.conversion_logic.weight_items.filter((weight) =>
            itemTreeIds.some((item) => item.id === weight.new_product_id),
          );
          itemTreeIds.some((item) => {
            // 方案可能出现：祖/父/子，祖/夫
            // 1. 如果产品是子，那一定是要使用【祖/父/子】这个方案
            const find = weights.find((weight) => weight.new_product_id === item.id);
            if (find) {
              leaseItem.weight_item = find;
              return true;
            }
          });
          leaseItem.unit_price = contract_Plan.unit_price || 0;
          leaseItem.conversion_logic_id = contract_Plan.conversion_logic_id;
        }
        // 对应产品维修赔偿项目
        const leaseFee = leaseFeeData.filter((fee) => fee.product_id === leaseItem.product_id);
        if (leaseFee.length) {
          for (const fee of leaseFee) {
            const feeTreeIds: any = await ctx.db.sequelize.query(
              `
      WITH RECURSIVE tree AS ( SELECT id, "parentId"
        FROM products
        WHERE id = :dataId
        UNION ALL
        SELECT p.id, p."parentId"
        FROM tree up
        JOIN products p ON up."parentId" = p.id
      ) select id from tree
    `,
              {
                replacements: {
                  dataId: fee.fee_products_id,
                },
                type: QueryTypes.SELECT,
              },
            );
            let productFeeRule;
            feeTreeIds.some((item) => {
              const find = contract_Plan.fee_items.find((plan) => plan.new_fee_products_id === item.id);
              if (find) {
                productFeeRule = find;
                return true;
              }
            });
            fee.conversion_logic_id = productFeeRule.conversion_logic_id;
            fee.count_source = productFeeRule.count_source;
            fee.unit_price = productFeeRule.unit_price;
            if (productFeeRule.conversion_logic_id > 4) {
              const weights = productFeeRule.conversion_logic.weight_items.filter((weight) =>
                itemTreeIds.some((item) => item.id === weight.new_product_id),
              );
              itemTreeIds.some((item) => {
                const find = weights.find((weight) => weight.new_product_id === item.id);
                if (find) {
                  fee.weight_item = find;
                  return true;
                }
              });
            }
          }
          leaseFees.push(...leaseFee);
        }
      } else {
        // 产品没有找到方案，那就去费用查找，若果费用找到，并且还是手工录入，则计算这个数据，产品item排除，放到手工录入的最后展示
        let fee_no_product_rule;
        const contract_fee_plans = contractPLan.contract_plan.fee_items.filter((plan) =>
          itemTreeIds.some((item) => item.id === plan.new_fee_products.id),
        );
        itemTreeIds.some((item) => {
          const find = contract_fee_plans.find((plan) => plan.new_fee_products.id === item.id);
          if (find) {
            fee_no_product_rule = find;
            return true; // 返回 true 停止循环
          }
        });
        if (fee_no_product_rule) {
          console.log(fee_no_product_rule, '=======找到了吗======');
        }
      }

      allProductsFeeRules.forEach((fee) => {
        if (no_product_fee[fee.new_fee_products_id]) {
          // 出入库量的单位确定
          if (fee.conversion_logic_id === ConversionLogics.Keep) {
            no_product_fee[fee.new_fee_products_id].total += leaseItem.count;
          } else if (fee.conversion_logic_id === ConversionLogics.Product) {
            const ratio = leaseItem.convertible ? leaseItem.ratio : 1;
            no_product_fee[fee.new_fee_products_id].total += leaseItem.count * ratio;
          } else if (fee.conversion_logic_id === ConversionLogics.ProductWeight) {
            no_product_fee[fee.new_fee_products_id].total += leaseItem.count * leaseItem.weight;
          } else if (fee.conversion_logic_id > 4) {
            const weights = fee.conversion_logic.weight_items.filter((weight) =>
              itemTreeIds.some((item) => item.id === weight.new_product_id),
            );
            let weightRule;
            itemTreeIds.some((item) => {
              const find = weights.find((weight) => weight.new_product_id === item.id);
              if (find) {
                weightRule = find;
                return true;
              }
            });
            if (!weightRule) return;
            if (weightRule.conversion_logic_id === ConversionLogics.Keep) {
              no_product_fee[fee.new_fee_products_id].total += leaseItem.count * weightRule.weight;
            } else if (weightRule.conversion_logic_id === ConversionLogics.Product) {
              const ratio = leaseItem.convertible ? leaseItem.ratio : 1;
              no_product_fee[fee.new_fee_products_id].total += leaseItem.count * weightRule.weight * ratio;
            }
          }
        } else {
          no_product_fee[fee.new_fee_products_id] = {
            name: fee.new_fee_products.name,
            total: 0,
            conversion_unit: '',
            unit_price: fee.unit_price,
            isFee: true,
          };
        }
      });
    }
    const noProductFeeArr = Object.values(no_product_fee);
    no_product_fee_arr.push(...noProductFeeArr);

    const printSetup =
      settingType === '0' || settingType === '1' || settingType === '2'
        ? settingType
        : pdfExplain[0]?.record_print_setup;
    const double = isDouble === '0' || isDouble === '1' ? isDouble : pdfExplain[0].record_columns;
    ctx.body = await this.recordPdfService.transformPdfV2(
      baseRecord,
      contracts,
      leaseData,
      leaseFees,
      no_product_fee_arr,
      { isDouble: double, printSetup },
    );
    return '一下要根据订单的产品去查合同相关的数据';
    // 记录单数据
    // const records = await ctx.db.sequelize.query(this.sqlLoader.sqlFiles['pdf_record'], {
    //   replacements: {
    //     recordId,
    //   },
    //   type: QueryTypes.SELECT,
    // });
    // const record = records[0] as any;
    // // 拉标题
    // const systemSetting = await this.systemSetting.get();
    // record.systemTitle = systemSetting?.title || '异常数据，请联系相关负责人！';
    // const userID = record.createdById || record.updatedById;
    // const user = await ctx.db.getRepository('users').findOne({ filter: { id: userID } });
    // record.nickname = user?.nickname || '';
    // record.userPhone = user?.phone || '';
    // record.pdfExplain = pdfExplain[0]?.out_of_storage_explain;
    // if (Number(margingTop)) {
    //   record.margingTop = Number(margingTop);
    // } else {
    //   // 查询当前用户信息
    //   const currentUser = await ctx.db.getRepository('users').findOne({ filter: { id: ctx.state.currentUser.id } });
    //   record.margingTop = Number(currentUser?.pdf_top_margin) || 0;
    // }

    // // 费用数据
    // const feeData = await ctx.db.sequelize.query(this.sqlLoader.sqlFiles['pdf_record_fee'], {
    //   replacements: {
    //     recordId,
    //   },
    //   type: QueryTypes.SELECT,
    // });
    // // 订单打印选项
    // const printSetup =
    //   settingType === '0' || settingType === '1' || settingType === '2'
    //     ? settingType
    //     : pdfExplain[0]?.record_print_setup;
    // const double = isDouble === '0' || isDouble === '1' ? isDouble : pdfExplain[0].record_columns;
    // ctx.body = await this.recordPdfService.transformPdfV2(record, leaseData, feeData, { isDouble: double, printSetup });
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
