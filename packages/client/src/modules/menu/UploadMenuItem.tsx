import React, { useCallback, useContext } from 'react';
import { FormLayout } from '@tachybase/components';
import { SchemaOptionsContext } from '@tachybase/schema';

import { useTranslation } from 'react-i18next';

import { useAPIClient } from '../../api-client/hooks/useAPIClient';
import { SchemaInitializerItem, useSchemaInitializer } from '../../application';
import { Icon } from '../../icon';
import { FormDialog, SchemaComponent, SchemaComponentOptions } from '../../schema-component';
import { useStyles } from '../../schema-component/antd/menu/MenuItemInitializers';
import { useGlobalTheme } from '../../style/theme';

export const UploadMenuItem = () => {
  const { insert } = useSchemaInitializer();
  const { t } = useTranslation();
  const options = useContext(SchemaOptionsContext);
  const { theme } = useGlobalTheme();
  const { styles } = useStyles();

  const apiClient = useAPIClient();

  const handleClick = useCallback(async () => {
    const values = await FormDialog(
      t('Load menu config'),
      () => {
        return (
          <SchemaComponentOptions scope={options.scope} components={{ ...options.components }}>
            <FormLayout layout={'vertical'}>
              <SchemaComponent
                schema={{
                  type: 'object',
                  title: t('Load menu config'),
                  properties: {
                    title: {
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      title: t('Menu item title'),
                      required: true,
                      'x-component-props': {},
                    },
                    bindMenuToRole: {
                      type: 'boolean',
                      title: '{{ t("Automatically assign permissions to all matching roles") }}',
                      'x-decorator': 'FormItem',
                      'x-component': 'Checkbox',
                      default: true,
                    },
                    file: {
                      type: 'object',
                      title: '{{ t("File") }}',
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'Upload.Attachment',
                      'x-component-props': {
                        action: 'attachments:create',
                        multiple: false,
                      },
                    },
                  },
                }}
              />
            </FormLayout>
          </SchemaComponentOptions>
        );
      },
      theme,
    ).open({
      initialValues: {},
    });

    const { title, icon } = values;

    // const { data } = await apiClient.request({
    //   url: file.url,
    //   baseURL: '/',
    // });
    // const s = data ?? {};
    // if (bindMenuToRole) {
    //   const hooks = data['x-server-hooks'];
    //   if (!hooks.some((v) => v.type === 'onSelfCreate' && v.method === 'bindMenuToRole')) {
    //     hooks.push({
    //       type: 'onSelfCreate',
    //       method: 'bindMenuToRole',
    //     });
    //   }
    // }
    // s.title = title;
    // insert(s);
  }, [insert, options.components, options.scope, t, theme]);

  return (
    <SchemaInitializerItem
      className={styles.menuItem}
      icon={<Icon type={'UploadOutlined'} />}
      title={t('Load menu config')}
      onClick={handleClick}
    />
  );
};
