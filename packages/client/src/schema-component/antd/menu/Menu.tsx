import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  FieldContext,
  observer,
  RecursionField,
  SchemaContext,
  SchemaExpressionScopeContext,
  uid,
  useField,
  useFieldSchema,
} from '@tachybase/schema';
import { error } from '@tachybase/utils/client';

import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Menu as AntdMenu, Button, Card, MenuProps, Popover } from 'antd';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { DndContext, SortableItem, useDesignable, useDesigner } from '../..';
import { css, Icon, useSchemaInitializerRender, useToken } from '../../../';
import { useCollectMenuItems, useMenuItem } from '../../../hooks/useMenuItem';
import { DragHandleMenu } from '../../common/sortable-item/DragHandleMenu';
import { useProps } from '../../hooks/useProps';
import { useMenuTranslation } from './locale';
import { MenuDesigner } from './Menu.Designer';
import { useStyles } from './Menu.styles';
import { findKeysByUid, findMenuItem } from './util';

type ComposedMenu = React.FC<any> & {
  Item?: React.FC<any>;
  URL?: React.FC<any>;
  SubMenu?: React.FC<any>;
  Designer?: React.FC<any>;
};

const HeaderMenu = ({
  others,
  schema,
  mode,
  onSelect,
  setLoading,
  setDefaultSelectedKeys,
  defaultSelectedKeys,
  defaultOpenKeys,
  selectedKeys,
  designable,
  render,
  children,
}) => {
  const { Component, getMenuItems } = useMenuItem();
  const { token } = useToken();
  const [items, setItems] = useState([]);
  const { t } = useTranslation();
  const { styles: itemStyle } = useStyles();
  const result = getMenuItems(() => {
    return children;
  });
  useEffect(() => {
    setItems(getItem());
  }, [children, designable, getMenuItems]);
  const getItem = () => {
    const designerBtn = {
      key: 'x-designer-button',
      label: render({
        'data-testid': 'schema-initializer-Menu-header',
        style: { background: 'none', height: '100%' },
      }),
      notdelete: true,
      disabled: true,
    };
    if (designable) {
      result.push(designerBtn);
    }
    return result;
  };

  const onClick = (info) => {
    const s = schema.properties?.[info.key];
    if (!s) {
      return;
    }
    if (mode === 'mix') {
      if (s['x-component'] !== 'Menu.SubMenu') {
        onSelect?.({ item: { props: info } });
      } else {
        const menuItemSchema = findMenuItem(s);
        if (!menuItemSchema) {
          return onSelect?.({ item: { props: info } });
        }
        setLoading(true);
        const keys = findKeysByUid(schema, menuItemSchema['x-uid']);
        setDefaultSelectedKeys(keys);
        setTimeout(() => {
          setLoading(false);
        }, 100);
        onSelect?.({
          key: menuItemSchema.name,
          item: {
            props: {
              schema: menuItemSchema,
            },
          },
        });
      }
    } else {
      onSelect?.({ item: { props: info } });
    }
  };
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}></div>
      <div
        className={css`
          .iconButton {
            border: 0;
            height: var(--tb-header-height);
            width: 46px;
            border-radius: 0;
            background: none;
            color: rgba(255, 255, 255, 0.65);
            &:hover {
              background: rgba(255, 255, 255, 0.1) !important;
            }
          }
        `}
      >
        <Popover
          placement="bottomRight"
          arrow={false}
          content={() => {
            return (
              <Card
                className={css`
                  border: none;
                  max-width: 21rem;
                `}
              >
                {items?.map((item) => {
                  const { icon, field, Designer, schema, styles } = item?.menu || {};
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
                      className={itemStyle.menuItem}
                      key={item.key}
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
                })}
              </Card>
            );
          }}
        >
          <Button className="iconButton" icon={<Icon type="apps" style={{ color: token.colorTextHeaderMenu }} />} />
        </Popover>
        <Component />
      </div>
    </div>
  );
};

const SideMenu = ({ loading, mode, sideMenuSchema, sideMenuRef, defaultOpenKeys, defaultSelectedKeys, onSelect }) => {
  const { Component, getMenuItems } = useMenuItem();
  const { styles } = useStyles();

  const sideMenuSchemaRef = useRef(sideMenuSchema);
  sideMenuSchemaRef.current = sideMenuSchema;
  const [stateOpenKeys, setStateOpenKeys] = useState([]);

  const items = getMenuItems(() => <RecursionField key={uid()} schema={sideMenuSchema} onlyRenderProperties />);

  if (loading) {
    return null;
  }

  return (
    mode === 'mix' &&
    sideMenuSchema?.['x-component'] === 'Menu.SubMenu' &&
    sideMenuRef?.current?.firstChild &&
    createPortal(
      <MenuModeContext.Provider value={{ mode: 'inline', setStateOpenKeys }}>
        <Component />
        <AntdMenu
          mode={'inline'}
          defaultOpenKeys={defaultOpenKeys}
          defaultSelectedKeys={defaultSelectedKeys}
          onSelect={(info) => {
            onSelect?.(info);
          }}
          className={styles.sideMenuClass}
          items={items as MenuProps['items']}
          expandIcon={null}
          onOpenChange={(openKeys) => setStateOpenKeys(openKeys)}
          openKeys={stateOpenKeys}
        />
      </MenuModeContext.Provider>,
      sideMenuRef.current.firstChild,
    )
  );
};

const MenuModeContext = createContext(null);
MenuModeContext.displayName = 'MenuModeContext';

const useSideMenuRef = () => {
  const schema = useFieldSchema();
  const scope = useContext(SchemaExpressionScopeContext);
  const scopeKey = schema?.['x-component-props']?.['sideMenuRefScopeKey'];
  if (!scopeKey) {
    return;
  }
  return scope[scopeKey];
};

const MenuItemDesignerContext = createContext(null);
MenuItemDesignerContext.displayName = 'MenuItemDesignerContext';

export const Menu: ComposedMenu = observer(
  (props) => {
    const {
      onSelect,
      mode,
      selectedUid,
      defaultSelectedUid,
      sideMenuRefScopeKey,
      defaultSelectedKeys: dSelectedKeys,
      defaultOpenKeys: dOpenKeys,
      children,
      ...others
    } = useProps(props);
    const Designer = useDesigner();
    const schema = useFieldSchema();
    const { render } = useSchemaInitializerRender(schema['x-initializer'], schema['x-initializer-props']);
    const sideMenuRef = useSideMenuRef();
    const [selectedKeys, setSelectedKeys] = useState<string[]>();
    const [defaultSelectedKeys, setDefaultSelectedKeys] = useState(() => {
      if (dSelectedKeys) {
        return dSelectedKeys;
      }
      if (defaultSelectedUid) {
        return findKeysByUid(schema, defaultSelectedUid);
      }
      return [];
    });
    const [loading, setLoading] = useState(false);
    const [defaultOpenKeys, setDefaultOpenKeys] = useState(() => {
      if (['inline', 'mix'].includes(mode)) {
        return dOpenKeys || defaultSelectedKeys;
      }
      return dOpenKeys;
    });

    // 配置传感器（确保拖拽行为正常）
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 1, // 移动 1px 后触发拖拽
          delay: 150,
          tolerance: 5, // 允许的移动距离
        },
      }),
    );

    const sideMenuSchema = useMemo(() => {
      let key;

      if (selectedUid) {
        const keys = findKeysByUid(schema, selectedUid);
        key = keys?.[0] || null;
      } else {
        key = defaultSelectedKeys?.[0] || null;
      }

      if (mode === 'mix' && key) {
        const s = schema.properties?.[key];
        if (s?.['x-component'] === 'Menu.SubMenu') {
          return s;
        }
      }
      return null;
    }, [defaultSelectedKeys, mode, schema, selectedUid]);

    useEffect(() => {
      if (!selectedUid) {
        setSelectedKeys(undefined);
        return;
      }

      const keys = findKeysByUid(schema, selectedUid);
      setSelectedKeys(keys);
      if (['inline', 'mix'].includes(mode)) {
        setDefaultOpenKeys(dOpenKeys || keys);
      }
    }, [selectedUid]);

    useEffect(() => {
      if (['inline', 'mix'].includes(mode)) {
        setDefaultOpenKeys(defaultSelectedKeys);
      }
    }, [defaultSelectedKeys]);

    const { designable } = useDesignable();
    return (
      <DndContext sensors={sensors}>
        <MenuItemDesignerContext.Provider value={Designer}>
          <MenuModeContext.Provider value={mode}>
            <HeaderMenu
              others={others}
              schema={schema}
              mode={mode}
              onSelect={onSelect}
              setLoading={setLoading}
              setDefaultSelectedKeys={setDefaultSelectedKeys}
              defaultSelectedKeys={defaultSelectedKeys}
              defaultOpenKeys={defaultOpenKeys}
              selectedKeys={selectedKeys}
              designable={designable}
              render={render}
            >
              {children}
            </HeaderMenu>
            <SideMenu
              loading={loading}
              mode={mode}
              sideMenuSchema={sideMenuSchema}
              sideMenuRef={sideMenuRef}
              defaultOpenKeys={defaultOpenKeys}
              defaultSelectedKeys={defaultSelectedKeys}
              onSelect={onSelect}
            />
          </MenuModeContext.Provider>
        </MenuItemDesignerContext.Provider>
      </DndContext>
    );
  },
  { displayName: 'Menu' },
);

Menu.Item = observer(
  (props) => {
    const { t } = useMenuTranslation();
    const { pushMenuItem } = useCollectMenuItems();
    const { icon, children, ...others } = props;
    const schema = useFieldSchema();
    const { styles } = useStyles();
    const field = useField();
    const Designer = useContext(MenuItemDesignerContext);

    const item = useMemo(() => {
      return {
        ...others,
        className: styles.menuItemClass,
        key: schema.name,
        eventKey: schema.name,
        schema,
        menu: {
          icon,
          field,
          Designer,
          schema,
          styles,
        },
        label: (
          <SchemaContext.Provider value={schema}>
            <FieldContext.Provider value={field}>
              <SortableItem
                role="button"
                aria-label={t(field.title)}
                className={styles.designerCss}
                removeParentsIfNoChildren={false}
              >
                <DragHandleMenu>
                  <span className={'menuitem-title-wrapper'}>
                    <Icon type={icon} />
                    <span className={'menuitem-title'}>{t(field.title)}</span>
                  </span>
                  <Designer />
                </DragHandleMenu>
              </SortableItem>
            </FieldContext.Provider>
          </SchemaContext.Provider>
        ),
      };
    }, [field.title, icon, schema, Designer]);

    if (!pushMenuItem) {
      error('Menu.Item must be wrapped by GetMenuItemsContext.Provider');
      return null;
    }

    pushMenuItem(item);
    return null;
  },
  { displayName: 'Menu.Item' },
);

Menu.URL = observer(
  (props) => {
    const { t } = useMenuTranslation();
    const { pushMenuItem } = useCollectMenuItems();
    const { icon, children, ...others } = props;
    const schema = useFieldSchema();
    const field = useField();
    const Designer = useContext(MenuItemDesignerContext);
    const { styles } = useStyles();

    if (!pushMenuItem) {
      error('Menu.URL must be wrapped by GetMenuItemsContext.Provider');
      return null;
    }

    const item = useMemo(() => {
      return {
        ...others,
        className: styles.menuItemClass,
        key: schema.name,
        eventKey: schema.name,
        schema,
        onClick: () => {
          window.open(props.href, '_blank');
        },
        menu: { icon, field, Designer, schema, styles },
        label: (
          <SchemaContext.Provider value={schema}>
            <FieldContext.Provider value={field}>
              <SortableItem
                className={styles.designerCss}
                removeParentsIfNoChildren={false}
                aria-label={t(field.title)}
              >
                <DragHandleMenu>
                  <span className={'menuitem-title-wrapper'}>
                    <Icon type={icon} />
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'inline-block',
                        width: '100%',
                        verticalAlign: 'middle',
                      }}
                    >
                      {t(field.title)}
                    </span>
                  </span>
                  <Designer />
                </DragHandleMenu>
              </SortableItem>
            </FieldContext.Provider>
          </SchemaContext.Provider>
        ),
      };
    }, [field.title, icon, props.href, schema, Designer]);

    pushMenuItem(item);
    return null;
  },
  { displayName: 'MenuURL' },
);

Menu.SubMenu = observer(
  (props) => {
    const { t } = useMenuTranslation();
    const { Component, getMenuItems } = useMenuItem();
    const { pushMenuItem } = useCollectMenuItems();
    const { icon, children, ...others } = props;
    const schema = useFieldSchema();
    const field = useField();
    const { mode, setStateOpenKeys } = useContext(MenuModeContext);
    const Designer = useContext(MenuItemDesignerContext);
    const { styles } = useStyles();
    const submenu = useMemo(() => {
      return {
        ...others,
        className: styles.menuItemClass,
        key: schema.name,
        eventKey: schema.name,
        menu: { icon, field, Designer, schema, styles },
        label: (
          <SchemaContext.Provider value={schema}>
            <FieldContext.Provider value={field}>
              <SortableItem
                className={styles.subMenuDesignerCss}
                removeParentsIfNoChildren={false}
                aria-label={t(field.title)}
              >
                <DragHandleMenu name={schema.name} isSubMenu setStateOpenKeys={setStateOpenKeys}>
                  <span className={'submenu-title'}>
                    <Icon type={icon} />
                    <span className={'menuitem-title'}>{t(field.title)}</span>
                  </span>
                  <Designer />
                </DragHandleMenu>
              </SortableItem>
            </FieldContext.Provider>
          </SchemaContext.Provider>
        ),
        children: getMenuItems(() => {
          return <RecursionField schema={schema} onlyRenderProperties />;
        }),
      };
    }, [field.title, icon, schema, children, Designer]);

    if (!pushMenuItem) {
      error('Menu.SubMenu must be wrapped by GetMenuItemsContext.Provider');
      return null;
    }

    if (mode === 'mix') {
      return <Menu.Item {...props} />;
    }

    pushMenuItem(submenu);
    return <Component />;
  },
  { displayName: 'Menu.SubMenu' },
);

Menu.Designer = MenuDesigner;
