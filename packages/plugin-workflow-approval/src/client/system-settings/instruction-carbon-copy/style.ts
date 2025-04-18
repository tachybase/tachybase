import { createStyles, css } from '@tachybase/client';

export const useStyles = createStyles({});

export const configSytles = {
  ArrayItemsStyle: css`
    &[disabled] {
      > .ant-formily-array-base-addition {
        display: none;
      }
      > .ant-formily-array-items-item .ant-space-item:not(:nth-child(2)) {
        display: none;
      }
    }
  `,

  SpaceStyle: css`
    width: 100%;
    &.ant-space.ant-space-horizontal {
      flex-wrap: nowrap;
    }
    > .ant-space-item:nth-child(2) {
      flex-grow: 1;
    }
  `,
};
