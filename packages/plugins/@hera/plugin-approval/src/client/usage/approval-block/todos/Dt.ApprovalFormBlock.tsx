import {
  BlockRequestContext_deprecated,
  CollectionProvider_deprecated,
  FormActiveFieldsProvider,
  FormBlockContext,
  FormV2,
  RecordProvider,
  useAPIClient,
  useAssociationNames,
  useCurrentUserContext,
  useDesignable,
} from '@tachybase/client';
import { useFlowContext } from '@tachybase/plugin-workflow/client';
import { RecursionField, createForm, useField, useFieldSchema } from '@tachybase/schema';
import _ from 'lodash';
import React, { Fragment, useContext, useMemo, useRef } from 'react';
import { useContextApprovalExecutions } from './Pd.ApprovalExecutions';

export function ApprovalFormBlockDecorator(props) {
  const approvalExecutions = useContextApprovalExecutions();
  const { job } = approvalExecutions;
  const omitApproval = _.omit(approvalExecutions, ['approval', 'job', 'node', 'snapshot']);
  const { execution, workflow } = useFlowContext();
  const fieldSchema = useFieldSchema();

  const field = useField();
  const formBlockRef = useRef(null);
  const { getAssociationAppends } = useAssociationNames();
  const { appends, updateAssociationValues } = getAssociationAppends();
  const { data } = useCurrentUserContext();
  const { findComponent } = useDesignable();
  const ContainerFormComp = findComponent(field.component?.[0]) || Fragment;

  const form = useMemo(() => {
    return createForm({
      initialValues: omitApproval,
      pattern:
        !workflow?.enabled || execution?.status || job?.status || omitApproval?.status == null
          ? 'disabled'
          : omitApproval.status || data.data?.id !== omitApproval.userId
            ? 'readPretty'
            : 'editable',
    });
  }, [data.data?.id, omitApproval?.status, workflow?.enabled]);

  const params = useMemo(() => ({ appends: appends, ...props.params }), [appends, props.params]);
  const result = useMemo(() => ({ loading: false, data: { data: omitApproval } }), [omitApproval]);
  const collectionApi = useAPIClient().resource(props.collection);
  const blockRequestContext = useContext(BlockRequestContext_deprecated);

  const formValue = useMemo(
    () => ({
      params: params,
      form: form,
      field: field,
      service: result,
      updateAssociationValues: updateAssociationValues,
      formBlockRef: formBlockRef,
    }),
    [field, form, params, result, updateAssociationValues],
  );

  if (!omitApproval.status && omitApproval.userId !== data.data?.id) {
    return null;
  }

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
              service: result,
              resource: collectionApi,
              __parent: blockRequestContext,
            }}
          >
            <FormBlockContext.Provider value={formValue}>
              <ContainerFormComp {...field.componentProps}>
                <FormV2.Templates key={1} style={{ marginBottom: 18 }} form={form} />
                <div key={2} ref={formBlockRef}>
                  <RecursionField schema={fieldSchema} onlyRenderProperties={true} />
                </div>
              </ContainerFormComp>
            </FormBlockContext.Provider>
          </BlockRequestContext_deprecated.Provider>
        </FormActiveFieldsProvider>
      </RecordProvider>
    </CollectionProvider_deprecated>
  );
}
