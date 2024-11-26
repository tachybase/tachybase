import { Context, Next, utils } from '@tachybase/actions';
import { Action, Controller } from '@tachybase/utils';

import { QueryTypes } from 'sequelize';

@Controller('customEventSources')
export class CustomEventSourceController {
  @Action('sync')
  async sync(context: Context, next: Next) {
    const transaction = await context.db.sequelize.transaction();

    // 查询当前的 uiSchema 筛选出触发 workflow 的那些
    const query = `
    SELECT * FROM public."uiSchemas"
    WHERE schema::jsonb -> 'x-action-settings' IS NOT NULL
    AND jsonb_array_length((schema::jsonb -> 'x-action-settings' -> 'triggerWorkflows')::jsonb) > 0;
  `;
    const uiSchemaList = await context.db.sequelize.query(query, {
      transaction,
      type: QueryTypes.SELECT,
    });

    for (const currentUiSchema of uiSchemaList) {
      // [key, schema.title][]
      let currentSchemaList: [string, string][] = [];
      const { 'x-uid': xuid, schema } = currentUiSchema as any;
      const schemaTitle = schema['title'];
      const triggerWorkflows = schema['x-action-settings']['triggerWorkflows'];
      currentSchemaList.push([xuid, schemaTitle]);

      // 然后递归查找父级, 直到寻找到符合条件的 uiSchema 记录,
      // 符合条件为,具有如下特征的: "x-component": "CardItem", "x-decorator-props".collection: "records"
      // records 为数据表
      const completeUiSchemaRecord = await this.searchParent(context, currentUiSchema, currentSchemaList, transaction);
      // 查找对应触发的 workflow 的记录
      for (const triggerWorkflow of triggerWorkflows) {
        const { workflowKey } = triggerWorkflow;
        // 查询 workflow 对应的 action
        const RepoWorkflow = context.db.getRepository('workflows');
        const targetWorkflow = await RepoWorkflow.findOne({
          filter: {
            key: workflowKey,
          },
          transaction,
        });
        if (targetWorkflow && completeUiSchemaRecord) {
          // 整理查询结果, 将查询出的结果存储在 workflows-manager 数据表中
          const { 'x-uid': completeUiSchemaId, schema } = completeUiSchemaRecord as any;
          const collectionName = schema?.['x-decorator-props']?.['collection'];
          const pathDesc = currentSchemaList
            .map(([key, title]) => `${title}(${key})`)
            .reverse()
            .join('->');

          const RepoWorkflowsManager = utils.getRepositoryFromParams(context);
          const workflowsManagerRecord = await RepoWorkflowsManager.findOne({
            filter: {
              pathDesc,
            },
            transaction,
          });

          if (workflowsManagerRecord) {
            const { id } = workflowsManagerRecord;
            await RepoWorkflowsManager.update({
              values: {
                collectionName,
                pathDesc,
                workflowId: targetWorkflow.id,
                uiSchemaId: xuid,
                completeUiSchemaId,
              },
              filter: {
                id,
              },
              transaction,
            });
          } else {
            await RepoWorkflowsManager.create({
              values: {
                collectionName,
                pathDesc,
                workflowId: targetWorkflow.id,
                uiSchemaId: xuid,
                completeUiSchemaId,
              },
              // transaction,
            });
          }
        }
      }
    }

    await next();
  }

  async searchParent(context: Context, currentUiSchema: any, currentSchemaList: [string, string][], transaction) {
    const { 'x-uid': childKey } = currentUiSchema as any;
    const RepoParent = context.db.getRepository('uiSchemaTreePath');
    const parentUiSchemaList = await RepoParent.find({
      filter: {
        descendant: childKey,
      },
      transaction,
    });

    for (const parentUiSchema of parentUiSchemaList) {
      const { ancestor } = parentUiSchema as any;
      if (ancestor === childKey) {
        continue;
      }

      const RepoUiSchema = context.db.getRepository('uiSchemas');
      const parentUiSchemaRecord = await RepoUiSchema.findOne({
        filter: {
          'x-uid': ancestor,
        },
        transaction,
      });
      if (parentUiSchemaRecord) {
        const { 'x-uid': parentKey, schema: parentSchema } = parentUiSchemaRecord as any;

        const {
          title: parentSchemaTitle,
          'x-component': component,
          'x-decorator-props': decoratorProps,
        } = parentSchema as any;

        currentSchemaList.push([parentKey, parentSchemaTitle || component]);

        if (component === 'CardItem' && !!decoratorProps?.['collection']) {
          return parentUiSchemaRecord;
        } else {
          continue;
        }
      } else {
        continue;
      }
    }

    return;
  }
}
