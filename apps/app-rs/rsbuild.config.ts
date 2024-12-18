import { defineConfig } from '@rsbuild/core';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  source: {
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
  },
  dev: {
    hmr: false,
    writeToDisk: true,
  },

  output: {
    distPath: {
      js: 'assets',
      css: 'assets',
      image: 'assets',
      svg: 'assets',
      font: 'assets',
      media: 'assets',
    },
    minify: false,
  },
  server: {
    proxy: {
      "/api/": {
        "target": "http://127.0.0.1:3010",
        "changeOrigin": true,
        "pathRewrite": {
          "^/api/": "/api/"
        }
      },
      "/adapters/": {
        "target": "http://127.0.0.1:3010",
        "changeOrigin": true,
        "pathRewrite": {
          "^/adapters/": "/adapters/"
        }
      },
      "/storage/uploads/": {
        "target": "http://127.0.0.1:3010",
        "changeOrigin": true
      },
      "/static/": {
        "target": "http://127.0.0.1:3010",
        "changeOrigin": true
      }
    }
  },
  plugins: [pluginReact(), pluginLess(), pluginNodePolyfill()],
  resolve: {
    alias: {
      '@tachybase/app/client': '/Users/seal/Documents/projects/tachybase/apps/app/src/client',
      '@tachybase/app/package.json': '/Users/seal/Documents/projects/tachybase/apps/app/package.json',
      '@tachybase/app': '/Users/seal/Documents/projects/tachybase/apps/app/src',
      '@tachybase/cli/client': '/Users/seal/Documents/projects/tachybase/apps/cli/src/client',
      '@tachybase/cli/package.json': '/Users/seal/Documents/projects/tachybase/apps/cli/package.json',
      '@tachybase/cli': '/Users/seal/Documents/projects/tachybase/apps/cli/src',
      '@tachybase/build/client': '/Users/seal/Documents/projects/tachybase/apps/build/src/client',
      '@tachybase/build/package.json': '/Users/seal/Documents/projects/tachybase/apps/build/package.json',
      '@tachybase/build': '/Users/seal/Documents/projects/tachybase/apps/build/src',
      '@tachybase/app-mako/client': '/Users/seal/Documents/projects/tachybase/apps/app-mako/src/client',
      '@tachybase/app-mako/package.json': '/Users/seal/Documents/projects/tachybase/apps/app-mako/package.json',
      '@tachybase/app-mako': '/Users/seal/Documents/projects/tachybase/apps/app-mako/src',
      'demos-toolbar-1/client': '/Users/seal/Documents/projects/tachybase/apps/demos-toolbar-1/src/client',
      'demos-toolbar-1/package.json': '/Users/seal/Documents/projects/tachybase/apps/demos-toolbar-1/package.json',
      'demos-toolbar-1': '/Users/seal/Documents/projects/tachybase/apps/demos-toolbar-1/src',
      '@tachybase/acl/client': '/Users/seal/Documents/projects/tachybase/packages/acl/src/client',
      '@tachybase/acl/package.json': '/Users/seal/Documents/projects/tachybase/packages/acl/package.json',
      '@tachybase/acl': '/Users/seal/Documents/projects/tachybase/packages/acl/src',
      'app-rs/client': '/Users/seal/Documents/projects/tachybase/apps/app-rs/src/client',
      'app-rs/package.json': '/Users/seal/Documents/projects/tachybase/apps/app-rs/package.json',
      'app-rs': '/Users/seal/Documents/projects/tachybase/apps/app-rs/src',
      '@tachybase/auth/client': '/Users/seal/Documents/projects/tachybase/packages/auth/src/client',
      '@tachybase/auth/package.json': '/Users/seal/Documents/projects/tachybase/packages/auth/package.json',
      '@tachybase/auth': '/Users/seal/Documents/projects/tachybase/packages/auth/src',
      '@tachybase/client/client': '/Users/seal/Documents/projects/tachybase/packages/client/src/client',
      '@tachybase/client/package.json': '/Users/seal/Documents/projects/tachybase/packages/client/package.json',
      '@tachybase/client': '/Users/seal/Documents/projects/tachybase/packages/client/src',
      'create-tachybase-app/client': '/Users/seal/Documents/projects/tachybase/apps/create-tachybase-app/src/client',
      'create-tachybase-app/package.json':
        '/Users/seal/Documents/projects/tachybase/apps/create-tachybase-app/package.json',
      'create-tachybase-app': '/Users/seal/Documents/projects/tachybase/apps/create-tachybase-app/src',
      '@tachybase/actions/client': '/Users/seal/Documents/projects/tachybase/packages/actions/src/client',
      '@tachybase/actions/package.json': '/Users/seal/Documents/projects/tachybase/packages/actions/package.json',
      '@tachybase/actions': '/Users/seal/Documents/projects/tachybase/packages/actions/src',
      '@tachybase/devtools/client': '/Users/seal/Documents/projects/tachybase/packages/devtools/src/client',
      '@tachybase/devtools/package.json': '/Users/seal/Documents/projects/tachybase/packages/devtools/package.json',
      '@tachybase/devtools': '/Users/seal/Documents/projects/tachybase/packages/devtools/src',
      '@tachybase/components/client': '/Users/seal/Documents/projects/tachybase/packages/components/src/client',
      '@tachybase/components/package.json': '/Users/seal/Documents/projects/tachybase/packages/components/package.json',
      '@tachybase/components': '/Users/seal/Documents/projects/tachybase/packages/components/src',
      '@tachybase/evaluators/client': '/Users/seal/Documents/projects/tachybase/packages/evaluators/src/client',
      '@tachybase/evaluators/package.json': '/Users/seal/Documents/projects/tachybase/packages/evaluators/package.json',
      '@tachybase/evaluators': '/Users/seal/Documents/projects/tachybase/packages/evaluators/src',
      '@tachybase/cache/client': '/Users/seal/Documents/projects/tachybase/packages/cache/src/client',
      '@tachybase/cache/package.json': '/Users/seal/Documents/projects/tachybase/packages/cache/package.json',
      '@tachybase/cache': '/Users/seal/Documents/projects/tachybase/packages/cache/src',
      '@tachybase/data-source/client': '/Users/seal/Documents/projects/tachybase/packages/data-source/src/client',
      '@tachybase/data-source/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/data-source/package.json',
      '@tachybase/data-source': '/Users/seal/Documents/projects/tachybase/packages/data-source/src',
      '@tachybase/module-acl/client': '/Users/seal/Documents/projects/tachybase/packages/module-acl/src/client',
      '@tachybase/module-acl/package.json': '/Users/seal/Documents/projects/tachybase/packages/module-acl/package.json',
      '@tachybase/module-acl': '/Users/seal/Documents/projects/tachybase/packages/module-acl/src',
      '@tachybase/module-app-info/client':
        '/Users/seal/Documents/projects/tachybase/packages/module-app-info/src/client',
      '@tachybase/module-app-info/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/module-app-info/package.json',
      '@tachybase/module-app-info': '/Users/seal/Documents/projects/tachybase/packages/module-app-info/src',
      '@tachybase/database/client': '/Users/seal/Documents/projects/tachybase/packages/database/src/client',
      '@tachybase/database/package.json': '/Users/seal/Documents/projects/tachybase/packages/database/package.json',
      '@tachybase/database': '/Users/seal/Documents/projects/tachybase/packages/database/src',
      '@tachybase/module-backup/client': '/Users/seal/Documents/projects/tachybase/packages/module-backup/src/client',
      '@tachybase/module-backup/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/module-backup/package.json',
      '@tachybase/module-backup': '/Users/seal/Documents/projects/tachybase/packages/module-backup/src',
      '@tachybase/module-auth/client': '/Users/seal/Documents/projects/tachybase/packages/module-auth/src/client',
      '@tachybase/module-auth/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/module-auth/package.json',
      '@tachybase/module-auth': '/Users/seal/Documents/projects/tachybase/packages/module-auth/src',
      '@tachybase/module-collection/client':
        '/Users/seal/Documents/projects/tachybase/packages/module-collection/src/client',
      '@tachybase/module-collection/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/module-collection/package.json',
      '@tachybase/module-collection': '/Users/seal/Documents/projects/tachybase/packages/module-collection/src',
      '@tachybase/logger/client': '/Users/seal/Documents/projects/tachybase/packages/logger/src/client',
      '@tachybase/logger/package.json': '/Users/seal/Documents/projects/tachybase/packages/logger/package.json',
      '@tachybase/logger': '/Users/seal/Documents/projects/tachybase/packages/logger/src',
      '@tachybase/module-cron/client': '/Users/seal/Documents/projects/tachybase/packages/module-cron/src/client',
      '@tachybase/module-cron/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/module-cron/package.json',
      '@tachybase/module-cron': '/Users/seal/Documents/projects/tachybase/packages/module-cron/src',
      '@tachybase/module-data-source/client':
        '/Users/seal/Documents/projects/tachybase/packages/module-data-source/src/client',
      '@tachybase/module-data-source/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/module-data-source/package.json',
      '@tachybase/module-data-source': '/Users/seal/Documents/projects/tachybase/packages/module-data-source/src',
      '@tachybase/module-cloud-component/client':
        '/Users/seal/Documents/projects/tachybase/packages/module-cloud-component/src/client',
      '@tachybase/module-cloud-component/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/module-cloud-component/package.json',
      '@tachybase/module-cloud-component':
        '/Users/seal/Documents/projects/tachybase/packages/module-cloud-component/src',
      '@tachybase/module-event-source/client':
        '/Users/seal/Documents/projects/tachybase/packages/module-event-source/src/client',
      '@tachybase/module-event-source/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/module-event-source/package.json',
      '@tachybase/module-event-source': '/Users/seal/Documents/projects/tachybase/packages/module-event-source/src',
      '@hera/plugin-core/client': '/Users/seal/Documents/projects/tachybase/packages/module-hera/src/client',
      '@hera/plugin-core/package.json': '/Users/seal/Documents/projects/tachybase/packages/module-hera/package.json',
      '@hera/plugin-core': '/Users/seal/Documents/projects/tachybase/packages/module-hera/src',
      '@tachybase/module-error-handler/client':
        '/Users/seal/Documents/projects/tachybase/packages/module-error-handler/src/client',
      '@tachybase/module-error-handler/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/module-error-handler/package.json',
      '@tachybase/module-error-handler': '/Users/seal/Documents/projects/tachybase/packages/module-error-handler/src',
      '@tachybase/module-multi-app/client':
        '/Users/seal/Documents/projects/tachybase/packages/module-multi-app/src/client',
      '@tachybase/module-multi-app/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/module-multi-app/package.json',
      '@tachybase/module-multi-app': '/Users/seal/Documents/projects/tachybase/packages/module-multi-app/src',
      '@tachybase/module-message/client': '/Users/seal/Documents/projects/tachybase/packages/module-message/src/client',
      '@tachybase/module-message/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/module-message/package.json',
      '@tachybase/module-message': '/Users/seal/Documents/projects/tachybase/packages/module-message/src',
      '@tachybase/module-ui-schema/client':
        '/Users/seal/Documents/projects/tachybase/packages/module-ui-schema/src/client',
      '@tachybase/module-ui-schema/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/module-ui-schema/package.json',
      '@tachybase/module-ui-schema': '/Users/seal/Documents/projects/tachybase/packages/module-ui-schema/src',
      '@tachybase/module-web/client': '/Users/seal/Documents/projects/tachybase/packages/module-web/src/client',
      '@tachybase/module-web/package.json': '/Users/seal/Documents/projects/tachybase/packages/module-web/package.json',
      '@tachybase/module-web': '/Users/seal/Documents/projects/tachybase/packages/module-web/src',
      '@tachybase/module-user/client': '/Users/seal/Documents/projects/tachybase/packages/module-user/src/client',
      '@tachybase/module-user/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/module-user/package.json',
      '@tachybase/module-user': '/Users/seal/Documents/projects/tachybase/packages/module-user/src',
      '@tachybase/module-worker-thread/client':
        '/Users/seal/Documents/projects/tachybase/packages/module-worker-thread/src/client',
      '@tachybase/module-worker-thread/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/module-worker-thread/package.json',
      '@tachybase/module-worker-thread': '/Users/seal/Documents/projects/tachybase/packages/module-worker-thread/src',
      '@tachybase/module-pdf/client': '/Users/seal/Documents/projects/tachybase/packages/module-pdf/src/client',
      '@tachybase/module-pdf/package.json': '/Users/seal/Documents/projects/tachybase/packages/module-pdf/package.json',
      '@tachybase/module-pdf': '/Users/seal/Documents/projects/tachybase/packages/module-pdf/src',
      '@tachybase/module-workflow/client':
        '/Users/seal/Documents/projects/tachybase/packages/module-workflow/src/client',
      '@tachybase/module-workflow/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/module-workflow/package.json',
      '@tachybase/module-workflow': '/Users/seal/Documents/projects/tachybase/packages/module-workflow/src',
      '@tachybase/plugin-action-bulk-edit/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-bulk-edit/src/client',
      '@tachybase/plugin-action-bulk-edit/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-bulk-edit/package.json',
      '@tachybase/plugin-action-bulk-edit':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-bulk-edit/src',
      '@tachybase/plugin-action-custom-request/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-custom-request/src/client',
      '@tachybase/plugin-action-custom-request/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-custom-request/package.json',
      '@tachybase/plugin-action-custom-request':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-custom-request/src',
      '@tachybase/plugin-action-duplicate/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-duplicate/src/client',
      '@tachybase/plugin-action-duplicate/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-duplicate/package.json',
      '@tachybase/plugin-action-duplicate':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-duplicate/src',
      '@tachybase/plugin-action-bulk-update/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-bulk-update/src/client',
      '@tachybase/plugin-action-bulk-update/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-bulk-update/package.json',
      '@tachybase/plugin-action-bulk-update':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-bulk-update/src',
      '@tachybase/plugin-action-print/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-print/src/client',
      '@tachybase/plugin-action-print/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-print/package.json',
      '@tachybase/plugin-action-print': '/Users/seal/Documents/projects/tachybase/packages/plugin-action-print/src',
      '@tachybase/plugin-action-import/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-import/src/client',
      '@tachybase/plugin-action-import/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-import/package.json',
      '@tachybase/plugin-action-import': '/Users/seal/Documents/projects/tachybase/packages/plugin-action-import/src',
      '@tachybase/plugin-action-share/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-share/src/client',
      '@tachybase/plugin-action-share/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-share/package.json',
      '@tachybase/plugin-action-share': '/Users/seal/Documents/projects/tachybase/packages/plugin-action-share/src',
      '@tachybase/plugin-action-export/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-export/src/client',
      '@tachybase/plugin-action-export/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-action-export/package.json',
      '@tachybase/plugin-action-export': '/Users/seal/Documents/projects/tachybase/packages/plugin-action-export/src',
      '@tachybase/plugin-adapter-bullmq/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-adapter-bullmq/src/client',
      '@tachybase/plugin-adapter-bullmq/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-adapter-bullmq/package.json',
      '@tachybase/plugin-adapter-bullmq': '/Users/seal/Documents/projects/tachybase/packages/plugin-adapter-bullmq/src',
      '@tachybase/plugin-adapter-red-node/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-adapter-red-node/src/client',
      '@tachybase/plugin-adapter-red-node/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-adapter-red-node/package.json',
      '@tachybase/plugin-adapter-red-node':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-adapter-red-node/src',
      '@tachybase/plugin-adapter-remix/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-adapter-remix/src/client',
      '@tachybase/plugin-adapter-remix/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-adapter-remix/package.json',
      '@tachybase/plugin-adapter-remix': '/Users/seal/Documents/projects/tachybase/packages/plugin-adapter-remix/src',
      '@tachybase/plugin-audit-logs/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-audit-logs/src/client',
      '@tachybase/plugin-audit-logs/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-audit-logs/package.json',
      '@tachybase/plugin-audit-logs': '/Users/seal/Documents/projects/tachybase/packages/plugin-audit-logs/src',
      '@tachybase/plugin-auth-cas/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-cas/src/client',
      '@tachybase/plugin-auth-cas/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-cas/package.json',
      '@tachybase/plugin-auth-cas': '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-cas/src',
      '@tachybase/plugin-auth-dingtalk/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-dingtalk/src/client',
      '@tachybase/plugin-auth-dingtalk/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-dingtalk/package.json',
      '@tachybase/plugin-auth-dingtalk': '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-dingtalk/src',
      '@tachybase/plugin-auth-oidc/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-oidc/src/client',
      '@tachybase/plugin-auth-oidc/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-oidc/package.json',
      '@tachybase/plugin-auth-oidc': '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-oidc/src',
      '@tachybase/plugin-auth-pages/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-pages/src/client',
      '@tachybase/plugin-auth-pages/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-pages/package.json',
      '@tachybase/plugin-auth-pages': '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-pages/src',
      '@tachybase/plugin-api-keys/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-api-keys/src/client',
      '@tachybase/plugin-api-keys/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-api-keys/package.json',
      '@tachybase/plugin-api-keys': '/Users/seal/Documents/projects/tachybase/packages/plugin-api-keys/src',
      '@tachybase/plugin-auth-lark/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-prototype-lark/src/client',
      '@tachybase/plugin-auth-lark/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-prototype-lark/package.json',
      '@tachybase/plugin-auth-lark': '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-prototype-lark/src',
      '@tachybase/plugin-auth-saml/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-saml/src/client',
      '@tachybase/plugin-auth-saml/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-saml/package.json',
      '@tachybase/plugin-auth-saml': '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-saml/src',
      '@tachybase/plugin-auth-sms/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-sms/src/client',
      '@tachybase/plugin-auth-sms/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-sms/package.json',
      '@tachybase/plugin-auth-sms': '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-sms/src',
      '@tachybase/plugin-auth-wecom/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-wecom/src/client',
      '@tachybase/plugin-auth-wecom/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-wecom/package.json',
      '@tachybase/plugin-auth-wecom': '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-wecom/src',
      '@tachybase/plugin-block-charts/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-block-charts/src/client',
      '@tachybase/plugin-block-charts/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-block-charts/package.json',
      '@tachybase/plugin-block-charts': '/Users/seal/Documents/projects/tachybase/packages/plugin-block-charts/src',
      '@tachybase/plugin-block-calendar/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-block-calendar/src/client',
      '@tachybase/plugin-block-calendar/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-block-calendar/package.json',
      '@tachybase/plugin-block-calendar': '/Users/seal/Documents/projects/tachybase/packages/plugin-block-calendar/src',
      '@tachybase/plugin-block-gantt/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-block-gantt/src/client',
      '@tachybase/plugin-block-gantt/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-block-gantt/package.json',
      '@tachybase/plugin-block-gantt': '/Users/seal/Documents/projects/tachybase/packages/plugin-block-gantt/src',
      '@tachybase/plugin-block-comments/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-block-comments/src/client',
      '@tachybase/plugin-block-comments/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-block-comments/package.json',
      '@tachybase/plugin-block-comments': '/Users/seal/Documents/projects/tachybase/packages/plugin-block-comments/src',
      '@tachybase/plugin-block-map/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-block-map/src/client',
      '@tachybase/plugin-block-map/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-block-map/package.json',
      '@tachybase/plugin-block-map': '/Users/seal/Documents/projects/tachybase/packages/plugin-block-map/src',
      '@tachybase/plugin-block-kanban/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-block-kanban/src/client',
      '@tachybase/plugin-block-kanban/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-block-kanban/package.json',
      '@tachybase/plugin-block-kanban': '/Users/seal/Documents/projects/tachybase/packages/plugin-block-kanban/src',
      '@tachybase/plugin-devtools/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-devtools/src/client',
      '@tachybase/plugin-devtools/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-devtools/package.json',
      '@tachybase/plugin-devtools': '/Users/seal/Documents/projects/tachybase/packages/plugin-devtools/src',
      '@tachybase/plugin-data-source-common/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-data-source-common/src/client',
      '@tachybase/plugin-data-source-common/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-data-source-common/package.json',
      '@tachybase/plugin-data-source-common':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-data-source-common/src',
      '@tachybase/plugin-block-presentation/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-block-presentation/src/client',
      '@tachybase/plugin-block-presentation/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-block-presentation/package.json',
      '@tachybase/plugin-block-presentation':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-block-presentation/src',
      '@tachybase/plugin-auth-wechat/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-wechat/src/client',
      '@tachybase/plugin-auth-wechat/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-wechat/package.json',
      '@tachybase/plugin-auth-wechat': '/Users/seal/Documents/projects/tachybase/packages/plugin-auth-wechat/src',
      '@tachybase/plugin-field-china-region/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-china-region/src/client',
      '@tachybase/plugin-field-china-region/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-china-region/package.json',
      '@tachybase/plugin-field-china-region':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-china-region/src',
      '@tachybase/plugin-field-encryption/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-encryption/src/client',
      '@tachybase/plugin-field-encryption/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-encryption/package.json',
      '@tachybase/plugin-field-encryption':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-encryption/src',
      '@tachybase/plugin-file-manager/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-file-manager/src/client',
      '@tachybase/plugin-file-manager/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-file-manager/package.json',
      '@tachybase/plugin-file-manager':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-file-manager/src',
      '@tachybase/plugin-field-formula/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-formula/src/client',
      '@tachybase/plugin-field-formula/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-formula/package.json',
      '@tachybase/plugin-field-formula': '/Users/seal/Documents/projects/tachybase/packages/plugin-field-formula/src',
      '@tachybase/plugin-field-sequence/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-sequence/src/client',
      '@tachybase/plugin-field-sequence/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-sequence/package.json',
      '@tachybase/plugin-field-sequence': '/Users/seal/Documents/projects/tachybase/packages/plugin-field-sequence/src',
      '@tachybase/plugin-field-markdown-vditor/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-markdown-vditor/src/client',
      '@tachybase/plugin-field-markdown-vditor/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-markdown-vditor/package.json',
      '@tachybase/plugin-field-markdown-vditor':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-markdown-vditor/src',
      '@tachybase/plugin-field-snapshot/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-snapshot/src/client',
      '@tachybase/plugin-field-snapshot/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-field-snapshot/package.json',
      '@tachybase/plugin-field-snapshot': '/Users/seal/Documents/projects/tachybase/packages/plugin-field-snapshot/src',
      '@tachybase/plugin-mock-collections/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-mock-collections/src/client',
      '@tachybase/plugin-mock-collections/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-mock-collections/package.json',
      '@tachybase/plugin-mock-collections':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-mock-collections/src',
      '@tachybase/plugin-i18n-editor/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-i18n-editor/src/client',
      '@tachybase/plugin-i18n-editor/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-i18n-editor/package.json',
      '@tachybase/plugin-i18n-editor': '/Users/seal/Documents/projects/tachybase/packages/plugin-i18n-editor/src',
      '@tachybase/plugin-multi-app-share-collection/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-multi-app-share-collection/src/client',
      '@tachybase/plugin-multi-app-share-collection/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-multi-app-share-collection/package.json',
      '@tachybase/plugin-multi-app-share-collection':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-multi-app-share-collection/src',
      '@tachybase/plugin-log-viewer/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-log-viewer/src/client',
      '@tachybase/plugin-log-viewer/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-log-viewer/package.json',
      '@tachybase/plugin-log-viewer': '/Users/seal/Documents/projects/tachybase/packages/plugin-log-viewer/src',
      '@tachybase/plugin-online-user/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-prototype-online-user/src/client',
      '@tachybase/plugin-online-user/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-prototype-online-user/package.json',
      '@tachybase/plugin-online-user':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-prototype-online-user/src',
      '@tachybase/plugin-demos-game-runesweeper/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-prototype-game-runesweeper/src/client',
      '@tachybase/plugin-demos-game-runesweeper/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-prototype-game-runesweeper/package.json',
      '@tachybase/plugin-demos-game-runesweeper':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-prototype-game-runesweeper/src',
      '@tachybase/plugin-print-template/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-prototype-print-template/src/client',
      '@tachybase/plugin-print-template/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-prototype-print-template/package.json',
      '@tachybase/plugin-print-template':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-prototype-print-template/src',
      '@tachybase/plugin-simple-cms/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-prototype-simple-cms/src/client',
      '@tachybase/plugin-simple-cms/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-prototype-simple-cms/package.json',
      '@tachybase/plugin-simple-cms':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-prototype-simple-cms/src',
      '@tachybase/plugin-wechat-official-account/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-prototype-wechat-official-account/src/client',
      '@tachybase/plugin-wechat-official-account/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-prototype-wechat-official-account/package.json',
      '@tachybase/plugin-wechat-official-account':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-prototype-wechat-official-account/src',
      '@tachybase/plugin-sub-accounts/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-sub-accounts/src/client',
      '@tachybase/plugin-sub-accounts/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-sub-accounts/package.json',
      '@tachybase/plugin-sub-accounts': '/Users/seal/Documents/projects/tachybase/packages/plugin-sub-accounts/src',
      '@tachybase/plugin-theme-editor/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-theme-editor/src/client',
      '@tachybase/plugin-theme-editor/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-theme-editor/package.json',
      '@tachybase/plugin-theme-editor': '/Users/seal/Documents/projects/tachybase/packages/plugin-theme-editor/src',
      '@tachybase/plugin-workflow-approval/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-workflow-approval/src/client',
      '@tachybase/plugin-workflow-approval/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-workflow-approval/package.json',
      '@tachybase/plugin-workflow-approval':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-workflow-approval/src',
      '@tachybase/plugin-otp/client': '/Users/seal/Documents/projects/tachybase/packages/plugin-otp/src/client',
      '@tachybase/plugin-otp/package.json': '/Users/seal/Documents/projects/tachybase/packages/plugin-otp/package.json',
      '@tachybase/plugin-otp': '/Users/seal/Documents/projects/tachybase/packages/plugin-otp/src',
      '@tachybase/schema/client': '/Users/seal/Documents/projects/tachybase/packages/schema/src/client',
      '@tachybase/schema/package.json': '/Users/seal/Documents/projects/tachybase/packages/schema/package.json',
      '@tachybase/schema': '/Users/seal/Documents/projects/tachybase/packages/schema/src',
      '@tachybase/plugin-workflow-test/client':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-workflow-test/src/client',
      '@tachybase/plugin-workflow-test/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-workflow-test/package.json',
      '@tachybase/plugin-workflow-test': '/Users/seal/Documents/projects/tachybase/packages/plugin-workflow-test/src',
      '@tachybase/plugin-workflow-test/e2e':
        '/Users/seal/Documents/projects/tachybase/packages/plugin-workflow-test/src/e2e',
      '@tachybase/preset-tachybase/client':
        '/Users/seal/Documents/projects/tachybase/packages/preset-tachybase/src/client',
      '@tachybase/preset-tachybase/package.json':
        '/Users/seal/Documents/projects/tachybase/packages/preset-tachybase/package.json',
      '@tachybase/preset-tachybase': '/Users/seal/Documents/projects/tachybase/packages/preset-tachybase/src',
      '@tachybase/requirejs/client': '/Users/seal/Documents/projects/tachybase/packages/requirejs/src/client',
      '@tachybase/requirejs/package.json': '/Users/seal/Documents/projects/tachybase/packages/requirejs/package.json',
      '@tachybase/requirejs': '/Users/seal/Documents/projects/tachybase/packages/requirejs/src',
      '@tachybase/sdk/client': '/Users/seal/Documents/projects/tachybase/packages/sdk/src/client',
      '@tachybase/sdk/package.json': '/Users/seal/Documents/projects/tachybase/packages/sdk/package.json',
      '@tachybase/sdk': '/Users/seal/Documents/projects/tachybase/packages/sdk/src',
      '@tachybase/resourcer/client': '/Users/seal/Documents/projects/tachybase/packages/resourcer/src/client',
      '@tachybase/resourcer/package.json': '/Users/seal/Documents/projects/tachybase/packages/resourcer/package.json',
      '@tachybase/resourcer': '/Users/seal/Documents/projects/tachybase/packages/resourcer/src',
      '@tachybase/server/client': '/Users/seal/Documents/projects/tachybase/packages/server/src/client',
      '@tachybase/server/package.json': '/Users/seal/Documents/projects/tachybase/packages/server/package.json',
      '@tachybase/server': '/Users/seal/Documents/projects/tachybase/packages/server/src',
      '@tachybase/telemetry/client': '/Users/seal/Documents/projects/tachybase/packages/telemetry/src/client',
      '@tachybase/telemetry/package.json': '/Users/seal/Documents/projects/tachybase/packages/telemetry/package.json',
      '@tachybase/telemetry': '/Users/seal/Documents/projects/tachybase/packages/telemetry/src',
      '@tachybase/utils/client': '/Users/seal/Documents/projects/tachybase/packages/utils/src/client',
      '@tachybase/utils/package.json': '/Users/seal/Documents/projects/tachybase/packages/utils/package.json',
      '@tachybase/utils': '/Users/seal/Documents/projects/tachybase/packages/utils/src',
      '@tachybase/test/client': '/Users/seal/Documents/projects/tachybase/packages/test/src/client',
      '@tachybase/test/package.json': '/Users/seal/Documents/projects/tachybase/packages/test/package.json',
      '@tachybase/test': '/Users/seal/Documents/projects/tachybase/packages/test/src',
      '@tachybase/test/server': '/Users/seal/Documents/projects/tachybase/packages/test/src/server',
      '@tachybase/test/e2e': '/Users/seal/Documents/projects/tachybase/packages/test/src/e2e',
    },
  },
});
