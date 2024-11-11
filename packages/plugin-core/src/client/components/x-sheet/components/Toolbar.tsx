import React from 'react';

import { cssPrefix } from '../config';
import { Icon } from './Icon';

const btns = [
  'undo',
  'redo',
  'print',
  'paintformat',
  'clearformat',
  'divider',
  'bold',
  'italic',
  'underline',
  'strike',
  'divider',
  'merge',
  'textwrap',
  'freeze',
  'autofilter',
];

export const Toolbar = () => {
  return (
    <div className={`${cssPrefix}-toolbar`}>
      <div className={`${cssPrefix}-toolbar-btns`}>
        {btns.map((btn, i) =>
          btn === 'divider' ? (
            <div key={btn + i} className={`${cssPrefix}-toolbar-divider`} />
          ) : (
            <div key={btn} className={`${cssPrefix}-toolbar-btn`}>
              <Icon name={btn} onClick={() => {}} />
            </div>
          ),
        )}
      </div>
    </div>
  );
};
