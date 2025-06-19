import { useRef } from 'react';

import { Layout } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import { CurrentUser, PinnedPluginList, useApp, useSystemSettings } from '../..';
import { AdminContent } from './AdminContent';
import { AdminTabs } from './AdminTabs';
import { MenuEditor } from './MenuEditor';
import { useStyles } from './style';

export const InternalAdminLayout = (props: any) => {
  const sideMenuRef = useRef<HTMLDivElement>();
  const result = useSystemSettings();
  const app = useApp();
  const params = useParams<any>();
  const { styles } = useStyles();
  // TODO: 这里需要判断是否是动态页面，如果是动态页面，则不需要显示侧边栏
  // 动态页面是 /:entry/:name 这种格式，所以只要 params['*'] 存在，就说明是动态页面, 否则就是普通页面
  // 暂时用这种判断方式, 需要替换为更严谨的特征值, 比如上下文
  const isDynamicPage = !!params['*'];
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Layout className={styles.layout}>
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
            <div className={styles.headerTabs}>
              <AdminTabs />
            </div>
          </div>
          <div className={styles.right}>
            <PinnedPluginList belongToFilter="pinnedmenu" />
            <CurrentUser />
          </div>
        </div>
      </Layout.Header>
      <Layout>
        {params.name && !isDynamicPage && (
          <Layout.Sider className={styles.sider} theme={'light'} ref={sideMenuRef}></Layout.Sider>
        )}
        <Layout.Content className={styles.main}>
          {isDynamicPage ? (
            <div onClick={handleBack}>动态页面</div>
          ) : (
            <div className="amplifier-block">
              <AdminContent />
            </div>
          )}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
