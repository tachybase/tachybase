CREATE OR REPLACE VIEW
  public.view_record_items AS
SELECT
  record_items.id,
  project.id AS project_id,
  product.id AS product_id,
  records.id AS record_id,
  product_category.id AS product_category_id,
  records.number,
  CASE
    WHEN product_category.convertible = TRUE THEN record_items.count * product.ratio * records.movement::DOUBLE PRECISION
    ELSE record_items.count * records.movement::DOUBLE PRECISION
  END AS subtotal,
  record_items.count * records.movement::DOUBLE PRECISION AS stock,
  CASE
    WHEN product_category.convertible = TRUE THEN product_category.conversion_unit
    ELSE product_category.unit
  END AS unit,
  CASE
    WHEN records.movement::TEXT = '1'::TEXT THEN record_items.count
    ELSE 0::DOUBLE PRECISION
  END AS in_stock,
  CASE
    WHEN records.movement::TEXT = '-1'::TEXT THEN record_items.count
    ELSE 0::DOUBLE PRECISION
  END AS out_stock
FROM
  (
    SELECT
      records_1.id,
      records_1.number,
      records_1.movement,
      CASE
        WHEN records_1.movement::TEXT = '1'::TEXT THEN out_project.id
        WHEN records_1.movement::TEXT = '-1'::TEXT THEN in_project.id
        ELSE NULL::BIGINT
      END AS project_id
    FROM
      records records_1
      JOIN project in_project ON records_1.in_stock_id = in_project.id
      JOIN project out_project ON records_1.out_stock_id = out_project.id
    WHERE
      records_1.category::INTEGER <= 3
  ) records2
  JOIN project ON records2.project_id = project.id
  JOIN records ON records.id = records2.id
  JOIN record_items ON records.id = record_items.record_id
  JOIN product ON record_items.product_id = product.id
  JOIN product_category ON product.category_id = product_category.id;
