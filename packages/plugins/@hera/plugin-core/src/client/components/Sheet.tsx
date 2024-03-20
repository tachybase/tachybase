import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import Spreadsheet from './x-sheet';
import { css } from '@nocobase/client';
import { demoData } from './x-sheet/demo';

export type SheetRef = {
  getData: () => any;
};

export type SheetProps = {
  data?: any;
  style?: React.CSSProperties;
};

const Sheet = forwardRef<SheetRef, SheetProps>(({ data }, ref) => {
  const workbookRef = useRef<Spreadsheet>(null);
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getData,
  }));

  const getData = () => {
    if (!workbookRef.current) {
      throw new Error('Workbook is not initialized');
    }
    return workbookRef.current.getData();
  };

  useEffect(() => {
    const workbook = new Spreadsheet('#sheet', {
      view: {
        height: () => containerRef.current.offsetHeight,
        width: () => containerRef.current.offsetWidth,
      },
    }).loadData(demoData);
    workbookRef.current = workbook;
  }, [data]);

  return (
    <div
      ref={containerRef}
      id="sheet"
      className={css`
        height: 800px;
      `}
    />
  );
});

Sheet.displayName = 'Sheet';

export default Sheet;
