-- 增值税计算
CREATE OR REPLACE VIEW
  public.view_invoice_tax AS
  --  发票进项表和完税凭证表: 1. 筛选所需字段并统一命名,2. 将发票进项表和完税凭证表, 两个表的数据合并
WITH RECURSIVE
  A_INPUT AS (
    SELECT
      purchaser_id AS company_id, -- 发票进项取购买方公司id,作为本公司id标识
      authentication_date AS "date", -- 发票进项取认证日期,作为计算月份的来源
      tax_amount,
      "state"
    FROM
      invoice_input
    UNION ALL
    SELECT
      purchaser_id AS company_id, -- 完税凭证,同发票进项字段
      authentication_date AS "date", -- 完税凭证,同发票进项字段
      tax_amount,
      "state"
    FROM
      invoice_receipt
  ),
  -- 发票销项表: 筛选所需字段并统一命名
  A_OUTPUT AS (
    SELECT
      seller_id AS company_id, -- 发票销项取销售方id,作为本公司id标识
      "Invoicing_date" AS "date", -- 发票销项取开票日期,作为计算月份的来源
      tax_amount,
      "state"
    FROM
      invoice_output
  ),
  -- 聚合A_INPUT: 1. 按照 company_id 和 date 聚合计算后的月份 "MONTH" 2. 获取对应月份的进项税额 input_tax_amount
  B_INPUT AS (
    SELECT
      company_id,
      DATE_TRUNC('month', "date") AS "MONTH",
      COALESCE(SUM(tax_amount), 0) AS input_tax_amount
    FROM
      A_INPUT
    WHERE
      "date" >= '2022-01-01' -- 筛选出日期在'2022-01-01'之后的数据 
      AND "state" = '1' -- 筛选出所有状态为正常的记录, 正常-1,作废-2
    GROUP BY
      company_id,
      "MONTH"
  ),
  -- 聚合B_OUTPUT: 1. 按照 company_id 和 date 聚合计算后的月份 "MONTH" 2. 获取对应月份的销项税额 output_tax_amount
  B_OUTPUT AS (
    SELECT
      company_id,
      DATE_TRUNC('month', "date") AS "MONTH",
      COALESCE(SUM(tax_amount), 0) AS out_tax_amount
    FROM
      A_OUTPUT
    WHERE
      "date" >= '2022-01-01' -- 筛选出日期在'2022-01-01'之后的数据 
      AND "state" = '1' -- 筛选出所有状态为正常的记录, 正常-1,作废-2
    GROUP BY
      company_id,
      "MONTH"
  ),
  -- JOIN 两个表,B_INPUT, B_OUTPUT: 1. 聚合两个表,保留全部记录 2. 聚合后的表,如果某个表的对应取值字段为null,则置为0
  C_INTIAL_TAX AS (
    SELECT
      COALESCE(B_INPUT.company_id, B_OUTPUT.company_id) AS company_id,
      COALESCE(B_INPUT."MONTH", B_OUTPUT."MONTH") AS "MONTH",
      COALESCE(B_INPUT.input_tax_amount, 0) AS input_tax_amount,
      COALESCE(B_OUTPUT.out_tax_amount, 0) AS out_tax_amount
    FROM
      B_INPUT
      FULL JOIN B_OUTPUT ON B_INPUT.company_id = B_OUTPUT.company_id
      AND B_INPUT."MONTH" = B_OUTPUT."MONTH"
  ),
  -- 计算出中间值 excessive_tax_amount, 用于之后的计算
  D_INTIAL_TAX AS (
    SELECT
      company_id,
      "MONTH",
      input_tax_amount,
      out_tax_amount,
      input_tax_amount - out_tax_amount AS excessive_tax_amount
    FROM
      C_INTIAL_TAX
    ORDER BY
      company_id,
      "MONTH"
  ),
  -- 加工 D_INTIAL_TAX 给每行数据添加row_num,用于下边递归计算的时候进行累加定位
  E_INTIAL_TAX AS (
    SELECT
      company_id,
      "MONTH",
      input_tax_amount,
      out_tax_amount,
      excessive_tax_amount,
      ROW_NUMBER() OVER (
        PARTITION BY
          company_id
        ORDER BY
          company_id,
          "MONTH"
      ) AS row_num
    FROM
      D_INTIAL_TAX
    ORDER BY
      company_id,
      "MONTH"
  ),
  -- 定义一个递归来根据上一个应缴税额,计算当前的应缴税额
  F_INTIAL_TAX AS (
    -- 初始查询部分
    (
      SELECT
        row_num,
        company_id,
        "MONTH",
        input_tax_amount,
        out_tax_amount,
        excessive_tax_amount,
        -- 当前应缴税额的初始值 
        (
          COALESCE(
            (
              SELECT
                intial_value
              FROM
                invoice_tax_intial
              WHERE
                invoice_tax_intial.company_id = E_INTIAL_TAX.company_id
            ),
            0
          ) + excessive_tax_amount
        ) AS monthly_tax_amount
      FROM
        E_INTIAL_TAX
      WHERE
        row_num = 1
    )
    UNION ALL
    -- 递归查询部分
    (
      SELECT
        curr.row_num,
        curr.company_id,
        curr."MONTH",
        curr.input_tax_amount,
        curr.out_tax_amount,
        curr.excessive_tax_amount,
        (
          CASE
            WHEN prev.monthly_tax_amount <= 0
            -- 如果上一条 monthly_tax_amount 是负数, 代表上月交出税
            THEN curr.excessive_tax_amount
            -- 如果上一条 monthly_tax_amount 是正数, 代表上月有结余
            ELSE curr.excessive_tax_amount + prev.monthly_tax_amount
          END
        ) AS monthly_tax_amount
      FROM
        E_INTIAL_TAX AS curr
        -- 连接当前行和前一行
        JOIN F_INTIAL_TAX AS prev ON (
          curr.company_id = prev.company_id
          AND curr.row_num = prev.row_num + 1
        )
    )
  ),
  -- 拿到当月应缴税后, 求附加税和合计税额
  G_INTIAL_TAX AS (
    SELECT
      row_num,
      company_id,
      "MONTH",
      input_tax_amount,
      out_tax_amount,
      monthly_tax_amount,
      (
        CASE
          WHEN monthly_tax_amount < 0 THEN monthly_tax_amount * 0.12
          ELSE 0
        END
      ) AS super_tax_amount,
      (
        CASE
          WHEN monthly_tax_amount < 0 THEN monthly_tax_amount + monthly_tax_amount * 0.12
          ELSE 0
        END
      ) AS monthly_total_tax_amount
    FROM
      F_INTIAL_TAX
    ORDER BY
      company_id,
      "MONTH"
  )
  -- 主查询
  -- 根据计算后的表,获取最终的视图
SELECT
  *
FROM
  G_INTIAL_TAX
ORDER BY
  company_id,
  "MONTH"
