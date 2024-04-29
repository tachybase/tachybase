import { observer } from '@tachybase/schema';
import React from 'react';

export const Event = observer(
  (props) => {
    return <>{props.children}</>;
  },
  { displayName: 'Event' },
);
