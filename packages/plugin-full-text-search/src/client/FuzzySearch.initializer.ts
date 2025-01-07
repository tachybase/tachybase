import { ViewFuzzySearchActionSwitch } from './FuzzySearchAction.view';
import { tval } from './locale';

export const fuzzySearchInitializer = {
  name: 'enableActions.fuzzySearch',
  type: 'item',
  title: tval('Full fuzzy search'),
  Component: ViewFuzzySearchActionSwitch,
  schema: {
    'x-align': 'left',
  },
};
