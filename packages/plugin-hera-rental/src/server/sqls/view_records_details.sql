-- 订单明细查询
CREATE OR REPLACE VIEW
  public.view_records_details AS
SELECT
  project."name" AS project_name,
  product."name" AS product_name,
  product.spec AS product_spec,
  project.category,
  product_category."name",
  CASE
    WHEN product_category.convertible = TRUE THEN SUM(record_items."count" * product.ratio)
    ELSE SUM(record_items."count")
  END AS subtotal,
  CASE
    WHEN product_category.convertible = TRUE THEN product_category.conversion_unit
    ELSE product_category.unit
  END AS unit,
  CASE
    WHEN records.movement = '1' THEN SUM(record_items."count")
    ELSE 0
  END AS in_stock,
  CASE
    WHEN records.movement = '-1' THEN SUM(record_items."count")
    ELSE 0
  END AS out_stock,
  records."date"
  -- 		array_agg(records."number") as record_numbers
FROM
  records
  LEFT JOIN contracts ON records.contract_id = contracts.id
  LEFT JOIN record_items ON records.id = record_items.record_id
  LEFT JOIN product ON record_items.product_id = product.id
  LEFT JOIN project ON contracts.project_id = project."id"
  LEFT JOIN product_category ON product.category_id = product_category.id
GROUP BY
  project."name",
  product."name",
  product.spec,
  product_category.convertible,
  product.ratio,
  product_category.unit,
  product_category.conversion_unit,
  records.movement,
  records."date",
  project.category,
  product_category."name"
