import React, { useCallback } from 'react';
import { InputNumber } from '@tachybase/client';

import { QuestionCircleOutlined } from '@ant-design/icons';
import { Radio, Tooltip } from 'antd';

import { useTranslation } from '../../../locale';
import { useStyles } from './NegotiationConfig.style';

// 协商模式
export const NegotiationConfig = ({ value, onChange }) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  const percentSign = value > 0 && value < 1 ? '%' : value;

  const onChangeRadio = useCallback(
    ({ target }) => {
      if (target.value !== percentSign) {
        onChange(target.value === '%' ? 0.5 : target.value);
      }
    },
    [percentSign, onChange],
  );
  const onChangeInput = useCallback(
    (val) => {
      onChange(val / 100);
    },
    [onChange],
  );

  return (
    <fieldset className={styles.container}>
      <Radio.Group key="radio" value={percentSign} onChange={onChangeRadio}>
        <Radio key="0" value="0">
          <Tooltip title={t('The approval or rejection by anyone of them is the result.')} placement="bottom">
            <span>{t('Or')}</span>
            <QuestionCircleOutlined style={{ color: '#999' }} />
          </Tooltip>
        </Radio>
        <Radio key="1" value="1">
          <Tooltip
            title={t("If it's approved by all, it's approved. If it's rejected by anyone, it's rejected.")}
            placement="bottom"
          >
            <span>{t('And')}</span>
            <QuestionCircleOutlined style={{ color: '#999' }} />
          </Tooltip>
        </Radio>
        <Radio key="%" value="%">
          <Tooltip
            title={t('Approved if the approval rate is greater than the set percentage, otherwise rejected.')}
            placement="bottom"
          >
            <span>{t('Voting')}</span>
            <QuestionCircleOutlined style={{ color: '#999' }} />
          </Tooltip>
        </Radio>
      </Radio.Group>
      {percentSign === '%' ? (
        <InputNumber
          addonBefore=">"
          min="1"
          max="99"
          defaultValue="50"
          value={value * 100}
          onChange={onChangeInput}
          addonAfter="%"
        />
      ) : null}
    </fieldset>
  );
};
