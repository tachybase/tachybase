import React from 'react';
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
  useDesignable,
} from '@nocobase/client';
import { RecursionField, createForm, useField, useFieldSchema } from '@nocobase/schema';
import { Fragment, useContext, useMemo, useRef } from 'react';
import { useContextApprovalExecution } from '../usage/approval-block/common/Pd.ApprovalExecution';

export const FormBlockProvider = (props) => {
  const context = useContextApprovalExecution();
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
