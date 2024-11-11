import React, { memo, useContext, useMemo } from 'react';
import { ExpressionScope, SchemaComponentsContext, SchemaOptionsContext } from '@tachybase/schema';

import { ISchemaComponentOptionsProps } from '../types';

export const useSchemaOptionsContext = () => {
  const options = useContext(SchemaOptionsContext);
  return options || {};
};

export const SchemaComponentOptions = memo((props: ISchemaComponentOptionsProps) => {
  const { children } = props;
  const options = useSchemaOptionsContext();
  const components = useMemo(() => {
    return { ...options.components, ...props.components };
  }, [options.components, props.components]);

  const scope = useMemo(() => {
    return { ...options.scope, ...props.scope };
  }, [options.scope, props.scope]);

  const schemaOptionsContextValue = useMemo(() => {
    return { scope, components };
  }, [scope, components]);

  return (
    <SchemaOptionsContext.Provider value={schemaOptionsContextValue}>
      <SchemaComponentsContext.Provider value={components}>
        <ExpressionScope value={scope}>{children}</ExpressionScope>
      </SchemaComponentsContext.Provider>
    </SchemaOptionsContext.Provider>
  );
});

SchemaComponentOptions.displayName = 'SchemaComponentOptions';
