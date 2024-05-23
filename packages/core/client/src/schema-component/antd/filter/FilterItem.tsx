import React, { useCallback, useContext, useMemo } from 'react';
import { observer } from '@tachybase/schema';

import { CloseCircleOutlined } from '@ant-design/icons';
import { Cascader, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import { useCompile } from '../..';
import { RemoveConditionContext } from './context';
import { DynamicComponent } from './DynamicComponent';
import { useValues } from './useValues';

export const FilterItem = observer(
  (props: any) => {
    const { t } = useTranslation();
    const compile = useCompile();
    const remove = useContext(RemoveConditionContext);
    const {
      schema,
      fields,
      operators,
      dataIndex,
      operator,
      setDataIndex,
      setOperator,
      value,
      setValue,
      collectionField,
    } = useValues();
    const style = useMemo(() => ({ marginBottom: 8 }), []);
    const fieldNames = useMemo(
      () => ({
        label: 'title',
        value: 'name',
        children: 'children',
      }),
      [],
    );
    const onChange = useCallback(
      (value) => {
        setDataIndex(value);
      },
      [setDataIndex],
    );

    const onOperatorsChange = useCallback(
      (value) => {
        setOperator(value);
      },
      [setOperator],
    );

    const removeStyle = useMemo(() => ({ color: '#bfbfbf' }), []);
    return (
      // 添加 nc-filter-item 类名是为了帮助编写测试时更容易选中该元素
      <div style={style} className="nc-filter-item">
        <Space>
          <Cascader
            data-testid="select-filter-field"
            style={{ width: '160px' }}
            fieldNames={fieldNames}
            changeOnSelect={false}
            value={dataIndex}
            options={compile(fields)}
            onChange={onChange}
            placeholder={t('Select field')}
          />
          <Select
            data-testid="select-filter-operator"
            style={{ minWidth: '110px' }}
            popupMatchSelectWidth={false}
            value={operator?.value}
            options={compile(operators)}
            onChange={onOperatorsChange}
            placeholder={t('Comparision')}
          />
          {!operator?.noValue ? (
            <DynamicComponent value={value} schema={schema} collectionField={collectionField} onChange={setValue} />
          ) : null}
          {!props.disabled && (
            <a role="button" aria-label="icon-close">
              <CloseCircleOutlined onClick={remove} style={removeStyle} />
            </a>
          )}
        </Space>
      </div>
    );
  },
  { displayName: 'FilterItem' },
);
