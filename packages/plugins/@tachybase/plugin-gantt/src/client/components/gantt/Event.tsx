import React from 'react';
import { observer } from '@tachybase/schema';

export const Event = observer(
  (props) => {
    return <>{props.children}</>;
  },
  { displayName: 'Event' },
);
