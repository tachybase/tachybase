import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Layout } from 'antd';
import { useLocation, useMatch, useNavigate, useParams } from 'react-router-dom';

import {
  ACLRolesCheckProvider,
  CurrentAppInfoProvider,
  CurrentUser,
  findByUid,
  findMenuItem,
  NavigateIfNotSignIn,
  NoticeManagerProvider,
  PinnedPluginList,
  RemoteCollectionManagerProvider,
  RemoteSchemaTemplateManagerPlugin,
  SchemaComponent,
  useACLRoleContext,
  useAdminSchemaUid,
  useApp,
  useDocumentTitle,
  useRequest,
  useSystemSettings,
} from '../..';
import { Plugin } from '../../application/Plugin';
import { VariablesProvider } from '../../variables';
import { AdminContent } from './AdminContent';
import { AdminTabs } from './AdminTabs';
import { NoticeArea } from './NoticeArea';
import { useStyles } from './style';

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
SchemaIdContext.displayName = 'SchemaIdContext';
const useMenuProps = () => {
  const defaultSelectedUid = useContext(SchemaIdContext);
  return {
    selectedUid: defaultSelectedUid,
    defaultSelectedUid,
  };
};

const MenuEditor = (props) => {
  const { setTitle } = useDocumentTitle();
  const navigate = useNavigate();
  const params = useParams<any>();
  const location = useLocation();
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

  const match = useMatch('/admin/:name');

  useEffect(() => {
    if (match) {
      const schema = filterByACL(data?.data, ctx);
      const s = findByUid(schema, defaultSelectedUid);
      if (s) {
        setTitle(s.title);
      }
    }
  }, [data?.data, location.pathname, defaultSelectedUid]);

  useEffect(() => {
    const properties = Object.values(current?.root?.properties || {}).shift()?.['properties'] || data?.data?.properties;
    if (sideMenuRef.current) {
      const pageType =
        properties &&
        Object.values(properties).find((item) => item['x-uid'] === params.name && item['x-component'] === 'Menu.Item');
      const isSettingPage = location?.pathname.includes('/settings');
      if (pageType || isSettingPage) {
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

  if (loading) {
    return;
  }
  return (
    <SchemaIdContext.Provider value={defaultSelectedUid}>
      <SchemaComponent memoized scope={{ useMenuProps, onSelect, sideMenuRef, defaultSelectedUid }} schema={schema} />
    </SchemaIdContext.Provider>
  );
};

export const InternalAdminLayout = (props: any) => {
  const sideMenuRef = useRef<HTMLDivElement>();
  const result = useSystemSettings();
  const app = useApp();
  const params = useParams<any>();
  const { styles } = useStyles();
  return (
    <Layout>
      <Layout.Header className={styles.header}>
        <div className={styles.headerA}>
          <div className={styles.headerB}>
            <div
              className={styles.titleContainer}
              onClick={() => {
                location.href = app.adminUrl;
              }}
            >
              <img className={styles.logo} src={result?.data?.data?.logo?.url} />
              <h1 className={styles.title}>{result?.data?.data?.title}</h1>
            </div>
            <MenuEditor sideMenuRef={sideMenuRef} />
            <div className={styles.editor}>
              <AdminTabs />
              <NoticeArea className={styles.notice} />
            </div>
          </div>
          <div className={styles.right}>
            <PinnedPluginList />
            <CurrentUser />
          </div>
        </div>
      </Layout.Header>
      {params.name && <Layout.Sider className={styles.sider} theme={'light'} ref={sideMenuRef}></Layout.Sider>}
      <Layout.Content className={styles.main}>
        <header className={styles.mainHeader}></header>
        <div className="amplifier-block">
          <AdminContent />
        </div>
      </Layout.Content>
    </Layout>
  );
};

export const AdminProvider = (props) => {
  return (
    <NoticeManagerProvider>
      <CurrentAppInfoProvider>
        <NavigateIfNotSignIn>
          <RemoteCollectionManagerProvider>
            <VariablesProvider>
              <ACLRolesCheckProvider>{props.children}</ACLRolesCheckProvider>
            </VariablesProvider>
          </RemoteCollectionManagerProvider>
        </NavigateIfNotSignIn>
      </CurrentAppInfoProvider>
    </NoticeManagerProvider>
  );
};

export const AdminLayout = (props) => {
  return (
    <AdminProvider>
      <InternalAdminLayout {...props} />
    </AdminProvider>
  );
};

export class AdminLayoutPlugin extends Plugin {
  async afterAdd() {
    await this.app.pm.add(RemoteSchemaTemplateManagerPlugin);
  }
  async load() {
    this.app.addComponents({ AdminLayout });
  }
}

export * from './NoticeArea';
