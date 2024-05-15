CREATE OR REPLACE VIEW
  public.view_order_demi AS
SELECT
  business_id,
  '推广总数' AS "label",
  "orderTotalCount" AS "value"
FROM
  public.view_order_stat
UNION ALL
SELECT
  business_id,
  '有效总数' AS "label",
  "orderYouXiaoCount" AS "value"
FROM
  public.view_order_stat
UNION ALL
SELECT
  business_id,
  '跟进总数' AS "label",
  "orderGenJinCount" AS "value"
FROM
  public.view_order_stat
UNION ALL
SELECT
  business_id,
  '异常总数' AS "label",
  "orderYiChangCount" AS "value"
FROM
  public.view_order_stat
