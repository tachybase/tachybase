CREATE OR REPLACE VIEW
  public.view_records_contracts AS
SELECT
  c.id AS contract_id,
  r.id AS record_id,
  r."createdAt",
  r."updatedAt",
  CAST('c_' || rc.id AS VARCHAR) AS id,
  rc.id AS rc_id, -- 页面更新中间表存根联/回根联用
  rc.movement,
  c1.id AS company_id,
  p.id AS project_id,
  rc.has_receipt,
  rc.has_stub,
  c.record_category,
  (
    CASE
      WHEN c1.abbreviation IS NOT NULL THEN c1.abbreviation::TEXT
      ELSE c1.id::TEXT
    END || '-' || CASE
      WHEN c2.abbreviation IS NOT NULL THEN c2.abbreviation::TEXT
      ELSE c2.id::TEXT
    END || '-' || r.number
  )::CHARACTER VARYING AS number
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
  JOIN company c2 ON c2.id = c.party_b_id
WHERE
  r.direct_record_id IS NULL
UNION ALL
SELECT
  NULL AS contract_id,
  r.id AS record_id,
  r."createdAt",
  r."updatedAt",
  CAST('r_' || r.id || '_' || c.id AS VARCHAR) AS id,
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
  '3' AS record_category,
  r.number::VARCHAR AS number
FROM
  records r
  LEFT JOIN record_contract rc ON rc.record_id = r.id
  JOIN project p ON p.id = r.in_stock_id
  JOIN project p2 ON p2.id = r.out_stock_id
  JOIN company c ON c.roles @> '["associated"]'
  AND (
    c.id = p.company_id
    OR c.id = p2.company_id
  )
  JOIN project p3 ON p3.company_id = c.id
  AND (
    p3.id = p.id
    OR p3.id = p2.id
  )
WHERE
  rc.id IS NULL
  AND r.in_stock_id IS NOT NULL
  AND r.out_stock_id IS NOT NULL
  AND r.direct_record_id IS NULL
