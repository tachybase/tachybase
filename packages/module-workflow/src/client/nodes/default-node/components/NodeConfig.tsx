import React from 'react';

import { ProviderNodeConfig } from './NodeConfig.provider';
import { ViewNodeConfig } from './NodeConfig.view';

export const NodeConfig = (props) => {
  const { instruction, data, detailText, workflow, editingConfig, setEditingConfig } = props;

  return (
    <ProviderNodeConfig {...{ editingConfig, setEditingConfig, data, workflow }}>
      <ViewNodeConfig {...{ instruction, data, detailText, workflow }} />
    </ProviderNodeConfig>
  );
};
