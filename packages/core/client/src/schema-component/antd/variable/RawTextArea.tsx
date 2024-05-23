import React, { useRef, useState } from 'react';

import { Button, Input } from 'antd';
import { createStyles } from 'antd-style';
import { cloneDeep } from 'lodash';

import { VariableSelect } from './VariableSelect';

// NOTE: https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js/46012210#46012210
function setNativeInputValue(input, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(input.constructor.prototype, 'value')?.set;
  nativeInputValueSetter?.call(input, value);
  input.dispatchEvent(
    new Event('input', {
      bubbles: true,
    }),
  );
}

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      position: relative;
      .ant-input {
        width: 100%;
      }
    `,
    group: css`
      position: absolute;
      right: 0;
      top: 0;
      .ant-btn-sm {
        font-size: 85%;
      }
    `,
    select: css`
      &:not(:hover) {
        border-right-color: transparent;
        border-top-color: transparent;
      }
      background-color: transparent;
    `,
  };
});

export function RawTextArea(props): JSX.Element {
  const inputRef = useRef<any>(null);
  const { changeOnSelect, component: Component = Input.TextArea, ...others } = props;
  const scope = typeof props.scope === 'function' ? props.scope() : props.scope;
  const [options, setOptions] = useState(scope ? cloneDeep(scope) : []);
  const { styles } = useStyles();

  function onInsert(selected) {
    if (!inputRef.current) {
      return;
    }

    const variable = `{{${selected.join('.')}}}`;

    const { textArea } = inputRef.current.resizableTextArea;
    const nextValue =
      textArea.value.slice(0, textArea.selectionStart) + variable + textArea.value.slice(textArea.selectionEnd);
    const nextPos = [textArea.selectionStart, textArea.selectionStart + variable.length];
    setNativeInputValue(textArea, nextValue);
    textArea.setSelectionRange(...nextPos);
    textArea.focus();
  }
  return (
    <div className={styles.container}>
      <Component {...others} ref={inputRef} />
      <Button.Group className={styles.group}>
        <VariableSelect
          className={props.buttonClass ?? styles.select}
          fieldNames={props.fieldNames}
          options={options}
          setOptions={setOptions}
          onInsert={onInsert}
          changeOnSelect={changeOnSelect}
        />
      </Button.Group>
    </div>
  );
}
