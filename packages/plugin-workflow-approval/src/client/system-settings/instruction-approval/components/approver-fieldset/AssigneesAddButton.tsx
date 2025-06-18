import React, { useCallback, useState } from 'react';
import { ArrayItems } from '@tachybase/components';
import { useWorkflowExecuted } from '@tachybase/module-workflow/client';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Popover, Space } from 'antd';

import { useTranslation } from '../../../../locale';

// 添加审批人(选择/查询)
export const AssigneesAddButton = () => {
  const isWorkflowExecuted = useWorkflowExecuted();

  const array = ArrayItems.useArray();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const onSlecet = useCallback(() => {
    array.field.push('');
    setIsOpen(false);
  }, [array.field]);

  const onQuery = useCallback(() => {
    array.field.push({ filter: {} });
    setIsOpen(false);
  }, [array.field]);

  return (
    <Popover
      open={!isWorkflowExecuted && isOpen}
      onOpenChange={setIsOpen}
      content={<PopoverContent onSlecet={onSlecet} onQuery={onQuery} />}
    >
      <Button
        className="ant-formily-array-base-addition"
        icon={<PlusOutlined />}
        type="dashed"
        block={true}
        disabled={isWorkflowExecuted}
      >
        {t('Add assignee')}
      </Button>
    </Popover>
  );
};

// Child Component
const PopoverContent = ({ onSlecet, onQuery }) => {
  const { t } = useTranslation();
  return (
    <Space direction="vertical" size="small">
      <Button type="text" onClick={onSlecet}>
        {t('Select assignees')}
      </Button>
      <Button type="text" onClick={onQuery}>
        {t('Query assignees')}
      </Button>
    </Space>
  );
};
