import React, { useCallback, useContext } from 'react';
import { FormLayout } from '@tachybase/components';
import { SchemaOptionsContext } from '@tachybase/schema';

import { useTranslation } from 'react-i18next';

import { SchemaInitializerItem, useSchemaInitializer } from '../../application';
import { Icon } from '../../icon';
import { FormDialog, SchemaComponent, SchemaComponentOptions } from '../../schema-component';
import { useStyles } from '../../schema-component/antd/menu/MenuItemInitializers';
import { useGlobalTheme } from '../../style/theme';

export const GroupItem = () => {
  const { insert } = useSchemaInitializer();
  const { t } = useTranslation();
  const options = useContext(SchemaOptionsContext);
  const { theme } = useGlobalTheme();
  const { styles } = useStyles();

  const handleClick = useCallback(async () => {
    const values = await FormDialog(
      t('Add submenu'),
      () => {
        return (
          <SchemaComponentOptions scope={options.scope} components={{ ...options.components }}>
            <FormLayout layout={'vertical'}>
              <SchemaComponent
                schema={{
                  properties: {
                    title: {
                      title: t('Menu item title'),
                      'x-component': 'Input',
                      'x-decorator': 'FormItem',
                      required: true,
                    },
                    icon: {
                      title: t('Icon'),
                      'x-component': 'IconPicker',
                      'x-decorator': 'FormItem',
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
    insert({
      type: 'void',
      title,
      'x-component': 'Menu.SubMenu',
      'x-decorator': 'ACLMenuItemProvider',
      'x-component-props': {
        icon,
      },
      'x-server-hooks': [
        {
          type: 'onSelfCreate',
          method: 'bindMenuToRole',
        },
        {
          type: 'onSelfSave',
          method: 'extractTextToLocale',
        },
      ],
    });
  }, [insert, options.components, options.scope, t, theme]);
  return (
    <SchemaInitializerItem
      icon={<Icon type={'FolderAddOutlined'} />}
      title={t('Create group')}
      onClick={handleClick}
      className={styles.menuItem}
    />
  );
};
