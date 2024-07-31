import React, { useEffect, useRef } from 'react';

import { Draw } from '../canvas';
import CanvasTable from '../component/table';
import { cssPrefix } from '../config';
import { useSheetData } from './SheetRoot';

export const Table = () => {
  const data = useSheetData();
  const ref = useRef();

  useEffect(() => {
    const draw = new Draw(ref.current, data.viewWidth(), data.viewHeight());
    const canvasTable = new CanvasTable(ref.current, data, draw);
    canvasTable.render();
  }, [data, ref]);

  return (
    <div className={`${cssPrefix}-sheet`}>
      <canvas ref={ref} className={`${cssPrefix}-table`} />
    </div>
  );
};
