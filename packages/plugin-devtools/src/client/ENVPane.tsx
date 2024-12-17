import React from 'react';
import { CodeMirror, css, useAPIClient, useRequest } from '@tachybase/client';

import { useMemoizedFn } from 'ahooks';
import { Card, theme } from 'antd';

import { useTranslation } from './locale';

export const ENVToolPane = React.memo((props) => {
  const { token } = theme.useToken();
  const { t: lang } = useTranslation();
  const t = useMemoizedFn(lang);
  const api = useAPIClient();
  const { data } = useRequest(() =>
    api
      .resource('enviroment')
      .get()
      .then((res) => res.data?.data),
  );

  return (
    <Card style={{ minHeight: '700px' }}>
      <div
        className={css`
          display: flex;
        `}
      >
        <div
          style={{
            maxHeight: '700px',
            overflow: 'auto',
            border: '1px solid',
            marginTop: '10px',
            marginBottom: '10px',
            borderColor: token.colorBorder,
            width: '1205px',
          }}
        >
          <CodeMirror
            value={JSON.stringify(data, null, 2)}
            width="1200px"
            height="600px"
            defaultLanguage="typescript"
          />
        </div>
      </div>
    </Card>
  );
});
ENVToolPane.displayName = 'ENVToolPane';
