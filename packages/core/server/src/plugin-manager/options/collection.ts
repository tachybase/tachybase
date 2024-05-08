import { defineCollection } from '@tachybase/database';

export default defineCollection({
  name: 'applicationPlugins',
  dumpRules: 'required',
  repository: 'PluginManagerRepository',
  origin: '@tachybase/server',
  fields: [
    { type: 'string', name: 'name', unique: true },
    { type: 'string', name: 'packageName', unique: true },
    { type: 'string', name: 'version' },
    { type: 'boolean', name: 'enabled' },
    { type: 'boolean', name: 'installed' },
    { type: 'boolean', name: 'builtIn' },
    { type: 'json', name: 'options' },
  ],
});
