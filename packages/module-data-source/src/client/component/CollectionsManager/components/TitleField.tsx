import React from 'react';
import {
  useAPIClient,
  useCollectionManager_deprecated,
  useProps,
  useRecord,
  withDynamicSchemaProps,
} from '@tachybase/client';

import { message, Switch, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

import { useRemoteCollectionContext } from '../CollectionFields';

export const TitleField = withDynamicSchemaProps(
  (props) => {
    const { t } = useTranslation();
    const { isTitleField } = useCollectionManager_deprecated();
    const [loadingRecord, setLoadingRecord] = React.useState(null);

    // 新版 UISchema（1.0 之后）中已经废弃了 useProps，这里之所以继续保留是为了兼容旧版的 UISchema
    const { setTitleField, filterByTk, dataSourceKey } = useProps(props);
    const record = useRecord();
    const api = useAPIClient();
    const { refreshRM, titleField } = useRemoteCollectionContext();
    const handleChange = async (checked) => {
      setLoadingRecord(record);
      await api.request({
        url: `dataSources/${dataSourceKey}/collections:update?filterByTk=${filterByTk}`,
        method: 'post',
        data: { titleField: checked ? record.name : 'id' },
      });
      message.success(t('Saved successfully'));
      refreshRM();
      setTitleField(checked ? record.name : 'id');
      setLoadingRecord(null);
    };
    return isTitleField(record) ? (
      <Tooltip title={t('Default title for each record')} placement="right" overlayInnerStyle={{ textAlign: 'center' }}>
        <Switch
          aria-label={`switch-title-field-${record?.name}`}
          size="small"
          loading={record?.name === loadingRecord?.name}
          checked={record?.name === (titleField || 'id')}
          onChange={handleChange}
        />
      </Tooltip>
    ) : null;
  },
  { displayName: 'TitleField' },
);
