SELECT
  cpfi.conversion_logic_id,
  cpfi.count_source,
  cpfi.unit_price,
  cpfi.unit,
  p2.name || '[' || p.name || ']' AS fee_name,
  ri.count AS count_source_count
FROM
  settlements s
  -- 开始查产品费用规则
  JOIN contracts c ON c.id = s.contract_id
  JOIN contract_items ci ON c.id = ci.contract_id
  AND ci.start_date <= s.start_date
  AND ci.end_date >= ci.start_date
  JOIN contract_plans cp ON cp.id = ci.contract_plan_id
  JOIN contract_plan_fee_items cpfi ON cpfi.contract_plan_id = cp.id
  -- 查询人工录入的费用数据
  JOIN record_contract rc ON rc.contract_id = s.contract_id
  JOIN records r ON r.id = rc.record_id
  AND (s.end_date + INTERVAL '1 day - 1 millisecond') >= r.date
  LEFT JOIN record_items ri ON ri.record_id = r.id
  AND ri.new_product_id = cpfi.new_fee_products_id
  AND cpfi.count_source = '0'
  JOIN products p ON p.id = cpfi.new_fee_products_id
  LEFT JOIN products p2 ON p."parentId" = p2.id
  -- 查询人工录入的费用数据结束
WHERE
  s.id = :settlementsId
