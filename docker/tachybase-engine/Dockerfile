FROM tachybase/tachybase-node-pg:0.0.2 AS base

ARG NPM_REGISTRY=https://registry.npmjs.org
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_NPM_REGISTRY=$NPM_REGISTRY
RUN npm install -g corepack@latest
RUN corepack enable

WORKDIR /app

ENV NODE_MODULES_PATH=/app/plugins/node_modules
RUN npm i -g @tachybase/cli && npm i -g @tachybase/engine
RUN tachybase init /app --plugins action-bulk-edit,action-bulk-update,action-custom-request,action-duplicate,action-export,action-import,action-print,block-calendar,block-charts,block-gantt,block-kanban,block-presentation,field-china-region,field-formula,field-sequence,field-encryption,log-viewer,otp,full-text-search,password-policy,auth-pages,manual-notification,adapter-bullmq,adapter-red-node,adapter-remix,api-keys,audit-logs,auth-cas,auth-dingtalk,auth-lark,auth-oidc,auth-saml,auth-sms,auth-wechat,auth-wecom,block-comments,block-map,block-step-form,data-source-common,demos-game-runesweeper,devtools,field-markdown-vditor,field-snapshot,i18n-editor,multi-app-share-collection,online-user,simple-cms,sub-accounts,theme-editor,workflow-approval,ai-chat,department,workflow-analysis,api-logs,ocr-convert

COPY ./docker/tachybase-engine/docker-entrypoint.sh /app/
CMD ["/app/docker-entrypoint.sh"]
