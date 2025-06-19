import React, { useMemo } from 'react';
import { connect, mapReadPretty } from '@tachybase/schema';

import { useGlobalVariable } from '../../../application/hooks/useGlobalVariable';
import { Input } from '../input';
import { Password } from '../password';
import { RawTextArea } from './RawTextArea';
import { TextArea } from './TextArea';
import { Variable } from './Variable';

export const useEnvironmentVariableOptions = (scope) => {
  const environmentVariables = useGlobalVariable('$env');
  return useMemo(() => {
    if (environmentVariables) {
      return [environmentVariables].filter(Boolean);
    }
    return scope;
  }, [environmentVariables, scope]);
};

const isVariable = (value) => {
  const regex = /{{.*?}}/;
  return regex.test(value);
};
interface TextAreaWithGlobalScopeProps {
  supportsLineBreak?: boolean;
  password?: boolean;
  number?: boolean;
  boolean?: boolean;
  value?: any;
  scope?: string | object;
  [key: string]: any;
}

export const TextAreaWithGlobalScope = connect((props: TextAreaWithGlobalScopeProps) => {
  const { supportsLineBreak, password, number, boolean, ...others } = props;
  const scope = useEnvironmentVariableOptions(props.scope);
  const fieldNames = { value: 'name', label: 'title' };

  if (supportsLineBreak) {
    return <RawTextArea {...others} scope={scope} fieldNames={fieldNames} rows={3} />;
  }
  if (number) {
    return <Variable.Input {...props} scope={scope} fieldNames={fieldNames} />;
  }
  if (password && props.value && !isVariable(props.value)) {
    return <Password {...others} autoFocus />;
  }
  if (boolean) {
    return <Variable.Input {...props} scope={scope} fieldNames={fieldNames} />;
  }
  return <TextArea {...others} scope={scope} fieldNames={fieldNames} />;
}, mapReadPretty(Input.ReadPretty));
