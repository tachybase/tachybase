SELECT
  r."date",
  p.id AS products_id,
  p2.id AS "parentId",
  p2.name AS "parentName",
  p2.name || '[' || p.name || ']' AS "name",
  p2.unit,
  p2.convertible,
  p2.conversion_unit,
  p.weight AS products_weight,
  p.ratio AS products_ratio,
  cpli.conversion_logic_id,
  ri.count,
  wr.conversion_logic_id AS wr_logic_id,
  wr.weight AS wr_weight,
  cpli.unit_price
FROM
  records r
  JOIN contracts c ON c.id = :contractId
  JOIN contract_items ci ON c.id = ci.contract_id
  AND ci.start_date <= r."date"
  AND ci.end_date >= r."date"
  JOIN contract_plans cp ON cp.id = ci.contract_plan_id
  JOIN contract_plan_lease_items cpli ON cpli.contract_plan_id = cp.id
  JOIN view_products_search_rule_special vpsrs ON cpli.new_products_id = ANY (vpsrs.parents)
  JOIN record_items ri ON ri.record_id = r.id
  AND ri.new_product_id = vpsrs.id
  JOIN products p ON p.id = ri.new_product_id
  LEFT JOIN products p2 ON p."parentId" = p2.id
  LEFT JOIN weight_rules wr ON cpli.conversion_logic_id = wr.logic_id
  AND cpli.conversion_logic_id > 4
  AND wr.new_product_id = ri.new_product_id
WHERE
  r.id = :recordId
