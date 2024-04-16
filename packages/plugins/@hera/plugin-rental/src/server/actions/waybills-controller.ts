import { Context } from '@nocobase/actions';
import { renderWaybill } from '../pdf-documents/waybills-document';
import { SqlLoader } from '@hera/plugin-core';
import { Action, Controller, Inject } from '@nocobase/utils';
import { QueryTypes } from 'sequelize';
import { Waybill } from '../../interfaces/waybill';
import { FilterParser } from '@nocobase/database';

@Controller('waybills')
export class WaybillsController {
  @Inject(() => SqlLoader)
  private sqlLoader: SqlLoader;

  @Action('pdf')
  async printPreview(ctx: Context) {
    const {
      params: { recordId, margingTop },
    } = ctx.action;
    if (recordId === 'undefined' || recordId === undefined) {
      ctx.body = await renderWaybill(null);
      return;
    }
    const waybills = await ctx.db.sequelize.query(this.sqlLoader.sqlFiles['pdf_waybills'], {
      replacements: {
        recordId: recordId,
      },
      type: QueryTypes.SELECT,
    });
    const settings = {};
    if (Number(margingTop)) {
      settings['margingTop'] = Number(margingTop);
    } else {
      const currentUser = await ctx.db.getRepository('users').findOne({ filter: { id: ctx.state.currentUser.id } });
      settings['margingTop'] = Number(currentUser?.pdf_top_margin) || 0;
    }
    ctx.body = await renderWaybill(waybills[0] as Waybill, settings);
  }

  @Action('group')
  async group(ctx: Context) {
    const { filter } = ctx.action.params.values;
    const collectionName = 'waybills';
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
        [
          sequelize.fn(
            'sum',
            sequelize.cast(
              sequelize.literal(
                'COALESCE(weight_or_amount, 0) * COALESCE(unit_price, 0) + COALESCE(additional_cost, 0)',
              ),
              'double precision',
            ),
          ),
          'price',
        ],
        [sequelize.col('carrier_id'), 'carrier_id'],
        [sequelize.col('carrier.name'), 'name'],
        [sequelize.col('paid'), 'paid'],
        [sequelize.col('checked'), 'checked'],
      ],
      include: [
        {
          association: 'carrier',
          attributes: [],
        },
        ...parsedFilterInclude,
      ],
      // 承运商，付款，结清
      group: [
        sequelize.col('carrier.name'),
        sequelize.col('carrier_id'),
        sequelize.col('paid'),
        sequelize.col('checked'),
      ],
      order: [],
      subQuery: false,
      raw: true,
    } as any;
    // 付款
    const records = await ctx.db.getModel('waybills').findAll(query);
    const data = {
      labels: ['收款人', '小计', '已结清款', '未结清款', '已核对款', '未核对款'],
      values: [],
    };
    const all = ['合计', 0, 0, 0, 0, 0];
    records.forEach((item) => {
      let res = data.values.find((r) => r[0] === item.name);
      if (!res) {
        res = [item.name, 0, 0, 0, 0, 0];
        data.values.push(res);
      }
      res[1] += item.price; // 小计
      all[1] += item.price;
      if (item.paid) {
        res[2] += item.price; // 已结清款
        all[2] += item.price;
      } else {
        res[3] += item.price; // 未结清款
        all[3] += item.price;
      }
      if (item.checked) {
        res[4] += item.price; // 已核对款
        all[4] += item.price;
      } else {
        res[5] += item.price; // 未核对款
        all[5] += item.price;
      }
    });
    data.values.push(all);
    ctx.body = data;
  }
}
