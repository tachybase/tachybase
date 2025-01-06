import { uid } from '@tachybase/utils/client';

export const getRemoteSchemaRecordBlockInitItem = () => {
  const id = uid();

  return {
    type: 'void',
    name: id,
    'x-uid': id,
    'x-designer': 'List.Designer',
    'x-decorator': 'Approval-ProviderApprovalRecordBlock',
    'x-component': 'CardItem',
    properties: {
      block: {
        type: 'void',
        'x-component': 'Approval-ViewApprovalRecordBlock',
      },
    },
  };
};
