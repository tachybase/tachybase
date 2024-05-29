export const tabPendingSchema = (t, props, parantUid) => {
  return {
    type: 'void',
    name: 'TabPendingItem',
    title: t('Pending'),
    'x-settings': 'ApprovalSettings',
    'x-component': 'TabPendingItem',
    'x-component-props': {
      ...props,
      collectionName: 'approvalRecords',
      settingBlock: true,
      tabKey: 'pending',
      parantUid,
      parantParams: props['params'],
    },
  };
};

export const tabProcessedSchema = (t, props, parantUid) => {
  return {
    type: 'void',
    name: 'TabProcessedItem',
    title: t('Processed'),
    'x-settings': 'ApprovalSettings',
    'x-component': 'TabProcessedItem',
    'x-component-props': {
      ...props,
      collectionName: 'approvalRecords',
      settingBlock: true,
      tabKey: 'processed',
      parantUid,
      parantParams: props['params'],
    },
  };
};

export const tabDuplicateSchema = (t, props, parantUid) => {
  return {
    type: 'void',
    name: 'TabDuplicateItem',
    title: t('Duplicate'),
    'x-settings': 'ApprovalSettings',
    'x-component': 'TabDuplicateItem',
    'x-component-props': {
      ...props,
      collectionName: 'approvalRecords',
      settingBlock: true,
      tabKey: 'duplicate',
      parantUid,
      parantParams: props['params'],
    },
  };
};

export const tabExecutedSchema = (t, props, parantUid) => {
  return {
    type: 'void',
    name: 'TabExecutedItem',
    title: t('Executed'),
    'x-settings': 'ApprovalSettings',
    'x-component': 'TabExecutedItem',
    'x-component-props': {
      ...props,
      collectionName: 'users_jobs',
      settingBlock: true,
      tabKey: 'executed',
      parantUid,
      parantParams: props['params'],
    },
  };
};
