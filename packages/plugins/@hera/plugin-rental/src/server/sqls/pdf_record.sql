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
  -- 查询分组实际重量
  (
    SELECT
      JSONB_AGG(
        JSONB_SET(TO_JSONB(rgwi), '{category}', TO_JSONB(pc))
      )
    FROM
      record_group_weight_items rgwi
      JOIN record_group_weight_items_products rgwip ON rgwip.item_id = rgwi.id
      JOIN product_category pc ON rgwip.product_category_id = pc.id
    WHERE
      rgwi.record_id = r.id
  ) AS record_group_weight_items
FROM
  records r
  -- 合同数据（租赁有合同）
  LEFT JOIN contracts c ON r.contract_id = c.id
WHERE
  r.id = :recordId
