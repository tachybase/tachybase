SELECT
  p.id AS porject_id,
  c.id AS contract_id,
  SUM(
    CASE
      WHEN pc.convertible = TRUE THEN ri.count * CAST(r.movement AS DECIMAL) * p2.ratio
      ELSE ri.count * CAST(r.movement AS DECIMAL)
    END
  ) AS COUNT
FROM
  project p
  JOIN contracts c ON p.id = c.project_id
  LEFT JOIN records r ON c.id = r.contract_id
  LEFT JOIN record_items ri ON r.id = ri.record_id
  JOIN product p2 ON ri.product_id = p2.id
  JOIN product_category pc ON pc.id = p2.category_id
WHERE
  p.id = ${project_id}
GROUP BY
  p.id,
  c.id;
