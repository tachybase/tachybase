import { useTranslation } from 'react-i18next';

import { createStyles } from '../style';

const useStyles = createStyles(({ css, token }) => {
  return {
    powerBy: css`
      text-align: center;
      color: ${token.colorTextDescription};
      a {
        color: ${token.colorTextDescription};
        &:hover {
          color: ${token.colorText};
        }
      }
    `,
  };
});

export const PoweredBy = () => {
  const { styles } = useStyles();
  const date = new Date();
  const year = date.getFullYear();
  const { t } = useTranslation();
  return <div className={styles.powerBy}>{`©2023-${year} ${t('TachyBase Team')}`}</div>;
};
