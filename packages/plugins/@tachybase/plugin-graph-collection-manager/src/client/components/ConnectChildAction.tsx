import React from 'react';
import { useCollectionManager_deprecated } from '@tachybase/client';

import { FallOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

import { getPopupContainer, useGCMTranslation } from '../utils';

export const ConnectChildAction = (props) => {
  const { targetGraph, item } = props;
  const { t } = useGCMTranslation();
  const { getChildrenCollections } = useCollectionManager_deprecated();
  const childs = getChildrenCollections(item.name);

  const isShowChild = childs?.some(({ name }) => {
    return !targetGraph.hasCell(name);
  });
  return isShowChild ? (
    <Tooltip title={t('Show child')} getPopupContainer={getPopupContainer}>
      <FallOutlined
        className="btn-inheriedChild"
        onClick={() => {
          targetGraph.onConnectionChilds(childs.map((v) => v.name));
        }}
      />
    </Tooltip>
  ) : (
    ''
  );
};
