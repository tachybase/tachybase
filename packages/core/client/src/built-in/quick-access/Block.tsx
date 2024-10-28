import React, { createContext, useEffect, useState } from 'react';
import { observer, RecursionField, useFieldSchema } from '@tachybase/schema';

import { css } from '@emotion/css';
import { Avatar, List, Space } from 'antd';

import { useSchemaInitializerRender, withDynamicSchemaProps } from '../../application';
import { CollectionContext, DataSourceContext } from '../../data-source';
import { Icon } from '../../icon';
import { DndContext, useDesignable } from '../../schema-component';
import { QuickAccessLayout } from './blockSettings';

const ConfigureActionsButton = observer(
  () => {
    const fieldSchema = useFieldSchema();
    const { render } = useSchemaInitializerRender(fieldSchema['x-initializer']);
    return render();
  },
  { displayName: 'QuickAccessConfigureActionsButton' },
);

const InternalIcons = () => {
  const fieldSchema = useFieldSchema();
  const { designable } = useDesignable();
  const { layout = QuickAccessLayout.Grid } = fieldSchema.parent['x-component-props'] || {};
  const [gap, setGap] = useState(8); // 初始 gap 值

  useEffect(() => {
    const calculateGap = () => {
      const container = document.getElementsByClassName('mobile-page-content')[0] as any;
      if (container) {
        const containerWidth = container.offsetWidth - 48;
        const itemWidth = 100; // 每个 item 的宽度
        const itemsPerRow = Math.floor(containerWidth / itemWidth); // 每行能容纳的 item 数
        // 计算实际需要的 gap 值
        const totalItemWidth = itemsPerRow * itemWidth;
        const totalAvailableWidth = containerWidth;
        const totalGapsWidth = totalAvailableWidth - totalItemWidth;

        if (totalGapsWidth > 0) {
          setGap(totalGapsWidth / (itemsPerRow - 1));
        } else {
          setGap(0); // 如果没有足够的空间，则设置 gap 为 0
        }
      }
    };

    window.addEventListener('resize', calculateGap);
    calculateGap(); // 初始化时计算 gap

    return () => {
      window.removeEventListener('resize', calculateGap);
    };
  }, [Object.keys(fieldSchema?.properties || {}).length]);

  return (
    <div style={{ marginBottom: designable ? '1rem' : 0 }}>
      <DndContext>
        {layout === QuickAccessLayout.Grid ? (
          <Space wrap size={gap}>
            {fieldSchema.mapProperties((s, key) => (
              <RecursionField name={key} schema={s} key={key} />
            ))}
          </Space>
        ) : (
          <List itemLayout="horizontal">
            {fieldSchema.mapProperties((s, key) => {
              const icon = s['x-component-props']?.['icon'];
              const backgroundColor = s['x-component-props']?.['iconColor'];
              return (
                <List.Item
                  key={key}
                  className={css`
                    .ant-list-item-meta-avatar {
                      margin-inline-end: 0px !important;
                    }
                    .ant-list-item-meta-title {
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                    .ant-list-item-meta-title button {
                      font-size: 16px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      width: 100%;
                      text-align: left;
                    }
                  `}
                >
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor }} icon={<Icon type={icon} />} />}
                    title={<RecursionField name={key} schema={s} key={key} />}
                  ></List.Item.Meta>
                </List.Item>
              );
            })}
          </List>
        )}
      </DndContext>
    </div>
  );
};

export const QuickAccessBlockContext = createContext({ layout: 'grid' });

export const QuickAccessBlock: any = withDynamicSchemaProps(
  (props) => {
    const fieldSchema = useFieldSchema();
    const { layout = 'grid' } = fieldSchema['x-component-props'] || {};

    return (
      <QuickAccessBlockContext.Provider value={{ layout }}>
        <DataSourceContext.Provider value={undefined}>
          <CollectionContext.Provider value={undefined}>{props.children}</CollectionContext.Provider>
        </DataSourceContext.Provider>
      </QuickAccessBlockContext.Provider>
    );
  },
  { displayName: 'QuickAccessBlock' },
);

QuickAccessBlock.ActionBar = () => {
  return (
    <>
      <InternalIcons />
      <ConfigureActionsButton />
    </>
  );
};
