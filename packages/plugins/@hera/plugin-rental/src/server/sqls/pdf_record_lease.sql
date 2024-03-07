-- 租金
SELECT
  r.category,
  ri.comment AS item_comment,
  ri.*,
  p.*,
  pc.*,
  pc.name AS product_category_name,
  lr.*,
  lr.unit_price AS price_price,
  vp."label" AS price_label,
  lr."comment" AS price_comment,
  cpli.*,
  rwi.*,
  CASE
    WHEN ucl.id > 4
    AND c.id IS NOT NULL THEN (
      SELECT
        TO_JSONB(wr)
      FROM
        weight_rules wr
      WHERE
        ucl.id = wr.logic_id
        AND (
          wr.product_id = p.id
          OR wr.product_id = pc.id + 99999
        )
    )
    WHEN lr.conversion_logic_id > 4
    AND c.id IS NULL THEN (
      SELECT
        TO_JSONB(wr2)
      FROM
        weight_rules wr2
      WHERE
        lr.conversion_logic_id = wr2.logic_id
        AND (
          wr2.product_id = p.id
          OR wr2.product_id = pc.id + 99999
        )
    )
  END AS wr
FROM
  records r
  LEFT JOIN record_items ri ON r.id = ri.record_id
  LEFT JOIN product p ON ri.product_id = p.id
  LEFT JOIN product_category pc ON p.category_id = pc.id
  ---- 租赁找合同规则
  LEFT JOIN contracts c ON r.contract_id = c.id
  LEFT JOIN contract_items ci ON c.id = ci.contract_id
  AND ci.start_date <= r.date
  AND ci.end_date >= r."date"
  LEFT JOIN contract_plans cp ON ci.contract_plan_id = cp.id
  LEFT JOIN contract_plan_lease_items cpli ON cp.id = cpli.contract_plan_id
  LEFT JOIN unit_conversion_logics ucl ON cpli.conversion_logic_id = ucl.id
  AND cpli.conversion_logic_id > 4
  ------ 购销找租金定价
  LEFT JOIN lease_rules lr ON r.id = lr.record_id
  AND (
    lr.product_id = p.id
    OR lr.product_id = pc.id + 99999
  )
  LEFT JOIN view_products vp ON vp.id = lr.product_id
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
  ) rwi ON r.id = rwi.record_id
  AND rwi.product_category_id = pc.id
WHERE
  r.id = :recordId
  AND (
    CASE
      WHEN c.id IS NOT NULL THEN (
        ri.product_id = (
          SELECT
            cplip.product_id
          FROM
            contract_plan_lease_items_products cplip
          WHERE
            cplip.lease_item_id = cpli.id
            AND cplip.product_id = p.id
        )
        OR pc.id + 99999 = (
          SELECT
            cplip.product_id
          FROM
            contract_plan_lease_items_products cplip
          WHERE
            cplip.lease_item_id = cpli.id
            AND cplip.product_id - 99999 = pc.id
        )
      )
      ELSE TRUE
    END
  )
