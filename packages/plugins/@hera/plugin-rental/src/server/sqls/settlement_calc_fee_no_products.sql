SELECT
  cpfi.conversion_logic_id,
  cpfi.count_source,
  cpfi.unit_price,
  cpfi.unit,
  p.id AS fee_product_id,
  p2.name AS fee_name,
  p2.name || '[' || p.name || ']' AS fee_label
FROM
  settlements s
  -- 开始查产品费用规则
  JOIN contracts c ON c.id = s.contract_id
  JOIN contract_items ci ON c.id = ci.contract_id
  AND ci.date_range @> s.start_date
  JOIN contract_plans cp ON cp.id = ci.contract_plan_id
  JOIN contract_plan_fee_items cpfi ON cpfi.contract_plan_id = cp.id
  JOIN products p ON p.id = cpfi.new_fee_products_id
  LEFT JOIN products p2 ON p."parentId" = p2.id
WHERE
  s.id = :settlementsId
