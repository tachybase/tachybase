-- 目前换算，单位只查询目标根夫级，如果子有已子为主
SELECT
  p2.id AS parent_id,
  p2.name AS parent_name,
  p.id AS product_id,
  p.name AS product_name,
  p2."name" || '[' || p."name" || ']' AS "name",
  p.ratio, -- 换算比例在单个产品身上
  p.custom_name,
  p.weight,
  ri.count,
  ri."comment" AS record_items_comment,
  CASE
    WHEN p.unit IS NOT NULL THEN p.unit
    ELSE p2.unit
  END AS unit, -- 单位
  CASE
    WHEN p.convertible IS NOT NULL THEN p.convertible
    ELSE p2.convertible
  END AS convertible, -- 换算
  CASE
    WHEN p.conversion_unit IS NOT NULL THEN p.conversion_unit
    ELSE p2.conversion_unit
  END AS conversion_unit -- 换算单位
FROM
  records r
  JOIN record_items ri ON ri.record_id = r.id
  JOIN products p ON p.id = ri.product_id -- 录单中产品只允许选择到最后一个层级
  LEFT JOIN products p2 ON p."parentId" = p2.id -- 上一个层级应为分类，携带是否换算，单位信息（目前先考虑基本情况）
WHERE
  r.id = :recordId
  -- 赔偿内容想法：每一项赔偿内容携带所属的根id就好，后面根据根id可进行排序，没有根id则是无产品关联的，所以合同查询直接全部结构查处，降低维护难度
