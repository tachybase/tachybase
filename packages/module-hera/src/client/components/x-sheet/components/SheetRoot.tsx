import React, { createContext, useContext, useEffect, useState } from 'react';

import { Options } from '..';
import { cssPrefix } from '../config';
import DataProxy from '../core/data_proxy';
import { Bottombar } from './Bottombar';
import { Print } from './Print';
import { Table } from './Table';
import { Toolbar } from './Toolbar';

const SheetContext = createContext<DataProxy>(null);

export const useSheetData = () => {
  return useContext(SheetContext);
};

export const SheetRoot = ({ options }: { options: Options }) => {
  const [data, setData] = useState<DataProxy>(null);

  useEffect(() => {
    setData(new DataProxy('sheet1', options));
  }, [options]);

  if (!data) {
    return null;
  }

  return (
    <SheetContext.Provider value={data}>
      <div
        className={`${cssPrefix}`}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Toolbar />
        <Table />
        {/* <Print /> */}
      </div>
      <Bottombar />
    </SheetContext.Provider>
  );
};
