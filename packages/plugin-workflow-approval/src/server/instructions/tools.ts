import { JOB_STATUS } from '@tachybase/module-workflow';

import { APPROVAL_ACTION_STATUS } from '../constants/status';

const NEGOTIATION_MODE = {
  SINGLE: Symbol('single'),
  ALL: Symbol('all'),
  ANY: Symbol('any'),
  PERCENTAGE: Symbol('percentage'),
};
const JobStatusMap = {
  [APPROVAL_ACTION_STATUS.PENDING]: JOB_STATUS.PENDING,
  [APPROVAL_ACTION_STATUS.APPROVED]: JOB_STATUS.RESOLVED,
  [APPROVAL_ACTION_STATUS.REJECTED]: JOB_STATUS.REJECTED,
  [APPROVAL_ACTION_STATUS.RETURNED]: JOB_STATUS.RETRY_NEEDED,
};
export const ApprovalJobStatusMap = {
  [JOB_STATUS.PENDING]: APPROVAL_ACTION_STATUS.PENDING,
  [JOB_STATUS.RESOLVED]: APPROVAL_ACTION_STATUS.APPROVED,
  [JOB_STATUS.REJECTED]: APPROVAL_ACTION_STATUS.REJECTED,
  [JOB_STATUS.RETRY_NEEDED]: APPROVAL_ACTION_STATUS.RETURNED,
  [JOB_STATUS.CANCELED]: APPROVAL_ACTION_STATUS.CANCELED,
};
const Modes = {
  [NEGOTIATION_MODE.SINGLE]: {
    getStatus(distribution, assignees, mode) {
      const done = distribution.find((item) => item.status !== APPROVAL_ACTION_STATUS.PENDING && item.count > 0);
      return done ? JobStatusMap[done.status] : null;
    },
  },
  [NEGOTIATION_MODE.ALL]: {
    getStatus(distribution, assignees, mode) {
      const rejected = distribution.find((item) =>
        [APPROVAL_ACTION_STATUS.REJECTED, APPROVAL_ACTION_STATUS.RETURNED].includes(item.status),
      );
      if (rejected && rejected.count) {
        return JobStatusMap[rejected.status];
      }
      const approved = distribution.find((item) => item.status === APPROVAL_ACTION_STATUS.APPROVED);
      if (approved && approved.count === assignees.length) {
        return JOB_STATUS.RESOLVED;
      }
      return null;
    },
  },
  [NEGOTIATION_MODE.ANY]: {
    getStatus(distribution, assignees, mode) {
      const returned = distribution.find((item) => item.status === APPROVAL_ACTION_STATUS.RETURNED);
      if (returned && returned.count) {
        return JOB_STATUS.RETRY_NEEDED;
      }
      const approved = distribution.find((item) => item.status === APPROVAL_ACTION_STATUS.APPROVED);
      if (approved && approved.count) {
        return APPROVAL_ACTION_STATUS.APPROVED;
      }
      const rejectedCount = distribution.reduce(
        (count, item) => (item.status === APPROVAL_ACTION_STATUS.REJECTED ? count + item.count : count),
        0,
      );
      if (rejectedCount === assignees.length) {
        return JOB_STATUS.REJECTED;
      }
      return null;
    },
  },
  [NEGOTIATION_MODE.PERCENTAGE]: {
    getStatus(distribution, assignees, mode) {
      const returned = distribution.find((item) => item.status === APPROVAL_ACTION_STATUS.RETURNED);
      if (returned && returned.count) {
        return JOB_STATUS.RETRY_NEEDED;
      }
      const approved = distribution.find((item) => item.status === APPROVAL_ACTION_STATUS.APPROVED);
      if (approved && approved.count / assignees.length > mode) {
        return JOB_STATUS.RESOLVED;
      }
      const rejected = distribution.find((item) => item.status === APPROVAL_ACTION_STATUS.REJECTED);
      if (rejected && rejected.count / assignees.length >= 1 - mode) {
        return JOB_STATUS.REJECTED;
      }
      return null;
    },
  },
};
export function getNegotiationMode(mode) {
  switch (true) {
    case mode === 1:
      return Modes[NEGOTIATION_MODE.ALL];
    case 0 < mode && mode < 1:
      return Modes[NEGOTIATION_MODE.PERCENTAGE];
    default:
      return Modes[NEGOTIATION_MODE.SINGLE];
  }
}
export async function parseAssignees(node, processor) {
  const configAssignees = processor
    .getParsedValue(node.config.assignees ?? [], node.id)
    .flat()
    .filter(Boolean);
  const assignees = new Set();
  const UserRepo = processor.options.plugin.app.db.getRepository('users');
  for (const item of configAssignees) {
    if (typeof item === 'object') {
      const result = await UserRepo.find({
        ...item,
        fields: ['id'],
        transaction: processor.transaction,
      });
      result.forEach((item2) => assignees.add(item2.id));
    } else {
      assignees.add(item);
    }
  }
  return [...assignees];
}
