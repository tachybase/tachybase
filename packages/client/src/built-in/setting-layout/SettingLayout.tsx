import React, { useState } from 'react';

import { GithubFilled, InfoCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import { PageContainer, ProConfigProvider, ProLayout, type ProSettings } from '@ant-design/pro-components';
import { Button, Dropdown } from 'antd';

import { SettingsMenu, useCurrentUserContext } from '../../user';
import { AdminProvider, NoticeArea } from '../admin-layout';
import { useSystemSettings } from '../system-settings';
import defaultProps from './_defaultProps';

export const MyLayout = ({ selectedKeys, onClick, route, children }) => {
  const settings: Partial<ProSettings> = {
    fixSiderbar: true,
    layout: 'mix',
    splitMenus: false,
    navTheme: 'light',
    contentWidth: 'Fluid',
    fixedHeader: true,
    siderMenuType: 'sub',
  };

  const [pathname, setPathname] = useState('/list/sub-page/sub-sub-page1');
  const { data } = useCurrentUserContext();
  const result = useSystemSettings();

  return (
    <AdminProvider>
      <NoticeArea />
      <ProConfigProvider hashed={false}>
        <ProLayout
          title={result?.data?.data?.title}
          logo={<img src={result?.data?.data?.logo?.url} />}
          prefixCls="my-prefix"
          bgLayoutImgList={[
            {
              src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
              left: 85,
              bottom: 100,
              height: '303px',
            },
            {
              src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
              bottom: -68,
              right: -45,
              height: '303px',
            },
            {
              src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
              bottom: 0,
              left: 0,
              width: '331px',
            },
          ]}
          {...defaultProps}
          route={route}
          location={{
            pathname,
          }}
          token={{
            header: {
              colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
            },
          }}
          siderMenuType="group"
          menuProps={{
            onClick,
            selectedKeys,
          }}
          menu={{
            collapsedShowGroupTitle: true,
          }}
          avatarProps={{
            src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
            size: 'small',
            title: data?.data?.nickname || data?.data?.username || data?.data?.email,
            render: (props, dom) => {
              return <Dropdown dropdownRender={() => <SettingsMenu />}>{dom}</Dropdown>;
            },
          }}
          actionsRender={(props) => {
            if (props.isMobile) return [];
            if (typeof window === 'undefined') return [];
            return [
              <Button
                type="text"
                target="_blank"
                href="https://tachybase.org"
                icon={<InfoCircleFilled key="InfoCircleFilled" />}
              ></Button>,
              <Button
                type="text"
                target="_blank"
                href="https://github.com/tachybase/tachybase/issues"
                icon={<QuestionCircleFilled key="QuestionCircleFilled" />}
              ></Button>,
              <Button
                type="text"
                target="_blank"
                href="https://github.com/tachybase/tachybase"
                icon={<GithubFilled key="GithubFilled" />}
              ></Button>,
            ];
          }}
          headerTitleRender={(logo, title, _) => {
            const defaultDom = (
              <a>
                {logo}
                {title}
              </a>
            );
            if (typeof window === 'undefined') return defaultDom;
            if (document.body.clientWidth < 1400) {
              return defaultDom;
            }
            if (_.isMobile) return defaultDom;
            return <>{defaultDom}</>;
          }}
          onMenuHeaderClick={(e) => console.log(e)}
          menuItemRender={(item, dom) => (
            <div
              onClick={() => {
                setPathname(item.path || '/welcome');
              }}
            >
              {dom}
            </div>
          )}
          {...settings}
        >
          <PageContainer
            token={{
              paddingInlinePageContainerContent: 40,
            }}
          >
            {children}
          </PageContainer>
        </ProLayout>
      </ProConfigProvider>
    </AdminProvider>
  );
};
