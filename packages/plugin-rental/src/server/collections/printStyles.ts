import { defineCollection } from '@tachybase/database';

export default defineCollection({
  dumpRules: 'required',
  name: 'printStyles',
  fields: [
    {
      type: 'string',
      name: 'name',
      allowNull: false,
      defaultValue: false,
    },
    {
      type: 'json',
      name: 'margin',
      allowNull: false,
      defaultValue: false,
    },
    {
      type: 'string',
      name: 'size',
      allowNull: false,
      defaultValue: false,
    },
    {
      type: 'string',
      name: 'fontSize',
      allowNull: false,
      defaultValue: false,
    },
    {
      type: 'string',
      name: 'orientation',
      allowNull: false,
      defaultValue: false,
    },
    {
      type: 'string',
      name: 'column',
      allowNull: false,
      defaultValue: false,
    },
    {
      type: 'string',
      name: 'comment',
      allowNull: false,
      defaultValue: false,
    },
  ],
});
