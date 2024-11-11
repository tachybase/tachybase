import { Migration } from '@tachybase/server';

import { ConversionLogics } from '../../utils/constants';

export default class extends Migration {
  appVersion = '<0.19.0-alpha.3';
  async up() {
    console.log('开始：购销单总金额计算开始');
    const data = await this.db.sequelize.query(`
        select
            r.id as record_id,
            p.id as product_id,
            pc.id as product_category_id,
            lr.conversion_logic_id,
            lr.unit_price,
            ri.count,
            rwi.product_category_id as weight_item,
            wr.conversion_logic_id as weight_logic_id,
            wr.weight as weitht_calc,
            CASE
                WHEN lr.conversion_logic_id = 1 THEN ri.count * lr.unit_price
                WHEN lr.conversion_logic_id = 2 THEN CASE
                        WHEN pc.convertible = true THEN ri.count * p.ratio * lr.unit_price
                        ELSE ri.count * lr.unit_price
                    END
                WHEN lr.conversion_logic_id = 3 THEN CASE
                    WHEN rwi.product_category_id is not null THEN rwi.weight * lr.unit_price
                        ELSE r.weight * lr.unit_price
                        --CASE
                        --    WHEN pc.convertible = true THEN ri.count * p.ratio * lr.unit_price
                        --    ELSE ri.count * lr.unit_price
                        --END
                    END
                WHEN lr.conversion_logic_id = 4 THEN ri.count * p.weight * lr.unit_price
                ELSE CASE
                        WHEN wr.conversion_logic_id = 1 and pc.convertible is true THEN ri.count * p.ratio * wr.weight * lr.unit_price
                        WHEN wr.conversion_logic_id = 2 and pc.convertible is true THEN ri.count * p.ratio * lr.unit_price
                        WHEN wr.conversion_logic_id = 1 and pc.convertible is not true THEN ri.count * wr.weight * lr.unit_price
                        WHEN wr.conversion_logic_id = 2 and pc.convertible is not true THEN ri.count * lr.unit_price
                    END
            END AS item_price
        from records r
        join record_items ri on r.id = ri.record_id
        join product p on ri.product_id = p.id
        join product_category pc on p.category_id = pc.id
        join lease_rules lr on r.id = lr.record_id and (p.id = lr.product_id or pc.id+99999 = lr.product_id)
        left join weight_rules wr on lr.conversion_logic_id > 4 and wr.logic_id = lr.conversion_logic_id and wr.product_id = p.id
        left join record_weight_items rwi on r.id = rwi.record_id and rwi.product_category_id = pc.id
        where r.category = '1' and r.all_price is null
    `);
    const recordsData = data[0];
    const transform = {};
    recordsData.forEach((item: any) => {
      if (transform[item.record_id] && item.conversion_logic_id !== ConversionLogics.ActualWeight) {
        transform[item.record_id] = {
          allPrice: transform[item.record_id].allPrice + item.item_price,
          logicId: item.conversion_logic_id,
        };
      } else if (!transform[item.record_id]) {
        transform[item.record_id] = { allPrice: item.item_price, logicId: item.conversion_logic_id };
      }
    });
    const updateData = Object.keys(transform).map((item) => {
      return {
        id: item,
        all_price: transform[item].allPrice,
      };
    });
    for (const record of updateData) {
      await this.db.sequelize.query(
        `
          update records
          set all_price = ${record.all_price || 0}
          where records.id = ${record.id};
        `,
      );
    }
    console.log('更新了', updateData.length, '条数据');
    console.log('结束：购销单总金额计算完成');
  }
  async down() {}
}
