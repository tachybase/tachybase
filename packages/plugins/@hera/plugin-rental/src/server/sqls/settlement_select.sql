SELECT
  JSONB_AGG(TO_JSONB(settlement_items)) AS settlement_items,
  settlements.*,
  TO_JSONB(
    JSONB_SET(
      TO_JSONB(contracts),
      '{project}',
      (
        SELECT
          TO_JSONB(
            JSONB_SET(
              TO_JSONB(p),
              '{associated_company}',
              COALESCE(TO_JSONB(c), '{}'::jsonb)
            ) || JSONB_SET(
              TO_JSONB(p),
              '{company}',
              COALESCE(TO_JSONB(c1), '{}'::jsonb)
            ) || JSONB_SET(
              TO_JSONB(p),
              '{contacts}',
              (
                SELECT
                  COALESCE(JSONB_AGG(c), '[]'::jsonb)
                FROM
                  project_contacts pc
                  JOIN contacts c ON pc.contact_id = c.id
                WHERE
                  pc.project_id = p.id
              )
            )
          )
        FROM
          project p
          LEFT JOIN company c ON p.associated_company_id = c."id"
          LEFT JOIN company c1 ON p.company_id = c1.id
        WHERE
          contracts.project_id = p."id"
      )
    ) || JSONB_SET(
      TO_JSONB(contracts),
      '{operator}',
      (
        SELECT
          TO_JSONB(u)
        FROM
          users u
        WHERE
          contracts."updatedById" = u.id
      )
    ) || JSONB_SET(
      TO_JSONB(contracts),
      '{first_party}',
      (
        SELECT
          TO_JSONB(c)
        FROM
          company c
        WHERE
          c.id = c.first_party_id
      )
    ) || JSONB_SET(
      TO_JSONB(contracts),
      '{party_b}',
      (
        SELECT
          TO_JSONB(c)
        FROM
          company c
        WHERE
          c.id = c.party_b_id
      )
    )
  ) AS contracts,
  (
    SELECT
      JSONB_AGG(sai)
    FROM
      settlement_add_items sai
    WHERE
      sai.add_id = settlements.id
  ) AS settlement_add_items,
  (
    SELECT
      JSONB_AGG(ssi)
    FROM
      settlement_summary_items ssi
    WHERE
      ssi.settlement_id = settlements.id
      AND ssi."type" = :type
  ) AS settlement_summary_items,
  (
    SELECT
      JSONB_AGG(shi)
    FROM
      settlement_history_items shi
    WHERE
      shi.settlement_id = settlements.id
      AND shi."type" = :type
  ) AS settlement_history_items
FROM
  settlements
  LEFT JOIN settlement_items ON settlement_items.settlement_id = settlements."id"
  AND (
    settlement_items."type" = :type
    OR settlement_items."type" = 'fee'
  )
  JOIN contracts ON contracts."id" = settlements.contract_id
WHERE
  settlements.id = :settlementsId
GROUP BY
  settlements.id,
  contracts.id
