import { Fragment, useContext, useMemo, useRef } from 'react';
import {
  BlockRequestContext_deprecated,
  CollectionProvider_deprecated,
  FormActiveFieldsProvider,
  FormBlockContext,
  FormProvider,
  FormV2,
  RecordProvider,
  useAPIClient,
  useAssociationNames,
  useCurrentUserContext,
  useDesignable,
} from '@tachybase/client';
import { createForm, RecursionField, useField, useFieldSchema } from '@tachybase/schema';

import { useContextApprovalExecution } from '../../usage/pc/block/common/ApprovalExecution.provider';
import { useContextApprovalRecords } from '../../usage/pc/block/todos-table/providers/ApprovalExecutions.provider';

export const FormBlockProvider = (props) => {
  const { formType } = props;
  const context = useContextApprovalExecution();
  const { data: currentUser } = useCurrentUserContext();
  const { userId: approvalUserId } = useContextApprovalRecords();

  const fieldSchema = useFieldSchema();
  const field = useField();
  const formBlockRef = useRef(null);
  const { getAssociationAppends } = useAssociationNames();
  const { appends, updateAssociationValues } = getAssociationAppends();
  // @ts-ignore
  const snapshot = context?.snapshot;
  const { findComponent } = useDesignable();
  const ContainerFormComp = findComponent(field.component?.[0]) || Fragment;
  const form = useMemo(() => createForm({ initialValues: snapshot }), [snapshot]);
  const params = useMemo(() => ({ ...appends, ...props.params }), [appends, props.params]);
  const service = useMemo(() => ({ loading: false, data: { data: snapshot } }), [snapshot]);
  const collectionResource = useAPIClient().resource(props.collection);
  const blockContext = useContext(BlockRequestContext_deprecated);
  const formValue = useMemo(
    () => ({
      params,
      form,
      field,
      service,
      updateAssociationValues,
      formBlockRef,
    }),
    [field, form, params, service, updateAssociationValues],
  );

  // 当更新表单时候, 不应该让除审批人外的用户看到表单更新入口
  // TODO: 区分出配置态和用户态, 暂时用 !!snapshot 来判断是否是配置态
  if (['update'].includes(formType) && currentUser?.data.id !== approvalUserId && !!snapshot) {
    return null;
  }

  return (
    <CollectionProvider_deprecated dataSource={props.dataSource} collection={props.collection}>
      {/* @ts-ignore */}
      <RecordProvider record={snapshot}>
        <FormActiveFieldsProvider name="form">
          <BlockRequestContext_deprecated.Provider
            value={{
              block: 'form',
              props: props,
              field: field,
              service: service,
              resource: collectionResource,
              __parent: blockContext,
            }}
          >
            <FormBlockContext.Provider value={formValue}>
              <ContainerFormComp {...field.componentProps}>
                <FormV2.Templates style={{ marginBottom: 18 }} form={form} />
                <FormProvider form={form}>
                  <div ref={formBlockRef}>
                    <RecursionField schema={fieldSchema} onlyRenderProperties />
                  </div>
                </FormProvider>
              </ContainerFormComp>
            </FormBlockContext.Provider>
          </BlockRequestContext_deprecated.Provider>
        </FormActiveFieldsProvider>
      </RecordProvider>
    </CollectionProvider_deprecated>
  );
};
