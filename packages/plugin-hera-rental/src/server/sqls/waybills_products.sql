SELECT
  p2."name" || '/' || p.name AS products_name,
  p2.convertible,
  p2.unit,
  p2.conversion_unit,
  p.ratio,
  ri.count,
  CASE
    WHEN p2.convertible THEN ri.count * COALESCE(p.ratio, 1)
    ELSE ri.count
  END AS total
FROM
  waybills w
  JOIN record_items ri ON ri.record_id = w.record_id
  JOIN products p ON p.id = ri.new_product_id
  JOIN products p2 ON p2.id = p."parentId"
WHERE
  w.id = :recordId
  -- 运输单相关产品查询
