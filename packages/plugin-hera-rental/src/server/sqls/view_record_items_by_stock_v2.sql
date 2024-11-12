CREATE OR REPLACE VIEW
  public.view_record_items_by_stock_v2 AS
SELECT
  record_items.id,
  project.id AS project_id,
  project2.id AS opposite_id,
  product.id AS product_id,
  records.id AS records_id,
  product_category.id AS product_category_id,
  t1.subtotal,
  t1.stock,
  t1.in_stock,
  t1.out_stock
FROM
  (
    SELECT
      record_items_1.id,
      project_1.id AS project_id,
      records_1.out_stock_id AS opposite_id,
      product_1.id AS product_id,
      records_1.id AS record_id,
      product_category_1.id AS product_category_id,
      CASE
        WHEN product_category_1.convertible = TRUE THEN record_items_1.count * product_1.ratio
        ELSE record_items_1.count
      END AS subtotal,
      record_items_1.count AS stock,
      record_items_1.count AS in_stock,
      0 AS out_stock
    FROM
      records records_1
      JOIN project project_1 ON records_1.in_stock_id = project_1.id
      JOIN record_items record_items_1 ON records_1.id = record_items_1.record_id
      JOIN product product_1 ON record_items_1.product_id = product_1.id
      JOIN product_category product_category_1 ON product_1.category_id = product_category_1.id
    WHERE
      records_1.category::INTEGER <= 3
    UNION ALL
    SELECT
      record_items_1.id,
      project_1.id AS project_id,
      records_1.in_stock_id AS opposite_id,
      product_1.id AS product_id,
      records_1.id AS record_id,
      product_category_1.id AS product_category_id,
      CASE
        WHEN product_category_1.convertible = TRUE THEN record_items_1.count * product_1.ratio * '-1'::DOUBLE PRECISION
        ELSE record_items_1.count * '-1'::DOUBLE PRECISION
      END AS subtotal,
      record_items_1.count * '-1'::DOUBLE PRECISION AS stock,
      0 AS in_stock,
      record_items_1.count AS out_stock
    FROM
      records records_1
      JOIN project project_1 ON records_1.out_stock_id = project_1.id
      JOIN record_items record_items_1 ON records_1.id = record_items_1.record_id
      JOIN product product_1 ON record_items_1.product_id = product_1.id
      JOIN product_category product_category_1 ON product_1.category_id = product_category_1.id
    WHERE
      records_1.category::INTEGER <= 3
  ) t1
  JOIN records ON t1.record_id = records.id
  JOIN project ON t1.project_id = project.id
  JOIN project project2 ON t1.opposite_id = project2.id
  JOIN record_items ON t1.id = record_items.id
  JOIN product ON t1.product_id = product.id
  JOIN product_category ON t1.product_category_id = product_category.id;
