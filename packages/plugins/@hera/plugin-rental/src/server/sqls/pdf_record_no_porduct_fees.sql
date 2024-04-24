SELECT
  p.weight,
  p.ratio,
  p2.convertible,
  p2.unit,
  p2.conversion_unit,
  p2.name || '[' || p.name || ']' AS NAME,
  p.custom_name,
  cpfi.unit_price,
  cpfi.conversion_logic_id,
  cpfi.unit,
  cpfi.count_source,
  cpfi.new_fee_products_id AS fee_products_id,
  rfin.count, -- 无关联手工录入数量
  rfin.is_excluded,
  wr2.weight AS wr_weight, --人工录入数量重量规则
  wr2.conversion_logic_id AS wr_logic_id,
  COALESCE(JSONB_AGG(wr), '[]'::jsonb) AS weight_rules -- 出库入库量的重量规则表
FROM
  contracts c
  JOIN records r ON r.id = :recordId
  JOIN contract_items ci ON c.id = ci.contract_id
  AND ci.start_date <= r."date"
  AND ci.end_date >= r."date"
  JOIN contract_plans cp ON cp.id = ci.contract_plan_id
  JOIN contract_plan_fee_items cpfi ON cpfi.contract_plan_id = cp.id
  JOIN products p ON p.id = cpfi.new_fee_products_id
  LEFT JOIN products p2 ON p."parentId" = p2.id
  JOIN record_contract rc ON rc.record_id = r.id
  AND rc.contract_id = c.id
  LEFT JOIN record_fee_items_new rfin ON rfin.record_contract_id = rc.id
  AND rfin.new_fee_product_id = cpfi.new_fee_products_id
  AND cpfi.count_source = '0'
  LEFT JOIN weight_rules wr ON cpfi.conversion_logic_id = wr.logic_id
  AND cpfi.count_source != '0'
  AND cpfi.conversion_logic_id > 4
  LEFT JOIN weight_rules wr2 ON cpfi.conversion_logic_id = wr.logic_id
  AND cpfi.new_fee_products_id = wr2.new_product_id
  AND cpfi.count_source = '0'
WHERE
  c.id = :contractId
GROUP BY --jsonb_agg需要分组
  cpfi.unit_price,
  cpfi.conversion_logic_id,
  cpfi.unit,
  cpfi.count_source,
  cpfi.new_fee_products_id,
  rfin.count,
  p.weight,
  p.ratio,
  p2.convertible,
  p2.unit,
  p2.conversion_unit,
  p.name,
  p2.name,
  p.custom_name,
  wr2.weight,
  wr2.conversion_logic_id,
  rfin.is_excluded
