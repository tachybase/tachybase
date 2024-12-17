import React from 'react';
import { CodeMirror, css, useApp } from '@tachybase/client';

import { Card, theme } from 'antd';

export const clientrouterToolPane = React.memo(() => {
  const { token } = theme.useToken();
  const app = useApp();
  const allroutes = app.router.getRoutes();

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
