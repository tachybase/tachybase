import { CollectionOptions } from '@tachybase/database';

export default {
  namespace: 'block-presentation.iframe-html-storage',
  dumpRules: 'required',
  name: 'iframeHtml',
  createdBy: true,
  updatedBy: true,
  shared: true,
  fields: [
    {
      type: 'uid',
      name: 'id',
      primaryKey: true,
    },
    {
      type: 'text',
      name: 'html',
    },
  ],
} as CollectionOptions;
