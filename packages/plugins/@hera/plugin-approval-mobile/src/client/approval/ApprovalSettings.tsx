import { SchemaSettings } from '@nocobase/client';
import _ from 'lodash';

export const ApprovalSettings = new SchemaSettings({
  name: 'ApprovalSettings',
  items: [
    {
      name: 'divider',
      type: 'divider',
    },
    {
      name: 'delete',
      type: 'remove',
      sort: 100,
    },
  ],
});
