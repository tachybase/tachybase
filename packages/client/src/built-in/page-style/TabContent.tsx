import React, { useContext, useEffect } from 'react';

import { css } from '@emotion/css';
import { Outlet, useOutlet, useParams } from 'react-router-dom';

import { RemoteSchemaComponent } from '../../schema-component';
import { useDocumentTitle } from '../document-title';
import { DynamicPage } from '../dynamic-page/DynamicPage';
import { PageStyleContext } from './PageStyle.provider';
import { usePageStyle } from './usePageStyle';

export const TabContentInternal = ({ items, activeKey }) => {
  return items.map((item) => (
    <div
      className={
        activeKey !== item.key
          ? css`
              display: none;
            `
          : ''
      }
      key={item.key}
    >
      {item.children}
    </div>
  ));
};

export const TabContent = () => {
  const params = useParams<{ name?: string }>();
  const { title, setTitle } = useDocumentTitle();
  const { items, setItems } = useContext(PageStyleContext);
  const targetKey = params.name + (params['*'] ? '/' + params['*'] : '');
  const outlet = useOutlet();

  useEffect(() => {
    if (targetKey && title) {
      const targetItem = items.find((value) => value.key === targetKey);
      if (!targetItem) {
        // 现有tab页数组里,不存在之前浏览的tab页面,添加新的tab页进数组
        setItems([
          ...items,
          {
            key: targetKey,
            // TODO: 这里title计算需要处理
            label: title,
            children: outlet,
          },
        ]);
      } else {
        // 如果存在之前浏览的tab页面,只用更新页面标题
        setTitle(targetItem.label);
      }
    }
  }, [targetKey, title]);

  return <TabContentInternal items={items} activeKey={params.name} />;
};

export function MyRouteSchemaComponent({ name }: { name: string }) {
  const params = useParams<any>();
  if (params['*']) {
    return <DynamicPage />;
  }
  return <RemoteSchemaComponent onlyRenderProperties uid={name} />;
}

export const CustomAdminContent = () => {
  const params = useParams<any>();
  const pageStyle = usePageStyle();
  return params.name && pageStyle === 'tab' ? <TabContent /> : <Outlet />;
};
