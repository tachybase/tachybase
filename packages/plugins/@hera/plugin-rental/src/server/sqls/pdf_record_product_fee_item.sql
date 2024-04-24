SELECT
  ri.count,
  rfin.count AS fee_count,
  rfin.new_product_id AS products_id,
  rfin.new_fee_product_id AS fee_product_id,
  p2."name" || '[' || p."name" || ']' AS fee_product,
  p.custom_name AS fee_custom_name,
  p4.convertible AS fee_convertible,
  p4.unit AS fee_unit,
  p4.conversion_unit AS fee_conversion_unit,
  p3.weight AS fee_weight,
  p3.ratio AS fee_ratio,
  rfin.is_excluded,
  rfin."comment",
  cpfi.count_source,
  cpfi.conversion_logic_id,
  cpfi.unit AS fee_rule_unit,
  cpfi.unit_price
FROM
  record_contract rc
  JOIN records r ON r.id = rc.record_id
  JOIN contract_items ci ON ci.contract_id = rc.contract_id
  AND ci.start_date <= r."date"
  AND ci.end_date >= r."date"
  JOIN contract_plans cp ON cp.id = ci.contract_plan_id
  JOIN contract_plan_lease_items cpli ON cpli.contract_plan_id = cp.id
  JOIN view_products_search_rule_special vpsrs ON cpli.new_products_id = ANY (vpsrs.parents)
  JOIN record_fee_items_new rfin ON rfin.record_contract_id = rc.id
  AND rfin.new_product_id = vpsrs.id
  JOIN products p ON p.id = rfin.new_fee_product_id
  LEFT JOIN products p2 ON p."parentId" = p2.id
  JOIN contract_plan_fee_items cpfi ON cpfi.lease_item_id = cpli.id
  AND cpfi.new_fee_products_id = rfin.new_fee_product_id
  JOIN record_items ri ON ri.record_id = r.id
  AND ri.new_product_id = vpsrs.id
  JOIN products p3 ON p3.id = ri.new_product_id
  LEFT JOIN products p4 ON p3."parentId" = p4.id
WHERE
  rc.record_id = :recordId
  AND rc.contract_id = :contractId
