import Database, { CreateOptions, MagicAttributeModel } from '@nocobase/database';
import { Db, Service } from '@nocobase/utils';

@Service()
export class ContractService {
  @Db()
  private db: Database;

  async load() {
    // 合同方案规则重复校验
    this.db.on('contracts.beforeSave', this.contractBeforeSave.bind(this));
    this.db.on('contract_items.beforeSave', this.contractItemsBeforeSave.bind(this));
  }

  async contractBeforeSave(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    // 根据合同模板名称，自动转换结算表名称
    await this.transSettlementName(model, options);
    // 合同方案重复区间校验
    await this.repetitionTimeCheck(model, options);
  }

  async contractItemsBeforeSave(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    // 单个合同方案重复校验
    await this.contractItemsTimeCheck(model, options);
  }

  /**
   * 合同自动结算，结算表名称转化Formula格式
   * @param model
   * @param options
   */
  async transSettlementName(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    if (!options.values) return;
    if (options.values.settlementTemplate) {
      const temp = {
        上个月: `MONTH(EOMONTH(TODAY(), -1))`, // 工作流默认
        本月: `MONTH(TODAY())`,
        当年: `YEAR(EOMONTH(TODAY(), -1))`,
      };
      const str = options.values.settlementTemplate;
      const data1 = str.split('${');
      const arr = [];
      for (const iterator of data1) {
        arr.push(...iterator.split('}'));
      }
      const trans = arr.filter(Boolean).map((item) => {
        if (!temp[item]) {
          return "'" + item + "'";
        } else return temp[item];
      });
      const templateFormula = `CONCATENATE(${trans.join(',')})`;
      model.settlementName = templateFormula;
    }
  }

  /**
   * 合同方案时间区间重复校验
   * @param model
   * @param options
   */
  async repetitionTimeCheck(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    if (!options.values) return;
    if (options.values.items?.length) {
      const plans = options.values.items;
      for (let i = 0; i < plans.length; i++) {
        const target = plans[i];
        for (let j = i + 1; j < plans.length; j++) {
          const origin = plans[j];
          if (
            origin.start_date === target.start_date ||
            (origin.start_date > target.start_date && origin.start_date < target.end_date) ||
            (origin.start_date < target.start_date && origin.end_date > target.start_date)
          ) {
            throw new Error('时间区间重复');
          }
        }
      }
    }
  }

  /**
   * 方案页面中增减校验
   * @param model
   * @param options
   */
  async contractItemsTimeCheck(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    if (!options.values) return;
    const origin = options.values;
    const data = await this.db.getRepository('contract_items').find({
      where: {
        contract_id: model.contract_id,
      },
    });
    const startDate = new Date(origin.start_date);
    const endDate = new Date(origin.end_date);
    data.forEach((element) => {
      if (
        element.start_date?.getTime() === startDate.getTime() ||
        (element.start_date > startDate && element.start_date < endDate) ||
        (element.start_date < startDate && element.end_date > startDate)
      ) {
        throw new Error('时间区间重复');
      }
    });
  }
}
