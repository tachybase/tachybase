import React from 'react';
import { ExtendCollectionsProvider, TableBlockProvider } from '@tachybase/client';

import MessageCollection from '../collections/messages';

export const MessageBlockProvider = ({ children, ...restProps }) => {
  return (
    <ExtendCollectionsProvider collections={[MessageCollection]}>
      <TableBlockProvider name="message" {...restProps}>
        {children}
      </TableBlockProvider>
    </ExtendCollectionsProvider>
  );
};
