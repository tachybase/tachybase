import React, { lazy, Suspense } from 'react';
import { createStyles, Plugin } from '@tachybase/client';

import { RightOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import { clientrouterToolPane } from './clientrouterPane';
import { ENVToolPane } from './ENVPane';
import { lang } from './locale';
import { MiddlewareToolPane } from './middlewarePane';

const DOCUMENTATION_PATH = '/api-documentation';
const DocumentationLazy = lazy(() => import('./Document'));
const Documentation = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <DocumentationLazy />
  </Suspense>
);

export const useStyles = createStyles(({ css, token }) => {
  return css`
    position: relative;
    background: ${token.colorBgContainer};
    padding: ${token.paddingMD}px;
    .open-tab {
      position: absolute;
      right: 0;
      top: 0;
    }
  `;
});

const SCDocumentation = () => {
  const { styles } = useStyles();
  return (
    <div className={styles}>
      <div className="open-tab">
        <Tooltip title="Preview">
          <a href={DOCUMENTATION_PATH} target="_blank" rel="noreferrer">
            <Button size="small" icon={<RightOutlined />} />
          </a>
        </Tooltip>
      </div>
      <Documentation />
    </div>
  );
};

export class PluginDevToolClient extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('devtools', {
      title: lang('Development Tools'),
      icon: 'ToolOutlined',
      sort: -20,
    });
    this.app.systemSettingsManager.add(`devtools.api-doc`, {
      title: lang('API Doc'),
      icon: 'BookOutlined',
      Component: SCDocumentation,
      aclSnippet: 'pm.devtools.documentation',
    });
    this.app.systemSettingsManager.add('devtools.env', {
      title: lang('Environment'),
      icon: 'CodeOutlined',
      Component: ENVToolPane,
      aclSnippet: 'pm.devtools.environment',
    });
    this.app.systemSettingsManager.add('devtools.middlewaresorder', {
      title: lang('Middlewares order'),
      icon: 'CodeOutlined',
      Component: MiddlewareToolPane,
      aclSnippet: 'pm.devtools.middlewares',
    });
    this.app.systemSettingsManager.add('devtools.clientrouter', {
      title: lang('Client router'),
      icon: 'CodeOutlined',
      Component: clientrouterToolPane,
    });
    this.app.router.add('api-documentation', {
      path: DOCUMENTATION_PATH,
      Component: Documentation,
    });
  }
}

export default PluginDevToolClient;
