import React from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';

import { useProps } from './AddButton.props';
import useStyles from './AddButton.style';

interface AddButtonProps {
  upstream;
  branchIndex?: number | null;
  [key: string]: any;
}

/**
 * 添加按钮以及节点之间的连接线
 */
export const AddButton = (props: AddButtonProps) => {
  const { styles } = useStyles();

  const { workflow, menu } = useProps(props);

  if (!workflow) {
    return null;
  }

  return (
    <div className={styles.addButtonClass}>
      <Dropdown trigger={['click']} disabled={workflow.executed} overlayClassName={styles.dropDownClass} menu={menu}>
        <Button
          className="add-btn"
          icon={<PlusOutlined />}
          type="primary"
          aria-label={props['aria-label'] || 'add-button'}
        />
      </Dropdown>
    </div>
  );
};
