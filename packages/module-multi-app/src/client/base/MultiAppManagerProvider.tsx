import { Icon, PinnedPluginListProvider, SchemaComponentOptions, useApp, useRequest } from '@tachybase/client';

import { Button, Dropdown } from 'antd';
import { Link } from 'react-router-dom';

import { NAMESPACE } from '../../constants';
import { usePluginUtils } from '../locale';
import { MultiAppBlockInitializer } from '../usage/MultiAppBlockInitializer';
import { AppNameInput } from './AppNameInput';
import { useStyles } from './MultiAppManagerProvider.style';

const MultiAppManager = () => {
  const { styles } = useStyles();
  const { data, run } = useRequest<{
    data: any[];
  }>(
    {
      resource: 'applications',
      action: 'listPinned',
    },
    {
      manual: true,
    },
  );
  const { t } = usePluginUtils();
  const instance = useApp();
  const items = [
    ...(data?.data || []).map((app) => {
      let link = instance.getRouteUrl(`/apps/${app.name}/admin/`);
      if (app.cname) {
        link = `//${app.cname}`;
      }
      return {
        key: app.name,
        label: (
          <a href={link} target="_blank" rel="noopener noreferrer">
            {app.displayName || app.name}
          </a>
        ),
      };
    }),
    {
      key: '.manager',
      label: (
        <Link to={instance.systemSettingsManager.getRoutePath('system-services.' + NAMESPACE)}>
          {t('Manage applications')}
        </Link>
      ),
    },
  ];
  return (
    <Dropdown
      onOpenChange={(visible) => {
        run();
      }}
      menu={{ items }}
    >
      <Button className={styles.button} title={'Apps'} icon={<Icon type={'AppstoreOutlined'} />} />
    </Dropdown>
  );
};

export const MultiAppManagerProvider = (props) => {
  return (
    <PinnedPluginListProvider
      items={{
        am: { order: 201, component: 'MultiAppManager', pin: true, snippet: 'pm.*', belongTo: 'pinnedmenu' },
      }}
    >
      <SchemaComponentOptions
        components={{
          MultiAppManager,
          AppNameInput,
          MultiAppBlockInitializer,
        }}
      >
        {props.children}
      </SchemaComponentOptions>
    </PinnedPluginListProvider>
  );
};
