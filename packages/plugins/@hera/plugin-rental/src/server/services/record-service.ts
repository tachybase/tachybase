import Database, { CreateOptions, MagicAttributeModel } from '@nocobase/database';
import { ConversionLogics, RecordCategory, settlementStatus } from '@hera/plugin-core';
import { Db, Service } from '@nocobase/utils';
import { Movement, RecordTypes } from '../../utils/constants';

@Service()
export class RecordService {
  @Db()
  private db: Database;

  async load() {
    // 新版订单页面需要完善订单中项目数据
    this.db.on('records.afterSave', this.setProject.bind(this));
    // 处理直发单，生成对应租赁/购销，出入库单 || 订单创建绑定project字段关系
    this.db.on('records.afterCreate', this.afterCreateDirectRecord.bind(this));
    this.db.on('records.afterUpdate', this.afterUpdateDirectRecord.bind(this));
    // 订单发生变化时更新对应结算单的状态（需要重新计算）
    this.db.on('records.afterSave', this.updateSettlementStatus.bind(this));
    // 老系统导入信息系统数据，record_import存储数据，并根据record_import数据创建对应的单子
    this.db.on('record_import.afterCreate', this.importRecord.bind(this));
  }
  /**
   * 处理直发单生成单
   */
  async afterCreateDirectRecord(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    const { values, transaction, context } = options;
    if (!values) {
      return;
    }
    await this.createRecord(model, values, transaction, context);
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
      // 删除订单多对多项目表数据
      const records = await this.db.getRepository('records').find({ where: { direct_record_id: model.id } });
      await this.deleteReocrdProject(
        records.map((item) => item.id),
        transaction,
        true,
      );
      // 删除新建时创建的订单
      const data = await this.db.sequelize.query(
        `
          delete from records
          where records.direct_record_id = ${model.id}
        `,
        {
          transaction,
        },
      );
      await this.createRecord(model, values, transaction, context);
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
    if (values?.category === RecordCategory.lease && values.contrac) {
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

  async importRecord(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    console.log('Start importing record');
    const { values, transaction } = options;
    const record_category = {
      // 采购直发: '0',
      // 租赁直发: '1',
      '1.1': '2', // 采购入库
      '1.-1': '3', // 销售出库
      '0.1': '4', // 租赁入库
      '0.-1': '5', // 租赁出库
      '2.1': '6', // 暂存入库
      '2.-1': '7', // 暂存出库
      '3.1': '8', // 盘点
      '3.-1': '8', // 盘点
    };
    const feeItem = [
      {
        key: 1,
        value: '维修人工',
        children: [
          { key: 1.1, value: '清理费' },
          { key: 1.2, value: '调直费' },
          { key: 1.3, value: '改制费' },
          { key: 1.4, value: '上油费' },
          { key: 1.5, value: '打包费' },
        ],
      },
      {
        key: 2,
        value: '无物赔偿',
        children: [
          { key: 2.001, value: '无物赔偿' },
          { key: 2.002, value: '螺丝' },
          { key: 2.003, value: '螺帽' },
          { key: 2.004, value: '螺杆' },
          { key: 2.005, value: '螺帽' },
          { key: 2.006, value: '接头芯' },
          { key: 2.007, value: '立杆盘' },
          { key: 2.008, value: '横杆头' },
          { key: 2.009, value: '57头' },
          { key: 2.01, value: '插销' },
          { key: 2.011, value: '底板' },
        ],
      },
      {
        key: 3,
        value: '有物赔偿',
        children: [{ key: 3001, value: '有物赔偿' }],
      },
      {
        key: 4,
        value: '装卸运费',
        children: [
          { key: 4.1, value: '运费' },
          { key: 4.2, value: '上车费' },
          { key: 4.3, value: '下车费' },
          { key: 4.4, value: '整理费' },
        ],
      },
    ];
    const categoryObj = {
      调拨: '0',
      购销: '1',
      暂存: '2',
      盘点: '3',
    };
    const arrtObj = {
      自提: '0',
      直送: '1',
      转单: '2',
      叉车: '3',
      // 老系统存在一下三种，新系统不存在
      转车: null,
      合车: null,
      自备车: null,
    };
    const getProject = async (oid: string) => {
      return await this.db.getModel('project').findOne({
        where: {
          oid: oid,
        },
        transaction: transaction,
      });
    };
    const getUser = async (name: string) => {
      return await this.db.getModel('users').findOne({
        where: {
          username: name,
        },
        transaction: transaction,
      });
    };
    try {
      // 处理出库入库，基本订单信息
      const recordData = {
        date: values.data.outDate,
        attrs: arrtObj[values.data?.carNumber] ? [arrtObj[values.data?.carNumber]] : null,
        weight: values.data.weight,
        original_number: values.data?.originalOrder || null,
        comment: values.data?.comments || '',
        category: categoryObj[values.data.type],
        has_receipt: values.data.receipt,
        has_stub: values.data.counterfoil,
        number: String(values.data.number),
        import: values.data,
      };
      if (values.data.outStock) {
        const outStock = await getProject(values.data.outStock);
        recordData['out_stock'] = outStock.dataValues;
      }
      if (values.data.inStock) {
        const inStock = await getProject(values.data.inStock);
        recordData['in_stock'] = inStock.dataValues;
      }
      if (recordData['in_stock'].category === '1' && recordData['out_stock'].category === '1') {
        if (recordData['in_stock'].name === '松江基地仓库') recordData['movement'] = '1';
        else recordData['movement'] = '-1';
      } else if (recordData['in_stock'].category === '1') {
        recordData['movement'] = '1';
      } else if (recordData['out_stock'].category === '1') {
        recordData['movement'] = '-1';
      }

      recordData['record_category'] = record_category[`${recordData.category}.${recordData['movement']}`];

      // 处理产品信息，以及产品费用
      if (values.data.entries?.length) {
        const productArr = [];
        // 采购入库
        const priceRuleArr = [];
        for (const porduct_item of values.data.entries) {
          let productName: string;
          let size: string = porduct_item.size;
          if (porduct_item.name === '钢管') {
            productName = 'Φ48钢管';
          } else if (porduct_item.name === '挑网') {
            productName = '白挑网';
          } else if (porduct_item.name.startsWith('方圆扣')) {
            productName = '方圆扣';
            size = porduct_item.name.slice(3);
          } else {
            productName = porduct_item.name;
          }
          // 老系统size存在空格，新系统不存在空格
          if (size === 'B ') {
            size = 'B';
          }
          const product = await this.db.getModel('product').findOne({
            where: {
              name: productName,
              spec: size,
            },
          });
          const product_id = product.id;
          const exist = priceRuleArr.findIndex((rule) => rule.id === product_id) > -1;
          !exist && priceRuleArr.push({ id: product_id, unit_price: porduct_item.price });
          const fee = values.data.complements.filter(
            (item) => item.associate.name === porduct_item.name && item.associate.size === porduct_item.size,
          );

          const feeItems = [];
          if (fee.length) {
            for (const element of fee) {
              const feeArr = feeItem.find((fe) => fe.key === element.product[0]);
              const feeName = feeArr.children.find((item) => item.key === element.product[1]);
              const product = await this.db
                .getModel('product')
                .findOne({ where: { spec: feeName.value, name: feeArr.value } });
              feeItems.push({ product: product.dataValues, count: element.count });
            }
          }
          productArr.push({ product: product.dataValues, count: porduct_item.count, fee_items: feeItems });
        }
        recordData['items'] = productArr;
        // 处理购销单定价
        if (values.data.type === '购销') {
          // 采购
          const ucl = await this.db.getRepository('unit_conversion_logics').findOne({ where: { id: 2 } });
          const transForm = [];
          for (const iterator of priceRuleArr) {
            const productView = await this.db.getRepository('view_products').findOne({ where: { id: iterator.id } });
            transForm.push({
              conversion_logic: ucl.dataValues,
              product: productView.dataValues,
              unit_price: iterator.unit_price,
            });
          }
          recordData['price_items'] = transForm;
        }
        // 处理租赁单合同信息
        if (values.data.type === '调拨') {
          const project = recordData['movement'] === '1' ? recordData['out_stock'] : recordData['in_stock'];
          const contract = await this.db.getRepository('contracts').findOne({ where: { project_id: project.id } });
          contract['project'] = project;
          recordData['contract'] = contract;
        }
      }
      // 处理车辆信息
      if (!arrtObj[values.data?.carNumber] && values.data?.carNumber) {
        const car = await this.db.getRepository('vehicles').findOne({
          where: {
            number: values.data.carNumber,
          },
          transaction: transaction,
        });
        if (car?.dataValues) {
          recordData['vehicles'] = [car.dataValues];
        } else {
          const user = getUser(values.data.username);
          let userId: number;
          if (user[0]) {
            userId = user[0].id;
          } else {
            userId = null;
          }
          const car = await this.db.getModel('vehicles').create({
            createdAt: values.data.createdAt,
            updatedAt: values.data.updatedAt,
            createdById: userId,
            updatedById: userId,
            number: values.data.carNumber,
          });
          recordData['vehicles'] = [car.dataValues];
        }
      }
      // 处理订单费用，无产品
      if (values.data.additionals?.length) {
        const additionals = [];
        for (const iterator of values.data.additionals) {
          const feeArr = feeItem.find((fe) => fe.key === iterator.product[0]);
          const feeName = feeArr.children.find((item) => item.key === iterator.product[1]);
          const product = await this.db
            .getRepository('product')
            .findOne({ where: { spec: feeName.value, name: feeArr.value }, transaction: transaction });
          additionals.push({ product: product.dataValues, count: iterator.count });
        }
        recordData['record_fee_items'] = additionals;
      }

      const recordNumber = String(values.data.number);
      const record = await this.db.getRepository('records').findOne({
        where: { number: recordNumber },
        appends: ['items', 'items.fee_items', 'price_items', 'record_fee_items', 'waybill'],
        transaction: transaction,
      });

      let origingData: any;
      // 同步订单，存在则删除
      if (record?.dataValues) {
        origingData = record;
        await this.db.getRepository('records').destroy({ filter: { number: recordNumber }, transaction: transaction });
      }
      const createNewRecord = await this.db
        .getRepository('records')
        .create({ values: recordData, transaction: transaction });
      // 运输单处理
      if (values.data?.transport) {
        const waybillData = values.data.transport;
        const data = {
          record_id: createNewRecord.id,
          off_date: waybillData['off-date'],
          arrival_date: waybillData['arrival-date'],
          weight_or_amount: waybillData.weight || 0,
          unit_price: waybillData.price || 0,
          additional_cost: waybillData.extraPice || 0,
          // payer_id: waybillData.payer, // 老系统信息是字符串，名称
          pay_date: waybillData.payDate,
          comment: waybillData['pay-info'],
          paid: values.data.transportPaid,
          checked: values.data.transportChecked,
        };
        await this.db.getRepository('waybills').create({ values: data, transaction: transaction });
      }
      await model.update(
        { is_success: true, origing_data: origingData, recordId: recordData.number },
        { transaction: transaction },
      );
    } catch (error) {
      console.error('订单导入失败:' + error);
      await model.update(
        {
          is_success: false,
          reason:
            'Error name：' + error.name + '，Error message：' + error.message + '，Error stack trace：' + error.stack,
        },
        { transaction: transaction },
      );
    }
  }

  /**
   * 订单发生变化时删除已经存在的多对多关系的表数据
   * @param id
   * @param transaction
   */
  async deleteReocrdProject(id, transaction, isBatch = false) {
    let sql = `DELETE FROM record_projects WHERE record_id = ${id};`;
    if (isBatch) {
      sql = `DELETE FROM record_projects WHERE record_id IN (${id.join(',')});`;
    }
    await this.db.sequelize.query(sql, { transaction });
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
      await this.deleteReocrdProject(model.id, transaction);
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
      await this.deleteReocrdProject(model.id, transaction);
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
          .findOne({ where: { company_id: contractProject.associated_company_id } });

        if (values.record_category === RecordTypes.rentInStock) {
          out_stock = contractProject.dataValues;
          in_stock = associatedCompanyProject.dataValues;
        } else {
          out_stock = associatedCompanyProject.dataValues;
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
      where['in_stock_id'] = in_stock.id;
      where['out_stock_id'] = out_stock.id;
    }
    await record.update(where, { transaction });
    // 设置完出库入，设置项目
    await this.updateRecordProjects(record, values, transaction, where);
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
      const weightDate = weight_items.find(
        (item) => item.products?.find((product) => product?.id === rule.product.id - 99999),
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
  async createRecord(model, values, transaction, context) {
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
      // 编辑时需要删除携带的这写参数
      delete purchaseData.id;
      delete purchaseData.number;
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
      // 编辑时需要删除携带的这写参数
      delete leaseData.id;
      delete leaseData.number;
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
      leaseInData['contract'] = values.in_contract;
      leaseInData['out_stock'] = outProject.dataValues;
      leaseInData['in_stock'] = baseProject.dataValues;
      // 编辑时需要删除携带的这写参数
      delete leaseInData.id;
      delete leaseInData.number;
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
      // 编辑时需要删除携带的这写参数
      delete leaseOutData.id;
      delete leaseOutData.number;
      leaseOutData.items.forEach((element) => {
        delete element.record_id;
        delete element.id;
      });
      await this.db.getRepository('records').create({ values: leaseOutData, transaction, context });
    }
  }
}
