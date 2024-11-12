import React from 'react';
import { GeneralSchemaDesigner, SchemaSettingsRemove } from '@tachybase/client';

import { useTranslation } from '../../../../locale';

export const SettingsDesigner = () => {
  const { t } = useTranslation();

  return (
    <GeneralSchemaDesigner>
      <SchemaSettingsRemove
        key="remove"
        removeParentsIfNoChildren
        confirm={{
          title: t('Delete settings block'),
        }}
        breakRemoveOn={{
          'x-component': 'Grid',
        }}
      />
    </GeneralSchemaDesigner>
  );
};
