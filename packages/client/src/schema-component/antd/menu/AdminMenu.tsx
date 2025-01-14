import { FieldContext, SchemaContext } from '@tachybase/schema';

import { Card } from 'antd';
import { useTranslation } from 'react-i18next';

import { SortableItem } from '../..';
import { css, Icon } from '../../../';

export const AdminMenu = (props) => {
  const { items, token, onClick } = props;
  return (
    <Card
      className={css`
        border: none;
        max-width: 21rem;
      `}
    >
      {items?.map((item) => <AdminMenuCard key={item.key} item={item} token={token} onClick={onClick} />)}
    </Card>
  );
};

const AdminMenuCard = (props) => {
  const { item, token, onClick } = props;
  const { icon, field, Designer, schema, styles } = item?.menu || {};
  const { t } = useTranslation();

  return (
    <Card.Grid
      style={{
        display: 'block',
        color: 'inherit',
        padding: token.marginSM,
        boxShadow: 'none',
        width: '7rem',
        height: '5rem',
      }}
      className={css`
        &:hover {
          border-radius: ${token.borderRadius}px;
          background: rgba(0, 0, 0, 0.045);
          overflow: hidden;
        }
        .ant-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: none;
          box-shadow: none;
          padding-left: 0;
          padding-right: 0;
          width: 100%;
          span {
            display: block;
            text-align: center;
            font-size: ${token.fontSizeSM}px;
          }
          .anticon {
            font-size: 1.2rem;
            margin-bottom: 0.3rem;
            text-align: center;
          }
        }
        .ant-btn-default {
          box-shadow: none;
        }
        .general-schema-designer {
          background: none;
        }
      `}
      onClick={() => {
        onClick(item);
      }}
    >
      {item.menu ? (
        <SchemaContext.Provider value={schema}>
          <FieldContext.Provider value={field}>
            <SortableItem
              role="button"
              aria-label={t(field.title)}
              className={styles.designerCss}
              removeParentsIfNoChildren={false}
              style={{ position: 'revert' }}
            >
              <a
                role="button"
                aria-label={t(field.title)}
                title={t(field.title)}
                className={css`
                  display: block;
                  color: inherit;
                  &:hover {
                    color: inherit;
                  }
                `}
              >
                <div style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '0.3rem' }}>
                  <Icon type={icon || 'QuestionCircleOutlined'} />
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: token.fontSizeSM,
                  }}
                >
                  {t(field.title)}
                </div>
              </a>
              <Designer />
            </SortableItem>
          </FieldContext.Provider>
        </SchemaContext.Provider>
      ) : (
        <>{item.label}</>
      )}
    </Card.Grid>
  );
};
