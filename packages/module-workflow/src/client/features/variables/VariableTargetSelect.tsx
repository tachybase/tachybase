import React, { useCallback } from 'react';
import { Space } from '@tachybase/client';

import { Radio, Select } from 'antd';

import { lang } from '../../locale';
import { useContextNode } from '../../nodes/default-node/Node.context';
import { useAvailableUpstreams } from '../../nodes/default-node/useAvailableUpstreams';
import { useStyles } from './useStyles';

export function VariableTargetSelect({ value, onChange }) {
  const isNull = value == null;
  const node = useContextNode();
  const nodes = useAvailableUpstreams(node, (n) => n.type === 'variable' && !n.config.target);
  const { styles } = useStyles();
  const onTargetChange = useCallback(
    ({ target }) => {
      if (target.value) return onChange(null);
      nodes.length && onChange(nodes[0].key);
    },
    [onChange, nodes],
  );
  const filterOption = useCallback(
    (t, v) => v.label.toLowerCase().indexOf(t.toLowerCase()) >= 0 || `#${v.data.id}`.indexOf(t) >= 0,
    [],
  );
  return (
    <fieldset>
      <Radio.Group value={isNull} onChange={onTargetChange}>
        <Space direction="vertical">
          <Radio value={true}>{lang('Declare a new variable')}</Radio>
          <Space>
            <Radio value={false} disabled={!nodes.length}>
              {lang('Assign value to an existing variable')}
            </Radio>
            {!isNull && (
              <Select
                options={nodes.map((node) => ({ label: node.title, value: node.key, data: node }))}
                value={value}
                onChange={onChange}
                allowClear
                showSearch
                filterOption={filterOption}
                optionRender={({ label, data }) => (
                  <Space>
                    <span>{label}</span>
                    <span className={styles.nodeIdClass}>{data.data.id}</span>
                  </Space>
                )}
              />
            )}
          </Space>
        </Space>
      </Radio.Group>
    </fieldset>
  );
}
