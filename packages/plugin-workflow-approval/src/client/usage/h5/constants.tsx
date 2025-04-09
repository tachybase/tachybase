import React from 'react';
import { SchemaInitializerItemType } from '@tachybase/client';
import { EXECUTION_STATUS, JOB_STATUS } from '@tachybase/module-workflow/client';
import { ISchema } from '@tachybase/schema';

import {
  CheckOutlined,
  CloseOutlined,
  ExclamationOutlined,
  HourglassOutlined,
  LoadingOutlined,
  MinusOutlined,
  RedoOutlined,
} from '@ant-design/icons';

export const ProcessedStatus = [1, 2, -1, -3];

export const ApprovalPriorityType = [
  { value: '1', label: '一般', color: 'cyan' },
  { value: '2', label: '紧急', color: 'gold' },
  { value: '3', label: '非常紧急', color: 'red' },
];

export const ExecutionStatusOptions = [
  {
    value: EXECUTION_STATUS.QUEUEING,
    label: 'Queueing',
    color: 'blue',
    icon: <HourglassOutlined />,
    description: 'Triggered but still waiting in queue to execute.',
  },
  {
    value: EXECUTION_STATUS.STARTED,
    label: 'On going',
    color: 'gold',
    icon: <LoadingOutlined />,
    description: 'Started and executing, maybe waiting for an async callback (manual, delay etc.).',
  },
  {
    value: EXECUTION_STATUS.RESOLVED,
    label: 'Resolved',
    color: 'green',
    icon: <CheckOutlined />,
    description: 'Successfully finished.',
  },
  {
    value: EXECUTION_STATUS.FAILED,
    label: 'Failed',
    color: 'red',
    icon: <ExclamationOutlined />,
    description: 'Failed to satisfy node configurations.',
  },
  {
    value: EXECUTION_STATUS.ERROR,
    label: 'Error',
    color: 'red',
    icon: <CloseOutlined />,
    description: 'Some node meets error.',
  },
  {
    value: EXECUTION_STATUS.ABORTED,
    label: 'Aborted',
    color: 'red',
    icon: <MinusOutlined rotate={90} />,
    description: 'Running of some node was aborted by program flow.',
  },
  {
    value: EXECUTION_STATUS.CANCELED,
    label: 'Canceled',
    color: 'volcano',
    icon: <MinusOutlined rotate={45} />,
    description: 'Manually canceled whole execution when waiting.',
  },
  {
    value: EXECUTION_STATUS.REJECTED,
    label: 'Rejected',
    color: 'volcano',
    icon: <MinusOutlined />,
    description: 'Rejected from a manual node.',
  },
  {
    value: EXECUTION_STATUS.RETRY_NEEDED,
    label: 'Retry needed',
    color: 'volcano',
    icon: <RedoOutlined />,
    description: 'General failed but should do another try.',
  },
];

export const ApprovalNoticeStatusOptions = [
  {
    value: EXECUTION_STATUS.QUEUEING,
    label: 'Assigned',
    color: 'blue',
  },
  {
    value: EXECUTION_STATUS.STARTED,
    label: 'Pending',
    color: 'gold',
  },
  {
    value: 2,
    label: 'Approved',
    color: 'green',
  },
  {
    value: EXECUTION_STATUS.REJECTED,
    label: 'Rejected',
    color: 'red',
  },
];

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

export type ManualFormType = {
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
