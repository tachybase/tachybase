import React from 'react';

import { HolderOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { useFlowContext } from '../../../FlowContext';
import { useContextDrag } from '../Drag.context';

export const DragButton = () => {
  const { workflow } = useFlowContext() ?? {};
  const { setIsDraggable } = useContextDrag();
  const handleOnClick = () => {
    setIsDraggable(true);
  };

  if (!workflow) {
    return null;
  }

  return (
    <Button
      className="workflow-node-drag-button"
      type="text"
      shape="circle"
      icon={<HolderOutlined />}
      onClick={handleOnClick}
    />
  );
};
