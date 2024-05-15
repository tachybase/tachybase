import { css, cx } from '@tachybase/client';
import React, { PropsWithChildren } from 'react';

type IProps = PropsWithChildren<{
  className: string;
}>;

const iOS6: React.FC<IProps> = (props) => {
  return (
    <div
      className={cx(
        'nb-mobile-device-ios6',
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
