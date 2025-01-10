import { ActionInitializer } from '@tachybase/client';

import { schema } from './FuzzySearchAction.schema';

export const ViewFuzzySearchActionSwitch = (props) => {
  return <ActionInitializer {...props} schema={schema} />;
};
