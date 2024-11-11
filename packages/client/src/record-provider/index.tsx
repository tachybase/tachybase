import React, { createContext, useContext } from 'react';

import { useCollection_deprecated } from '../collection-manager';
import { CollectionRecordProvider } from '../data-source';
import { useCurrentUserContext } from '../user';

export const RecordContext_deprecated = createContext({});
RecordContext_deprecated.displayName = 'RecordContext_deprecated';
export const RecordIndexContext = createContext(null);
RecordIndexContext.displayName = 'RecordIndexContext';

/**
 * @deprecated use `CollectionRecordProvider` instead
 */
export const RecordProvider = (props: {
  record: any;
  parent?: any;
  isNew?: boolean;
  collectionName?: string;
  children: React.ReactNode;
}) => {
  const { record, children, parent, isNew } = props;
  const { name: __collectionName } = useCollection_deprecated();
  const value = { ...record };
  value['__parent'] = parent;
  value['__collectionName'] = __collectionName;
  return (
    <RecordContext_deprecated.Provider value={value}>
      <CollectionRecordProvider isNew={isNew} record={record} parentRecord={parent}>
        {children}
      </CollectionRecordProvider>
    </RecordContext_deprecated.Provider>
  );
};

export const RecordSimpleProvider = (props: { value: Record<string, any>; children: React.ReactNode }) => {
  return <RecordContext_deprecated.Provider {...props} />;
};

export const RecordIndexProvider = (props: { index: any; children: React.ReactNode }) => {
  const { index, children } = props;
  return <RecordIndexContext.Provider value={index}>{children}</RecordIndexContext.Provider>;
};

/**
 * @deprecated use `useCollectionRecord` instead
 */
export function useRecord<D = any>() {
  return useContext(RecordContext_deprecated) as D;
}

export function useRecordIndex() {
  return useContext(RecordIndexContext);
}

export const useRecordIsOwn = () => {
  const record = useRecord();
  const ctx = useCurrentUserContext();
  if (!record?.createdById) {
    return false;
  }
  return record?.createdById === ctx?.data?.data?.id;
};
