import React, { forwardRef } from 'react';

import {
  CopyOutlined,
  DeleteOutlined,
  DragOutlined,
  FullscreenOutlined,
  RedoOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { ActionGroup, ActionIconGroupItemType } from '@ant-design/pro-editor';
import { message } from 'antd';

const defaultItems = [
  { icon: <FullscreenOutlined />, title: '全屏' },
  { icon: <UndoOutlined />, title: '撤销' },
  { icon: <RedoOutlined />, title: '重做' },
  { icon: <DeleteOutlined />, title: '删除' },
];

const customItems: ActionIconGroupItemType[] = [
  {
    icon: <CopyOutlined />,
    placement: 'bottom',
    title: '复制',
  },
  {
    icon: <ZoomInOutlined />,
    title: '放大！',
  },
  {
    icon: <ZoomOutOutlined />,
    style: {
      color: '#1890ff',
    },
    title: '缩小！',
  },
  {
    type: 'divider',
  },
  {
    icon: <DragOutlined />,
    title: '快速定位',
  },
];

const dropdownMenuItems: ActionIconGroupItemType[] = [
  {
    icon: <CopyOutlined />,
    onClick: () => {
      message.info('复制！');
    },
    label: '复制',
  },
  {
    icon: <ZoomInOutlined />,
    onClick: () => {
      message.success('放大！');
    },
    label: '放大！',
  },
  {
    icon: <ZoomOutOutlined />,
    style: {
      color: '#1890ff',
    },
    onClick: () => {
      message.success('缩小！');
    },
    label: '缩小！',
  },
  {
    type: 'divider',
  },
  {
    icon: <DragOutlined />,
    onClick: () => {
      message.loading('快速定位ing');
    },
    label: '快速定位',
  },
];

export { customItems, defaultItems, dropdownMenuItems };

export default forwardRef((props: any, ref) => {
  return (
    <div {...props} ref={ref as any}>
      <ActionGroup items={defaultItems} dropdownMenu={dropdownMenuItems} />
    </div>
  );
});
