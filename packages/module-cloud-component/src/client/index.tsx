import { Plugin, useApp, useDesignable } from '@tachybase/client';
import { Field, useField, useFieldSchema } from '@tachybase/schema';
import { uid } from '@tachybase/utils/client';

import exceljs from 'exceljs';
import * as fileSaver from 'file-saver';
import * as qrcode from 'qrcode';
import * as reactUse from 'react-use';

import { CloudLibraryManager } from './cloud-library-manager/CloudLibraryManager';
import { ProviderCloudComponent } from './CloudComponent.provider';
import { useTranslation } from './locale';
import { CloudComponentBlock } from './settings/CloudComponentBlock';
import { cloudComponentBlockInitializerItem } from './settings/InitializerItem';
import { cloudComponentBlockSettings } from './settings/settings';

export const CloudComponentNameKey = Symbol('CloudComponentNameKey');

export class ModuleCloudComponentClient extends Plugin {
  async afterAdd() {
    this.app.requirejs.define('react-use', () => reactUse);
    this.app.requirejs.define('exceljs', () => exceljs);
    this.app.requirejs.define('qrcode', () => qrcode);
    this.app.requirejs.define('file-saver', () => fileSaver);
    await this.initLibraries();
  }

  async load() {
    this.app.systemSettingsManager.add('cloud-component', {
      title: this.t('Cloud Component'),
      icon: 'deploymentunitoutlined',
      Component: CloudLibraryManager,
      sort: -50,
    });
    this.app.use(ProviderCloudComponent);
    this.app.addComponents({
      CloudComponentBlock,
    });
    this.app.schemaSettingsManager.add(cloudComponentBlockSettings);
    // 添加到页面的 Add block 里
    this.app.schemaInitializerManager.addItem(
      'page:addBlock',
      `otherBlocks.${cloudComponentBlockInitializerItem.name}`,
      cloudComponentBlockInitializerItem,
    );
    // 添加到弹窗的 Add block 里
    this.app.schemaInitializerManager.addItem(
      'popup:common:addBlock',
      `otherBlocks.${cloudComponentBlockInitializerItem.name}`,
      cloudComponentBlockInitializerItem,
    );

    const addCloudComponent = {
      name: 'addCloudComponent',
      title: this.t('Cloud Component'),
      Component: 'BlockItemInitializer',
      schema: {
        type: 'void',
        'x-decorator': 'FormItem',
        'x-settings': 'blockSettings:cloudComponent', // TODO
        'x-component': 'CloudComponentBlock',
        'x-component-props': {
          element: 'CloudComponentVoid',
        },
      },
    };
    this.app.schemaInitializerManager.addItem('form:configureFields', addCloudComponent.name, addCloudComponent);
    this.app.schemaInitializerManager.addItem('details:configureFields', addCloudComponent.name, addCloudComponent);

    const addCloudComponentColumn = {
      name: 'addCloudComponent',
      title: this.t('Cloud Component'),
      Component: 'BlockItemInitializer',
      schema: {
        type: 'void',
        name: uid(),
        'x-component': 'CloudComponentBlock',
        'x-component-props': {
          element: 'CloudComponentVoid',
        },
      },
    };
    this.app.schemaSettingsManager.get('fieldSettings:TableColumn').add('cloudComponent', {
      type: 'select',
      useVisible() {
        const schema = useFieldSchema();
        return !!schema.reduceProperties((buf, s) => {
          if (s['x-component'] === 'CloudComponentBlock') {
            return s;
          }
          return buf;
        }, null);
      },
      useComponentProps() {
        const app = useApp();
        const CloudComponentVoid = app.getComponent('CloudComponentVoid');
        const { t } = useTranslation();
        const components = Object.getOwnPropertyNames(CloudComponentVoid)
          .filter((key) => typeof CloudComponentVoid[key] === 'function' || CloudComponentVoid[key]?.$$typeof)
          .map((key) => {
            return {
              label: t(CloudComponentVoid[key][CloudComponentNameKey] || key),
              value: key,
            };
          });
        const field = useField<Field>();
        const columnSchema = useFieldSchema();
        const fieldSchema = columnSchema.reduceProperties((s, buf) => {
          if (s?.['x-component'] === 'CloudComponentBlock') {
            return s;
          }
          return buf;
        }, null);
        const { dn } = useDesignable();
        return {
          title: t('Cloud Component'),
          value: fieldSchema['x-component-props']['element'] || 'CloudComponentVoid',
          options: [
            {
              label: t('Not selected'),
              value: 'CloudComponentVoid',
            },
            ...components,
          ],
          onChange(element) {
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };
            fieldSchema['x-component-props']['element'] = element;
            fieldSchema['x-acl-ignore'] = true;
            schema['x-component-props'] = fieldSchema['x-component-props'];
            schema['x-acl-ignore'] = true;
            const path = field.path?.splice(field.path?.length - 1, 1);
            field.form.query(`${path.concat(`*.` + fieldSchema.name)}`).forEach((f) => {
              f.componentProps.element = element;
            });
            dn.emit('patch', {
              schema,
            });
          },
        };
      },
    });
    this.app.schemaInitializerManager.addItem(
      'table:configureColumns',
      addCloudComponentColumn.name,
      addCloudComponentColumn,
    );
  }

  async initLibraries() {
    const { data } = await this.app.apiClient.request({
      resource: 'effectLibraries',
      action: 'list',
      params: {
        paginate: false,
        filter: {
          isClient: true,
          enabled: true,
        },
      },
    });
    const libraries = data?.data || [];
    for (const library of libraries) {
      const blob = new Blob([library.client], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      this.app.requirejs.require.config({
        paths: {
          [library.module]: url,
        },
      });
    }

    // 加载客户端插件
    const waitlist = [];
    for (const library of libraries) {
      if (!library.clientPlugin) {
        continue;
      }

      new Promise((resolve) => {
        this.app.requirejs.require([library.module], (m) => {
          this.app.pm.add(m[library.clientPlugin]);
          resolve(library.clientPlugin);
        });
      });
    }

    const CloudComponentVoid = () => null;

    // 加载客户端组件
    for (const library of libraries) {
      if (!library.component) {
        continue;
      }
      waitlist.push(
        new Promise((resolve) => {
          this.app.requirejs.require([library.module], (m) => {
            if (m?.[library.component]) {
              CloudComponentVoid[library.component] = m[library.component];
              CloudComponentVoid[library.component][CloudComponentNameKey] = library.name;
              resolve(library.component);
            } else {
              console.warn(`[CloudComponent] component ${library.component} not found in ${library.module}`);
              resolve('empty component');
            }
          });
        }),
      );
    }
    await Promise.all(waitlist);
    this.app.addComponents({ CloudComponentVoid });
  }
}

export default ModuleCloudComponentClient;
