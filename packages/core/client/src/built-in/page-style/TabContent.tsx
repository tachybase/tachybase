import React, { useContext, useEffect } from 'react';

import { css } from '@emotion/css';
import { Outlet, useParams } from 'react-router-dom';

import { RemoteSchemaComponent } from '../../schema-component';
import { useDocumentTitle } from '../document-title';
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

  useEffect(() => {
    if (params.name && title) {
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

  return <TabContentInternal items={items} activeKey={params.name} />;
};

export function MyRouteSchemaComponent({ name }: { name: string }) {
  return <RemoteSchemaComponent onlyRenderProperties uid={name} />;
}

export const CustomAdminContent = () => {
  const params = useParams<any>();
  const pageStyle = usePageStyle();
  return params.name && pageStyle === 'tab' ? <TabContent /> : <Outlet />;
};
