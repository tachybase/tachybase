import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  BlockProvider,
  FixedBlockWrapper,
  RecordContext_deprecated,
  RenderChildrenWithAssociationFilter,
  SchemaComponentOptions,
  TableBlockContext,
  useAPIClient,
  useRecord,
  useTableBlockParams,
  withDynamicSchemaProps,
} from '@tachybase/client';
import { createForm, FormContext, useField, useFieldSchema } from '@tachybase/schema';

import { message } from 'antd';
import { useTranslation } from 'react-i18next';

import { CurrentRolesContext } from '.';

export const SettingCenterPermissionProvider = (props) => {
  const { currentRecord } = useContext(PermissionContext);
  if (!currentRecord?.snippets?.includes('pm.*')) {
    return null;
  }
  return <div>{props.children}</div>;
};

export const PermissionContext = createContext<any>(null);
PermissionContext.displayName = 'PermissionContext';

export const PermissionProvider = (props) => {
  const api = useAPIClient();
  const record = useRecord();
  const { t } = useTranslation();
  const role = useContext(CurrentRolesContext);
  const { snippets } = role;
  snippets?.forEach((key) => {
    role[key] = true;
  });
  const [currentRecord, setCurrentRecord] = useState(role);
  useEffect(() => {
    setCurrentRecord(role);
  }, [role]);
  return (
    <PermissionContext.Provider
      value={{
        currentDataSource: record,
        currentRecord,
        update: async (field, form) => {
          await api.request({
            url: `dataSources/${record.key}/roles:update`,
            data: form.values,
            method: 'post',
            params: { filterByTk: form.values.roleName },
          });
          setCurrentRecord({ ...currentRecord, ...form.values });
          message.success(t('Saved successfully'));
        },
      }}
    >
      {props.children}
    </PermissionContext.Provider>
  );
};

export const RoleRecordProvider = (props) => {
  const role = useContext(CurrentRolesContext);
  const record = useRecord();
  return (
    <RecordContext_deprecated.Provider value={{ ...role }}>
      <SchemaComponentOptions scope={{ dataSourceKey: record.key }}>{props.children}</SchemaComponentOptions>
    </RecordContext_deprecated.Provider>
  );
};

export const RoleCollectionTableBlockProvider = withDynamicSchemaProps((props) => {
  const { showIndex, dragSort, rowKey, fieldNames, collection, service, ...others } = props;
  const field: any = useField();
  // const { role } = useContext(RolesManagerContext);
  const params = useTableBlockParams(props);
  // useEffect(() => {
  //   service.run();
  // }, [role]);
  const fieldSchema = useFieldSchema();
  const { treeTable } = fieldSchema?.['x-decorator-props'] || {};
  const [expandFlag, setExpandFlag] = useState(fieldNames ? true : false);

  let childrenColumnName = 'children';
  if (collection?.tree && treeTable !== false) {
    const f = collection.fields.find((f) => f.treeChildren);
    if (f) {
      childrenColumnName = f.name;
    }
    params['tree'] = true;
  }
  const form = useMemo(() => createForm(), [treeTable]);

  return (
    <SchemaComponentOptions scope={{ treeTable }}>
      <FormContext.Provider value={form}>
        <BlockProvider name={props.name || 'table'} {...props} params={params} runWhenParamsChanged>
          <FixedBlockWrapper>
            <TableBlockContext.Provider
              value={{
                ...others,
                field,
                service,
                params,
                showIndex,
                dragSort,
                rowKey,
                expandFlag,
                childrenColumnName,
                setExpandFlag: () => setExpandFlag(!expandFlag),
              }}
            >
              <RenderChildrenWithAssociationFilter {...props} />
            </TableBlockContext.Provider>
          </FixedBlockWrapper>
        </BlockProvider>
      </FormContext.Provider>
    </SchemaComponentOptions>
  );
});
