import { css, Icon, useDesignable } from '@tachybase/client';

import { Button } from 'antd';

import { useTranslation } from '../locale';
import { useStyles } from './AddStep.style';

export const AddStepDesignable = (props) => {
  const { onClick } = props;

  const { designable } = useDesignable();

  const { t } = useTranslation();

  const { styles } = useStyles();

  if (!designable) {
    return null;
  }

  return (
    <Button
      className={styles.addStep}
      type="dashed"
      icon={<Icon type="PlusOutlined" />}
      style={{ marginLeft: 24, marginTop: 12 }}
      onClick={onClick}
    >
      {t('Add Step')}
    </Button>
  );
};
