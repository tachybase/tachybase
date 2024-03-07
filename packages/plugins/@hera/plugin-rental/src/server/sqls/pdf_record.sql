SELECT
  r.*,
  -- ================================出入库信息================================
  (
    SELECT
      TO_JSONB(
        JSONB_SET(
          TO_JSONB(project),
          '{associated_company}',
          COALESCE(TO_JSONB(c2), '{}'::jsonb)
        )
      )
    FROM
      project
      LEFT JOIN company c2 ON project.associated_company_id = c2.id
    WHERE
      project.id = r.out_stock_id
  ) AS out_stock,
  -- 查订单入库方
  (
    SELECT
      TO_JSONB(
        JSONB_SET(
          TO_JSONB(project),
          '{associated_company}',
          COALESCE(TO_JSONB(c), '{}'::jsonb)
        )
      )
    FROM
      project
      LEFT JOIN company c ON project.associated_company_id = c.id
    WHERE
      project.id = r.in_stock_id
  ) AS in_stock,
  TO_JSONB(
    -- 项目/客户数据（只有租赁才有此项目，其他项目就是出入库数据）
    JSONB_SET(
      TO_JSONB(c),
      '{project}',
      (
        SELECT
          COALESCE(
            TO_JSONB(
              JSONB_SET(
                TO_JSONB(p3),
                '{associated_company}',
                CASE
                  WHEN p3.associated_company_id IS NOT NULL THEN (
                    SELECT
                      COALESCE(TO_JSONB(c), '{}'::jsonb)
                    FROM
                      company c
                    WHERE
                      p3.associated_company_id = c.id
                  )
                  ELSE '{}'::jsonb
                END
              ) || JSONB_SET(
                TO_JSONB(p3),
                '{company}',
                (
                  SELECT
                    TO_JSONB(c)
                  FROM
                    company c
                  WHERE
                    p3.company_id = c.id
                )
              ) || JSONB_SET(
                TO_JSONB(p3),
                '{contacts}',
                (
                  SELECT
                    COALESCE(JSONB_AGG(c), '[]'::jsonb)
                  FROM
                    project_contacts pc
                    JOIN contacts c ON pc.contact_id = c.id
                  WHERE
                    p3.id = pc.project_id
                )
              )
            ),
            '{}'::jsonb
          )
        FROM
          project p3
        WHERE
          c.project_id = p3.id
      )
    )
  ) AS contract,
  (
    -- 订单自己的租金规则
    SELECT
      JSONB_AGG(
        JSONB_SET(
          TO_JSONB(lr2),
          '{ucl}',
          (
            SELECT
              TO_JSONB(
                JSONB_SET(
                  TO_JSONB(ucl),
                  '{other_rules}',
                  (
                    SELECT
                      COALESCE(JSONB_AGG(wr), '[]'::jsonb)
                    FROM
                      weight_rules wr
                    WHERE
                      ucl.id = wr.logic_id
                  )
                )
              )
            FROM
              unit_conversion_logics ucl
            WHERE
              lr2.conversion_logic_id = ucl.id
          )
        ) || JSONB_SET(
          TO_JSONB(lr2),
          '{product}',
          (
            SELECT
              TO_JSONB(vp)
            FROM
              view_products vp
            WHERE
              lr2.product_id = vp.id
          )
        )
      )
    FROM
      lease_rules lr2
    WHERE
      r.id = lr2.record_id
  ) AS record_lease_rules,
  -- ==========================================车号==========================================
  (
    SELECT
      COALESCE(JSONB_AGG(v), '[]'::jsonb)
    FROM
      record_vehicles rv
      JOIN vehicles v ON rv.vehicle_id = v.id
    WHERE
      r.id = rv.record_id
  ) AS vehicles,
  (
    SELECT
      JSONB_AGG(
        TO_JSONB(
          JSONB_SET(TO_JSONB(rfi), '{product}', TO_JSONB(p))
        )
      )
    FROM
      record_fee_items rfi
      JOIN product p ON p.id = rfi.product_id
    WHERE
      rfi.record_id = r.id
  ) AS record_fee_items
FROM
  records r
  -- 合同数据（租赁有合同）
  LEFT JOIN contracts c ON r.contract_id = c.id
WHERE
  r.id = :recordId
