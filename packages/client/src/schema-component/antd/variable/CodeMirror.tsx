import React, { useState } from 'react';
import { CodeMirror as CodeMirrorComponent } from '@tachybase/components';

import { cloneDeep } from 'lodash';

import { css, useTranslation } from '../../..';
import { VariableSelect } from './VariableSelect';

export const CodeMirror = (props) => {
  const { value = '', changeOnSelect, onChange, ...others } = props;
  const scope = typeof props.scope === 'function' ? props.scope() : props.scope;
  const { t } = useTranslation();
  const [options, setOptions] = useState(scope ? cloneDeep(scope) : []);
  const [codeValue, setCodeValue] = useState(value);

  const onInsert = (selected) => {
    const variable = `{{${selected.join('.')}}}`;
    const nextValue = `${variable}\n${codeValue}`;
    setCodeValue(nextValue);
    onChange?.(nextValue);
  };

  const handleChange = (nextValue) => {
    setCodeValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <div>
      <div
        className={css`
          display: flex;
          border: dashed 1px #eee;
          flex-direction: row;
        `}
      >
        <div
          className={css`
            flex: 1;
            text-align: center;
            color: #e5e5e5;
          `}
        >
          {t('Click on the right to select variables →')}
        </div>
        <VariableSelect
          className={css``}
          options={options}
          setOptions={setOptions}
          onInsert={onInsert}
          changeOnSelect={changeOnSelect}
        />
      </div>
      <CodeMirrorComponent
        className={css`
          border: dashed 1px #eee;
        `}
        value={codeValue}
        defaultLanguage="Plain Text"
        onChange={handleChange}
        {...others}
      />
    </div>
  );
};
