import _ from 'lodash';

import { JOB_STATUS } from '../../constants';
import { NOTICE_ACTION_STATUS } from './constants';

interface ParamsType {
  summaryConfig: Array<string>;
  data: object;
}

export function getSummary(params: ParamsType): object {
  const { summaryConfig = [], data } = params;

  const result = summaryConfig.reduce((summary, key) => {
    const value = _.get(data, key);
    return {
      ...summary,
      [key]: value,
    };
  }, {});

  return result;
}

export async function parsePerson(node, processor) {
  const configPerson = processor
    .getParsedValue(node.config.notifiedPerson ?? [], node.id)
    .flat()
    .filter(Boolean);

  const notifiedPerson = new Set();
  const UserRepo = processor.options.plugin.app.db.getRepository('users');
  for (const item of configPerson) {
    if (typeof item === 'object') {
      const result = await UserRepo.find({
        ...item,
        fields: ['id'],
        transaction: processor.transaction,
      });
      result.forEach((item2) => notifiedPerson.add(item2.id));
    } else {
      notifiedPerson.add(item);
    }
  }
  return [...notifiedPerson];
}

const NEGOTIATION_MODE = {
  SINGLE: Symbol('single'),
  ALL: Symbol('all'),
  ANY: Symbol('any'),
  PERCENTAGE: Symbol('percentage'),
};
const JobStatusMap = {
  [NOTICE_ACTION_STATUS.PENDING]: JOB_STATUS.PENDING,
  [NOTICE_ACTION_STATUS.APPROVED]: JOB_STATUS.RESOLVED,
  [NOTICE_ACTION_STATUS.REJECTED]: JOB_STATUS.REJECTED,
  [NOTICE_ACTION_STATUS.RETURNED]: JOB_STATUS.RETRY_NEEDED,
};

const Modes = {
  [NEGOTIATION_MODE.SINGLE]: {
    getStatus(distribution, assignees, mode) {
      const done = distribution.find((item) => item.status !== NOTICE_ACTION_STATUS.PENDING && item.count > 0);
      return done ? JobStatusMap[done.status] : null;
    },
  },
  [NEGOTIATION_MODE.ALL]: {
    getStatus(distribution, assignees, mode) {
      const rejected = distribution.find((item) =>
        [NOTICE_ACTION_STATUS.REJECTED, NOTICE_ACTION_STATUS.RETURNED].includes(item.status),
      );
      if (rejected && rejected.count) {
        return JobStatusMap[rejected.status];
      }
      const approved = distribution.find((item) => item.status === NOTICE_ACTION_STATUS.APPROVED);
      if (approved && approved.count === assignees.length) {
        return JOB_STATUS.RESOLVED;
      }
      return null;
    },
  },
  [NEGOTIATION_MODE.ANY]: {
    getStatus(distribution, assignees, mode) {
      const returned = distribution.find((item) => item.status === NOTICE_ACTION_STATUS.RETURNED);
      if (returned && returned.count) {
        return JOB_STATUS.RETRY_NEEDED;
      }
      const approved = distribution.find((item) => item.status === NOTICE_ACTION_STATUS.APPROVED);
      if (approved && approved.count) {
        return NOTICE_ACTION_STATUS.APPROVED;
      }
      const rejectedCount = distribution.reduce(
        (count, item) => (item.status === NOTICE_ACTION_STATUS.REJECTED ? count + item.count : count),
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
      const returned = distribution.find((item) => item.status === NOTICE_ACTION_STATUS.RETURNED);
      if (returned && returned.count) {
        return JOB_STATUS.RETRY_NEEDED;
      }
      const approved = distribution.find((item) => item.status === NOTICE_ACTION_STATUS.APPROVED);
      if (approved && approved.count / assignees.length > mode) {
        return JOB_STATUS.RESOLVED;
      }
      const rejected = distribution.find((item) => item.status === NOTICE_ACTION_STATUS.REJECTED);
      if (rejected && rejected.count / assignees.length >= 1 - mode) {
        return JOB_STATUS.REJECTED;
      }
      return null;
    },
  },
};

export const NoticeJobStatusMap = {
  [JOB_STATUS.PENDING]: NOTICE_ACTION_STATUS.PENDING,
  [JOB_STATUS.RESOLVED]: NOTICE_ACTION_STATUS.APPROVED,
  [JOB_STATUS.REJECTED]: NOTICE_ACTION_STATUS.REJECTED,
  [JOB_STATUS.RETRY_NEEDED]: NOTICE_ACTION_STATUS.RETURNED,
  [JOB_STATUS.CANCELED]: NOTICE_ACTION_STATUS.CANCELED,
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
