import React from 'react';

import { createStyles } from 'antd-style';

import { Input } from '../input';
import { RawTextArea } from './RawTextArea';

const useStyles = createStyles(({ css }) => {
  return {
    button: css`
      &:not(:hover) {
        border-right-color: transparent;
        border-top-color: transparent;
      }
      background-color: transparent;
    `,
  };
});

export function JSONInput(props) {
  const { styles } = useStyles();
  return <RawTextArea buttonClass={styles.button} {...props} component={Input.JSON} />;
}
