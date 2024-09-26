import React, { useContext, useEffect } from 'react';

import { css } from '@emotion/css';
import { Tabs } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import { RemoteSchemaComponent } from '../../schema-component';
import { useDocumentTitle } from '../document-title';
import { PageStyleContext } from './PageStyle.provider';

export const PageTab = () => {
  const params = useParams<{ name?: string }>();
  const { title, setTitle } = useDocumentTitle();
  const navigate = useNavigate();
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

  const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'remove') {
      setItems((items) => {
        return items.filter((item) => item.key !== targetKey);
      });
    }
  };
  return (
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
  );
};

export function MyRouteSchemaComponent({ name }: { name: string }) {
  return <RemoteSchemaComponent onlyRenderProperties uid={name} />;
}
