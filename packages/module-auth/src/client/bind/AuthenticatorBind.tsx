import React from 'react';
import { SchemaComponent, useAPIClient, useCollectionManager_deprecated, useRecord, useResourceActionContext } from '@tachybase/client';

import { Card } from 'antd';
import { BindForm } from './BindForm';

import { useAuthTranslation } from '../locale';
import { authenticatorsSchema } from './schemas/authenticators';

const useUnbindAction = () => {
  const { refreshCM } = useCollectionManager_deprecated();
  const apiClient = useAPIClient();
  const record = useRecord();
  return {
    async run() {
      await apiClient.resource('authenticators').unbind({
        authenticator: record.name,
      });
      refreshCM();
    },
  };
};

export const AuthenticatorBind = () => {
  const { t } = useAuthTranslation();

  return (
    <Card bordered={false}>
      <SchemaComponent schema={authenticatorsSchema} components={{ BindForm }} scope={{ t, useUnbindAction }} />
    </Card>
  );
};
