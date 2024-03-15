import Database, { CreateOptions, MagicAttributeModel, Transaction } from '@nocobase/database';
import { ConversionLogics, RecordCategory, settlementStatus } from '@hera/plugin-core';
import { Db, Service } from '@nocobase/utils';
import { Movement, RecordTypes } from '../../utils/constants';

@Service()
export class RecordService {
  @Db()
  private db: Database;

  async load() {
    // 1. 创建项目/更新项目（ 直发单，生成对应租赁/购销，出入库单数据， 并且设置订单多对多project字段关系）
    this.db.on('records.afterCreate', this.afterCreateDirectRecord.bind(this));
    this.db.on('records.afterUpdate', this.afterUpdateDirectRecord.bind(this));
    // 2. 订单新建更新后（根据合同确定出入库字段）
    this.db.on('records.afterSave', this.setProject.bind(this));
    // 订单发生变化时更新对应结算单的状态（需要重新计算）
    this.db.on('records.afterSave', this.updateSettlementStatus.bind(this));
  }
  /**
   * 处理直发单生成单
   */
  async afterCreateDirectRecord(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    const { values, transaction, context } = options;
    if (!values) {
      return;
    }
    if (values.record_category === RecordTypes.purchaseDirect || values.record_category === RecordTypes.rentDirect) {
      await this.createRecord(model, values, transaction, context, null);
    }
  }
  /**
   * 处理直发单生成单
   */
  async afterUpdateDirectRecord(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    const { values, transaction, context } = options;
    if (!values) {
      return;
    }
    if (values.record_category === RecordTypes.purchaseDirect || values.record_category === RecordTypes.rentDirect) {
      const deleteDatas = await this.db.getRepository('records').find({ where: { direct_record_id: model.id } });
      // 删除订单多对多项目表数据
      const records = await this.db.getRepository('records').find({ where: { direct_record_id: model.id } });
      await this.deleteReocrdProject(
        records.map((item) => item.id),
        transaction,
      );
      // 删除新建时创建的订单
      await this.db.sequelize.query(
        `
          delete from records
          where records.direct_record_id = ${model.id}
        `,
        {
          transaction,
        },
      );
      const numbers = deleteDatas.map((item) => item.number);
      await this.createRecord(model, values, transaction, context, numbers);
    }
  }
  /**
   * 更新订单对应的结算表状态
   */
  async updateSettlementStatus(record: MagicAttributeModel, options: CreateOptions) {
    const { values, transaction, context } = options;
    if (!values) return;
    // 触发打印更新次数跳过
    if (values?.print_count) return;
    if (values?.category === RecordCategory.lease && values.contract) {
      const dateObject = values.date;
      // 结束时间添加一天，新系统选择时间都是以当天0点开始，但是导入的数据存在不是以0点开始比如2023-12-21:03.000……，提醒结算单的时间可能为2023-12-21:00.000……
      const settlement = await this.db.sequelize.query(
        `SELECT * FROM settlements WHERE contract_id = ${values.contract.id} AND start_date <= '${dateObject}' AND end_date >= (TIMESTAMP '${dateObject}' - INTERVAL '1 day')`,
      );
      const settlementData: any = settlement[0];
      if (settlementData.length) {
        for (const item of settlementData) {
          const settlement_id = item.id;
          await this.db.getModel('settlements').update(
            {
              status: settlementStatus.needReCompute,
            },
            {
              where: {
                id: settlement_id,
              },
              transaction,
            },
          );
        }
      }
    }
    if (values?.category === RecordCategory.purchase) {
      // 定价
      const rule = values.price_items;
      // 产品
      const products = values.items;
      // 分组实际总量
      const weight_items = values.group_weight_items;
      let allPrice = 0;
      for (const item of rule) {
        const data = await this.amountCalculation(item, products, weight_items);
        allPrice += data;
      }
      const recordId = record.id;
      // 更新订单总金额字段
      await this.db.getModel('records').update(
        { all_price: allPrice },
        {
          where: {
            id: recordId,
          },
          transaction,
        },
      );
    }
  }

  /**
   * 订单发生变化时删除已经存在的多对多关系的表数据
   * @param id
   * @param transaction
   */
  async deleteReocrdProject(id: number[], transaction: Transaction) {
    await this.db.getRepository('record_projects').destroy({
      transaction,
      filter: {
        record_id: {
          $eq: id,
        },
      },
    });
  }

  /**
   * 订单多对多项目hook赋值方法
   * @param model
   * @param values
   * @param transaction
   * @param where
   */
  async updateRecordProjects(model, values, transaction, where) {
    if (
      values.category === RecordCategory.purchase2lease ||
      values.category === RecordCategory.lease2lease ||
      values.category === RecordCategory.staging
    ) {
      await this.deleteReocrdProject([model.id], transaction);
      await this.db.sequelize.query(
        `
      INSERT INTO record_projects (project_id, record_id)
      SELECT ${where.in_stock_id} AS project_id, ${model.id} AS record_id
      UNION ALL
      SELECT ${where.out_stock_id} AS project_id, ${model.id} AS project_id;
      `,
        { transaction },
      );
    } else {
      await this.deleteReocrdProject([model.id], transaction);
      await this.db.sequelize.query(
        `
      INSERT INTO record_projects (project_id, record_id)
      SELECT
        CASE WHEN movement = '1' THEN ${where.out_stock_id} ELSE ${where.in_stock_id} END AS project_id,
        id AS record_id
      FROM records
      WHERE records.id = ${model.id}
      `,
        { transaction },
      );
    }
  }
  // 新版订单录入界面，手动赋值对应的出入库信息
  async setProject(record: MagicAttributeModel, options: CreateOptions) {
    const { values, transaction, context } = options;

    // 非新增和修改订单信息的
    if (!values || values.record_category === undefined) {
      return;
    }
    // 暂存和盘点是不需要处理的
    if (values.category === RecordCategory.inventory) {
      // values.category === RecordCategory.staging ||
      return;
    }
    const where = {};
    // 订单导入直接取值
    if (values.import && values.in_stock && values.out_stock) {
      where['in_stock_id'] = values.in_stock.id;
      where['out_stock_id'] = values.out_stock.id;
    } else {
      let out_stock, in_stock;
      if (values.record_category === RecordTypes.purchaseDirect || values.record_category === RecordTypes.rentDirect) {
        // 采购直发/租赁直发
        const inContract = values.in_contract;
        const contractProject = await this.db
          .getRepository('project')
          .findOne({ where: { id: inContract.project_id } });
        in_stock = contractProject.dataValues;
        if (values.record_category === RecordTypes.rentDirect) {
          const project = await this.db
            .getRepository('project')
            .findOne({ where: { id: values.out_contract.project_id } });
          out_stock = project.dataValues;
        } else {
          out_stock = values.out_stock;
        }
      } else if (
        values.record_category === RecordTypes.rentInStock ||
        values.record_category === RecordTypes.rentOutStock
      ) {
        if (!values.contract) return;
        const contract = values.contract;
        const contractProject = await this.db.getRepository('project').findOne({ where: { id: contract.project_id } });
        // 租赁出库/租赁入库，确定出入库
        // out_stock, in_stock
        // 租赁入库, out_stock = 合同中project_id, in_stock = 合同中项目的associated_company_id => 项目表id
        const associatedCompanyProject = await this.db
          .getRepository('project')
          .findOne({ where: { company_id: contractProject.associated_company_id, category: '1' } });

        if (values.record_category === RecordTypes.rentInStock) {
          out_stock = contractProject.dataValues;
          in_stock = associatedCompanyProject?.dataValues;
        } else {
          out_stock = associatedCompanyProject?.dataValues;
          in_stock = contractProject.dataValues;
        }
      } else if (
        values.record_category === RecordTypes.purchaseInStock ||
        values.record_category === RecordTypes.sellOutStock
      ) {
        out_stock = values.out_stock;
        const associatedCompanyProject = await this.db
          .getRepository('project')
          .findOne({ where: { company_id: out_stock.company_id } });
        in_stock = associatedCompanyProject;
      } else if (values.category === RecordCategory.staging) {
        in_stock = values.in_stock;
        out_stock = values.out_stock;
      }
      if (in_stock) {
        where['in_stock_id'] = in_stock.id;
      }
      if (out_stock) {
        where['out_stock_id'] = out_stock.id;
      }
    }
    await record.update(where, { transaction });
    if (where['in_stock_id'] && where['out_stock_id']) {
      // 设置完出库入，设置项目
      await this.updateRecordProjects(record, values, transaction, where);
    }
  }

  /**
   * 根据产品数据计算金额
   * @param rule 单个规则
   * @param products 全部产品
   * @param weight_items 全部分组实际重量
   * @returns 单个规则产生的总金额
   */
  private async amountCalculation(rule, products, weight_items) {
    const calc_products = products.filter(
      (product) => product.product.category_id === rule.product.id - 99999 || product.product.id === rule.product.id,
    );
    const categoryIds = calc_products.map((item) => item.product.category_id).filter(Boolean);
    const categoryIdsStr = categoryIds.join(',');

    const datas = await this.db.sequelize.query(`
      SELECT pc.*
      FROM product_category pc
      WHERE pc.id IN (${categoryIdsStr ? categoryIdsStr : 'null'});
      `);
    // 相关分类数据
    const categoryDatas = datas[0];
    if (!categoryDatas.length) return;
    if (rule.conversion_logic.id === ConversionLogics.Keep) {
      const allPrice = calc_products.reduce(
        (accumulator, currentValue) => accumulator + currentValue.count * rule.unit_price,
        0,
      );
      return allPrice;
    } else if (rule.conversion_logic.id === ConversionLogics.Product) {
      const allPrice = calc_products.reduce((accumulator, currentValue) => {
        const category: any = categoryDatas.find((item: any) => currentValue.product.category_id === item.id);
        if (category.convertible) {
          return accumulator + currentValue.count * currentValue.product.ratio * rule.unit_price;
        } else {
          return accumulator + currentValue.count * rule.unit_price;
        }
      }, 0);
      return allPrice;
    } else if (rule.conversion_logic.id === ConversionLogics.ProductWeight) {
      const allPrice = calc_products.reduce(
        (accumulator, currentValue) => accumulator + currentValue.count * currentValue.product.weight * rule.unit_price,
        0,
      );
      return allPrice / 1000;
    } else if (rule.conversion_logic.id === ConversionLogics.ActualWeight) {
      // 根据产品找分组实际重量
      const weightDate = weight_items.find((item) =>
        item.products?.find((product) => product?.id === rule.product.id - 99999),
      );
      if (weightDate) {
        const allPrice = weightDate.weight * rule.unit_price;
        return allPrice;
      } else {
        const allPrice = calc_products.reduce((accumulator, currentValue) => {
          const category: any = categoryDatas.find((item: any) => currentValue.product.category_id === item.id);
          if (category.convertible) {
            return accumulator + currentValue.count * currentValue.product.ratio * rule.unit_price;
          } else {
            return accumulator + currentValue.count * rule.unit_price;
          }
        }, 0);
        return allPrice;
      }
    } else {
      const ids = calc_products
        .map((item) => item.product.category_id)
        .filter(Boolean)
        .join(',');
      const rules = this.db.sequelize.query(`
        select wr.*
        from weight_rules wr
        where wr.product_id IN (${ids}) and wr.logic_id = ${rule.conversion_logic.id}
      `);
      const weight_rules = rules[0];
      const allPrice = calc_products.reduce((accumulator, currentValue) => {
        const weight_rule: any = weight_rules?.find((item: any) => currentValue.product_id === item.id);
        const category: any = categoryDatas.find((item: any) => currentValue.product.category_id === item.id);
        if (category.convertible && weight_rule?.logic_id === ConversionLogics.Keep) {
          return accumulator + currentValue.count * currentValue.product.ratio * rule.unit_price;
        } else if (category.convertible && weight_rule?.logic_id === ConversionLogics.Product) {
          return accumulator + currentValue.count * currentValue.product.ratio * weight_rule.weight * rule.unit_price;
        } else if (!category.convertible && weight_rule?.logic_id === ConversionLogics.Keep) {
          return accumulator + currentValue.count * rule.unit_price;
        } else {
          return accumulator + currentValue.count * weight_rule?.weight * rule.unit_price;
        }
      }, 0);
      return allPrice || 0;
    }
  }

  /**
   * 根据直发单创建对应出库订单
   */
  async createRecord(model, values, transaction, context, numbers) {
    delete values.number;
    delete values.id;
    values.vehicles?.forEach((item) => delete item.record_vehicles);
    //采购直发单
    if (values.record_category === RecordTypes.purchaseDirect && values.category === RecordCategory.purchase2lease) {
      const inProject = await this.db.getModel('project').findOne({
        where: {
          id: values.in_contract.project_id,
        },
      });
      const base_project = await this.db.getModel('project').findOne({
        where: {
          company_id: inProject.associated_company_id, // 签约公司id
          category: '1',
        },
      });
      //1. 创建购销入库单
      const purchaseData = {
        ...values,
        direct_record_id: model.id,
      };
      purchaseData['record_category'] = RecordTypes.purchaseInStock;
      purchaseData['movement'] = Movement.in;
      purchaseData['category'] = RecordCategory.purchase;
      purchaseData['in_stock'] = base_project.dataValues;
      if (numbers?.[0]) {
        purchaseData['number'] = numbers[0];
      }
      purchaseData.items.forEach((element) => {
        delete element.record_id;
        delete element.id;
      });
      await this.db.getRepository('records').create({ values: purchaseData, transaction, context });
      // 2. 创建租赁出库单
      const leaseData = {
        ...values,
        direct_record_id: model.id,
      };
      leaseData['record_category'] = RecordTypes.rentOutStock;
      leaseData['movement'] = Movement.out;
      leaseData['category'] = RecordCategory.lease;
      leaseData['contract'] = values.in_contract;
      leaseData['out_stock'] = base_project.dataValues;
      leaseData['in_stock'] = inProject.dataValues;
      if (numbers?.[1]) {
        leaseData['number'] = numbers[1];
      }
      leaseData.items.forEach((element) => {
        delete element.record_id;
        delete element.id;
      });
      await this.db.getRepository('records').create({ values: leaseData, transaction, context });
    }
    if (values.record_category === RecordTypes.rentDirect && values.category === RecordCategory.lease2lease) {
      // 1.创建租赁入库
      const leaseInData = {
        ...values,
        direct_record_id: model.id,
      };
      const outProject = await this.db.getModel('project').findOne({
        where: {
          id: values.out_contract.project_id,
        },
      });
      const inProject = await this.db.getModel('project').findOne({
        where: {
          id: values.in_contract.project_id,
        },
      });
      const baseProject = await this.db.getModel('project').findOne({
        where: {
          company_id: inProject.associated_company_id, // 签约公司id
          category: '1',
        },
      });
      leaseInData['record_category'] = RecordTypes.rentInStock;
      leaseInData['movement'] = Movement.in;
      leaseInData['category'] = RecordCategory.lease;
      leaseInData['contract'] = values.out_contract;
      leaseInData['out_stock'] = outProject.dataValues;
      leaseInData['in_stock'] = baseProject.dataValues;
      if (numbers?.[0]) {
        leaseInData['number'] = numbers[0];
      }
      leaseInData.items.forEach((element) => {
        delete element.record_id;
        delete element.id;
      });
      await this.db.getRepository('records').create({ values: leaseInData, transaction, context });
      // 2.创建租赁出库单
      const leaseOutData = {
        ...values,
        direct_record_id: model.id,
      };
      leaseOutData['record_category'] = RecordTypes.rentOutStock;
      leaseOutData['movement'] = Movement.out;
      leaseOutData['category'] = RecordCategory.lease;
      leaseOutData['contract'] = values.in_contract;
      leaseOutData['out_stock'] = baseProject.dataValues;
      leaseOutData['in_stock'] = inProject.dataValues;
      if (numbers?.[1]) {
        leaseOutData['number'] = numbers[1];
      }
      leaseOutData.items.forEach((element) => {
        delete element.record_id;
        delete element.id;
      });
      await this.db.getRepository('records').create({ values: leaseOutData, transaction, context });
    }
  }
}
