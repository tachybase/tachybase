import React from 'react';
import { CodeMirror, css, useAPIClient, usePlugin, useRequest } from '@tachybase/client';

import { useMemoizedFn } from 'ahooks';
import { Card, theme } from 'antd';

import PluginDevToolClient from '.';
import { useTranslation } from './locale';

export const clientrouterToolPane = React.memo(() => {
  const { token } = theme.useToken();
  const { t: lang } = useTranslation();
  const t = useMemoizedFn(lang);
  const plugin = usePlugin(PluginDevToolClient);
  const allroutes = plugin.allRoutes;

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
            value={JSON.stringify(allroutes, null, 2)}
            width="1200px"
            height="600px"
            defaultLanguage="typescript"
          />
        </div>
      </div>
    </Card>
  );
});
clientrouterToolPane.displayName = 'clientrouterToolPane';
