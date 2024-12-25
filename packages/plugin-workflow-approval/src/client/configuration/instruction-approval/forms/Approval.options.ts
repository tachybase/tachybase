import { SchemaInitializerItemType } from '@tachybase/client';
import { JOB_STATUS } from '@tachybase/module-workflow/client';
import { ISchema } from '@tachybase/schema';
import { Registry } from '@tachybase/utils/client';

import updateFormConfig from './update';

type ValueOf<T> = T[keyof T];

export type FormType = {
  type: 'create' | 'update' | 'custom';
  title: string;
  actions: ValueOf<typeof JOB_STATUS>[];
  collection:
    | string
    | {
        name: string;
        fields: any[];
        [key: string]: any;
      };
};

export type ApprovalFormType = {
  title: string;
  config: {
    useInitializer: ({ allCollections }?: { allCollections: any[] }) => SchemaInitializerItemType;
    initializers?: {
      [key: string]: React.FC;
    };
    components?: {
      [key: string]: React.FC;
    };
    parseFormOptions(root: ISchema): { [key: string]: FormType };
  };
  block: {
    scope?: {
      [key: string]: () => any;
    };
    components?: {
      [key: string]: React.FC;
    };
  };
};

export const approvalFormOptions = new Registry<ApprovalFormType>();
approvalFormOptions.register('updateForm', updateFormConfig as ApprovalFormType);
