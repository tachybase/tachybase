import { Migration } from '@nocobase/server';

export default class extends Migration {
  appVersion = '<0.19.0-alpha.3';

  async up() {
    console.log('开始更新新版合同规则：import-contract-rule-V2.ts');
    // 删除测试数据
    await this.app.db.sequelize.query(`
          DELETE FROM contract_plan_lease_items;
          DELETE FROM contract_plan_lease_items_products;
          DELETE FROM contract_plan_fee_items;
          DELETE FROM contract_plans;
          DELETE FROM contract_items;
          COMMIT;
        `);
    // 导入新版租金数据
    await this.app.db.sequelize.query(`
        INSERT INTO contract_plan_lease_items (
          "updatedAt",
          "createdAt",
          "updatedById",
          "createdById",
          id,
          sort,
          unit_price,
          "comment",
          conversion_logic_id,
          contract_plan_id
          )
          SELECT
              lr."updatedAt",
              lr."createdAt",
              lr."updatedById",
              lr."createdById",
              lr.id,
              lr.sort,
              lr.unit_price,
              lr."comment",
              lr.conversion_logic_id,
              lr.contract_rule_id as contract_plan_id
          FROM lease_rules lr
          WHERE lr.record_id IS NULL;
        `);
    // 导入产品表数据
    await this.app.db.sequelize.query(`
          INSERT INTO contract_plan_lease_items_products (
              "updatedAt",
              "createdAt",
              "updatedById",
              "createdById",
              sort,
              lease_item_id,
              product_id
          )
          SELECT
              lr."updatedAt",
              lr."createdAt",
              lr."updatedById",
              lr."createdById",
              lr.sort,
              lr.id,
              lr.product_id
          FROM lease_rules lr
          WHERE lr.record_id IS NULL;
        `);

    // 导入新版费用规则（无产品关联）
    await this.app.db.sequelize.query(`
      insert into contract_plan_fee_items (
          "createdAt" ,
          "updatedAt" ,
          "createdById" ,
          "updatedById" ,
          "sort" ,
          "unit_price" ,
          "unit",
          "comment" ,
          "fee_product_id",
          "conversion_logic_id" ,
          "contract_plan_id",
          "count_source",
          "alias"
      )
      select
          cfi."createdAt" ,
          cfi."updatedAt" ,
          cfi."createdById" ,
          cfi."updatedById" ,
          cfi.sort ,
          cfi.unit_price ,
          cfi.unit_name as unit,
          cfi."comment" ,
          cfi.product_or_fee_id as fee_product_id,
          cfi.conversion_logic_id ,
          cfi.contract_rule_id as contract_plan_id,
          cfi.count_source,
          p.label as alias
      from contract_fee_items cfi
      join product p on p.id = cfi.product_or_fee_id
      where cfi.product_id is null
    `);

    // 导入新版费用规则（有产品关联）
    await this.app.db.sequelize.query(`
          insert into contract_plan_fee_items (
              "createdAt" ,
              "updatedAt" ,
              "createdById" ,
              "updatedById" ,
              "sort" ,
              "unit_price" ,
              "unit",
              "comment" ,
              "fee_product_id",
              "conversion_logic_id" ,
          --	"contract_plan_id",
              "count_source",
              "alias",
              "lease_item_id"
          )
          select
              cfi."createdAt" ,
              cfi."updatedAt" ,
              cfi."createdById" ,
              cfi."updatedById" ,
              cfi.sort ,
              cfi.unit_price ,
              cfi.unit_name as unit,
              cfi."comment" ,
              cfi.product_or_fee_id as fee_product_id,
              cfi.conversion_logic_id ,
              cfi.count_source,
              p.label as alias,
              cplip.lease_item_id
          from contract_fee_items cfi
          join product p on p.id = cfi.product_or_fee_id
          join contract_plan_lease_items lr on lr.contract_plan_id = cfi.contract_rule_id
          join contract_plan_lease_items_products cplip on  lr.id = cplip.lease_item_id and cplip.product_id = cfi.product_id
          where cfi.product_id is not null
      `);

    // 导入合同方案V2
    await this.app.db.sequelize.query(`
          insert into contract_plans  (
              "id",
              "name",
              "comment"
          )
         select cr.id, cr.name, cr.comment
         from contract_rules cr
      `);

    // 导入合同方案V2——明细项
    await this.app.db.sequelize.query(`
        insert into contract_items (
          "createdAt" ,
          "updatedAt" ,
          "createdById" ,
          "updatedById" ,
          "id",
          "start_date",
          "end_date",
          "comment",
          "contract_id",
          "contract_plan_id"
        )
        select
          cri."createdAt" ,
          cri."updatedAt" ,
          cri."createdById" ,
          cri."updatedById" ,
          cri.id,
          cri.start_date,
          cri.end_date,
          cri.comment,
          cri.contract_id,
          cri.contract_rule_id
        from contract_rule_items cri
    `);
    console.log('结束更新新版合同规则：import-contract-rule-V2.ts');
  }

  async down() {}
}
