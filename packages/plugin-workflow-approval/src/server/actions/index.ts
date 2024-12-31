import { COLLECTION_NAME_APPROVAL_CARBON_COPY } from '../../common/constants';
import { approvalCarbonCopy } from './approvalCarbonCopy';
import { approvalRecords } from './approvalRecords';
import { approvals } from './approvals';
import { workflows } from './workflows';

function make(name, mod) {
  return Object.keys(mod).reduce(
    (result, key) => ({
      ...result,
      [`${name}:${key}`]: mod[key],
    }),
    {},
  );
}
export function init({ app }) {
  app.actions({
    ...make('workflows', workflows),
    ...make('approvals', approvals),
    ...make('approvalRecords', approvalRecords),
    ...make(COLLECTION_NAME_APPROVAL_CARBON_COPY, approvalCarbonCopy),
  });
}
