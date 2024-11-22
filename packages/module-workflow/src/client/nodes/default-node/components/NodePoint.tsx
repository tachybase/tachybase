import React from 'react';
import { Icon } from '@tachybase/client';

import { AutoResizeInput } from '../../..';
import { ArrowDownButton } from '../buttons/ArrowDownButton';
import { ArrowUpButton } from '../buttons/ArrowUpButton';
import { JobButton } from '../buttons/JobButton';
import { RemoveButton } from '../buttons/RemoveButton';

// 节点组件
export const NodePoint = (props) => {
  const { workflow, editingTitle, setEditingTitle, onChangeTitle } = props;
  return (
    <div>
      <IdentityIcon />
      <AutoResizeInput
        className="workflow-node-edit"
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
  return (
    <div className="workflow-node-prefix">
      <Icon type="dispatcher" />
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
        <ArrowUpButton />
      </div>
      <div className="icon-button">
        <ArrowDownButton />
      </div>
      <div className="icon-button">
        <RemoveButton />
      </div>
      <div className="icon-button">
        <JobButton />
      </div>
    </div>
  );
};
