import { ConversionLogics, RecordCategory, RulesNumber, SourcesType, countCource } from '../../utils/constants';
import { renderItV2 } from '../pdf-documents/records-documentV2';
import { Db, Service } from '@tachybase/utils';
import { RecordPdfOptions } from '../../interfaces/options';
import { PrintSetup } from '../../utils/system';
import Database from '@tachybase/database';

@Service()
export class RecordPdfService {
  @Db()
  private db: Database;

  /**
   * 注意点
   * 1. 正常租赁产品
   * 2. 租赁产品的维修赔偿
   * 3. 无关联产品的维修赔偿（实际总重量，出入库量）
   * 4. 无关联产品的维修赔偿（人工录入)
   * 5. 报价
   */
  async transformPdfV2(
    intermediate, // 中间表
    baseRecord, //订单基础数据
    leaseData, // 租金数据
    leaseFeeData, // 赔偿数据
    noLeaseProductFeeData,
    noRuleexcluded,
    contracts,
    options,
  ) {
    const { printSetup } = options;
    const movement = (movement: string) => {
      const data = {
        '-1': '出库',
        '1': '入库',
      };
      return data[movement];
    };

    const record_category = (category) => {
      const data = {
        '1': '购销',
        '2': '租赁',
      };
      return data[category];
    };
    const needRecord = {
      record_type: baseRecord.type_new,
      record_number: baseRecord.number,
      record_date: baseRecord.date,
      record_origin: baseRecord.origin,
      record_party_b: movement(contracts.movement) === '出库' ? baseRecord.in_stock : baseRecord.out_stock, // 还需要判断第三个合同的情况，确定一下出库入是否合同公司有关
      record_party_a: movement(contracts.movement) === '入库' ? baseRecord.in_stock : baseRecord.out_stock,
      vehicles: baseRecord.vehicles,
      record_category: record_category(contracts.record_category),
      contract_first_party: contracts.first_party, //公司信息，甲方，我们
      movement: movement(contracts.movement),
      pdfExplain: baseRecord.pdfExplain,
      nickname: baseRecord.nickname,
      userPhone: baseRecord.userPhone,
    };
    // ！租金数据
    const leasePorducts = leaseData.map((leas) => {
      const data = {
        ...leas,
      };
      let total: number;
      const unit = leas.unit;
      let conversion_unit = leas.conversion_unit;
      if (leas.conversion_logic_id === ConversionLogics.Keep) {
        total = leas.count;
        conversion_unit = leas.unit;
      } else if (
        leas.conversion_logic_id === ConversionLogics.Product ||
        leas.conversion_logic_id === ConversionLogics.ActualWeight
      ) {
        const ratio = leas.convertible ? leas.products_ratio : 1;
        total = leas.count * ratio;
        conversion_unit = leas.convertible ? leas.conversion_unit : leas.unit;
      } else if (leas.conversion_logic_id === ConversionLogics.ProductWeight) {
        total = leas.count * leas.products_weight;
        conversion_unit = 'KG';
      } else if (leas.conversion_logic_id > 4) {
        if (leas.wr_logic_id === ConversionLogics.Keep) {
          total = leas.count * leas.wr_weight;
        } else if (leas.wr_logic_id === ConversionLogics.Product) {
          const ratio = leas.convertible ? leas.products_ratio : 1;
          total = leas.count * leas.wr_weight * ratio;
        }
        conversion_unit = 'KG';
      }
      data['total'] = total;
      data.unit = unit;
      data.conversion_unit = conversion_unit;
      return data;
    });
    // ！租金赔偿
    const leaseProductsFees = leaseFeeData.map((fee) => {
      const data = {
        products_id: fee.products_id,
        name: fee.fee_custom_name || fee.fee_product,
        comment: fee.is_excluded ? fee.comment + '_不计入合同' : fee.comment,
      };
      let count: number;
      if (fee.count_source === SourcesType.staff) {
        count = fee.fee_count;
      } else if (
        fee.count_source === SourcesType.inAndOut ||
        (fee.count_source === SourcesType.inbound && contracts.movement === '1') ||
        (fee.count_source === SourcesType.outbound && contracts.movement === '0')
      ) {
        count = fee.count;
      }
      let total: number;
      let conversion_unit = fee.fee_rule_unit;
      if (fee.conversion_logic_id === ConversionLogics.Keep) {
        total = count;
        conversion_unit = fee.fee_unit;
      } else if (
        fee.conversion_logic_id === ConversionLogics.Product ||
        fee.conversion_logic_id === ConversionLogics.ActualWeight
      ) {
        const ratio = fee.fee_convertible ? fee.fee_ratio : 1;
        total = count * ratio;
      } else if (fee.conversion_logic_id === ConversionLogics.ProductWeight) {
        total = count * fee.fee_weight;
        conversion_unit = 'KG';
      } else if (fee.conversion_logic_id > 4) {
        const ProductWeightRule = leaseData.findOne((leas) => leas.products_id === fee.products_id);
        if (ProductWeightRule.wr_logic_id === ConversionLogics.Keep) {
          total = count * ProductWeightRule.wr_weight;
        } else if (ProductWeightRule.wr_logic_id === ConversionLogics.Product) {
          const ratio = ProductWeightRule.convertible ? ProductWeightRule.products_ratio : 1;
          total = count * ProductWeightRule.wr_weight * ratio;
        }
        conversion_unit = 'KG';
      }
      if (printSetup === PrintSetup.DisplayAndPrice) {
        data['count'] = total;
        data['unit'] = conversion_unit;
        data['total'] = total * fee.unit_price;
        data['conversion_unit'] = '元';
      } else {
        data['conversion_unit'] = conversion_unit;
        data['total'] = total;
      }
      return data;
    });
    const rentData = [...leasePorducts, ...leaseProductsFees].sort((a, b) => a.products_id - b.products_id);
    // 生成小计
    const productTotal = {};
    leasePorducts.forEach((element) => {
      if (element) {
        productTotal[element.parentId] = {
          name: element.parentName + '[小计]',
          total: (productTotal[element.parentId]?.total ?? 0) + element.total,
          conversion_unit: element.conversion_unit,
          count: '',
          unit: '',
          isTotal: true,
          comment: '',
          parentId: element.parentId,
          // 报价用
          priceName: element.parentName,
          price: element.unit_price,
        };
      }
    });

    // 插入小计
    const productTotalItems = Object.entries(productTotal).map(([_, value]) => value);
    productTotalItems.forEach((itemB: any) => {
      const lastIndex = rentData.map((itemA) => itemA.parentId).lastIndexOf(itemB.parentId);
      if (lastIndex !== -1) {
        rentData.splice(lastIndex + 1, 0, itemB);
      } else {
        rentData.push(itemB);
      }
    });

    // ！无关联费用（人工录入）
    const noproFeesStaff = noLeaseProductFeeData
      .filter((item) => item.count_source === SourcesType.staff)
      .map((fee) => {
        const data = {
          fee_products_id: fee.fee_products_id,
          name: fee.name,
          comment: fee.is_excluded ? fee.comment + '_不计入合同' : fee.comment,
        };
        let total: number;
        let conversion_unit;
        if (fee.conversion_logic_id === ConversionLogics.Keep) {
          total = fee.count;
          conversion_unit = fee.unit;
        } else if (
          fee.conversion_logic_id === ConversionLogics.Product ||
          fee.conversion_logic_id === ConversionLogics.ActualWeight
        ) {
          const ratio = fee.convertible ? fee.ratio : 1;
          total = fee.count * ratio;
          conversion_unit = fee.convertible ? fee.conversion_unit : fee.unit;
        } else if (fee.conversion_logic_id === ConversionLogics.ProductWeight) {
          total = fee.count * fee.weight;
          conversion_unit = 'KG';
        } else if (fee.conversion_logic_id > 4) {
          if (fee.wr_logic_id === ConversionLogics.Keep) {
            total = fee.count * fee.wr_weight;
          } else if (fee.wr_logic_id === ConversionLogics.Product) {
            const ratio = fee.convertible ? fee.ratio : 1;
            total = fee.count * fee.wr_weight * ratio;
          }
          conversion_unit = 'KG';
        }
        if (printSetup === PrintSetup.DisplayAndPrice) {
          data['count'] = total;
          data['unit'] = conversion_unit;
          data['total'] = total * fee.unit_price;
          data['conversion_unit'] = '元';
        } else {
          data['conversion_unit'] = conversion_unit;
          data['total'] = total;
        }
        return data;
      });
    rentData.push(...noproFeesStaff);

    // ！无关联费用（出入库量）
    if (printSetup === PrintSetup.Display || printSetup === PrintSetup.DisplayAndPrice) {
      const noproFees = noLeaseProductFeeData
        .filter((item) => item.count_source !== SourcesType.staff)
        .map((fee) => {
          const data = {
            name: fee.custom_name || fee.name,
          };
          if (
            fee.count_source === SourcesType.inAndOut ||
            (fee.count_source === SourcesType.inbound && intermediate.movement === '1') ||
            (fee.count_source === SourcesType.outbound && intermediate.movement === '-1')
          ) {
            let total = 0;
            let conversion_unit: string;
            leaseData.forEach((ele) => {
              if (fee.conversion_logic_id === ConversionLogics.Keep) {
                total += ele.count;
                conversion_unit = ele.unit;
              } else if (fee.conversion_logic_id === ConversionLogics.Product) {
                const ratio = ele.convertible ? ele.ratio : 1;
                total += ele.count * ratio;
                conversion_unit = ele.convertible ? ele.conversion_unit : ele.unit;
              } else if (fee.count_logic_id === ConversionLogics.ActualWeight) {
                total = baseRecord.weight;
                conversion_unit = '吨';
              } else if (fee.conversion_logic_id === ConversionLogics.ProductWeight) {
                total += ele.count * ele.weight;
                conversion_unit = 'KG';
              } else if (fee.conversion_logic_id > 4) {
                const weightRule = fee.weight_rules.find((item) => item.new_product_id === ele.products_id);
                if (weightRule) {
                  if (weightRule.conversion_logic_id === ConversionLogics.Keep) {
                    total += ele.count * weightRule.weight;
                  } else if (weightRule.conversion_logic_id === ConversionLogics.Product) {
                    const ratio = weightRule.convertible ? weightRule.ratio : 1;
                    total += ele.count * weightRule.weight * ratio;
                  }
                  conversion_unit = 'KG';
                }
              }
            });
            data['isFee'] = true;
            conversion_unit = fee.fee_rule_unit || conversion_unit;
            if (printSetup === PrintSetup.DisplayAndPrice) {
              data['count'] = total;
              data['unit'] = conversion_unit;
              data['total'] = total * fee.unit_price;
              data['conversion_unit'] = '元';
            } else {
              data['conversion_unit'] = conversion_unit;
              data['total'] = total;
            }
            return data;
          }
        })
        .filter(Boolean);
      rentData.push(...noproFees);
      const excluded = noRuleexcluded
        .map((item) => {
          const data = {
            name: item.custom_name || item.fee_name,
            total: item.count,
            comment: item.is_excluded ? (item.comment || '') + ' 不计入合同' : item.comment || '',
            conversion_unit: '',
          };
          return data;
        })
        .filter(Boolean);
      rentData.push(...excluded);
    }

    // 报价
    let priceRule = [];
    if (needRecord.record_category === '购销') {
      priceRule = productTotalItems.map((item: any) => {
        return {
          name: item.priceName,
          unit_price: item.price,
          unit: item.conversion_unit,
          count: item.total,
          all_price: item.total * item.price,
          comment: item.comment,
        };
      });
    }
    // 注意不记录合同
    return await renderItV2({
      detail: needRecord,
      record: rentData,
      priceRule,
      options,
    });
  }
}
