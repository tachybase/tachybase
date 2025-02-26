import { useCallback, useEffect, useState } from 'react';
import {
  CollectionManagerProvider,
  CollectionProvider,
  List,
  useDesignable,
  withDynamicSchemaProps,
} from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

import { CommentContext } from './CommentContext';

export const CommentDecorator = withDynamicSchemaProps((props) => {
  const { dataSource, association, collection, children } = props;
  const name = `${association || collection}`;
  return (
    <ProviderCommentContext {...props}>
      <List.Decorator {...props}>
        <CollectionManagerProvider dataSource={dataSource}>
          <CollectionProvider name={name}>{children}</CollectionProvider>
        </CollectionManagerProvider>
      </List.Decorator>
    </ProviderCommentContext>
  );
});

export const ProviderCommentContext = ({ children }) => {
  const fieldSchema = useFieldSchema();
  const [createAble, setCreateAble] = useState(false);
  const { dn } = useDesignable();
  const patchSchema = useCallback(
    (params) => {
      const mergedProps = {
        ...fieldSchema['x-component-props'],
        ...params,
      };
      fieldSchema['x-component-props'] = mergedProps;

      dn.emit('patch', {
        schema: {
          'x-uid': fieldSchema['x-uid'],
          'x-component-props': fieldSchema['x-component-props'],
        },
      });

      dn.refresh();
    },
    [dn, fieldSchema],
  );

  const handleSetCreateAble = useCallback(
    (newCreateAble) => {
      patchSchema({
        createAble: newCreateAble,
      });
      setCreateAble(newCreateAble);
    },
    [setCreateAble, patchSchema],
  );

  useEffect(() => {
    const createAble = dn.current['x-component-props']?.createAble;
    setCreateAble(createAble ?? true);
  }, []);

  return (
    <CommentContext.Provider value={{ createAble, setCreateAble: handleSetCreateAble }}>
      {children}
    </CommentContext.Provider>
  );
};
