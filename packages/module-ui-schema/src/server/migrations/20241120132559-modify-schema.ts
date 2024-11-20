import { Migration } from '@tachybase/server';

import { QueryTypes } from 'sequelize';

const initializerRule = {
  BlockInitializers: 'page:addBlock',
  MBlockInitializers: 'mobilePage:addBlock',
  CreateFormBlockInitializers: 'popup:addNew:addBlock',
  CusomeizeCreateFormBlockInitializers: 'popup:addRecord:addBlock',
  RecordBlockInitializers: 'popup:common:addBlock',
  BulkEditBlockInitializers: 'popup:bulkEdit:addBlock',
  TableColumnInitializers: 'table:configureColumns',
  TableActionColumnInitializers: 'table:configureItemActions',
  TableActionInitializers: 'table:configureActions',
  SubTableActionInitializers: 'subTable:configureActions',
  FormItemInitializers: 'form:configureFields',
  CreateFormActionInitializers: 'createForm:configureActions',
  UpdateFormActionInitializers: 'editForm:configureActions',
  ReadPrettyFormItemInitializers: 'details:configureFields',
  DetailsActionInitializers: 'detailsWithPaging:configureActions',
  ReadPrettyFormActionInitializers: 'details:configureActions',
  KanbanCardInitializers: 'kanban:configureItemFields',
  KanbanActionInitializers: 'kanban:configureActions',
  GridCardActionInitializers: 'gridCard:configureActions',
  GridCardItemActionInitializers: 'gridCard:configureItemActions',
  ListActionInitializers: 'list:configureActions',
  ListItemActionInitializers: 'list:configureItemActions',
  CalendarActionInitializers: 'calendar:configureActions',
  GanttActionInitializers: 'gantt:configureActions',
  MapActionInitializers: 'map:configureActions',
  TableSelectorInitializers: 'popup:tableSelector:addBlock',
  ChartInitializers: 'charts:addBlock',
  ChartFilterItemInitializers: 'chartFilterForm:configureFields',
  ChartFilterActionInitializers: 'chartFilterForm:configureActions',
  AssociationFilterInitializers: 'filterCollapse:configureFields',
  FilterFormItemInitializers: 'filterForm:configureFields',
  FilterFormActionInitializers: 'filterForm:configureActions',
  CustomFormItemInitializers: 'assignFieldValuesForm:configureFields',
  BulkEditFormItemInitializers: 'bulkEditForm:configureFields',
  BulkEditFormActionInitializers: 'bulkEditForm:configureActions',
  AuditLogsTableColumnInitializers: 'auditLogsTable:configureColumns',
  AuditLogsTableActionColumnInitializers: 'auditLogsTable:configureItemActions',
  AuditLogsTableActionInitializers: 'auditLogsTable:configureActions',
  SnapshotBlockInitializers: 'popup:snapshot:addBlock',
  AddBlockButton: 'workflowManual:popup:configureUserInterface:addBlock',
  AddCustomFormField: 'workflowManual:customForm:configureFields',
  AddActionButton: 'workflowManual:form:configureActions',
};

const settingsRule = {
  GanttBlockSettings: 'blockSettings:gantt',
  'ActionSettings:customize:bulkEdit': 'actionSettings:bulkEdit',
};

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.40';

  async up() {
    const sequelize = this.app.db.sequelize;
    // sequelize修改uiSchemas表中schemas
    // json 属性
    // x-initializer按照initializerRule遇到值是initializerRule的key改成value
    // x-settings按照settingsRule 遇到值是settingsRule的key改成value
    const result: any = await sequelize.query(`
      SELECT "x-uid", "schema" FROM public."uiSchemas"
    `);
    const uiSchemas = result[0];
    let count = 0;
    for (const uiSchema of uiSchemas) {
      const schema = uiSchema.schema;
      if (!schema) {
        continue;
      }
      let changed = false;
      if (schema['x-initializer'] && initializerRule[schema['x-initializer']]) {
        schema['x-initializer'] = initializerRule[schema['x-initializer']];
        changed = true;
      }
      if (schema['x-settings'] && settingsRule[schema['x-settings']]) {
        schema['x-settings'] = settingsRule[schema['x-settings']];
        changed = true;
      }
      if (!changed) {
        continue;
      }
      const result = await sequelize.query(
        `
          UPDATE public."uiSchemas"
          SET schema = :schema::jsonb
          WHERE "x-uid" = :id
        `,
        {
          type: QueryTypes.UPDATE,
          replacements: {
            schema: JSON.stringify(schema),
            id: uiSchema['x-uid'],
          },
        },
      );
      count += result[1];
    }
    console.log(`[uiSchemas]共更新数据：${count}条`);
  }
}
