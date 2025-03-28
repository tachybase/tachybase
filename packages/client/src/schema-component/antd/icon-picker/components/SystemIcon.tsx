import { useEffect, useMemo, useState } from 'react';

import { ColorPicker } from 'antd';
import { groupBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Icon, icons } from '../../../../icon';
import { useStyles } from './SystemIcon.style';

export const SystemIcon = (props) => {
  const { styles } = useStyles();
  const [size, setSize] = useState();
  const [color, setColor] = useState();
  const sizeProps = {
    ...props,
    size,
    setSize,
    color,
    setColor,
  };
  return (
    <div className={styles.systemIcon}>
      <SystemIconTop {...sizeProps} />
      <SystemIconMiddle {...sizeProps} />
      <SystemIconBottom />
    </div>
  );
};

const SystemIconTop = (props) => {
  const { size, setSize, color, setColor, filterKey } = props;
  const styleBackgroudColor = [
    { background: 'linear-gradient( 138deg, #FFCBCB 21%, #FF7575 100%)' },
    { background: 'linear-gradient( 136deg, #FFD07D 0%, #F4A94D 57%, #FB9EB1 92%)' },
    { background: 'linear-gradient( 135deg, #9EC56F 32%, #77D19A 88%)' },
    { background: 'linear-gradient( 136deg, #62D4C3 50%, #66CCE0 91%)' },
    { background: 'linear-gradient( 136deg, #9FCAFF 0%, #606CFF 72%, #705DFF 100%)' },
    { background: 'linear-gradient( 135deg, #8895F6 0%, #828FF4 27%, #956CF5 100%)' },
    {
      background:
        'conic-gradient( from 179.99999762840656deg at 85.99999248981476% 86.00000143051147%, #7796FD 1%, #FBCAFD 14%, #C2FCFF 31%, #7C90FF 50%, #A1A5F4 70%, #BDF1FF 87%)',
    },
  ];
  return (
    <div className={'system-icon-top'}>
      <div className={'system-icon-size'}>
        选择底色
        <div className="system-icon-radius">
          <Icon
            type={'clearoutlined'}
            onClick={() => {
              setColor('');
              setSize('');
            }}
          />
          <ul>
            <li
              className={`${size === 'rounded' ? 'syste-icon-checkout' : ''}`}
              onClick={() => {
                setSize('rounded');
              }}
            >
              圆形
            </li>
            <li
              className={`${size === 'smallRounded' ? 'syste-icon-checkout' : ''}`}
              onClick={() => {
                setSize('smallRounded');
              }}
            >
              小圆角
            </li>
            <li
              className={`${size === 'bigRounded' ? 'syste-icon-checkout' : ''}`}
              onClick={() => {
                setSize('bigRounded');
              }}
            >
              大圆角
            </li>
          </ul>
        </div>
      </div>
      <ul className={'system-icon-style'}>
        {styleBackgroudColor.map((item, index) => {
          if (index + 1 === styleBackgroudColor.length) {
            return <ColorPicker style={{ ...item, ...iconSize[size] }} value={color}></ColorPicker>;
          }
          return (
            <li
              style={{ ...item, ...iconSize[size] }}
              onClick={() => {
                setColor(item.background);
              }}
            ></li>
          );
        })}
      </ul>
    </div>
  );
};

const SystemIconMiddle = (props) => {
  const { currentKey, filterKey, onChange, changePop, size, color, value } = props;
  const [clickValue, setClickValue] = useState();
  const { t } = useTranslation();
  const iconKeysByFilter = useMemo(() => {
    const iconFilter = {
      Directional: [],
      Suggested: [],
      EditIcon: [],
      DataIcon: [],
      Brand: [],
      Application: [],
    };
    const iconsKey = [];
    if (filterKey) {
      icons.keys().forEach((item) => {
        if (item.toLowerCase().includes(filterKey.toLowerCase())) {
          iconsKey.push(item);
        }
      });
    } else {
      iconsKey.push(...icons.keys());
    }
    iconsKey.forEach((iconName) => {
      if (/up|down|left|right|arrow|expand|shrink/.test(iconName)) iconFilter.Directional.push(iconName);
      else if (/check|info|exclamation|close/.test(iconName)) iconFilter.Suggested.push(iconName);
      else if (/edit|delete|copy|save/.test(iconName)) iconFilter.EditIcon.push(iconName);
      else if (/chart|database|table/.test(iconName)) iconFilter.DataIcon.push(iconName);
      else if (/alibaba|antDesign|alipay|taobao|weibo|qq|wechat|github/.test(iconName)) iconFilter.Brand.push(iconName);
      else iconFilter.Application.push(iconName);
    });
    return iconFilter;
  }, [filterKey]);

  return (
    <div className={'system-icon-middle'}>
      选择图标
      {Object.keys(iconKeysByFilter).map((item) => {
        return iconKeysByFilter[item].length ? (
          <div className={'system-icon-category'}>
            <div className="title">{t(item)}</div>
            <div className="icon">
              {iconKeysByFilter[item].map((key) => {
                let iconStyle = {};
                if (key === clickValue || key === value) {
                  iconStyle = { ...iconSize[size], background: color, border: '1px solid #D4D4D4 ' };
                }
                return (
                  <div
                    className="icon-li"
                    style={{ ...iconStyle }}
                    onClick={() => {
                      onChange(key);
                      setClickValue(key);
                    }}
                  >
                    <Icon type={key} />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
};

const SystemIconBottom = () => {
  const categoryIcons = [
    'rightcircleoutlined',
    'exclamationcircleoutlined',
    'editoutlined',
    'pieChartoutlined',
    'globaloutlined',
    'appstoreoutlined',
  ];
  return (
    <div className={'system-icon-bottom'}>
      <ul>
        {categoryIcons.map((item) => {
          return (
            <li>
              <Icon type={item} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const iconSize = {
  rounded: {
    borderRadius: '50px',
  },
  smallRounded: {
    borderRadius: '8px',
  },
  bigRounded: {
    borderRadius: '11px',
  },
};
