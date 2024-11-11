import React from 'react';
import {
  ArrayField as ArrayFieldModel,
  ObjectFieldComponent as ObjectField,
  observer,
  useField,
} from '@tachybase/schema';

import { RemoveConditionContext } from './context';
import { FilterGroup } from './FilterGroup';
import { FilterItem } from './FilterItem';

export const FilterItems = observer(
  (props) => {
    const field = useField<ArrayFieldModel>();
    return (
      <div>
        {field?.value?.filter(Boolean).map((item, index) => {
          return (
            <RemoveConditionContext.Provider key={index} value={() => field.remove(index)}>
              <ObjectField name={index} component={[item.$and || item.$or ? FilterGroup : FilterItem]} />
            </RemoveConditionContext.Provider>
          );
        })}
      </div>
    );
  },
  { displayName: 'FilterItems' },
);
