import React, { useMemo } from 'react';

import { Tooltip } from 'antd';

import { Icon, icons } from '../../../icon';

export const IconFilterList = (props) => {
  const { currentKey, filterKey, onChange, changePop } = props;

  const iconKeysByFilter = useMemo(() => {
    if (!filterKey) {
      return icons;
    }
    const filterIcons = new Map();
    for (const key of icons.keys()) {
      if (key.toLowerCase().includes(filterKey.toLowerCase())) {
        filterIcons.set(key, icons.get(key));
      }
    }
    return filterIcons;
  }, [filterKey]);

  return (
    <div style={{ width: '26em', maxHeight: '20em', overflowY: 'auto' }}>
      {[...iconKeysByFilter.keys()].map((key) => (
        <span
          key={key}
          style={{
            fontSize: 18,
            marginRight: 10,
            cursor: 'pointer',
            backgroundColor: currentKey == key ? '#9bb0d393' : '',
          }}
        >
          <Tooltip
            destroyTooltipOnHide
            mouseEnterDelay={0.3}
            mouseLeaveDelay={0.3}
            placement="top"
            title={key}
            arrow={{
              pointAtCenter: true,
            }}
          >
            <Icon
              type={key}
              onClick={() => {
                onChange(key);
                changePop(false);
              }}
            />
          </Tooltip>
        </span>
      ))}
    </div>
  );
};
