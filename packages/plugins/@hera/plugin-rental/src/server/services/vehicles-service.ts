import Database, { CreateOptions, MagicAttributeModel } from '@tachybase/database';
import { Db, Service } from '@tachybase/utils';
import validateLicensePlate from '../../utils/validateLIcensePlate';

@Service()
export class VehiclesService {
  @Db()
  private db: Database;

  async load() {
    // 合同方案规则重复校验
    this.db.on('vehicles.beforeSave', this.vehiclesBeforeSave.bind(this));
  }
  /**
   * beforeSave hooks
   * @param model
   * @param options
   */
  async vehiclesBeforeSave(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    // 车牌号校验
    await this._plateNumberCheck(model, options);
  }

  /**
   * 车牌号校验
   */
  async _plateNumberCheck(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    if (!model.number) {
      return;
    }
    const validate = validateLicensePlate(model.number);
    if (!validate) {
      throw new Error('车牌号格式不正确');
    }
  }
}
