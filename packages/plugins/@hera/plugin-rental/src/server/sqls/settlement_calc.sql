SELECT
  s.*,
  TO_JSONB(
    JSONB_SET(
      TO_JSONB(c),
      '{rule_items}',
      (
        SELECT
          JSONB_AGG(
            JSONB_SET(
              TO_JSONB(ci),
              '{rule}',
              TO_JSONB(
                -- 租金
                JSONB_SET(
                  TO_JSONB(cp),
                  '{lease_items}',
                  (
                    SELECT
                      JSONB_AGG(
                        JSONB_SET(
                          TO_JSONB(cpli),
                          '{ucl}',
                          TO_JSONB(
                            JSONB_SET(
                              TO_JSONB(ucl),
                              '{weight_items}',
                              (
                                SELECT
                                  COALESCE(JSONB_AGG(wr), '[]'::jsonb)
                                FROM
                                  weight_rules wr
                                WHERE
                                  ucl.id = wr.logic_id
                                  AND ucl.id > 4
                              )
                            )
                          )
                        ) || JSONB_SET(
                          TO_JSONB(cpli),
                          '{product_fee}',
                          (
                            SELECT
                              COALESCE(
                                JSONB_AGG(
                                  JSONB_SET(TO_JSONB(cpfi), '{product}', TO_JSONB(product)) || JSONB_SET(
                                    TO_JSONB(cpfi),
                                    '{weight_items}',
                                    (
                                      SELECT
                                        COALESCE(JSONB_AGG(wrs), '[]'::jsonb)
                                      FROM
                                        weight_rules wrs
                                      WHERE
                                        wrs.logic_id = cpfi.conversion_logic_id
                                        AND cpfi.conversion_logic_id > 4
                                    )
                                  )
                                ),
                                '[]'::jsonb
                              )
                            FROM
                              contract_plan_fee_items cpfi
                              JOIN product ON cpfi.fee_product_id = product.id
                            WHERE
                              cpfi.lease_item_id = cpli.id
                          )
                        ) || JSONB_SET(
                          TO_JSONB(cpli),
                          '{products}',
                          (
                            SELECT
                              JSONB_AGG(cplip)
                            FROM
                              contract_plan_lease_items_products cplip
                            WHERE
                              cplip.lease_item_id = cpli.id
                          )
                        )
                      )
                    FROM
                      contract_plan_lease_items cpli
                      JOIN unit_conversion_logics ucl ON ucl.id = cpli.conversion_logic_id
                    WHERE
                      cpli.contract_plan_id = cp.id
                  )
                ) ||
                -- 费用
                JSONB_SET(
                  TO_JSONB(cp),
                  '{fee_item}',
                  (
                    SELECT
                      COALESCE(
                        JSONB_AGG(
                          JSONB_SET(
                            TO_JSONB(cpfi),
                            '{ucl}',
                            TO_JSONB(
                              JSONB_SET(
                                TO_JSONB(ucl),
                                '{weight_items}',
                                (
                                  SELECT
                                    COALESCE(JSONB_AGG(wr), '[]'::jsonb)
                                  FROM
                                    weight_rules wr
                                  WHERE
                                    cpfi.conversion_logic_id = wr.logic_id
                                    AND cpfi.conversion_logic_id > 4
                                )
                              )
                            )
                          ) || JSONB_SET(
                            TO_JSONB(cpfi),
                            '{product}',
                            (
                              SELECT
                                TO_JSONB(product)
                              FROM
                                product
                              WHERE
                                cpfi.fee_product_id = product.id
                            )
                          )
                        ),
                        '[]'::jsonb
                      )
                    FROM
                      contract_plan_fee_items cpfi
                      JOIN unit_conversion_logics ucl ON ucl.id = cpfi.conversion_logic_id
                    WHERE
                      cpfi.contract_plan_id = cp.id
                  )
                )
              )
            )
          )
        FROM
          contract_items ci
          LEFT JOIN contract_plans cp ON ci.contract_plan_id = cp.id
        WHERE
          ci.contract_id = COALESCE(main.id, c.id)
          AND ci.start_date IS NOT NULL
          AND ci.end_date IS NOT NULL
      )
    )
  ) AS contracts,
  (
    SELECT
      JSONB_AGG(
        JSONB_SET(
          TO_JSONB(r),
          '{record_items}',
          (
            SELECT
              COALESCE(
                JSONB_AGG(
                  JSONB_SET(
                    TO_JSONB(ri),
                    '{product}',
                    -- 产品
                    (
                      SELECT
                        TO_JSONB(
                          JSONB_SET(
                            TO_JSONB(p),
                            '{product_category}',
                            -- 产品分类
                            TO_JSONB(pc)
                          )
                        )
                      FROM
                        product p
                        JOIN product_category pc ON p.category_id = pc.id
                      WHERE
                        p.id = ri.product_id
                    )
                  ) || JSONB_SET(
                    TO_JSONB(ri),
                    '{record_item_fee_items}',
                    (
                      SELECT
                        COALESCE(
                          JSONB_AGG(
                            JSONB_SET(TO_JSONB(rifi), '{product}', TO_JSONB(p))
                          ),
                          '[]'::jsonb
                        )
                      FROM
                        record_item_fee_items rifi
                        JOIN product p ON rifi.product_id = p.id
                      WHERE
                        rifi.record_item_id = ri.id
                    )
                  )
                ),
                '[]'::jsonb
              )
            FROM
              record_items ri
            WHERE
              ri.record_id = r.id
          )
        ) || JSONB_SET(
          -- 维修赔偿（无产品关联，如：运费）
          TO_JSONB(r),
          '{fee_item}',
          (
            SELECT
              COALESCE(
                JSONB_AGG(
                  JSONB_SET(TO_JSONB(rfi), '{product}', TO_JSONB(p))
                ),
                '[]'::jsonb
              )
            FROM
              record_fee_items rfi
              JOIN product p ON rfi.product_id = p.id
            WHERE
              rfi.record_id = r.id
          )
        ) || JSONB_SET(
          TO_JSONB(r),
          '{weight_items}',
          (
            SELECT
              COALESCE(JSONB_AGG(rwi), '[]'::jsonb)
            FROM
              (
                SELECT
                  record_group_weight_items.id,
                  COMMENT,
                  weight,
                  record_id,
                  product_category_id
                FROM
                  record_group_weight_items
                  JOIN record_group_weight_items_products ON record_group_weight_items.id = record_group_weight_items_products.item_id
              ) rwi
            WHERE
              rwi.record_id = r.id
          )
        )
      )
    FROM
      records r
    WHERE
      r.contract_id = COALESCE(main.id, c.id)
      AND s.end_date >= r.date
  ) AS records,
  (
    SELECT
      COALESCE(JSONB_AGG(sai), '[]'::jsonb)
    FROM
      settlement_add_items sai
    WHERE
      s.id = sai.add_id
  ) AS settlement_add_items,
  (
    SELECT
      JSONB_AGG(s1)
    FROM
      settlements s1
    WHERE
      s1.contract_id = c.id
  ) AS settlements
FROM
  settlements s
  JOIN
  -- 合同 一对一
  contracts c ON c.id = s.contract_id
  LEFT JOIN contracts main ON main.id = c.alternative_contract_id
WHERE
  s.id = :settlementsId
