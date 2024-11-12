SELECT
  rc.movement,
  r.number,
  ri.new_product_id AS product_id,
  p2."name" AS fee_product_name,
  p."name" AS fee_product_label,
  cpfi.unit_price AS fee_price,
  cpfi.conversion_logic_id,
  cpfi.unit,
  cpfi.count_source,
  rifi.count,
  wr.conversion_logic_id AS weight_rule_conversion_logic_id,
  wr.weight AS weight_rules_weight,
  rgwi.weight AS group_weight,
  rgwi.new_product_id AS belong_to_group_weight_id,
  p3.name AS belong_to_group_weight_name,
  r.weight AS records_weight,
  c.calc_type,
  r.date,
  rifi.is_excluded
FROM
  settlements s
  -- 开始查产品费用规则
  JOIN contracts c ON c.id = s.contract_id
  JOIN contract_items ci ON c.id = ci.contract_id
  AND ci.date_range @> s.start_date
  JOIN contract_plans cp ON cp.id = ci.contract_plan_id
  JOIN contract_plan_lease_items cpli ON cpli.contract_plan_id = cp.id
  JOIN contract_plan_fee_items cpfi ON cpfi.lease_item_id = cpli.id
  -- 产品费用查询完毕
  -- 新版产品匹配处理join
  JOIN view_products_search_rule_special vpsrs ON cpli.new_products_id = ANY (vpsrs.parents)
  -- 新版产品匹配处理join end
  -- 开始查询订单相关，产品赔偿等
  JOIN record_contract rc ON rc.contract_id = c.id
  JOIN records r ON r.id = rc.record_id
  AND (s.end_date + INTERVAL '1 day - 1 millisecond') >= r.date
  JOIN record_items ri ON ri.record_id = r.id
  AND ri.new_product_id = vpsrs.id
  -- 要做的是查订单item中的赔偿要跟cpfi中费用产品join
  JOIN record_item_fee_items rifi ON rifi.record_item_id = ri.id
  AND rifi.new_product_id = cpfi.new_fee_products_id
  JOIN products p ON p.id = rifi.new_product_id
  LEFT JOIN products p2 ON p."parentId" = p2.id
  -- 开始查询订单相关，产品等，结束
  -- 实际重量查询
  LEFT JOIN record_group_weight_items rgwi ON rgwi.record_id = r.id
  AND cpfi.conversion_logic_id = 3
  AND rgwi.new_product_id = ANY (vpsrs.parents)
  JOIN products p3 ON p3.id = rgwi.new_product_id
  -- 实际重量查询结束
  -- 重量表情况
  LEFT JOIN weight_rules wr ON cpfi.conversion_logic_id = wr.logic_id
  AND cpfi.conversion_logic_id > 4
  AND wr.new_product_id = ri.new_product_id
  -- 重量表情况结束
WHERE
  s.id = :settlementsId
