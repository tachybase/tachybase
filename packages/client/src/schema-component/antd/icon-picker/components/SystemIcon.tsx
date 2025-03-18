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
  return (
    <div className={'system-icon-top'}>
      <h2>选择底色和风格</h2>
      <div>圆形/圆角/大圆角</div>
      <div>选择预设颜色和自定义颜色</div>
    </div>
  );
};

const SystemIconMiddle = () => {
  return <div className={'system-icon-middle'}>中间可滑动的选择图标</div>;
};

const SystemIconBottom = () => {
  return <div className={'system-icon-bottom'}>底部固定的区块选择</div>;
};
