import { EventSourceTrigger } from '.';
import { lang, NAMESPACE, tval } from '../locale';

export class DatabaseEventTrigger extends EventSourceTrigger {
  title = `{{t("Database event", { ns: "${NAMESPACE}" })}}`;
  description = '{{t("在数据表创建,修改,删除后加入特定的钩子事件")}}';
  options = {
    collection: {
      type: 'string',
      title: '{{t("Collection")}}',
      'x-decorator': 'FormItem',
      'x-component': 'DataSourceCollectionCascader',
    },
    event: {
      title: '操作类型',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { label: '保存(创建/更新)之前', value: 'beforeSave' },
        { label: '创建之前', value: 'beforeCreate' },
        { label: '更新之前', value: 'beforeUpdate' },
        { label: '删除之前', value: 'beforeDestroy' },
        { label: '保存(创建/更新)之后', value: 'afterSave' },
        { label: '创建之后', value: 'afterCreate' },
        { label: '更新之后', value: 'afterUpdate' },
        { label: '删除之后', value: 'afterDestroy' },
        { label: '当表和关联数据创建之后', value: 'afterSaveWithAssociations' },
        { label: '当表和关联数据更新之后', value: 'afterCreateWithAssociations' },
        { label: '当表和关联数据删除之后', value: 'afterUpdateWithAssociations' },
      ],
    },
    eventName: {
      title: `{{t("Custon event name", { ns: "${NAMESPACE}" })}}`,
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        tooltip:
          '{{t("The event name is used to identify the event, and the event name must be unique in the same collection.")}}',
      },
      'x-component': 'Input',
      'x-reactions': [
        '{{(field) => { const collection = field.query("options.collection").get("value"); const event = field.query("options.event").get("value"); field.value = `${collection || ""}.${event || ""}`; }}}',
      ],
      // ['x-validator'](value) {
      //   return value.split('.') === 2 ? '' : lang('The event name must be in the format of "collection.event"');
      // },
    },
  };
}
