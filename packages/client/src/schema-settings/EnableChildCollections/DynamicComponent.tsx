import React, { useEffect, useMemo } from 'react';
import { observer, useFieldSchema } from '@tachybase/schema';

import { createStyles } from 'antd-style';

import { useCompile } from '../../schema-component';
import { Variable } from '.././../schema-component';
import { useCurrentFormVariable } from '../VariableInput/hooks/useFormVariable';
import { useCurrentObjectVariable } from '../VariableInput/hooks/useIterationVariable';

const useStyles = createStyles(({ css }) => {
  return {
    variableInput: css`
      min-width: 400px;
      margin-right: 15;
      .ant-input {
        width: 100% !important;
      }
    `,
  };
});

export const ChildDynamicComponent = observer(
  (props: { rootCollection: string; onChange; value; default; collectionField }) => {
    const { styles } = useStyles();
    const { rootCollection, onChange, value, collectionField } = props;
    const fieldSchema = useFieldSchema();
    const { currentFormSettings } = useCurrentFormVariable({
      collectionName: rootCollection,
      collectionField,
    });
    const { currentObjectSettings } = useCurrentObjectVariable({
      schema: collectionField?.uiSchema,
      collectionField,
    });

    const compile = useCompile();
    const result = useMemo(
      () => [currentFormSettings, currentObjectSettings].filter(Boolean),
      [currentFormSettings, currentObjectSettings],
    );
    const scope = compile(result);
    useEffect(() => {
      onChange(fieldSchema.default);
    }, []);
    return <Variable.Input value={value} onChange={onChange} scope={scope} className={styles.variableInput} />;
  },
  { displayName: 'ChildDynamicComponent' },
);
