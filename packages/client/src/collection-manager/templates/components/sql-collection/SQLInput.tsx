import React, { useEffect } from 'react';
import { Field, useField } from '@tachybase/schema';

import { EditOutlined, RightSquareOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { createStyles } from 'antd-style';
import { useTranslation } from 'react-i18next';

import { useAsyncData } from '../../../../async-data-provider';
import { Input } from '../../../../schema-component';

const useStyles = createStyles(({ css }) => {
  return {
    input: css`
      position: relative;
      .ant-input {
        width: 100%;
      }
    `,
  };
});

export const SQLInput = ({ disabled }) => {
  const { t } = useTranslation();
  const { run, loading, error } = useAsyncData();
  const { styles } = useStyles();
  const field = useField<Field>();
  const execute = () => {
    if (!field.value) {
      return;
    }
    run(field.value);
  };
  const toggleEditing = () => {
    if (!disabled && !field.value) {
      return;
    }
    if (!disabled) {
      run(field.value);
    }
    field.setComponentProps({
      disabled: !disabled,
    });
  };

  useEffect(() => {
    if (error) {
      field.setComponentProps({
        disabled: false,
      });
    }
  }, [field, error]);

  return (
    <div className={styles.input}>
      <Input.TextArea value={field.value} disabled={disabled} onChange={(e) => (field.value = e.target.value)} />
      <Button.Group>
        <Button onClick={toggleEditing} ghost size="small" type="primary" icon={<EditOutlined />}>
          {t(!disabled ? 'Confirm' : 'Edit')}
        </Button>
        <Button
          onClick={() => execute()}
          loading={loading}
          ghost
          size="small"
          type="primary"
          icon={<RightSquareOutlined />}
        >
          {t('Execute')}
        </Button>
      </Button.Group>
    </div>
  );
};
