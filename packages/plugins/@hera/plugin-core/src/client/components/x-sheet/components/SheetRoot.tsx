import React, { createContext, useContext, useEffect, useState } from 'react';
import { cssPrefix } from '../config';
import { Bottombar } from './Bottombar';
import { Toolbar } from './Toolbar';
import { Table } from './Table';
import { Print } from './Print';
import { Options } from '..';
import DataProxy from '../core/data_proxy';

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
