import Database, { CreateOptions, MagicAttributeModel } from '@nocobase/database';
import { Db, Service } from '@nocobase/utils';

@Service()
export class ContractService {
  @Db()
  private db: Database;

  async load() {
    // 合同方案规则重复校验
    this.db.on('contracts.beforeSave', this.contractBefortSave.bind(this));
  }
  /**
   * 合同自动结算，结算表名称转化Formula格式
   * @param model
   * @param options
   */
  async contractBefortSave(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    if (!options.values) return;
    if (options.values.settlementTemplate) {
      const temp = {
        上个月: `MONTH(EOMONTH(TODAY(), -1))`,
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
      model.update({ settlementName: templateFormula });
    }
  }
}
