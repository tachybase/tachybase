import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useField, useFieldSchema } from '@tachybase/schema';

import { RemoteSchemaComponent, useDesignable, useSchemaComponentContext } from '..';
import { useTemplateBlockContext } from '../block-provider/TemplateBlockProvider';
import { useSchemaTemplateManager } from './useSchemaTemplateManager';

const BlockTemplateContext = createContext<any>({});
BlockTemplateContext.displayName = 'BlockTemplateContext';

export const useBlockTemplateContext = () => {
  return useContext(BlockTemplateContext);
};

export const BlockTemplate = (props: any) => {
  const { templateId } = props;
  const { getTemplateById } = useSchemaTemplateManager();
  const field = useField();
  const fieldSchema = useFieldSchema();
  const { dn } = useDesignable();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const template = useMemo(() => getTemplateById(templateId), [templateId]);
  const { onTemplateSuccess } = useTemplateBlockContext();
  const { refresh } = useSchemaComponentContext();

  const onSuccess = useCallback(
    (data) => {
      fieldSchema['x-linkage-rules'] = data?.data?.['x-linkage-rules'] || [];
      fieldSchema.setProperties(data?.data?.properties);
      onTemplateSuccess?.();
      refresh();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [template],
  );

  return template ? (
    <BlockTemplateContext.Provider value={{ dn, field, fieldSchema, template }}>
      <RemoteSchemaComponent noForm uid={template?.uid} onSuccess={onSuccess} />
    </BlockTemplateContext.Provider>
  ) : null;
};
