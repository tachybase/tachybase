import { useCollection_deprecated, SchemaInitializer } from '@tachybase/client';
import { tval } from './locale';

export const CommentBlockActionInitializer = new SchemaInitializer({
  name: 'comment:configureItemActions',
  title: '{{t("Configure actions")}}',
  icon: 'SettingOutlined',
  items: [
    {
      type: 'itemGroup',
      name: 'enableActions',
      title: '{{t("Enable actions")}}',
      children: [
        {
          name: 'edit',
          title: '{{t("Edit")}}',
          Component: 'UpdateCommentActionInitializer',
          schema: { 'x-action': 'update', 'x-decorator': 'ACLActionProvider', 'x-align': 'left' },
          useVisible() {
            const collection = useCollection_deprecated();
            return (collection.template !== 'view' || collection?.writableView) && collection.template !== 'sql';
          },
        },
        {
          name: 'delete',
          title: '{{t("Delete")}}',
          Component: 'DestroyActionInitializer',
          schema: {
            'x-component': 'Action.Link',
            'x-action': 'destroy',
            'x-decorator': 'ACLActionProvider',
            'x-align': 'left',
          },
          useVisible() {
            return useCollection_deprecated().template !== 'sql';
          },
        },
        {
          name: 'reply',
          title: tval('Quote Reply'),
          Component: 'QuoteReplyCommentActionInitializer',
          schema: { 'x-action': 'create', 'x-decorator': 'ACLActionProvider', 'x-align': 'left' },
          useVisible() {
            return useCollection_deprecated().template !== 'sql';
          },
        },
      ],
    },
  ],
});
