SELECT
  rc.movement,
  r.id AS record_id,
  r.number AS record_number,
  r.weight AS record_weight,
  p.id AS product_id,
  ri.count AS product_count,
  p2."name" AS product_name,
  p2."name" || '[' || p.name || ']' AS product_label,
  p2.convertible AS product_conbertible,
  p2.unit AS product_unit,
  p2.conversion_unit AS product_convertible_unit,
  p.weight AS product_weight,
  p.ratio AS porduct_ratio,
  rgwi.weight AS group_weight,
  wr.conversion_logic_id AS weight_rules_conversion_logic_id,
  wr.weight AS weight_rules_weight,
  cpli.conversion_logic_id,
  cpli.unit_price,
  c.calc_type,
  c.tax_included,
  c.tax_rate,
  r.date,
  rgwi.new_product_id AS belong_to_group_weight_id,
  p3.name AS belong_to_group_weight_name
FROM
  settlements s
  -- 开始查租金规则
  JOIN contracts c ON c.id = s.contract_id
  JOIN contract_items ci ON c.id = ci.contract_id
  AND ci.start_date <= s.start_date
  AND ci.end_date >= s.start_date
  JOIN contract_plans cp ON cp.id = ci.contract_plan_id
  JOIN contract_plan_lease_items cpli ON cpli.contract_plan_id = cp.id
  -- 租金规则查询完毕
  -- 新版产品匹配处理join
  JOIN view_products_search_rule_special vpsrs ON cpli.new_products_id = ANY (vpsrs.parents)
  -- 新版产品匹配处理join end
  -- 开始查询订单相关，产品等
  JOIN record_contract rc ON rc.contract_id = c.id
  JOIN records r ON r.id = rc.record_id
  AND (s.end_date + INTERVAL '1 day - 1 millisecond') >= r.date
  JOIN record_items ri ON ri.record_id = r.id
  AND ri.new_product_id = vpsrs.id
  JOIN products p ON p.id = ri.new_product_id
  LEFT JOIN products p2 ON p."parentId" = p2.id
  -- 开始查询订单相关，产品等，结束
  -- 实际重量查询
  LEFT JOIN record_group_weight_items rgwi ON rgwi.record_id = r.id
  AND cpli.conversion_logic_id = 3
  AND rgwi.new_product_id = ANY (vpsrs.parents)
  LEFT JOIN products p3 ON p3.id = rgwi.new_product_id
  -- 实际重量查询结束
  -- 重量表情况
  LEFT JOIN weight_rules wr ON cpli.conversion_logic_id = wr.logic_id
  AND cpli.conversion_logic_id > 4
  AND wr.new_product_id = ri.new_product_id
  -- 重量表情况结束
WHERE
  s.id = :settlementsId
