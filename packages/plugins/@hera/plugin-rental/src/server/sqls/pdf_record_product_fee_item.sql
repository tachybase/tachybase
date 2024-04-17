-- 目前换算，单位只查询目标根夫级，如果子有已子为主
SELECT
  CASE
    WHEN p.unit IS NOT NULL THEN p.unit
    ELSE p4.unit
  END AS unit,
  CASE
    WHEN p.convertible IS NOT NULL THEN p.convertible
    ELSE p4.convertible
  END AS convertible,
  CASE
    WHEN p.conversion_unit IS NOT NULL THEN p.conversion_unit
    ELSE p4.conversion_unit
  END AS conversion_unit,
  p4.id AS parent_id,
  p.ratio,
  p.weight,
  p.id AS product_id,
  rifi.count,
  rifi.is_excluded,
  rifi."comment",
  ri.count AS product_count,
  rifi.count AS fee_count,
  p2.id AS fee_products_id,
  p3.id AS fee_parent_id,
  p3."name" || '[' || p2."name" || ']' AS "fee_name",
  p2.custom_name
FROM
  records r
  JOIN record_items ri ON ri.record_id = r.id
  JOIN products p ON p.id = ri.new_product_id
  LEFT JOIN products p4 ON p."parentId" = p4.id
  LEFT JOIN record_item_fee_items rifi ON rifi.record_item_id = ri.id
  JOIN products p2 ON p2.id = rifi.new_product_id
  LEFT JOIN products p3 ON p2."parentId" = p3.id
WHERE
  r.id = :recordId
