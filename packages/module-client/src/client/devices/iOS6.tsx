import React, { PropsWithChildren } from 'react';
import { css, cx } from '@tachybase/client';

type IProps = PropsWithChildren<{
  className: string;
}>;

const iOS6: React.FC<IProps> = (props) => {
  return (
    <div
      className={cx(
        'tb-mobile-device-ios6',
        css(`
          display: flex;
          width: 375px;
          height: 667px;
      `),
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};

export default iOS6;
