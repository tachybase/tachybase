// import { PlusOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from 'react';
import { ArrayItems } from '@tachybase/components';
import { useWorkflowExecuted } from '@tachybase/plugin-workflow/client';

import { Button, Popover, Space } from 'antd';

import { useTranslation } from '../../locale';

export const AdditionNotifiedPerson = () => {
  const isWorkflowExecuted = useWorkflowExecuted();
  const array = ArrayItems.useArray() || { field: [] };
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

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
        // icon={<PlusOutlined />}
        type="dashed"
        block={true}
        disabled={isWorkflowExecuted}
      >
        {t('Add Notified Person')}
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
        {t('Select Notified Person')}
      </Button>
      <Button type="text" onClick={onQuery}>
        {t('Query Notified Person')}
      </Button>
    </Space>
  );
};
