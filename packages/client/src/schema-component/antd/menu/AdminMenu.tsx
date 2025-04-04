import { FieldContext, SchemaContext } from '@tachybase/schema';

import { Card } from 'antd';
import { useTranslation } from 'react-i18next';

import { SortableItem } from '../..';
import { Icon } from '../../../';
import { DragHandleMenu } from '../../common/sortable-item/DragHandleMenu';
import { useStyles } from './AdminMenu.style';

export const AdminMenu = (props) => {
  const { items, onClick } = props;
  const { styles } = useStyles();

  return (
    <Card className={styles.adminMenuStyle}>
      {items?.map((item) => <AdminMenuCard key={item.key} item={item} onClick={onClick} />)}
    </Card>
  );
};

const AdminMenuCard = (props) => {
  const { item, onClick } = props;
  const { icon, field, Designer, schema } = item?.menu || {};
  const { t } = useTranslation();
  const { styles } = useStyles();
  const handleClick = () => onClick(item);
  return (
    <Card.Grid className={styles.adminMenuCardStyle} onClick={handleClick}>
      {item.menu ? (
        <SchemaContext.Provider value={schema}>
          <FieldContext.Provider value={field}>
            <SortableItem
              className="card-wrapper"
              role="button"
              aria-label={t(field.title)}
              removeParentsIfNoChildren={false}
              overStyle={{
                background: 'transparent',
              }}
            >
              <DragHandleMenu className="drag-handle-menu" isAdminMenu>
                <div className="field-link" role="button" aria-label={t(field.title)} title={t(field.title)}>
                  <div className="icon-wrapper">
                    <Icon type={icon ?? 'QuestionCircleOutlined'} />
                  </div>
                  <div className="field-title">{t(field.title)}</div>
                </div>
                <Designer isAdminMenu />
              </DragHandleMenu>
            </SortableItem>
          </FieldContext.Provider>
        </SchemaContext.Provider>
      ) : (
        <>{item.label}</>
      )}
    </Card.Grid>
  );
};
