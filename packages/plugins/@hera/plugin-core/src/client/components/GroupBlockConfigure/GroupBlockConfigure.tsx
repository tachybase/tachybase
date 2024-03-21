import { SchemaSettingsItem } from '@nocobase/client';
import React, { useContext } from 'react';
import { useTranslation } from '../../locale';
import { Modal } from 'antd';
import { GroupBlockContext } from '../../schema-initializer/blocks/GroupBlockInitializer';

export const GroupBlockConfigure = (props) => {
  const { t } = useTranslation();
  const { setVisible, visible } = useContext(GroupBlockContext);
  return (
    <SchemaSettingsItem
      title="Configure"
      key="configure"
      onClick={async () => {
        setVisible(true);
      }}
    >
      {t('Configure')}
    </SchemaSettingsItem>
  );
};
