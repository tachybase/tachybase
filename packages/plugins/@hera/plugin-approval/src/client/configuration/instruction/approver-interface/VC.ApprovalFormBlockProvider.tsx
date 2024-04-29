import {
  BlockRequestContext_deprecated,
  CollectionProvider_deprecated,
  FormActiveFieldsProvider,
  FormBlockContext,
  FormV2,
  RecordProvider,
  useAPIClient,
  useAssociationNames,
  useDesignable,
} from '@nocobase/client';
import { RecursionField, createForm, useField, useFieldSchema } from '@tachybase/schema';
import React, { Fragment, useContext, useMemo, useRef } from 'react';

export const ApprovalFormBlockProvider = (props) => {
  const fieldSchema = useFieldSchema();
  const field = useField();
  const formBlockRef = useRef(null);
  const { getAssociationAppends } = useAssociationNames();
  const { appends, updateAssociationValues } = getAssociationAppends();
  const { findComponent } = useDesignable();
  const ContainerFormComp = findComponent(field.component?.[0]) || Fragment;
  const form = useMemo(() => createForm({}), []);
  const params = useMemo(() => ({ ...appends, ...props.params }), [appends, props.params]);
  const service = useMemo(() => ({ loading: false, data: { data: {} } }), []);
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
    <CollectionProvider_deprecated collection={props.collection}>
      {/* @ts-ignore */}
      <RecordProvider record={{}}>
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
                <div ref={formBlockRef}>
                  <RecursionField schema={fieldSchema} onlyRenderProperties={true} />
                </div>
              </ContainerFormComp>
            </FormBlockContext.Provider>
          </BlockRequestContext_deprecated.Provider>
        </FormActiveFieldsProvider>
      </RecordProvider>
    </CollectionProvider_deprecated>
  );
};
