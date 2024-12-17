import React, { lazy } from 'react';
import { createStyles, Plugin } from '@tachybase/client';

import { RightOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import { clientrouterToolPane } from './clientrouterPane';
import { ENVToolPane } from './ENVPane';
import { lang } from './locale';
import { MiddlewareToolPane } from './middlewarePane';

const DOCUMENTATION_PATH = '/api-documentation';
const Documentation = lazy(() => import('./Document'));

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
  allRoutes = this.app.router.getRoutes();
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  async load() {
    this.app.systemSettingsManager.add(`devtools.api-doc`, {
      title: lang('API documentation'),
      icon: 'BookOutlined',
      Component: SCDocumentation,
      aclSnippet: 'pm.api-doc.documentation',
    });
    this.app.systemSettingsManager.add('devtools.env', {
      title: lang('ENV'),
      icon: 'CodeOutlined',
      Component: ENVToolPane,
    });
    this.app.systemSettingsManager.add('devtools.middlewaresorder', {
      title: lang('middlewaresorder'),
      icon: 'CodeOutlined',
      Component: MiddlewareToolPane,
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
