-- 库存查询
CREATE OR REPLACE VIEW
  public.view_products_stock AS
SELECT
  product."name",
  product.label,
  product_category.attr,
  CASE
    WHEN records.movement = '1' THEN COALESCE(SUM(record_items.count), 0)
    ELSE 0
  END AS in_stock,
  CASE
    WHEN records.movement = '-1' THEN COALESCE(SUM(record_items.count), 0)
    ELSE 0
  END AS out_stock,
  COALESCE(
    SUM(
      CASE
        WHEN records.movement = '1' THEN record_items.count
        ELSE 0
      END
    ) - SUM(
      CASE
        WHEN records.movement = '-1' THEN record_items.count
        ELSE 0
      END
    ),
    0
  ) AS remain_number,
  records.date,
  product.sort
FROM
  product
  LEFT JOIN product_category ON product_category."id" = product.category_id
  LEFT JOIN LATERAL (
    SELECT
      *
    FROM
      record_items
    WHERE
      record_items.product_id = product."id"
  ) record_items ON TRUE
  LEFT JOIN records ON record_items.record_id = records."id"
GROUP BY
  product.label,
  product_category.attr,
  records.movement,
  product.sort,
  product."name",
  records."date"
