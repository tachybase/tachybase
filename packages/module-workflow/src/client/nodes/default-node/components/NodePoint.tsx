import React, { useState } from 'react';
import { cx, Icon } from '@tachybase/client';

import { AutoResizeInput } from '../../..';
import { DragButton } from '../buttons/DragButton';
import { JobButton } from '../buttons/JobButton';
import { RemoveButton } from '../buttons/RemoveButton';
import useStyles from './NodePoint.style';

// 节点组件
export const NodePoint = (props) => {
  const { color, icon, workflow, editingTitle, configuring, setEditingTitle, onChangeTitle } = props;

  const { styles } = useStyles();

  const [isEditing, setIsEditing] = useState(false);
  const isLockEdit = workflow.executed || !isEditing;

  const handleClick = () => {
    // 改善交互体验, 只有在选中节点的前提下, 再次点击才会进入编辑态
    if (configuring) {
      setIsEditing(true);
    }
  };

  const handleBlur = (ev) => {
    onChangeTitle(ev.target.value);
    setIsEditing(false);
  };

  return (
    <div className={cx(styles.nodePoint, { configuring: configuring })}>
      <IdentityIcon color={color} icon={icon} />
      <AutoResizeInput
        className={`workflow-node-edit ${isLockEdit ? 'node-executed' : ''}`}
        readOnly={isLockEdit}
        value={editingTitle}
        onChange={(ev) => setEditingTitle(ev.target.value)}
        onBlur={handleBlur}
        onClick={handleClick}
      />
      <ButtonArea isExecuted={workflow.executed} />
    </div>
  );
};

/**
 *节点标识 Icon
 */
const IdentityIcon = (props) => {
  const { color, icon } = props;
  return (
    <div className="workflow-node-prefix" style={{ backgroundColor: color }}>
      <Icon type={icon ?? 'dispatcher'} />
    </div>
  );
};

/**
 * 节点操作区域
 */

const ButtonArea = (props) => {
  const { isExecuted } = props;
  return (
    <div className="workflow-node-suffix">
      {isExecuted ? (
        <div className="icon-button">
          <JobButton />
        </div>
      ) : (
        <>
          <div className="icon-button">
            <RemoveButton />
          </div>
          <div className="icon-button">
            <DragButton />
          </div>
        </>
      )}
    </div>
  );
};
