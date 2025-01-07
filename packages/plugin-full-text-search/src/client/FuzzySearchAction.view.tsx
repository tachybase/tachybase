import { ActionInitializer } from '@tachybase/client';

export const ViewFuzzySearchSwitchAction = (props) => {
  const schema = {
    'x-component': 'FuzzySearchInput',
  };
  return <ActionInitializer {...props} schema={schema} />;
};
