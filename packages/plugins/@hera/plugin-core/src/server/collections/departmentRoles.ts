import { defineCollection } from '@tachybase/database';

export default defineCollection({
  name: 'departmentsRoles',
  dumpRules: 'required',
});
