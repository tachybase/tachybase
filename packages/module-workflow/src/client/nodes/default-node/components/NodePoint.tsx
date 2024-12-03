import React from 'react';
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

  return (
    <div className={cx(styles.nodePoint, { configuring: configuring })}>
      <IdentityIcon color={color} icon={icon} />
      <AutoResizeInput
        className={`workflow-node-edit ${workflow.executed ? 'node-executed' : ''}`}
        readOnly={workflow.executed}
        value={editingTitle}
        onChange={(ev) => setEditingTitle(ev.target.value)}
        onBlur={(ev) => onChangeTitle(ev.target.value)}
      />
      <ButtonArea />
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
  return (
    <div className="workflow-node-suffix">
      <div className="icon-button">
        <RemoveButton />
      </div>
      {/* <div className="icon-button">
        <ArrowUpButton />
      </div>
      <div className="icon-button">
        <ArrowDownButton />
      </div> */}
      <div className="icon-button">
        <DragButton />
      </div>
      <div className="icon-button">
        <JobButton />
      </div>
    </div>
  );
};
