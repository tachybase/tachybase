import { useEffect, useMemo, useRef, useState } from 'react';
import { useFieldSchema } from '@tachybase/schema';

import { ColorPicker } from 'antd';
import { useTranslation } from 'react-i18next';

import { Icon, icons } from '../../../../icon';
import { useStyles } from './SystemIcon.style';

export const SystemIcon = (props) => {
  const { styles } = useStyles();
  const [size, setSize] = useState();
  const [color, setColor] = useState();
  const [activeSection, setActiveSection] = useState('Directional');
  const containerRef = useRef(null);
  const sizeProps = {
    ...props,
    size,
    setSize,
    color,
    setColor,
    activeSection,
    setActiveSection,
    containerRef,
  };

  return (
    <div className={styles.systemIcon}>
      <SystemIconTop {...sizeProps} />
      <SystemIconMiddle {...sizeProps} />
      <SystemIconBottom {...sizeProps} />
    </div>
  );
};

const SystemIconTop = (props) => {
  const { size, setSize, color, setColor } = props;
  const { t } = useTranslation();

  return (
    <div className={'system-icon-top'}>
      <div className={'system-icon-size'}>
        {`${t('Select base color')}`}
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
              {t('Rotundity')}
            </li>
            <li
              className={`${size === 'smallRounded' ? 'syste-icon-checkout' : ''}`}
              onClick={() => {
                setSize('smallRounded');
              }}
            >
              {t('Small Rounded')}
            </li>
            <li
              className={`${size === 'largeRounded' ? 'syste-icon-checkout' : ''}`}
              onClick={() => {
                setSize('largeRounded');
              }}
            >
              {t('Large Rounded')}
            </li>
          </ul>
        </div>
      </div>
      <ul className={'system-icon-style'}>
        {styleBackgroudColor.map((item, index) => {
          if (index + 1 === styleBackgroudColor.length) {
            const chekoutColor = styleBackgroudColor.find((colorItem) => colorItem.background === color);
            return (
              <ColorPicker
                style={{ ...item, borderRadius: iconSize[size]?.borderRadius }}
                value={chekoutColor ? '' : color}
                onChange={(color) => {
                  setColor(color.toCssString());
                }}
              ></ColorPicker>
            );
          }
          return (
            <li
              style={{ ...item, borderRadius: iconSize[size]?.borderRadius }}
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
  const { filterKey, onChange, size, color, value, setActiveSection, containerRef } = props;
  const [clickValue, setClickValue] = useState();
  const { t } = useTranslation();
  const iconKeysByFilter = getFilterKeys(filterKey, icons);
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.system-icon-category');
      const middle = document.getElementById('system-icon-middle');
      const middleRect = middle.getBoundingClientRect();
      let currentSection = 'Application';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        if (rect.top - middleRect.top <= 70) {
          currentSection = section.id;
        }
      });
      setActiveSection(currentSection);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => container?.removeEventListener('scroll', handleScroll);
  }, [setActiveSection]);

  const iconChange = (key) => {
    // const changeProps = {
    //   iconValue:key,
    //   background: color,
    //   borderRadius: iconSize[size]?.borderRadius,
    // };
    // if (color) {
    //   changeProps['color']='white'
    // }
    onChange(key);
    setClickValue(key);
  };
  return (
    <div className={'system-icon-middle'} ref={containerRef} id="system-icon-middle">
      {t('Select Icon')}
      {Object.keys(iconKeysByFilter).map((item) => {
        return iconKeysByFilter[item].length ? (
          <div className={'system-icon-category'} id={item}>
            <div className="title">{t(item)}</div>
            <div className="icon">
              {iconKeysByFilter[item].map((key) => {
                let iconStyle = {};
                if (key === clickValue || key === value) {
                  iconStyle = {
                    borderRadius: iconSize[key]?.borderRadius,
                    background: color,
                    border: '1px solid #D4D4D4 ',
                  };
                  if (color) {
                    iconStyle['color'] = 'white';
                  }
                }
                return (
                  <div
                    className="icon-li"
                    style={{ ...iconStyle }}
                    onClick={() => {
                      iconChange(key);
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

const SystemIconBottom = (props) => {
  const { activeSection, containerRef } = props;

  const handleClick = (id) => {
    const section = document.getElementById(id);
    if (section && containerRef.current) {
      containerRef.current.scrollTo({
        top: section.offsetTop - containerRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };
  const categoryIcons = [
    {
      id: 'Directional',
      icon: 'rightcircleoutlined',
    },
    {
      id: 'Suggested',
      icon: 'exclamationcircleoutlined',
    },
    {
      id: 'EditIcon',
      icon: 'editoutlined',
    },
    {
      id: 'DataIcon',
      icon: 'pieChartoutlined',
    },
    {
      id: 'Brand',
      icon: 'globaloutlined',
    },
    {
      id: 'Application',
      icon: 'appstoreoutlined',
    },
  ];
  return (
    <div className={'system-icon-bottom'}>
      <ul>
        {categoryIcons.map((item) => {
          return (
            <li
              className={`system-icon-bottom-li  ${activeSection === item.id ? 'system-icon-bottom-li-active' : ''}`}
              onClick={() => {
                handleClick(item.id);
              }}
            >
              <Icon type={item.icon} />
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
  largeRounded: {
    borderRadius: '11px',
  },
};

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

const getFilterKeys = (filterKey, icons) => {
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
  return iconKeysByFilter;
};
