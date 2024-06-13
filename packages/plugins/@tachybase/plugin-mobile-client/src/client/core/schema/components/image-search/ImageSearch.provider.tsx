import React from 'react';
import { DataBlockProvider } from '@tachybase/client';

export const ImageSearchProvider = ({ collection, children }) => {
  return <DataBlockProvider collection={collection}>{children}</DataBlockProvider>;
};
