import { css } from '@emotion/css';
import { useSessionStorageState } from 'ahooks';
import { App, Layout, Spin, FloatButton } from 'antd';
import { ToolOutlined, CommentOutlined, CalculatorOutlined, HighlightOutlined } from '@ant-design/icons';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Outlet, useMatch, useNavigate, useParams } from 'react-router-dom';
import {
  CurrentUser,
  PinnedPluginList,
  SchemaComponent,
  findByUid,
  findMenuItem,
  useACLRoleContext,
  useAdminSchemaUid,
  useDocumentTitle,
  useRequest,
  useSystemSettings,
  useToken,
  useApp,
  AdminProvider,
  RemoteSchemaComponent,
  useCurrentUserSettingsMenu,
  SelectWithTitle,
  useDesignable,
} from '@nocobase/client';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { usePluginVersion } from '../hooks/usePluginVersion';
import { OnlineUserDropdown } from '../components/system/OnlineUserProvider';
import { MobileLink } from '../components/system/MobileLink';
import { Notifications } from '../components/system/Notifications';
import { useTranslation } from '../locale';

export const useAppSpin = () => {
  const app = useApp();
  return {
    render: () => (app ? app?.renderComponent?.('AppSpin') : React.createElement(Spin)),
  };
};

const filterByACL = (schema, options) => {
  const { allowAll, allowMenuItemIds = [] } = options;
  if (allowAll) {
    return schema;
  }
  const filterSchema = (s) => {
    if (!s) {
      return;
    }
    for (const key in s.properties) {
      if (Object.prototype.hasOwnProperty.call(s.properties, key)) {
        const element = s.properties[key];
        if (element['x-uid'] && !allowMenuItemIds.includes(element['x-uid'])) {
          delete s.properties[key];
        }
        if (element['x-uid']) {
          filterSchema(element);
        }
      }
    }
  };
  filterSchema(schema);
  return schema;
};

const SchemaIdContext = createContext(null);
const useMenuProps = () => {
  const defaultSelectedUid = useContext(SchemaIdContext);
  return {
    selectedUid: defaultSelectedUid,
    defaultSelectedUid,
  };
};

const MenuEditor = (props) => {
  const { notification } = App.useApp();
  const [hasNotice, setHasNotice] = useSessionStorageState('plugin-notice', { defaultValue: false });
  const { setTitle } = useDocumentTitle();
  const navigate = useNavigate();
  const params = useParams<any>();
  const isMatchAdmin = useMatch('/admin');
  const isMatchAdminName = useMatch('/admin/:name');
  const defaultSelectedUid = params.name;
  const { sideMenuRef } = props;
  const ctx = useACLRoleContext();
  const [current, setCurrent] = useState(null);
  const onSelect = ({ item }) => {
    const schema = item.props.schema;
    setTitle(schema.title);
    setCurrent(schema);
    navigate(`/admin/${schema['x-uid']}`);
  };
  const { render } = useAppSpin();
  const adminSchemaUid = useAdminSchemaUid();
  const { data, loading } = useRequest<{
    data: any;
  }>(
    {
      url: `/uiSchemas:getJsonSchema/${adminSchemaUid}`,
    },
    {
      refreshDeps: [adminSchemaUid],
      onSuccess(data) {
        const schema = filterByACL(data?.data, ctx);
        // url 为 `/admin` 的情况
        if (isMatchAdmin) {
          const s = findMenuItem(schema);
          if (s) {
            navigate(`/admin/${s['x-uid']}`);
            setTitle(s.title);
          } else {
            navigate(`/admin/`);
          }
          return;
        }

        // url 不为 `/admin/xxx` 的情况，不做处理
        if (!isMatchAdminName) return;

        // url 为 `admin/xxx` 的情况
        const s = findByUid(schema, defaultSelectedUid);
        if (s) {
          setTitle(s.title);
        } else {
          const s = findMenuItem(schema);
          if (s) {
            navigate(`/admin/${s['x-uid']}`);
            setTitle(s.title);
          } else {
            navigate(`/admin/`);
          }
        }
      },
    },
  );

  useEffect(() => {
    const properties = Object.values(current?.root?.properties || {}).shift()?.['properties'] || data?.data?.properties;
    if (properties && sideMenuRef.current) {
      const pageType = Object.values(properties).find(
        (item) => item['x-uid'] === params.name && item['x-component'] === 'Menu.Item',
      );
      if (pageType) {
        sideMenuRef.current.style.display = 'none';
      } else {
        sideMenuRef.current.style.display = 'block';
      }
    }
  }, [data?.data, params.name, sideMenuRef]);

  const schema = useMemo(() => {
    const s = filterByACL(data?.data, ctx);
    if (s?.['x-component-props']) {
      s['x-component-props']['useProps'] = useMenuProps;
    }
    return s;
  }, [data?.data]);

  useRequest(
    {
      url: 'applicationPlugins:list',
      params: {
        sort: 'id',
        paginate: false,
      },
    },
    {
      onSuccess: ({ data }) => {
        setHasNotice(true);
        const errorPlugins = data.filter((item) => !item.isCompatible);
        if (errorPlugins.length) {
          notification.error({
            message: 'Plugin dependencies check failed',
            description: (
              <div>
                <div>
                  These plugins failed dependency checks. Please go to the{' '}
                  <Link to="/admin/pm/list/local/">plugin management page</Link> for more details.{' '}
                </div>
                <ul>
                  {errorPlugins.map((item) => (
                    <li key={item.id}>
                      {item.displayName} - {item.packageName}
                    </li>
                  ))}
                </ul>
              </div>
            ),
          });
        }
      },
      manual: true,
      // ready: !hasNotice,
    },
  );

  if (loading) {
    return void 0;
  }
  return (
    <SchemaIdContext.Provider value={defaultSelectedUid}>
      <SchemaComponent memoized scope={{ useMenuProps, onSelect, sideMenuRef, defaultSelectedUid }} schema={schema} />
    </SchemaIdContext.Provider>
  );
};

export function MyRouteSchemaComponent({ name }: { name: string }) {
  return <RemoteSchemaComponent onlyRenderProperties uid={name} />;
}

export const InternalAdminLayout = (props: any) => {
  const app = useApp();
  const sideMenuRef = useRef<HTMLDivElement>();
  const result = useSystemSettings();
  const params = useParams<{ name?: string }>();
  const { token } = useToken();
  const { render } = useAppSpin();
  const { title, setTitle } = useDocumentTitle();
  const navigate = useNavigate();
  const [items, setItems] = useState<TabsProps['items']>([]);
  const pageStyle = usePageStyle();

  useEffect(() => {
    if (params.name && title && pageStyle === 'tab') {
      const targetItem = items.find((value) => value.key === params.name);
      if (!targetItem) {
        // 现有tab页数组里,不存在之前浏览的tab页面,添加新的tab页进数组
        setItems([
          ...items,
          {
            key: params.name,
            label: title,
            children: <MyRouteSchemaComponent name={params.name} />,
          },
        ]);
      } else {
        // 如果存在之前浏览的tab页面,只用更新页面标题
        setTitle(targetItem.label);
      }
    }
  }, [params.name, title]);

  const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'remove') {
      setItems((items) => {
        return items.filter((item) => item.key !== targetKey);
      });
    }
  };

  return (
    <Layout>
      <Layout.Header
        className={css`
          .ant-menu.ant-menu-dark .ant-menu-item-selected,
          .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected,
          .ant-menu-submenu-horizontal.ant-menu-submenu-selected {
            background-color: ${token.colorBgHeaderMenuActive};
            color: ${token.colorTextHeaderMenuActive};
          }
          .ant-menu-dark.ant-menu-horizontal > .ant-menu-item:hover {
            background-color: ${token.colorBgHeaderMenuHover};
            color: ${token.colorTextHeaderMenuHover};
          }

          position: fixed;
          left: 0;
          right: 0;
          height: var(--nb-header-height);
          line-height: var(--nb-header-height);
          padding: 0;
          z-index: 100;
          background-color: ${token.colorBgHeader};

          .ant-menu {
            background-color: transparent;
          }

          .ant-menu-item {
            color: ${token.colorTextHeaderMenu};
          }
        `}
      >
        <div
          className={css`
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
          `}
        >
          <div
            className={css`
              position: relative;
              z-index: 1;
              flex: 1 1 auto;
              display: flex;
              height: 100%;
            `}
          >
            <div
              className={css`
                display: inline-flex;
                flex-shrink: 0;
                color: #fff;
                padding: 0;
                align-items: center;
                padding: 0 12px 0 12px;
              `}
            >
              <img
                className={css`
                  object-fit: contain;
                  height: 28px;
                `}
                src={result?.data?.data?.logo?.url}
              />
              <h1
                className={css`
                  color: #fff;
                  height: 32px;
                  margin: 0 0 0 12px;
                  font-weight: 600;
                  font-size: 18px;
                  line-height: 32px;
                `}
              >
                {result?.data?.data?.title}
              </h1>
            </div>
            <div
              className={css`
                flex: 1 1 auto;
                width: 0;
              `}
            >
              <MenuEditor sideMenuRef={sideMenuRef} />
            </div>
          </div>
          <div
            className={css`
              position: relative;
              flex-shrink: 0;
              height: 100%;
              z-index: 10;
            `}
          >
            <PinnedPluginList />
            <MobileLink />
            <Notifications />
            <OnlineUserDropdown />
            <CurrentUser />
          </div>
        </div>
      </Layout.Header>
      {params.name && (
        <Layout.Sider
          className={css`
            height: 100%;
            /* position: fixed; */
            position: relative;
            left: 0;
            top: 0;
            background: rgba(0, 0, 0, 0);
            z-index: 100;
            .ant-layout-sider-children {
              top: var(--nb-header-height);
              position: fixed;
              width: 200px;
              height: calc(100vh - var(--nb-header-height));
            }
          `}
          theme={'light'}
          ref={sideMenuRef}
        ></Layout.Sider>
      )}
      <Layout.Content
        className={css`
          display: flex;
          flex-direction: column;
          position: relative;
          overflow-y: auto;
          height: 100vh;
          max-height: 100vh;
          > div {
            position: relative;
          }
          .ant-layout-footer {
            position: absolute;
            bottom: 0;
            text-align: center;
            width: 100%;
            z-index: 0;
            padding: 0px 50px;
          }
        `}
      >
        <header
          className={css`
            flex-shrink: 0;
            height: var(--nb-header-height);
            line-height: var(--nb-header-height);
            background: transparent;
            pointer-events: none;
          `}
        ></header>
        <>
          {params.name && pageStyle === 'tab' ? (
            <Tabs
              className={css`
                margin: 0;
                .ant-tabs-nav {
                  margin: 0;
                }
              `}
              type="editable-card"
              items={items}
              onEdit={onEdit}
              hideAdd
              onChange={(key) => {
                navigate(`/admin/${key}`);
              }}
              activeKey={params.name}
            />
          ) : (
            <Outlet />
          )}
        </>
      </Layout.Content>
    </Layout>
  );
};

export const useTabSettings = (props) => {
  return {
    key: 'tab',
    eventKey: 'tab',
    label: <Label {...props} />,
  };
};

const useHeraVersion = () => {
  const version = usePluginVersion();
  return {
    key: 'hera-version',
    eventKey: 'hera-version',
    label: <span>赫拉系统 - {version}</span>,
  };
};

const usePageStyle = () => {
  return useContext(PageStyleContext).style;
};

export const AdminLayout = (props) => {
  const { addMenuItem } = useCurrentUserSettingsMenu();
  const [style, setStyle] = useState('classical');
  const tabItem = useTabSettings({ style, setStyle });
  const heraVersion = useHeraVersion();
  const { designable, setDesignable } = useDesignable();

  useEffect(() => {
    addMenuItem(tabItem, { before: 'divider_3' });
  }, [addMenuItem, tabItem]);
  useEffect(() => {
    addMenuItem(heraVersion, { before: 'divider_1' });
  }, [addMenuItem, tabItem]);

  const AdminComponent = (
    <AdminProvider>
      <PageStyleContext.Provider value={{ style }}>
        <InternalAdminLayout {...props} />
      </PageStyleContext.Provider>
      <FloatButton.Group trigger="hover" type="primary" style={{ right: 24, zIndex: 1250 }} icon={<ToolOutlined />}>
        <FloatButton icon={<HighlightOutlined />} onClick={() => setDesignable(!designable)} />
        <FloatButton icon={<CalculatorOutlined />} />
        <FloatButton icon={<CommentOutlined />} />
      </FloatButton.Group>
    </AdminProvider>
  );
  return AdminComponent;
};

export interface PageStyleContextValue {
  style: string;
}

const PageStyleContext = createContext<PageStyleContextValue>({
  style: 'classical',
});

function Label({ style, setStyle }) {
  const { t } = useTranslation();
  return (
    <SelectWithTitle
      title={t('Page style')}
      defaultValue={style}
      options={[
        {
          label: t('classical'),
          value: 'classical',
        },
        {
          label: t('tabs'),
          value: 'tab',
        },
      ]}
      onChange={setStyle}
    />
  );
}
