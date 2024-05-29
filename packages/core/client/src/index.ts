// 重置浏览器样式
import 'antd/dist/reset.css';
import './global.less';

export * from '@emotion/css';
export * from './buildin-plugin/acl';
export * from './antd-config-provider';
export * from './api-client';
export * from './appInfo';
export * from './application';
export * from './async-data-provider';
export * from './block-provider';
export * from './collection-manager';

export * from './common';
export * from './css-variable';
export * from './data-source';
export * from './buildin-plugin/document-title';
export * from './filter-provider';
export * from './flag-provider';
export * from './global-theme';
export * from './hooks';
export * from './i18n';
export * from './icon';
export { default as locale } from './locale';
export * from './buildin-plugin';
export * from './buildin-plugin/pinned-list';
export * from './buildin-plugin/pm';
export * from './powered-by';
export * from './record-provider';
export * from './route-switch';
export * from './schema-component';
export * from './schema-initializer';
export * from './schema-items';
export * from './schema-settings';
export * from './schema-templates';
export * from './style';
export type { CustomToken } from './global-theme';
export * from './buildin-plugin/system-settings';
export * from './testUtils';
export * from './user';
export * from './variables';

export { withDynamicSchemaProps } from './application/hoc/withDynamicSchemaProps';

export * from './modules/blocks/BlockSchemaToolbar';
export * from './modules/blocks/data-blocks/details-multi/setDataLoadingModeSettingsItem';
export * from './modules/blocks/data-blocks/form';
export * from './modules/blocks/data-blocks/table';
export * from './modules/blocks/data-blocks/table-selector';

export * from './modules/blocks/useParentRecordCommon';

export * as __UNSAFE__ from './unsafe';
export type {
  DynamicComponentProps as __UNSAFE__DynamicComponentProps,
  VariablesContextType as __UNSAFE__VariablesContextType,
  VariableOption as __UNSAFE__VariableOption,
  Option as __UNSAFE__VariableInputOption,
} from './unsafe';
