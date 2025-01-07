import { ActionInitializer } from '@tachybase/client';

export const ViewFuzzySearchActionSwitch = (props) => {
  const schema = {
    'x-component': 'FuzzySearchInput',
  };
  return <ActionInitializer {...props} schema={schema} />;
};
