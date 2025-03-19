import React from 'react';
import { SchemaComponent } from '@tachybase/client';
import { ISchema, uid } from '@tachybase/schema';

import { Card } from 'antd';

import { TokenPolicyConfig } from '../../../types';
import { tval, useAuthTranslation } from '../../locale';
import { componentsMap, componentsNameMap } from './components';
import { hooksMap, hooksNameMap } from './hooks';

type Properties = {
  [K in keyof TokenPolicyConfig | 'footer']: any;
};
const schema: ISchema & { properties: Properties } = {
  name: uid(),
  'x-component': 'FormV2',
  'x-use-component-props': hooksNameMap.useEditForm,
  type: 'object',
  properties: {
    sessionExpirationTime: {
      type: 'string',
      title: tval('Session validity period'),
      'x-decorator': 'FormItem',
      'x-component': componentsNameMap.InputTime,
      required: true,
      description: tval(
        'The maximum valid time for each user login. During the session validity, the Token will be automatically updated. After the timeout, the user is required to log in again.',
      ),
    },
    tokenExpirationTime: {
      type: 'string',
      title: tval('Token validity period'),
      'x-decorator': 'FormItem',
      'x-component': componentsNameMap.InputTime,
      required: true,
      description: tval(
        'The validity period of each issued API Token. After the Token expires, if it is within the session validity period and has not exceeded the refresh limit, the server will automatically issue a new Token to maintain the user session, otherwise the user is required to log in again. (Each Token can only be refreshed once)',
      ),
    },
    expiredTokenRenewLimit: {
      type: 'string',
      title: "{{t('Expired token refresh limit')}}",
      'x-decorator': 'FormItem',
      'x-component': componentsNameMap.InputTime,
      'x-component-props': {
        minNum: 0,
      },
      required: true,
      description: tval(
        'The maximum time limit allowed for refreshing a Token after it expires. After this time limit, the token cannot be automatically renewed, and the user needs to log in again.',
      ),
    },
    footer: {
      type: 'void',
      'x-component': 'ActionBar',
      'x-component-props': {
        layout: 'one-column',
      },
      properties: {
        submit: {
          title: '{{t("Submit")}}',
          'x-component': 'Action',
          'x-use-component-props': hooksNameMap.useSubmitActionProps,
        },
      },
    },
  },
};

export const TokenPolicySettings = () => {
  const { t } = useAuthTranslation();
  return (
    <Card bordered={false}>
      <SchemaComponent schema={schema} scope={{ t, ...hooksMap }} components={componentsMap}></SchemaComponent>
    </Card>
  );
};
