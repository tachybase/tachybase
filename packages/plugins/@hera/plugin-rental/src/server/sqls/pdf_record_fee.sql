SELECT
  r.movement AS record_movement,
  r.weight AS record_weight,
  NULL AS actual_weight,
  NULL AS product_id,
  NULL AS product_count,
  NULL AS fee_count,
  NULL AS is_excluded,
  cpfi.fee_product_id,
  p.*,
  p.weight AS product_weight,
  NULL AS product_ratio,
  NULL AS convertible,
  NULL AS product_category_id,
  cpfi.unit_price,
  cpfi.conversion_logic_id,
  cpfi.unit,
  cpfi.count_source,
  cpfi."comment",
  cpfi.id,
  (
    SELECT
      JSONB_AGG(wr)
    FROM
      weight_rules wr
    WHERE
      wr.logic_id = cpfi.conversion_logic_id
  ) AS weight_rules
FROM
  records r
  LEFT JOIN contracts c ON r.contract_id = c.id
  LEFT JOIN contract_items ci ON c.id = ci.contract_id
  AND ci.start_date <= r.date
  AND ci.end_date >= r."date"
  LEFT JOIN contract_plans cp ON ci.contract_plan_id = cp.id
  LEFT JOIN contract_plan_fee_items cpfi ON cp.id = cpfi.contract_plan_id --有lease_item_id证明是关联产品的费用
  JOIN product p ON p.id = cpfi.fee_product_id
  LEFT JOIN product_category pc3 ON p.category_id = pc3.id
  JOIN product_category pc ON pc.id = p.category_id
  JOIN unit_conversion_logics ucl ON ucl.id = cpfi.conversion_logic_id
WHERE
  r.id = :recordId
GROUP BY
  cpfi.id,
  p.id,
  r.id
UNION
SELECT
  r2.movement AS record_movement,
  r2.weight AS record_weight,
  rwi.weight AS actual_weight,
  ri.product_id,
  ri.count AS product_count,
  rifi.count AS fee_count,
  rifi.is_excluded AS is_excluded, -- 不计入合同
  cpfi2.fee_product_id,
  p1.*,
  p2.weight AS product_weight,
  p2.ratio AS product_ratio,
  pc2.convertible AS convertible,
  pc2.id AS product_category_id,
  cpfi2.unit_price,
  cpfi2.conversion_logic_id,
  cpfi2.unit,
  cpfi2.count_source,
  cpfi2."comment",
  cpfi2.id,
  (
    SELECT
      TO_JSONB(wr)
    FROM
      weight_rules wr
    WHERE
      ucl2.id > 4
      AND wr.logic_id = ucl2.id
      AND wr.product_id = ri.product_id
    LIMIT
      1
  ) AS weight_rules
FROM
  records r2
  LEFT JOIN contracts c2 ON r2.contract_id = c2.id
  LEFT JOIN contract_items ci2 ON c2.id = ci2.contract_id
  AND ci2.start_date <= r2.date
  AND ci2.end_date >= r2."date"
  LEFT JOIN contract_plans cp2 ON ci2.contract_plan_id = cp2.id
  LEFT JOIN contract_plan_lease_items cpli ON cp2.id = cpli.contract_plan_id -- 查租金
  JOIN contract_plan_lease_items_products cplip ON cplip.lease_item_id = cpli.id -- 查租金产品
  JOIN contract_plan_fee_items cpfi2 ON cpfi2.lease_item_id = cpli.id
  AND cpfi2.count_source = '0' -- 查费用
  JOIN unit_conversion_logics ucl2 ON ucl2.id = cpfi2.conversion_logic_id -- 查计算规则
  JOIN record_items ri ON ri.record_id = r2.id
  AND (
    ri.product_id = cplip.product_id
    OR (
      SELECT
        p.category_id
      FROM
        product p
      WHERE
        p.id = ri.product_id
    ) = cplip.product_id - 99999
  )
  LEFT JOIN (
    SELECT
      record_group_weight_items.id,
      COMMENT,
      weight,
      record_id,
      product_category_id
    FROM
      record_group_weight_items
      JOIN record_group_weight_items_products ON record_group_weight_items.id = record_group_weight_items_products.item_id
  ) rwi ON r2.id = rwi.record_id
  AND rwi.product_category_id = ri.product_id
  LEFT JOIN record_item_fee_items rifi ON ri.id = rifi.record_item_id
  AND rifi.product_id = cpfi2.fee_product_id
  JOIN product p1 ON p1.id = cpfi2.fee_product_id
  LEFT JOIN product p2 ON ri.product_id = p2.id
  LEFT JOIN product_category pc2 ON p2.category_id = pc2.id
WHERE
  r2.id = :recordId
