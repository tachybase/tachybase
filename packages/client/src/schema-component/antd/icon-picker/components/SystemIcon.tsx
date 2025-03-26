import { useState } from 'react';

import { ColorPicker } from 'antd';
import { barBackground } from 'packages/plugin-block-gantt/src/client/components/task-item/bar/style';

import { useStyles } from './SystemIcon.style';

export const SystemIcon = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.systemIcon}>
      <SystemIconTop />
      <SystemIconMiddle />
      <SystemIconBottom />
    </div>
  );
};

const SystemIconTop = () => {
  const [color, setColor] = useState();

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
        <ul>
          <li>圆形</li>
          <li>小圆角</li>
          <li>大圆角</li>
        </ul>
      </div>
      <ul className={'system-icon-style'}>
        {styleBackgroudColor.map((item, index) => {
          if (index + 1 === styleBackgroudColor.length) {
            return <ColorPicker style={{ ...item }} value={color}></ColorPicker>;
          }
          return <li style={{ ...item }}></li>;
        })}
      </ul>
    </div>
  );
};

const SystemIconMiddle = () => {
  return <div className={'system-icon-middle'}>选择图标</div>;
};

const SystemIconBottom = () => {
  return <div className={'system-icon-bottom'}>底部固定的区块选择</div>;
};
