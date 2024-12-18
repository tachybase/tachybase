import { MagicAttributeModel } from '@tachybase/database';
import { Plugin } from '@tachybase/server';
import { uid } from '@tachybase/utils';

import { uiSchemaActions } from './actions/ui-schema-action';
import { UiSchemaModel } from './model';
import UiSchemaRepository from './repository';
import { ServerHooks } from './server-hooks';
import { ServerHookModel } from './server-hooks/model';

export class ModuleUiSchema extends Plugin {
  serverHooks: ServerHooks;

  registerRepository() {
    this.app.db.registerRepositories({
      UiSchemaRepository,
    });
  }

  async beforeLoad() {
    const db = this.app.db;

    this.serverHooks = new ServerHooks(db);

    this.app.db.registerModels({ MagicAttributeModel, UiSchemaModel, ServerHookModel });

    this.registerRepository();

    this.app.acl.registerSnippet({
      name: `pm.${this.name}.block-templates`,
      actions: ['uiSchemaTemplates:*'],
    });

    this.app.acl.registerSnippet({
      name: 'ui.uiSchemas',
      actions: [
        'uiSchemas:insert',
        'uiSchemas:insertNewSchema',
        'uiSchemas:remove',
        'uiSchemas:patch',
        'uiSchemas:batchPatch',
        'uiSchemas:clearAncestor',
        'uiSchemas:insertBeforeBegin',
        'uiSchemas:insertAfterBegin',
        'uiSchemas:insertBeforeEnd',
        'uiSchemas:insertAfterEnd',
        'uiSchemas:insertAdjacent',
        'uiSchemas:saveAsTemplate',
      ],
    });

    db.on('uiSchemas.beforeCreate', function setUid(model) {
      if (!model.get('name')) {
        model.set('name', uid());
      }
    });

    db.on('uiSchemas.afterCreate', async function insertSchema(model, options) {
      const { transaction } = options;
      const uiSchemaRepository = db.getCollection('uiSchemas').repository as UiSchemaRepository;

      const context = options.context;

      if (context?.disableInsertHook) {
        return;
      }

      await uiSchemaRepository.insert(model.toJSON(), {
        transaction,
      });
    });

    db.on('uiSchemas.afterUpdate', async function patchSchema(model, options) {
      const { transaction } = options;
      const uiSchemaRepository = db.getCollection('uiSchemas').repository as UiSchemaRepository;

      await uiSchemaRepository.patch(model.toJSON(), {
        transaction,
      });
    });

    this.app.resourcer.define({
      name: 'uiSchemas',
      actions: uiSchemaActions,
    });

    this.app.acl.allow('uiSchemas', ['getProperties', 'getJsonSchema'], 'loggedIn');
    this.app.acl.allow('uiSchemaTemplates', ['get', 'list'], 'public');
  }
}

export default ModuleUiSchema;
