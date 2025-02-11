import { init } from 'packages/plugin-workflow-approval/src/server/actions';

import { EventSourceTrigger } from '.';
import { lang, NAMESPACE, tval } from '../locale';

export class DatabaseEventTrigger extends EventSourceTrigger {
  title = tval('Database event');
  description = tval('Add specific hook events after creating, modifying, and deleting data tables');
  options = {
    collection: {
      type: 'string',
      title: '{{t("Collection")}}',
      'x-decorator': 'FormItem',
      'x-component': 'DataSourceCollectionCascader',
      'x-decorator-props': {
        tooltip: tval('Auxiliary selection, you can also customize the event name'),
      },
    },
    collectionEvent: {
      title: tval('Collection event'),
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { label: tval('Before Save (Create/Update)'), value: 'beforeSave' },
        { label: tval('Before Create'), value: 'beforeCreate' },
        { label: tval('Before Update'), value: 'beforeUpdate' },
        { label: tval('Before Delete'), value: 'beforeDestroy' },
        { label: tval('After Save (Create/Update)'), value: 'afterSave' },
        { label: tval('After Create'), value: 'afterCreate' },
        { label: tval('After Update'), value: 'afterUpdate' },
        { label: tval('After Delete'), value: 'afterDestroy' },
        { label: tval('After Save with Associations'), value: 'afterSaveWithAssociations' },
        { label: tval('After Create with Associations'), value: 'afterCreateWithAssociations' },
        { label: tval('After Update with Associations'), value: 'afterUpdateWithAssociations' },
      ],
      'x-decorator-props': {
        tooltip: tval('Auxiliary selection, you can also customize the event name'),
      },
    },
    eventName: {
      title: tval('Event name'),
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-reactions': [
        '{{(field) => { const collection = field.query("options.collection").get("value"); const event = field.query("options.collectionEvent").get("value"); field.value = `${collection || ""}.${event || ""}`; }}}',
      ],
    },
  };
}
