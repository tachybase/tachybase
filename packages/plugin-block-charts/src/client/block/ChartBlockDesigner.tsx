import React from 'react';
import {
  GeneralSchemaDesigner,
  SchemaSettingsBlockTitleItem,
  SchemaSettingsDivider,
  SchemaSettingsRemove,
} from '@tachybase/client';

import { useChartsTranslation } from '../locale';

export const ChartV2BlockDesigner: React.FC = () => {
  const { t } = useChartsTranslation();
  return (
    <GeneralSchemaDesigner title={t('Charts')} showDataSource={false}>
      <SchemaSettingsBlockTitleItem />
      <SchemaSettingsDivider />
      <SchemaSettingsRemove
        removeParentsIfNoChildren
        breakRemoveOn={{
          'x-component': 'Grid',
        }}
      />
    </GeneralSchemaDesigner>
  );
};
