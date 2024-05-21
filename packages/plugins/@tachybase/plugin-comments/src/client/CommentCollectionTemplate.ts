import { CollectionTemplate, getConfigurableProperties } from '@tachybase/client';
import { tval } from './locale';

export class CommentCollectionTemplate extends CollectionTemplate {
  name = 'comment';
  title = tval('Comment Collection');
  order = 2;
  color = 'orange';
  default = {
    fields: [
      {
        name: 'content',
        type: 'text',
        length: 'long',
        interface: 'vditor',
        deletable: false,
        uiSchema: {
          type: 'string',
          title: tval('Comment Content'),
          interface: 'vditor',
          'x-component': 'MarkdownVditor',
        },
      },
    ],
  };
  presetFieldsDisabled = true;
  configurableProperties = getConfigurableProperties(
    'title',
    'name',
    'inherits',
    'category',
    'description',
    'presetFields',
  );
}
