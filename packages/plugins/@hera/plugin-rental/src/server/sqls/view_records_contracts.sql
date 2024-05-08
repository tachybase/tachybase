CREATE OR REPLACE VIEW
  public.view_records_contracts AS
SELECT
  c.id AS contract_id,
  r.id AS record_id,
  r.createdAt,
  r.updatedAt,
  CAST('c_' || rc.id AS VARCHAR) AS id,
  rc.id AS rc_id, -- 页面更新中间表存根联/回根联用
  rc.movement,
  c1.id AS company_id,
  p.id AS project_id,
  rc.has_receipt,
  rc.has_stub,
  c.record_category
FROM
  records r
  JOIN record_contract rc ON rc.record_id = r.id
  JOIN contracts c ON c.id = rc.contract_id
  JOIN company c1 ON c1.id = c.first_party_id
  JOIN project p ON p.id = (
    CASE
      WHEN rc.movement = '1' THEN r.out_stock_id
      ELSE r.in_stock_id
    END
  )
UNION ALL
SELECT
  NULL AS contract_id,
  r.id AS record_id,
  r.createdAt,
  r.updatedAt,
  CAST('r_' || r.id AS VARCHAR) AS id,
  NULL AS rc_id,
  (
    CASE
      WHEN p3.id = r.in_stock_id THEN '1'
      ELSE '-1'
    END
  ) AS movement,
  c.id AS company_id,
  p3.id AS project_id,
  rc.has_receipt,
  rc.has_stub,
  '3' AS record_category
FROM
  records r
  LEFT JOIN record_contract rc ON rc.record_id = r.id
  JOIN project p ON p.id = r.in_stock_id
  JOIN project p2 ON p2.id = r.out_stock_id
  JOIN company c ON c.roles @> '["associated"]'
  AND c.id = p.company_id
  OR c.id = p2.company_id
  JOIN project p3 ON p3.company_id = c.id
  AND p3.id = p.id
  OR p3.id = p2.id
WHERE
  rc.id IS NULL
  AND r.in_stock_id IS NOT NULL
  AND r.out_stock_id IS NOT NULL
