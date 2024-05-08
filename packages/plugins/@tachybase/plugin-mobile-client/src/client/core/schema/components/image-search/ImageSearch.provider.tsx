import { DataBlockProvider } from '@tachybase/client';
import React from 'react';

export const ImageSearchProvider = ({ collection, children }) => {
  return <DataBlockProvider collection={collection}>{children}</DataBlockProvider>;
};
