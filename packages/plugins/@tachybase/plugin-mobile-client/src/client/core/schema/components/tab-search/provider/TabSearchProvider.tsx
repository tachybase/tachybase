import { DataBlockProvider } from '@tachybase/client';
import React from 'react';

export const TabSearchProvider = (props) => {
  return <DataBlockProvider collection={props.collection}>{props.children}</DataBlockProvider>;
};
