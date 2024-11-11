--- 三聪头, 转化订单数据, 用于统计分析
--- 原始数据, 是订单数据, 包含订单号, 订单创建时间, 关联的代理商, 
--- 订单的金额, 订单的佣金, 订单的状态,
--- 新的数据表: 订单编号, 代理商, 订单金额, 订单佣金, 订单的创建时间, 订单的展平状态,
--- 推广总数(每个代理商关联的订单总数); 
--- 有效总数(订单达到首充状态的订单数);
--- 跟进总数(下单成功, 但是物流异常, 或者物流正常但是没有首充的订单数)
--- 异常总数(下单没有成功的数量)
CREATE OR REPLACE VIEW
  public.view_order_stat AS
WITH
  orders_need_fields_all AS (
    SELECT
      "createdAt" AT TIME ZONE 'Asia/Shanghai' AS "createDate",
      "updatedAt" AT TIME ZONE 'Asia/Shanghai' AS "updateDate",
      "createdById",
      "updatedById",
      business_id,
      order_id,
      amount,
      --- 订单状态
      status_order,
      --- 物流状态
      status_logistics,
      --- 激活状态
      activation_status,
      --- 充值状态
      status_recharge,
      --- 结算状态
      status_settlement
    FROM
      orders
  ),
  --- 推广总数
  orders_tuiguang AS (
    SELECT
      business_id,
      COALESCE(COUNT(*), 0) AS "orderTotalCount"
    FROM
      orders_need_fields_all
    GROUP BY
      business_id
  ),
  --- 有效总数
  order_youxiao AS (
    SELECT
      business_id,
      COALESCE(COUNT(*), 0) AS "orderYouXiaoCount"
    FROM
      orders_need_fields_all
    WHERE
      status_recharge = '1' --- 0/未充值, 1/已充值
    GROUP BY
      business_id
  ),
  --- 跟进总数
  order_genjin AS (
    SELECT
      business_id,
      COALESCE(COUNT(*), 0) AS "orderGenJinCount"
    FROM
      orders_need_fields_all
    WHERE
      status_order = '3' --- 1/审核中, 2/审核失败, 3/审核成功
      AND status_recharge = '0' --- 0/未充值, 1/已充值
    GROUP BY
      business_id
  ),
  --- 异常总数
  order_yichang AS (
    SELECT
      business_id,
      COALESCE(COUNT(*), 0) AS "orderYiChangCount"
    FROM
      orders_need_fields_all
    WHERE
      status_order = '2' --- 1/审核中, 2/审核失败, 3/审核成功
    GROUP BY
      business_id
  )
SELECT
  orders_tuiguang.business_id,
  orders_tuiguang."orderTotalCount",
  order_youxiao."orderYouXiaoCount",
  order_genjin."orderGenJinCount",
  order_yichang."orderYiChangCount"
FROM
  orders_tuiguang
  LEFT JOIN order_youxiao ON orders_tuiguang.business_id = order_youxiao.business_id
  LEFT JOIN order_genjin ON orders_tuiguang.business_id = order_genjin.business_id
  LEFT JOIN order_yichang ON orders_tuiguang.business_id = order_yichang.business_id
