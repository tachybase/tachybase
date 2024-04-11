import { ConversionLogics, RecordCategory, RulesNumber, SourcesType, countCource } from '../../utils/constants';
import { renderItV2 } from '../pdf-documents/records-documentV2';
import { Db, Service } from '@nocobase/utils';
import { RecordPdfOptions } from '../../interfaces/options';
import { PrintSetup } from '../../utils/system';
import Database from '@nocobase/database';

@Service()
export class RecordPdfService {
  @Db()
  private db: Database;
  async transformPdfV2(
    recordData: any,
    contracts,
    lease_data: any,
    fee_data: any,
    no_product_fee_arr: any,
    options: RecordPdfOptions,
  ) {
    const { isDouble, printSetup } = options;
    const movement = (movement: string) => {
      const data = {
        '0': '出库',
        '1': '入库',
      };
      return data[movement];
    };

    const contract_type = (category) => {
      const data = {
        '0': '租赁',
        '1': '购销',
      };
      return data[category];
    };

    const needRecord = {
      record_type: recordData.type_new,
      record_number: recordData.number,
      record_date: recordData.date,
      record_origin: recordData.origin,
      record_party_b: movement(contracts.movement) === '出库' ? recordData.in_stock : recordData.out_stock, // 还需要判断第三个合同的情况，确定一下出库入是否合同公司有关
      vehicles: recordData.vehicles,
      contract_type: contracts.new_category,
      contract_first_party: contracts.first_party, //公司信息，甲方，我们
      movement: movement(contracts.movement),
      pdfExplain: recordData.pdfExplain,
      nickname: recordData.nickname,
      userPhone: recordData.userPhone,
    };

    const leaseData = lease_data
      .map((item) => {
        const data = {
          parentId: item.parent_id,
          parentName: item.parent_name,
          productId: item.product_id,
          name: item.name,
          count: item.count,
          unit: item.unit,
          conversion_unit: item.conversion_unit,
          comment: item.record_items_comment,
          unit_price: item.unit_price,
        };
        if (item.conversion_logic_id === ConversionLogics.Keep) {
          data['total'] = item.count;
        } else if (
          item.conversion_logic_id === ConversionLogics.Product ||
          item.conversion_logic_id === ConversionLogics.ActualWeight ||
          (!item.conversion_logic_id && !contract_type(needRecord.contract_type))
        ) {
          if (item.convertible) {
            data['total'] = item.count * item.ratio;
          } else {
            data['total'] = item.count;
          }
        } else if (item.conversion_logic_id === ConversionLogics.ProductWeight) {
          data['total'] = item.count * item.weight;
          data['conversion_unit'] = 'KG';
        } else if (item.conversion_logic_id > 4) {
          if (item.weight_item.conversion_logic_id === ConversionLogics.Keep) {
            data['total'] = item.count * item.weight_item.weight;
            data['conversion_unit'] = 'KG';
          } else if (item.weight_item.conversion_logic_id === ConversionLogics.Product) {
            const total = item.count * item.weight_item.weight;
            if (item.convertible) {
              data['total'] = total * item.ratio;
            } else {
              data['total'] = total;
            }
            data['conversion_unit'] = 'KG';
          }
        }
        return data;
      })
      .sort((a, b) => {
        a.parentId - b.parentId;
      });
    const leaseFeeData = fee_data.map((item) => {
      const data = {
        name: item.custom_name || item.fee_name,
        comment: item.comment,
        unit: '',
        conversion_unit: '',
        productId: item.product_id + 0.1,
        parentId: item.parent_id,
      };
      let count;
      if (item.count_source === SourcesType.staff) {
        count = item.fee_count;
      } else if (
        item.count_source === SourcesType.inAndOut ||
        (item.count_source === SourcesType.inbound && contracts.movement === '1') ||
        (item.count_source === SourcesType.outbound && contracts.movement === '0')
      ) {
        count = item.product_count;
      }

      if (item.conversion_logic_id === ConversionLogics.Keep) {
        data['total'] = count;
        data.conversion_unit = item.unit;
      } else if (
        item.conversion_logic_id === ConversionLogics.Product ||
        item.conversion_logic_id === ConversionLogics.ActualWeight
      ) {
        if (item.convertible) {
          data['total'] = count * item.ratio;
          data.conversion_unit = item.conversion_unit;
        } else {
          data['total'] = count;
          data.conversion_unit = item.unit;
        }
      } else if (item.conversion_logic_id === ConversionLogics.ProductWeight) {
        data['total'] = count * item.weight;
      } else if (item.conversion_logic_id > 4) {
        if (item.weight_item.conversion_logic_id === ConversionLogics.Keep) {
          data['total'] = count * item.weight_item.weight;
          data['conversion_unit'] = 'KG';
        } else if (item.weight_item.conversion_logic_id === ConversionLogics.Product) {
          const total = count * item.weight_item.weight;
          if (item.convertible) {
            data['total'] = total * item.ratio;
          } else {
            data['total'] = total;
          }
          data['conversion_unit'] = 'KG';
        }
      }
      return data;
    });
    const allData = [...leaseData, ...leaseFeeData].sort((a, b) => a.productId - b.productId);
    // 生成小计
    const productTotal = {};
    leaseData.forEach((element) => {
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
    let priceRule = [];
    if (contract_type(contracts.new_category) === '购销') {
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
    productTotalItems.forEach((itemB: any) => {
      const lastIndex = allData.map((itemA) => itemA.parentId).lastIndexOf(itemB.parentId);
      if (lastIndex !== -1) {
        allData.splice(lastIndex + 1, 0, itemB);
      } else {
        allData.push(itemB);
      }
    });
    // console.log(allData, '产品对应的费用')

    const data = [...allData, ...no_product_fee_arr];
    return await renderItV2({
      detail: needRecord,
      record: data,
      priceRule: priceRule,
      isDouble,
      printSetup,
    });

    return;
    // 直发单不需要打印预览
    //   if (recordData.category === RecordCategory.purchase2lease || recordData.category === RecordCategory.lease2lease)
    //     return;

    //   // 盘点/暂存单使用默认产品表的换算逻辑
    //   if (recordData.category === RecordCategory.staging || recordData.category === RecordCategory.inventory) {
    //     lease_data = lease_data.map((item) => {
    //       const data = {
    //         ...item,
    //       };
    //       // 根据产品表换算
    //       data['conversion_logic_id'] = 2;
    //       return data;
    //     });
    //   }
    //   let make_price;

    //   // 购销单计算报价数据
    //   if (recordData.category === RecordCategory.purchase) {
    //     const price_rule = lease_data.map((item) => {
    //       const data = {
    //         name: item.price_label,
    //         unit_price: item.price_price,
    //         comment: item.price_comment,
    //       };
    //       if (!item.conversion_logic_id) return;
    //       if (item.conversion_logic_id === ConversionLogics.Keep) {
    //         data['count'] = item.count;
    //         data['unit'] = item.unit;
    //       } else if (item.conversion_logic_id === ConversionLogics.Product) {
    //         if (item.convertible) {
    //           data['count'] = item.count * item.ratio;
    //           data['unit'] = item.conversion_unit;
    //         } else {
    //           data['count'] = item.count;
    //           data['unit'] = item.unit;
    //         }
    //       } else if (item.conversion_logic_id === ConversionLogics.ProductWeight) {
    //         data['count'] = item.count * item.weight;
    //         data['unit'] = 'KG';
    //       } else if (item.conversion_logic_id === ConversionLogics.ActualWeight) {
    //         const weight = recordData.record_group_weight_items?.find((w) => w.category.id === item.product_category_id);
    //         if (weight) {
    //           data['count'] = weight.weight;
    //           data['unit'] = '吨';
    //         } else {
    //           data['count'] = recordData.weight;
    //           data['unit'] = '吨';
    //         }
    //       } else {
    //         data['unit'] = 'KG';
    //         if (item.wr.conversion_logic_id === ConversionLogics.Keep) {
    //           data['count'] = item.count * item.wr.weight;
    //         } else if (item.wr.conversion_logic_id === ConversionLogics.Product) {
    //           data['count'] = item.count * item.ratio * item.wr.weight;
    //         }
    //       }
    //       data['all_price'] = data['count'] * data['unit_price'];
    //       return data;
    //     });

    //     const setData = Object.values(
    //       price_rule.reduce((acc, item) => {
    //         if (!item) {
    //           console.error('报价计算出错', price_rule);
    //           return acc;
    //         }
    //         if (!acc[item.name]) {
    //           acc[item.name] = { ...item };
    //         } else {
    //           acc[item.name].count += item.count;
    //           acc[item.name].all_price += item.all_price;
    //         }
    //         return acc;
    //       }, {}),
    //     );
    //     make_price = setData;
    //   }

    //   // ！产品
    //   const leaseData = lease_data
    //     .map((lease) => {
    //       const data = {
    //         name: lease.label,
    //         count: lease.count,
    //         unit: lease.unit,
    //         comment: lease.item_comment,
    //         product_id: lease.product_id,
    //         category_id: lease.category_id,
    //         product_category_name: lease.product_category_name,
    //       };
    //       if (lease.conversion_logic_id === ConversionLogics.Keep) {
    //         data['total'] = lease.count;
    //         data['conversion_unit'] = lease.unit;
    //       } else if (lease.conversion_logic_id === ConversionLogics.Product) {
    //         if (lease.convertible) {
    //           data['total'] = lease.count * lease.ratio;
    //           data['conversion_unit'] = lease.conversion_unit;
    //         } else {
    //           data['total'] = lease.count;
    //           data['conversion_unit'] = lease.unit;
    //         }
    //       } else if (lease.conversion_logic_id === ConversionLogics.ProductWeight) {
    //         data['total'] = lease.count * lease.weight;
    //         data['conversion_unit'] = 'KG';
    //       } else if (lease.conversion_logic_id === ConversionLogics.ActualWeight) {
    //         if (lease.convertible) {
    //           data['total'] = lease.count * lease.ratio;
    //           data['conversion_unit'] = lease.conversion_unit;
    //         } else {
    //           data['total'] = lease.count;
    //           data['conversion_unit'] = lease.unit;
    //         }
    //       } else {
    //         data['conversion_unit'] = 'KG';
    //         if (lease.wr?.conversion_logic_id === ConversionLogics.Keep) {
    //           data['total'] = lease.count * lease.wr?.weight;
    //         } else if (lease.wr?.conversion_logic_id === ConversionLogics.Product) {
    //           data['total'] = lease.count * lease.ratio * lease.wr?.weight;
    //         }
    //       }
    //       return data;
    //     })
    //     .sort((a, b) => a.category_id - b.category_id);

    //   // ！产品赔偿
    //   const product_fee =
    //     printSetup === PrintSetup.Manual
    //       ? fee_data.filter((item) => item.product_id && item.count_source === SourcesType.staff)
    //       : fee_data.filter((item) => item.product_id);
    //   const transFormProductFee = product_fee.map((item, index) => {
    //     // 购销/暂存/盘点无费用信息
    //     if (
    //       recordData.category === RecordCategory.purchase ||
    //       recordData.category === RecordCategory.staging ||
    //       recordData.category === RecordCategory.inventory
    //     ) {
    //       return;
    //     }
    //     // 人工录入没有数量
    //     if (item.count_source === SourcesType.staff && !item.fee_count) return;
    //     // 出库单，计数为入库量
    //     if (item.record_movement === '-1' && item.count_source === SourcesType.inbound) return;
    //     // 入库单，计数为出库量
    //     if (item.record_movement === '1' && item.count_source === SourcesType.outbound) return;
    //     const data = {
    //       isFee: true,
    //       isExcluded: item.is_excluded,
    //       name: item.custom_name || item.label,
    //       count1: item.count_source === SourcesType.staff ? item.fee_count : item.product_count,
    //       unit: item.unit,
    //       comment: '',
    //       product_id: item.product_id + '.' + (index + 1),
    //       category_id: item.product_category_id,
    //     };
    //     if (item.conversion_logic_id === ConversionLogics.Keep) {
    //       data['total'] = data.count1;
    //     } else if (item.conversion_logic_id === ConversionLogics.Product) {
    //       if (item.convertible) {
    //         data['total'] = data.count1 * item.product_ratio;
    //       } else {
    //         data['total'] = data.count1;
    //       }
    //     } else if (item.conversion_logic_id === ConversionLogics.ProductWeight) {
    //       data['total'] = data.count1 * item.product_weight;
    //     } else if (item.conversion_logic_id === ConversionLogics.ActualWeight) {
    //       data['total'] = item.actual_weight || item.record_weight;
    //     } else {
    //       if (item.weight_rules?.conversion_logic_id === ConversionLogics.Keep) {
    //         data['total'] = data.count1 * item.weight_rules.weight;
    //       } else if (item.weight_rules?.conversion_logic_id === ConversionLogics.Product) {
    //         data['total'] = data.count1 * item.weight_rules.weight * item.product_ratio;
    //       }
    //     }
    //     data['conversion_unit'] = item.unit;
    //     if (printSetup === PrintSetup.DisplayAndPrice) {
    //       data['count'] = data['total'];
    //       data['total'] = data['total'] * item.unit_price;
    //       data['conversion_unit'] = '元';
    //     }
    //     return data;
    //   });
    //   // ！无关联赔偿 item中
    //   let manualData = [];
    //   const noProductFee = fee_data.filter((item) => !item.product_id && item.count_source === SourcesType.staff);
    //   if (noProductFee.length) {
    //     const itemFee = await this.db.sequelize.query(`
    //       select ri.product_id, ri.count, p.category_id, ri.comment
    //       from records r
    //       left join record_items ri on ri.record_id = r.id and ri.product_id in (${noProductFee.map((item) => item.fee_product_id).join(',')})
    //       join product p on p.id = ri.product_id
    //       where r.id = ${recordData.id}
    //     `);
    //     const result: any = itemFee[0];
    //     manualData = result.map((item) => {
    //       const feeRule = noProductFee.find((f) => f.fee_product_id === item.product_id);
    //       if (!feeRule) return;
    //       const data = {
    //         name: feeRule.custom_name || feeRule.label,
    //         unit: feeRule.unit,
    //         conversion_unit: feeRule.unit,
    //         comment: item.comment || '',
    //       };
    //       if (feeRule.conversion_logic_id === ConversionLogics.Keep) {
    //         data['total'] = item.count;
    //       } else if (feeRule.conversion_logic_id === ConversionLogics.Product) {
    //         data['total'] = feeRule.convertible ? item.count * feeRule.product_ratio : item.count;
    //       } else if (feeRule.conversion_logic_id === ConversionLogics.ProductWeight) {
    //         data['total'] = item.count * feeRule.weight;
    //       } else if (feeRule.conversion_logic_id === ConversionLogics.ActualWeight) {
    //         data['total'] = feeRule.record_weight;
    //       } else {
    //         const weight_rule = item.weight_rules.find(
    //           (l) => l.product_id === item.product_id || l.product - RulesNumber === item.category_id,
    //         );
    //         if (weight_rule && weight_rule.conversion_logic_id === ConversionLogics.Keep) {
    //           return item.count * weight_rule.weight;
    //         } else if (weight_rule && weight_rule.conversion_logic_id === ConversionLogics.Product) {
    //           return item.count * feeRule.product_ratio * weight_rule.weight;
    //         }
    //       }
    //       if (printSetup === PrintSetup.DisplayAndPrice) {
    //         data['count'] = data['total'];
    //         data['total'] = data['total'] * feeRule.unit_price;
    //         data['conversion_unit'] = '元';
    //       }
    //       return data;
    //     });
    //   }
    //   // ！无关联赔偿，出入库量
    //   const fee =
    //     printSetup === PrintSetup.Manual
    //       ? []
    //       : fee_data.filter((item) => !item.product_id && item.count_source !== SourcesType.staff);
    //   const no_product_fee = fee
    //     .map((item) => {
    //       if (
    //         recordData.category === RecordCategory.purchase ||
    //         recordData.category === RecordCategory.staging ||
    //         recordData.category === RecordCategory.inventory
    //       ) {
    //         return;
    //       }
    //       if (item.record_movement === '-1' && item.count_source === SourcesType.inbound) return;
    //       if (item.record_movement === '1' && item.count_source === SourcesType.outbound) return;
    //       const data = {
    //         isFee: true,
    //         name: item.custom_name || item.label,
    //         unit: item.unit,
    //         comment: '',
    //       };
    //       if (item.conversion_logic_id === ConversionLogics.Keep) {
    //         data['total'] = lease_data.reduce((a, b) => a + b.count, 0);
    //       } else if (item.conversion_logic_id === ConversionLogics.Product) {
    //         data['total'] = lease_data.reduce((a, b) => a + (item.convertible ? b.count * b.ratio : b.count), 0);
    //       } else if (item.conversion_logic_id === ConversionLogics.ProductWeight) {
    //         data['total'] = lease_data.reduce((a, b) => a + b.count * b.weight, 0) / 1000;
    //       } else if (item.conversion_logic_id === ConversionLogics.ActualWeight) {
    //         data['total'] = item.record_weight;
    //       } else {
    //         if (item.weight_rules?.length) {
    //           data['total'] = lease_data.reduce((a, b) => {
    //             const weight_rule = item.weight_rules.find(
    //               (l) => l.product_id === b.product_id || l.product - RulesNumber === b.category_id,
    //             );
    //             if (weight_rule && weight_rule.conversion_logic_id === ConversionLogics.Keep) {
    //               return a + b.count * weight_rule.weight;
    //             } else if (weight_rule && weight_rule.conversion_logic_id === ConversionLogics.Product) {
    //               return a + b.count * b.ratio * weight_rule.weight;
    //             }
    //           }, 0);
    //         }
    //       }
    //       data['conversion_unit'] = '吨';
    //       if (printSetup === PrintSetup.DisplayAndPrice) {
    //         data['count'] = data['total'];
    //         data['total'] = data['total'] * item.unit_price;
    //         data['conversion_unit'] = '元';
    //       }
    //       return data;
    //     })
    //     .filter((item) => item && item.total);

    //   const product_fees = transFormProductFee.filter(Boolean);
    //   // 内容（租金+费用）
    //   const product_correlation = [...leaseData, ...product_fees].sort((a, b) => a.product_id - b.product_id);

    //   // 生成小计
    //   const productTotal = {};
    //   leaseData.forEach((element) => {
    //     if (element) {
    //       productTotal[element.category_id] = {
    //         name: element.product_category_name + '[小计]',
    //         total: (productTotal[element.category_id]?.total ?? 0) + element?.total,
    //         conversion_unit: element.conversion_unit,
    //         count: '',
    //         unit: '',
    //         isTotal: true,
    //         comment: '',
    //         category_id: element.category_id,
    //       };
    //     }
    //   });
    //   // 插入小计
    //   const productTotalItems = Object.entries(productTotal).map(([_, value]) => value);
    //   productTotalItems.forEach((itemB: any) => {
    //     const lastIndex = product_correlation.map((itemA) => itemA.category_id).lastIndexOf(itemB.category_id);
    //     if (lastIndex !== -1) {
    //       product_correlation.splice(lastIndex + 1, 0, itemB);
    //     } else {
    //       product_correlation.push(itemB);
    //     }
    //   });
    //   const recordPdfData = [...product_correlation, ...manualData, ...no_product_fee].filter(Boolean);
    //   return await renderItV2({
    //     detail: recordData,
    //     record: recordPdfData,
    //     priceRule: make_price,
    //     isDouble,
    //     printSetup,
    //   });
  }
}
