import { useEffect, useState } from 'react';
import { css } from '@tachybase/client';

import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';

import { useTranslation } from '../locale';

function parseValue(val) {
  try {
    if (val === 'true') return true;
    if (val === 'false') return false;
    if (val === 'null') return null;
    if (!isNaN(Number(val)) && val.trim() !== '') return Number(val);
    return val;
  } catch {
    return val;
  }
}

function Calculation({ value = {}, onChange }) {
  const { t } = useTranslation();

  const [source, setSource] = useState('meta');
  const [field, setField] = useState('');
  const [operator, setOperator] = useState('$eq');
  const [val, setVal] = useState('');

  useEffect(() => {
    // 初始化
    const [sourceKey] = Object.keys(value || {});
    const nested = value?.[sourceKey];
    const [fieldKey] = nested ? Object.keys(nested) : [''];
    const operatorObj = nested?.[fieldKey] || {};
    const [operatorKey] = Object.keys(operatorObj);

    setSource(sourceKey || 'meta');
    setField(fieldKey || '');
    setOperator(operatorKey || '$eq');
    const rawVal = operatorObj?.[operatorKey];
    setVal(rawVal != null ? String(rawVal) : '');
  }, []);

  useEffect(() => {
    if (!field) return;
    const parsedValue = parseValue(val);
    const expression = {
      [source]: {
        [field]: {
          [operator]: parsedValue,
        },
      },
    };

    onChange(expression);
  }, [source, field, operator, val]);

  return (
    <fieldset
      className={css`
        display: flex;
        gap: 0.5em;
        align-items: center;
        min-width: 0;
      `}
    >
      <Select
        value={source}
        className="auto-width"
        onChange={setSource}
        options={[
          { value: 'meta', label: t('Meta') },
          { value: 'payload', label: t('Payload') },
        ]}
      />
      <Input placeholder="Field" className="auto-width" value={field} onChange={(e) => setField(e.target.value)} />
      <Select
        value={operator}
        className="auto-width"
        onChange={setOperator}
        options={[
          { value: '$eq', label: t('equals') },
          { value: '$ne', label: t('not equals') },
          { value: '$gt', label: t('greater than') },
          { value: '$gte', label: t('greater than or equal') },
          { value: '$lt', label: t('less than') },
          { value: '$lte', label: t('less than or equal') },
          { value: '$in', label: t('includes') },
          { value: '$exists', label: t('exists') },
          { value: '$null', label: t('is null') },
        ]}
      />
      {operator === '$exists' || operator === '$null' ? (
        <Select
          value={val === 'true' ? 'true' : 'false'}
          className="auto-width"
          onChange={(v) => setVal(v)}
          options={[
            { value: 'true', label: 'true' },
            { value: 'false', label: 'false' },
          ]}
        />
      ) : (
        <Input placeholder={t('Value')} className="auto-width" value={val} onChange={(e) => setVal(e.target.value)} />
      )}
    </fieldset>
  );
}

function CalculationItem({ value, onChange, onRemove }) {
  return (
    <div
      className={css`
        display: flex;
        position: relative;
        width: 100%;
        margin: 0.5em 0;
      `}
    >
      <Calculation value={value} onChange={onChange} />
      <Button aria-label="icon-close" onClick={onRemove} type="link" icon={<CloseCircleOutlined />} />
    </div>
  );
}

function CalculationGroup({ value = {}, onChange }) {
  const { t } = useTranslation();
  const entry = Object.entries(value)[0] || ['$and', []];
  const type = entry[0] as '$and' | '$or';
  const expressions = Array.isArray(entry[1]) ? entry[1] : [];

  function handleChangeType(newType) {
    onChange({ [newType]: expressions });
  }

  function onAddSingle() {
    onChange({ [type]: [...expressions, {}] });
  }

  function onRemove(i) {
    const next = [...expressions];
    next.splice(i, 1);
    onChange({ [type]: next });
  }

  function onItemChange(i, newExpr) {
    const next = [...expressions];
    next[i] = newExpr;
    onChange({ [type]: next });
  }

  return (
    <div
      className={css`
        position: relative;
        width: 100%;
      `}
    >
      <div
        className={css`
          display: flex;
          align-items: center;
          gap: 0.5em;
        `}
      >
        {t('Meet')}
        <Select
          value={type}
          onChange={handleChangeType}
          style={{ width: 'auto' }}
          options={[
            { value: '$and', label: t('All') },
            { value: '$or', label: t('Any') },
          ]}
        />
        {t('Conditions')}
      </div>

      <div
        className={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 0.5em;
        `}
      >
        {expressions.map((expr, i) => (
          <CalculationItem key={i} value={expr} onChange={(v) => onItemChange(i, v)} onRemove={() => onRemove(i)} />
        ))}
      </div>

      <div style={{ marginTop: '0.5em' }}>
        <Button type="link" onClick={onAddSingle}>
          {t('Add condition')}
        </Button>
      </div>
    </div>
  );
}

export function InstrumentationFilter({ value, onChange }) {
  const filterValues = value ?? { $and: [] };
  return <CalculationGroup value={filterValues} onChange={onChange} />;
}
