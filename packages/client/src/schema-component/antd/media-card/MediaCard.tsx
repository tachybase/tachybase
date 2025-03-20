import { cx } from 'antd-style';

import { Icon } from '../../../icon';
import { useStyles } from './style';

interface MediaCardProps {
  color: string;
  icon: string;
  title: string;
  layout?: 'horizontal' | 'vertical';
  className?: string;
  onClick: () => void;
}

export const MediaCard = (props: MediaCardProps) => {
  const { icon, color, title, layout = 'horizontal', onClick, className } = props;
  const { styles } = useStyles();
  return (
    <div
      className={cx(
        styles.mediaCardStyle,
        {
          layout: layout === 'vertical',
        },
        className,
      )}
      onClick={onClick}
    >
      <div className="icon-wrapper" style={{ backgroundColor: color ?? '#e5e5e5' }}>
        <Icon className="icon" type={icon ?? 'AppstoreOutlined'} style={{ color: color ?? '#e5e5e5' }} />
      </div>
      <div className="title">{title}</div>
    </div>
  );
};
