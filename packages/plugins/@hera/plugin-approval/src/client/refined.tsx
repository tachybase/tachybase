import React  from 'react';
import { AuditOutlined, DownOutlined, PlusOutlined, QuestionCircleOutlined, TableOutlined } from '@ant-design/icons';
import { ArrayItems } from '@formily/antd-v5';
import {
  ActionBarProvider,
  i18n,
  ActionContextProvider,
  ActionInitializer,
  BlockRequestContext_deprecated,
  CollectionProvider_deprecated,
  DatePicker,
  ExtendCollectionsProvider,
  FormActiveFieldsProvider,
  FormBlockContext,
  FormProvider,
  FormV2,
  InitializerWithSwitch,
  InputNumber,
  InputReadPretty,
  List,
  RecordProvider,
  RemoteSchemaComponent,
  RemoteSelect,
  SchemaComponent,
  SchemaComponentContext,
  SchemaComponentProvider,
  SchemaInitializerItem,
  TableBlockProvider,
  Variable,
  createFormBlockSchema,
  createReadPrettyFormBlockSchema,
  createStyles,
  css,
  joinCollectionName,
  parseCollectionName,
  useAPIClient,
  useActionContext,
  useAssociationNames,
  useBlockRequestContext,
  useCollectionFilterOptions,
  useCollection_deprecated,
  useCompile,
  useCurrentUserContext,
  useDesignable,
  useFormBlockContext,
  useFormBlockProps,
  usePlugin,
  useRecord,
  useRecordCollectionDataSourceItems,
  useRequest,
  useSchemaComponentContext,
  useSchemaInitializer,
  useSchemaInitializerItem,
  useSchemaTemplateManager,
  useToken,
} from '@nocobase/client';
import PluginWorkflow, {
  Branch,
  DetailsBlockProvider,
  EXECUTION_STATUS,
  ExecutionContextProvider,
  FilterDynamicComponent,
  FlowContext,
  JOB_STATUS,
  NodeDefaultView,
  SimpleDesigner,
  useAvailableUpstreams,
  useFlowContext,
  useNodeContext,
  useStyles,
  useWorkflowExecuted,
  useWorkflowVariableOptions,
} from '@nocobase/plugin-workflow/client';
import { RecursionField, createForm, observer, useField, useFieldSchema, useForm } from '@nocobase/schema';
import { str2moment, uid } from '@nocobase/utils/client';
import { Button, Dropdown, Popover, Progress, Radio, Result, Space, Spin, Table, Tag, Tooltip } from 'antd';
import lodash from 'lodash';
import { Fragment, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { usePluginTranslation, NAMESPACE } from '../locale';

export function useTranslation(key: string, t = {}) {
  return i18n.t(key, w(x({}, t), { ns: NAMESPACE }));
}

var ut = Object.defineProperty,
  mt = Object.defineProperties;
var vt = Object.getOwnPropertyDescriptors;
var Z = Object.getOwnPropertySymbols;
var $e = Object.prototype.hasOwnProperty,
  Ne = Object.prototype.propertyIsEnumerable;
export var ce = (f, o, p) => (o in f ? ut(f, o, { enumerable: !0, configurable: !0, writable: !0, value: p }) : (f[o] = p)),
  x = (f, o) => {
    for (var p in o || (o = {})) $e.call(o, p) && ce(f, p, o[p]);
    if (Z) for (var p of Z(o)) Ne.call(o, p) && ce(f, p, o[p]);
    return f;
  },
  w = (f, o) => mt(f, vt(o));
var V = (f, o) => {
  var p = {};
  for (var r in f) $e.call(f, r) && o.indexOf(r) < 0 && (p[r] = f[r]);
  if (f != null && Z) for (var r of Z(f)) o.indexOf(r) < 0 && Ne.call(f, r) && (p[r] = f[r]);
  return p;
};
export var T = (f, o, p) => (ce(f, typeof o != 'symbol' ? o + '' : o, p), p);
var E = (f, o, p) =>
  new Promise((r, G) => {
    var u = ($) => {
        try {
          A(p.next($));
        } catch (U) {
          G(U);
        }
      },
      y = ($) => {
        try {
          A(p.throw($));
        } catch (U) {
          G(U);
        }
      },
      A = ($) => ($.done ? r($.value) : Promise.resolve($.value).then(u, y));
    A((p = p.apply(f, o)).next());
  });
export const Ve = {
    type: 'void',
    name: 'initiations',
    properties: {
      actions: {
        type: 'void',
        'x-component': 'ActionBar',
        'x-component-props': { style: { marginBottom: 16 } },
        properties: {
          filter: {
            type: 'void',
            title: '{{ t("Filter") }}',
            'x-action': 'filter',
            'x-designer': 'Filter.Action.Designer',
            'x-component': 'Filter.Action',
            'x-use-component-props': 'useFilterActionProps',
            'x-component-props': { icon: 'FilterOutlined' },
            'x-align': 'left',
          },
          refresher: {
            type: 'void',
            title: '{{ t("Refresh") }}',
            'x-action': 'refresh',
            'x-component': 'Action',
            'x-use-component-props': 'useRefreshActionProps',
            'x-designer': 'Action.Designer',
            'x-component-props': { icon: 'ReloadOutlined' },
            'x-align': 'right',
          },
          apply: {
            type: 'void',
            title: `{{t("Apply new", { ns: "${NAMESPACE}" })}}`,
            'x-component': 'ApplyButton',
            'x-align': 'right',
          },
        },
      },
      table: {
        type: 'array',
        'x-component': 'TableV2',
        'x-use-component-props': 'useTableBlockProps',
        'x-component-props': { rowKey: 'id', tableLayout: 'fixed' },
        properties: {
          action: {
            type: 'void',
            'x-decorator': 'TableV2.Column.Decorator',
            'x-component': 'TableV2.Column',
            'x-component-props': { width: 60 },
            title: '{{t("Actions")}}',
            properties: { action: { 'x-component': 'ApprovalBlock.ViewAction' } },
          },
          id: {
            type: 'void',
            'x-decorator': 'TableV2.Column.Decorator',
            'x-component': 'TableV2.Column',
            'x-component-props': { width: 80 },
            title: '{{t("ID")}}',
            properties: { id: { type: 'number', 'x-component': 'Input', 'x-read-pretty': !0 } },
          },
          workflow: {
            type: 'void',
            'x-decorator': 'TableV2.Column.Decorator',
            'x-component': 'TableV2.Column',
            'x-component-props': { width: null },
            title: '{{t("Workflow", { ns: "workflow" })}}',
            properties: { workflow: { 'x-component': 'WorkflowColumn', 'x-read-pretty': !0 } },
          },
          status: {
            type: 'void',
            'x-decorator': 'TableV2.Column.Decorator',
            'x-component': 'TableV2.Column',
            'x-component-props': { width: 100 },
            title: '{{t("Status", { ns: "workflow" })}}',
            properties: { status: { 'x-component': 'CollectionField', 'x-read-pretty': !0 } },
          },
          createdBy: {
            type: 'void',
            'x-decorator': 'TableV2.Column.Decorator',
            'x-component': 'TableV2.Column',
            'x-component-props': { width: 140 },
            title: `{{t("Initiator", { ns: "${NAMESPACE}" })}}`,
            properties: { createdBy: { 'x-component': 'UserColumn', 'x-read-pretty': !0 } },
          },
          createdAt: {
            type: 'void',
            'x-decorator': 'TableV2.Column.Decorator',
            'x-component': 'TableV2.Column',
            'x-component-props': { width: 160 },
            properties: { createdAt: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': !0 } },
          },
        },
      },
    },
  },
  Oe = {
    type: 'void',
    name: 'todos',
    properties: {
      actions: {
        type: 'void',
        'x-component': 'ActionBar',
        'x-component-props': { style: { marginBottom: 16 } },
        properties: {
          filter: {
            type: 'void',
            title: '{{ t("Filter") }}',
            'x-action': 'filter',
            'x-designer': 'Filter.Action.Designer',
            'x-component': 'Filter.Action',
            'x-use-component-props': 'useFilterActionProps',
            'x-component-props': { icon: 'FilterOutlined' },
            'x-align': 'left',
          },
          refresher: {
            type: 'void',
            title: '{{ t("Refresh") }}',
            'x-action': 'refresh',
            'x-component': 'Action',
            'x-use-component-props': 'useRefreshActionProps',
            'x-designer': 'Action.Designer',
            'x-component-props': { icon: 'ReloadOutlined' },
            'x-align': 'right',
          },
        },
      },
      table: {
        type: 'array',
        'x-component': 'TableV2',
        'x-use-component-props': 'useTableBlockProps',
        'x-component-props': { rowKey: 'id', tableLayout: 'fixed' },
        properties: {
          action: {
            type: 'void',
            'x-decorator': 'TableV2.Column.Decorator',
            'x-component': 'TableV2.Column',
            'x-component-props': { width: 60 },
            title: '{{t("Actions")}}',
            properties: { action: { 'x-component': 'ApprovalBlock.AssigneeViewAction' } },
          },
          approvalId: {
            type: 'void',
            'x-decorator': 'TableV2.Column.Decorator',
            'x-component': 'TableV2.Column',
            'x-component-props': { width: 80 },
            title: '{{t("ID")}}',
            properties: { approvalId: { type: 'number', 'x-component': 'Input', 'x-read-pretty': !0 } },
          },
          node: {
            type: 'void',
            'x-decorator': 'TableV2.Column.Decorator',
            'x-component': 'TableV2.Column',
            'x-component-props': { width: null },
            title: `{{t("Task node", { ns: "${NAMESPACE}" })}}`,
            properties: { node: { 'x-component': 'NodeColumn', 'x-read-pretty': !0 } },
          },
          workflow: {
            type: 'void',
            'x-decorator': 'TableV2.Column.Decorator',
            'x-component': 'TableV2.Column',
            'x-component-props': { width: null },
            title: '{{t("Workflow", { ns: "workflow" })}}',
            properties: { workflow: { 'x-component': 'WorkflowColumn', 'x-read-pretty': !0 } },
          },
          status: {
            type: 'void',
            'x-decorator': 'TableV2.Column.Decorator',
            'x-component': 'TableV2.Column',
            'x-component-props': { width: 100 },
            title: '{{t("Status", { ns: "workflow" })}}',
            properties: { status: { 'x-component': 'ApprovalRecordStatusColumn', 'x-read-pretty': !0 } },
          },
          user: {
            type: 'void',
            'x-decorator': 'TableV2.Column.Decorator',
            'x-component': 'TableV2.Column',
            'x-component-props': { width: 140 },
            title: `{{t("Assignee", { ns: "${NAMESPACE}" })}}`,
            properties: { user: { 'x-component': 'UserColumn', 'x-read-pretty': !0 } },
          },
          createdAt: {
            type: 'void',
            'x-decorator': 'TableV2.Column.Decorator',
            'x-component': 'TableV2.Column',
            'x-component-props': { width: 160 },
            properties: { createdAt: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': !0 } },
          },
        },
      },
    },
  },
  I = { DRAFT: 0, RETURNED: 1, SUBMITTED: 2, PROCESSING: 3, APPROVED: 4, REJECTED: -1 },
  pe = [
    { value: I.DRAFT, label: `{{t("Draft", { ns: "${NAMESPACE}" })}}`, editable: !0 },
    { value: I.RETURNED, label: `{{t("Returned", { ns: "${NAMESPACE}" })}}`, color: 'purple', editable: !0 },
    { value: I.SUBMITTED, label: `{{t("Submitted", { ns: "${NAMESPACE}" })}}`, color: 'cyan' },
    { value: I.PROCESSING, label: `{{t("Processing", { ns: "${NAMESPACE}" })}}`, color: 'gold' },
    { value: I.APPROVED, label: `{{t("Approved", { ns: "${NAMESPACE}" })}}`, color: 'green' },
    { value: I.REJECTED, label: `{{t("Rejected", { ns: "${NAMESPACE}" })}}`, color: 'red' },
  ],
  de = pe.reduce((e, t) => Object.assign(e, { [t.value]: t }), {}),
  b = { ASSIGNED: null, PENDING: 0, RETURNED: 1, APPROVED: 2, REJECTED: -1, CANCELED: -2, WITHDRAWN: -3 },
  ue = [
    { value: b.ASSIGNED, label: `{{t("Assigned", { ns: "${NAMESPACE}" })}}`, color: 'blue' },
    { value: b.PENDING, label: `{{t("Pending", { ns: "${NAMESPACE}" })}}`, color: 'gold' },
    { value: b.RETURNED, label: `{{t("Returned", { ns: "${NAMESPACE}" })}}`, color: 'purple' },
    { value: b.APPROVED, label: `{{t("Approved", { ns: "${NAMESPACE}" })}}`, color: 'green' },
    { value: b.REJECTED, label: `{{t("Rejected", { ns: "${NAMESPACE}" })}}`, color: 'red' },
    { value: b.WITHDRAWN, label: `{{t("Withdrawn", { ns: "${NAMESPACE}" })}}` },
  ],
  _ = ue.reduce((e, t) => Object.assign(e, { [t.value]: t }), {}),
  q = { SINGLE: Symbol('single'), ALL: Symbol('all'), VOTE: Symbol('vote') },
  ze = [
    { value: q.SINGLE, label: `{{t("Or", { ns: "${NAMESPACE}" })}}` },
    { value: q.ALL, label: `{{t("And", { ns: "${NAMESPACE}" })}}` },
    {
      value: q.VOTE,
      label(e) {
        return `${useTranslation('Voting')} ( > ${(e * 100).toFixed(0)}%)`;
      },
    },
  ].reduce((e, t) => Object.assign(e, { [t.value]: t }), {});
function Me(e) {
  switch (!0) {
    case e === 1:
      return q.ALL;
    case 0 < e && e < 1:
      return q.VOTE;
    default:
      return q.SINGLE;
  }
}
const H = createContext({});
function z() {
  return useContext(H);
}
const ee = createContext({});
function oe() {
  return useContext(ee);
}
function Ue(n) {
  var a = n,
    { useData: e = useRecord } = a,
    t = V(a, ['useData']);
  const s = e();
  return <H.Provider value={s}>{t.children}</H.Provider>;
}
const me = observer(
    () => {
      var t, n, a;
      const e = useField();
      return (a = (t = e == null ? void 0 : e.value) == null ? void 0 : t.title) != null
        ? a
        : `#${(n = e.value) == null ? void 0 : n.id}`;
    },
    { displayName: 'NodeColumn' },
  ),
  te = observer(
    () => {
      var n, a, s, i;
      const e = useField(),
        t =
          (s = (n = e == null ? void 0 : e.value) == null ? void 0 : n.title) != null
            ? s
            : `#${(a = e.value) == null ? void 0 : a.id}`;
      return (i = e == null ? void 0 : e.value) != null && i.enabled
        ? t
        : <span
        className={css`
          text-decoration: line-through;
        `}
        title={useTranslation('Disabled')}>{t}</span>;
    },
    { displayName: 'WorkflowColumn' },
  ),
  re = observer(
    () => {
      var t, n, a;
      const e = useField();
      return (a = (t = e == null ? void 0 : e.value) == null ? void 0 : t.nickname) != null
        ? a
        : (n = e.value) == null
          ? void 0
          : n.id;
    },
    { displayName: 'UserColumn' },
  );
function ve(a) {
  var s = a,
    { value: e, record: t } = s,
    n = V(s, ['value', 'record']);
  const i = useCompile(),
    { option: v = _[e] } = n,
    { workflow: l, execution: d, job: m } = t != null ? t : {};
  return (!(l != null && l.enabled) || (d != null && d.stauts) || (m != null && m.status)) &&
    [b.ASSIGNED, b.PENDING].includes(e)
    ? <Tag>{useTranslation('Unprocessed')}</Tag>
    : <Tag color={v.color}>{i(v.label)}</Tag>;
}
const xe = observer(
  () => {
    const { value: e } = useField(),
      t = useRecord();
    return <ve value={e} record={t} />;
  },
  { displayName: 'ApprovalRecordStatusColumn' },
);
function fe({ designable: e, children: t }) {
  const n = useSchemaComponentContext();
  return <SchemaComponentContext.Provider value={w(x({}, n), { designable: e })}>{t}</SchemaComponentContext.Provider>;
}
function ne(e) {
  var F;
  const t = oe(),
    n = useFieldSchema(),
    a = useField(),
    s = useRef(null),
    { getAssociationAppends: i } = useAssociationNames(),
    { appends: v, updateAssociationValues: l } = i(),
    d = t == null ? void 0 : t.snapshot,
    { findComponent: m } = useDesignable(),
    h = m((F = a.component) == null ? void 0 : F[0]) || Fragment,
    C = useMemo(() => createForm({ initialValues: d }), [d]),
    g = useMemo(() => x({ appends: v }, e.params), [v, e.params]),
    S = useMemo(() => ({ loading: !1, data: { data: d } }), [d]),
    P = useAPIClient().resource(e.collection),
    D = useContext(BlockRequestContext_deprecated),
    M = useMemo(
      () => ({ params: g, form: C, field: a, service: S, updateAssociationValues: l, formBlockRef: s }),
      [a, C, g, S, l],
    );
  return (
    <CollectionProvider_deprecated dataSource={e.dataSource} collection={e.collection}>{<RecordProvider record={d}>{<FormActiveFieldsProvider name="form">{<BlockRequestContext_deprecated.Provider
            value={{ block: 'form', props: e, field: a, service: S, resource: P, __parent: D }}>{<FormBlockContext.Provider value={M}>{_jsxs(
                h,
                w(x({}, a.componentProps), {
                  children: [
                    <FormV2.Templates style={{ marginBottom: 18 }} form={C} />,
                    <FormProvider form={C}>{<div ref={s}>{<RecursionField schema={n} onlyRenderProperties={!0} />}</div>}</FormProvider>,
                  ],
                }),
              )}</FormBlockContext.Provider>}</BlockRequestContext_deprecated.Provider>}</FormActiveFieldsProvider>}</RecordProvider>}</CollectionProvider_deprecated>
  );
}
function je() {
  const e = useField(),
    t = useAPIClient(),
    n = useForm(),
    a = L(),
    { status: s } = useContext(he),
    { setVisible: i, setSubmitted: v } = useActionContext();
  return {
    run() {
      return E(this, null, function* () {
        var d;
        try {
          if (n.values.status) return;
          yield n.submit(),
            (e.data = (d = e.data) != null ? d : {}),
            (e.data.loading = !0),
            yield t.resource('approvalRecords').submit({ filterByTk: a.id, values: w(x({}, n.values), { status: s }) }),
            (e.data.loading = !1),
            yield n.reset(),
            v(!0),
            i(!1);
        } catch (m) {
          console.error(m), e.data && (e.data.loading = !1);
        }
      });
    },
  };
}
function _e() {
  const { snapshot: e } = L(),
    { form: t } = useFormBlockContext();
  return (
    useEffect(() => {
      t.setValues(x({}, e));
    }, [t, e]),
    { form: t }
  );
}
function qe() {
  const { form: e } = useFormBlockContext();
  return { form: e };
}
function Le() {
  const e = useCompile(),
    { status: t, updatedAt: n, user: a } = L(),
    s = _[t];
  return (
    <Space>{[
        <Tag color={s.color}>{e(s.label)}</Tag>,
        <time>{str2moment(n).format('YYYY-MM-DD HH:mm:ss')}</time>,
        <Tag>{a.nickname}</Tag>,
      ]}</Space>
  );
}
function Ge(e) {
  const { status: t } = L();
  return t ? <Le /> : _jsx(ActionBarProvider, x({}, e));
}
const he = createContext({});
function Je(n) {
  var a = n,
    { children: e } = a,
    t = V(a, ['children']);
  const { status: s } = L();
  return (!s || s === t.status) && <he.Provider value={t}>{e}</he.Provider>;
}
const ye = createContext({});
function L() {
  return useContext(ye);
}
function Ke(e) {
  var Be, De, Ee;
  const Pe = L(),
    { approval: t, job: n, node: a, snapshot: s } = Pe,
    i = V(Pe, ['approval', 'job', 'node', 'snapshot']),
    { execution: v, workflow: l } = useFlowContext(),
    d = useFieldSchema(),
    m = useField(),
    h = useRef(null),
    { getAssociationAppends: C } = useAssociationNames(),
    { appends: g, updateAssociationValues: S } = C(),
    { data: B } = useCurrentUserContext(),
    { findComponent: P } = useDesignable(),
    D = P((Be = m.component) == null ? void 0 : Be[0]) || Fragment,
    M = useMemo(() => {
      var Fe;
      return createForm({
        initialValues: i,
        pattern:
          !l.enabled || v.status || n.status || i.status == null
            ? 'disabled'
            : i.status || ((Fe = B.data) == null ? void 0 : Fe.id) !== i.userId
              ? 'readPretty'
              : 'editable',
      });
    }, [(De = B.data) == null ? void 0 : De.id, i.status, l.enabled]),
    F = useMemo(() => x({ appends: g }, e.params), [g, e.params]),
    W = useMemo(() => ({ loading: !1, data: { data: i } }), [i]),
    Q = useAPIClient().resource(e.collection),
    pt = useContext(BlockRequestContext_deprecated),
    dt = useMemo(
      () => ({ params: F, form: M, field: m, service: W, updateAssociationValues: S, formBlockRef: h }),
      [m, M, F, W, S],
    );
  return !i.status && ((Ee = B.data) == null ? void 0 : Ee.id) !== i.userId
    ? null
    : <CollectionProvider_deprecated collection={e.collection}>{<RecordProvider record={{}}>{<FormActiveFieldsProvider name="form">{<BlockRequestContext_deprecated.Provider
          value={{ block: 'form', props: e, field: m, service: W, resource: Q, __parent: pt }}>{<FormBlockContext.Provider value={dt}>{_jsxs(
              D,
              w(x({}, m.componentProps), {
                children: [
                  <FormV2.Templates style={{ marginBottom: 18 }} form={M} />,
                  <div ref={h}>{<RecursionField schema={d} onlyRenderProperties={!0} />}</div>,
                ],
              }),
            )}</FormBlockContext.Provider>}</BlockRequestContext_deprecated.Provider>}</FormActiveFieldsProvider>}</RecordProvider>}</CollectionProvider_deprecated>;
}
function We() {
  const { id: e } = useRecord(),
    { actionEnabled: t } = useContext(J),
    { loading: n, data: a } = useRequest(
      {
        resource: 'approvalRecords',
        action: 'get',
        params: {
          filterByTk: e,
          appends: [
            'approvalExecution',
            'node',
            'job',
            'workflow',
            'workflow.nodes',
            'execution',
            'execution.jobs',
            'user',
            'approval',
            'approval.createdBy',
            'approval.approvalExecutions',
            'approval.createdBy.nickname',
            'approval.records',
            'approval.records.node.title',
            'approval.records.node.config',
            'approval.records.job',
            'approval.records.user.nickname',
          ],
          except: [
            'approval.data',
            'approval.approvalExecutions.snapshot',
            'approval.records.snapshot',
            'workflow.config',
            'workflow.options',
            'nodes.config',
          ],
          sort: ['-createdAt'],
        },
      },
      { refreshDeps: [e] },
    );
  if (n) return <Spin />;
  if (!(a != null && a.data))
    return (
      <Result
        status="error"
        title={useTranslation('Submission may be withdrawn, please try refresh the list.')} />
    );
  const h = a.data,
    { approvalExecution: s, node: i, approval: v, workflow: C } = h,
    g = C,
    { nodes: l } = g,
    d = V(g, ['nodes']),
    { execution: m } = h;
  return (
    <ExecutionContextProvider workflow={d} nodes={l} execution={m}>{<H.Provider value={v}>{<ee.Provider value={s}>{<ye.Provider value={a.data}>{<SchemaComponent
              components={{
                SchemaComponentProvider: SchemaComponentProvider,
                RemoteSchemaComponent: RemoteSchemaComponent,
                SchemaComponentContextProvider: fe,
                FormBlockProvider: ne,
                ActionBarProvider: Ge,
                ApprovalActionProvider: Je,
                ApprovalFormBlockProvider: Ke,
                DetailsBlockProvider: DetailsBlockProvider,
              }}
              scope={{
                useApprovalDetailBlockProps: _e,
                useApprovalFormBlockProps: qe,
                useDetailsBlockProps: useFormBlockContext,
                useSubmit: je,
              }}
              schema={{
                name: `content-${e}`,
                type: 'void',
                'x-component': 'Tabs',
                properties: x(
                  {
                    detail: {
                      type: 'void',
                      title: `{{t('Approval', { ns: '${NAMESPACE}' })}}`,
                      'x-component': 'Tabs.TabPane',
                      properties: {
                        detail: {
                          type: 'void',
                          'x-decorator': 'SchemaComponentContextProvider',
                          'x-decorator-props': { designable: !1 },
                          'x-component': 'RemoteSchemaComponent',
                          'x-component-props': { uid: i == null ? void 0 : i.config.applyDetail, noForm: !0 },
                        },
                      },
                    },
                  },
                  t
                    ? {}
                    : {
                        history: {
                          type: 'void',
                          title: `{{t('Approval process', { ns: '${NAMESPACE}' })}}`,
                          'x-component': 'Tabs.TabPane',
                          properties: {
                            history: {
                              type: 'void',
                              'x-decorator': 'CardItem',
                              'x-component': 'ApprovalBlock.ApprovalProcess',
                            },
                          },
                        },
                      },
                ),
              }} />}</ye.Provider>}</ee.Provider>}</H.Provider>}</ExecutionContextProvider>
  );
}
function Ae({ popoverComponent: e = 'Action.Drawer', popoverComponentProps: t = {} }) {
  const n = useRecord();
  return (
    <SchemaComponent
      components={{ AssigneeViewActionContent: We }}
      schema={{
        name: `assignee-view-${n.id}`,
        type: 'void',
        'x-component': 'Action.Link',
        title: '{{t("View")}}',
        properties: {
          drawer: {
            type: 'void',
            'x-component': e,
            'x-component-props': x({ className: 'nb-action-popup' }, t),
            properties: { content: { type: 'void', 'x-component': 'AssigneeViewActionContent' } },
          },
        },
      }} />
  );
}
function Qe() {
  const e = z(),
    t = oe(),
    { workflow: n } = useFlowContext(),
    a = useForm(),
    { data: s } = useCurrentUserContext();
  return (
    useEffect(() => {
      if (!e) return;
      const { editable: i } = de[e.status];
      a.setPattern(
        i && e.latestExecutionId === t.id && e.createdById === (s == null ? void 0 : s.data.id) && n.enabled
          ? 'editable'
          : 'readPretty',
      );
    }, [a, e, s]),
    { form: a }
  );
}
function He() {
  const e = useForm(),
    t = useField(),
    { setVisible: n, setSubmitted: a } = useActionContext(),
    { id: s } = z(),
    { workflow: i } = useFlowContext(),
    v = useContext(Ce),
    l = useAPIClient();
  return {
    run() {
      return E(this, null, function* () {
        try {
          yield e.submit(),
            (t.data = t.data || {}),
            (t.data.loading = !0),
            yield l
              .resource('approvals')
              .update({ filterByTk: s, values: { collectionName: i.config.collection, data: e.values, status: v } }),
            a(!0),
            n(!1),
            yield e.reset(),
            (t.data.loading = !1);
        } catch (m) {
          t.data && (t.data.loading = !1);
        }
      });
    },
  };
}
function Ye() {
  const e = useField(),
    { setVisible: t, setSubmitted: n } = useActionContext(),
    a = z(),
    s = useAPIClient();
  return {
    run() {
      return E(this, null, function* () {
        try {
          (e.data = e.data || {}),
            (e.data.loading = !0),
            yield s.resource('approvals').withdraw({ filterByTk: a.id }),
            n(!0),
            t(!1),
            (e.data.loading = !1);
        } catch (v) {
          e.data && (e.data.loading = !1);
        }
      });
    },
  };
}
function Xe() {
  const e = useField(),
    { setVisible: t, setSubmitted: n } = useActionContext(),
    a = z(),
    s = useAPIClient();
  return {
    run() {
      return E(this, null, function* () {
        try {
          (e.data = e.data || {}),
            (e.data.loading = !0),
            yield s.resource('approvals').destroy({ filterByTk: a.id }),
            n(!0),
            t(!1);
        } catch (v) {
          e.data && (e.data.loading = !1);
        }
      });
    },
  };
}
function Ze(e) {
  const { data: t } = useCurrentUserContext(),
    { status: n, createdById: a, latestExecutionId: s } = z(),
    i = oe();
  return t.data.id === a && s === i.id && [I.DRAFT, I.RETURNED, I.SUBMITTED].includes(n) ? e.children : null;
}
const Ce = createContext(I.SUBMITTED);
function Re(e) {
  const { status: t, createdById: n } = z(),
    { workflow: a } = useFlowContext(),
    { data: s } = useCurrentUserContext();
  return s.data.id === n && a.enabled && [I.DRAFT, I.RETURNED].includes(t)
    ? <Ce.Provider value={e.value}>{e.children}</Ce.Provider>
    : null;
}
function eo(e) {
  const { data: t } = useCurrentUserContext(),
    { status: n, createdById: a } = z(),
    { workflow: s } = useFlowContext();
  return t.data.id === a && s.enabled && s.config.withdrawable && [I.SUBMITTED].includes(n) ? e.children : null;
}
function oo(e) {
  var h;
  const { id: t } = useRecord(),
    { actionEnabled: n } = useContext(J),
    { loading: a, data: s } = useRequest(
      {
        resource: 'approvalExecutions',
        action: 'get',
        params: {
          filterByTk: t,
          appends: [
            'execution',
            'execution.jobs',
            'approval',
            'approval.workflow',
            'approval.workflow.nodes',
            'approval.approvalExecutions',
            'approval.createdBy.id',
            'approval.createdBy.nickname',
            'approval.records',
            'approval.records.node.title',
            'approval.records.node.config',
            'approval.records.job',
            'approval.records.user.nickname',
          ],
          except: ['approval.approvalExecutions.snapshot', 'approval.records.snapshot'],
        },
      },
      { refreshDeps: [t] },
    );
  if (a) return <Spin />;
  if (!(s != null && s.data)) return <Result status="error" title="Loading failed" />;
  const m = s.data,
    { approval: i, execution: v } = m,
    l = V(m, ['approval', 'execution']),
    { workflow: d } = i;
  return (
    <FlowContext.Provider
      value={{
        workflow: i == null ? void 0 : i.workflow,
        nodes: (h = i == null ? void 0 : i.workflow) == null ? void 0 : h.nodes,
        execution: v,
      }}>{<H.Provider value={i}>{<ee.Provider value={l}>{<SchemaComponent
            components={{
              SchemaComponentProvider: SchemaComponentProvider,
              RemoteSchemaComponent: RemoteSchemaComponent,
              SchemaComponentContextProvider: fe,
              FormBlockProvider: ne,
              ActionBarProvider: Ze,
              ApplyActionStatusProvider: Re,
              WithdrawActionProvider: eo,
              DetailsBlockProvider: DetailsBlockProvider,
            }}
            scope={{
              useForm: useForm,
              useSubmit: He,
              useFormBlockProps: Qe,
              useDetailsBlockProps: useFormBlockContext,
              useWithdrawAction: Ye,
              useDestroyAction: Xe,
            }}
            schema={{
              name: `view-${i == null ? void 0 : i.id}`,
              type: 'void',
              properties: {
                tabs: {
                  type: 'void',
                  'x-component': 'Tabs',
                  properties: x(
                    {
                      detail: {
                        type: 'void',
                        title: `{{t('Application content', { ns: '${NAMESPACE}' })}}`,
                        'x-component': 'Tabs.TabPane',
                        properties: {
                          detail: {
                            type: 'void',
                            'x-decorator': 'SchemaComponentContextProvider',
                            'x-decorator-props': { designable: !1 },
                            'x-component': 'RemoteSchemaComponent',
                            'x-component-props': { uid: d == null ? void 0 : d.config.applyForm, noForm: !0 },
                          },
                        },
                      },
                    },
                    n
                      ? {}
                      : {
                          process: {
                            type: 'void',
                            title: `{{t('Approval process', { ns: '${NAMESPACE}' })}}`,
                            'x-component': 'Tabs.TabPane',
                            properties: {
                              process: {
                                type: 'void',
                                'x-decorator': 'CardItem',
                                'x-component': 'ApprovalBlock.ApprovalProcess',
                              },
                            },
                          },
                        },
                  ),
                },
              },
            }} />}</ee.Provider>}</H.Provider>}</FlowContext.Provider>
  );
}
function to(e) {
  const { latestExecutionId: t } = useRecord();
  return <RecordProvider record={{ id: t }} parent={!1}>{e.children}</RecordProvider>;
}
function be({ popoverComponent: e = 'Action.Drawer', popoverComponentProps: t = {} }) {
  const n = useRecord();
  return (
    <SchemaComponent
      components={{ ViewActionContent: oo, RecordDecorator: to }}
      schema={{
        name: `view-${n.id}`,
        type: 'void',
        'x-component': 'Action.Link',
        title: '{{t("View")}}',
        properties: {
          drawer: {
            type: 'void',
            'x-component': e,
            'x-component-props': x({ className: 'nb-action-popup' }, t),
            properties: {
              content: w(x({ type: 'void' }, n.approvalId ? {} : { 'x-decorator': 'RecordDecorator' }), {
                'x-component': 'ViewActionContent',
              }),
            },
          },
        },
      }} />
  );
}
const ro = {
  [JOB_STATUS.PENDING]: { color: 'gold', label: `{{t('Pending', { ns: "${NAMESPACE}" })}}` },
  [JOB_STATUS.RESOLVED]: { color: 'green', label: `{{t('Approved', { ns: "${NAMESPACE}" })}}` },
  [JOB_STATUS.REJECTED]: { color: 'red', label: `{{t('Rejected', { ns: "${NAMESPACE}" })}}` },
  [JOB_STATUS.RETRY_NEEDED]: { color: 'red', label: `{{t('Returned', { ns: "${NAMESPACE}" })}}` },
};
function no(e, { node: t, job: n, groupCount: a, statusCount: s }, i) {
  var C;
  const v = useCompile(),
    { branchMode: l, negotiation: d } = (C = t == null ? void 0 : t.config) != null ? C : {},
    m = ze[Me(d)],
    h = l ? _[n.result] : ro[n == null ? void 0 : n.status];
  return (
    <_Fragment>{[
        <span>{e}</span>,
        i && a > 1
          ? <div
          className={css`
            display: flex;
            align-items: center;
            gap: 0.5em;

            .ant-tag {
              margin-right: 0;
            }
          `}>{[
            <Tag color={h == null ? void 0 : h.color}>{typeof m.label == 'function' ? m.label(d) : v(m.label)}</Tag>,
            s
              ? <Progress
              type="circle"
              size="20"
              strokeColor="#389e0d"
              showInfo={!1}
              percent={((s[b.APPROVED] + s[b.REJECTED]) / a) * 100}
              success={{ percent: (s[b.REJECTED] / a) * 100, strokeColor: '#cf1322' }} />
              : null,
          ]}</div>
          : null,
      ]}</_Fragment>
  );
}
function ao(e, t, n) {
  const a = useCompile();
  if (!n) {
    const i = de[t.status === I.DRAFT ? I.DRAFT : I.SUBMITTED];
    return <Tag color={i.color}>{a(i.label)}</Tag>;
  }
  const s = _[e];
  return <ve value={e} record={t} option={s} />;
}
function so(e) {
  const { data: t } = useCurrentUserContext(),
    { actionEnabled: n } = useContext(J);
  return (
    <_Fragment>{[
        <time>{<DatePicker.ReadPretty value={e.updatedAt} showTime={!0} />}</time>,
        n && e.user.id === (t == null ? void 0 : t.data.id)
          ? <RecordProvider record={e.execution} parent={!1}>{<be />}</RecordProvider>
          : null,
      ]}</_Fragment>
  );
}
function io(e) {
  const { data: t } = useCurrentUserContext(),
    { actionEnabled: n } = useContext(J);
  return (
    <_Fragment>{[
        e.status
          ? <_Fragment>{[
            e.comment ? <InputReadPretty.TextArea value={e.comment} /> : null,
            <time>{<DatePicker.ReadPretty value={e.updatedAt} showTime={!0} />}</time>,
          ]}</_Fragment>
          : null,
        n && e.userId === (t == null ? void 0 : t.data.id)
          ? <RecordProvider record={e} parent={!1}>{<Ae />}</RecordProvider>
          : null,
      ]}</_Fragment>
  );
}
function co(e, t, n) {
  return n ? _jsx(io, x({}, t)) : _jsx(so, x({}, t));
}
const lo = createStyles(({ css: e, token: t }) => ({
  layout: e`
    display: flex;
  `,
  columnDetail: e`
    .ant-description-textarea {
      margin-bottom: 0.5em;
    }
    time {
      display: block;
      color: ${t.colorTextTertiary};
    }
  `,
}));
function po({ approval: e, currentUser: t }) {
  const { workflow: n, approvalExecutions: a, records: s } = e;
  a.sort((l, d) => Date.parse(l.createdAt) - Date.parse(d.createdAt));
  const i = a.reduce(
    (l, d) =>
      Object.assign(l, {
        [d.id]: Object.assign(d, {
          records: [
            {
              groupCount: 1,
              node: { title: useTranslation('Apply') },
              user: w(x({}, e.createdBy), { id: e.createdById }),
              status: d.status ? I.SUBMITTED : e.status,
              updatedAt: d.createdAt,
              execution: x({}, d),
            },
          ],
        }),
      }),
    {},
  );
  s
    .sort((l, d) => {
      const m = new Date(l.job.createdAt),
        h = new Date(d.job.createdAt);
      return m < h ? -1 : m > h ? 1 : l.id - d.id;
    })
    .forEach((l) => {
      const d = i[l.approvalExecutionId],
        C = d,
        { records: m } = C,
        h = V(C, ['records']);
      (l.workflow = n),
        (l.execution = x({}, h)),
        d.records.push(l),
        d.jobs || (d.jobs = {}),
        d.jobs[l.jobId]
          ? (d.jobs[l.jobId].first.groupCount += 1)
          : ((d.jobs[l.jobId] = { first: l }),
            (l.groupCount = 1),
            (l.statusCount = { [b.APPROVED]: 0, [b.REJECTED]: 0 })),
        [b.APPROVED, b.REJECTED].includes(l.status) && (d.jobs[l.jobId].first.statusCount[l.status] += 1);
    }),
    e.createdById === (t == null ? void 0 : t.data.id) &&
      a.forEach((l) => {
        l.status === EXECUTION_STATUS.CANCELED &&
          l.records.length === 1 &&
          ((l.records[0].groupCount = 2),
          l.records.push({ user: { nickname: e.createdBy.nickname }, status: b.WITHDRAWN, updatedAt: l.updatedAt }));
      });
  const v = a.length;
  return a.filter(
    (l, d) => (v - 1 === d && (!l.status || l.status === EXECUTION_STATUS.CANCELED)) || l.records.length > 1,
  );
}
const J = createContext({ actionEnabled: !1 });
function uo(e) {
  const { t } = usePluginTranslation(),
    n = z(),
    { styles: a } = lo(),
    { data: s } = useCurrentUserContext(),
    i = po({ approval: n, currentUser: s });
  return (
    <J.Provider value={{ actionEnabled: e.actionEnabled }}>{<Space direction="vertical" size="middle" className={a.layout}>{i.map((v, l) =>
          _jsx(
            Table,
            {
              dataSource: v.records,
              rowKey: 'id',
              columns: [
                {
                  title: useTranslation('Task node'),
                  dataIndex: ['node', 'title'],
                  onCell(d) {
                    var m;
                    return { rowSpan: (m = d.groupCount) != null ? m : 0 };
                  },
                  render: no,
                },
                { title: t('User'), dataIndex: ['user', 'nickname'], width: 120 },
                { title: t('Status', { ns: 'workflow' }), dataIndex: 'status', render: ao, width: 120 },
                { title: t('Details'), dataIndex: 'updatedAt', render: co, width: 200, className: a.columnDetail },
              ],
              pagination: !1,
            },
            v.id,
          ),
        )}</Space>}</J.Provider>
  );
}
function mo({ workflow: e, children: t }) {
  return <FlowContext.Provider value={{ workflow: e }}>{t}</FlowContext.Provider>;
}
const we = createContext(I.SUBMITTED);
function vo(e) {
  return <we.Provider value={e.value}>{e.children}</we.Provider>;
}
function xo(e) {
  return e.children;
}
function fo(e) {
  return null;
}
function ho() {
  const e = useForm(),
    t = useField(),
    { setVisible: n } = useActionContext(),
    { __parent: a } = useBlockRequestContext(),
    s = useCollection_deprecated(),
    i = useContext(we),
    v = useAPIClient(),
    { workflow: l } = useFlowContext();
  return {
    run() {
      return E(this, null, function* () {
        var m;
        try {
          yield e.submit(),
            (t.data = t.data || {}),
            (t.data.loading = !0),
            yield v.resource('approvals').create({
              values: {
                collectionName: joinCollectionName(s.dataSource, s.name),
                data: e.values,
                status: i,
                workflowId: l.id,
              },
            }),
            n(!1),
            yield e.reset(),
            (t.data.loading = !1),
            (m = a == null ? void 0 : a.service) == null || m.refresh();
        } catch (h) {
          t.data && (t.data.loading = !1);
        }
      });
    },
  };
}
function yo() {
  return { run() {} };
}
function Ao(e) {
  const t = useContext(SchemaComponentContext),
    n = useAPIClient(),
    [a, s] = useState(!1),
    [i, v] = useState([]),
    [l, d] = useState(null);
  useEffect(() => {
    n.resource('workflows')
      .listApprovalFlows({ filter: { 'config.centralized': !0 } })
      .then(({ data: h }) => {
        v(h.data);
      })
      .catch(console.error);
  }, []);
  const m = useCallback(
    ({ key: h }) => {
      var P;
      const C = i.find((D) => D.id == h),
        { applyForm: g } = (P = C == null ? void 0 : C.config) != null ? P : {},
        [S, B] = parseCollectionName(C.config.collection);
      d({
        type: 'void',
        properties: {
          [`drawer-${C.id}`]: {
            type: 'void',
            title: C.title,
            'x-decorator': 'FlowContextProvider',
            'x-decorator-props': { workflow: C },
            'x-component': 'Action.Drawer',
            'x-component-props': {
              className: css`
                .ant-drawer-body {
                  background: var(--nb-box-bg);
                }
              `,
            },
            properties: {
              [g]: {
                type: 'void',
                'x-decorator': 'CollectionProvider_deprecated',
                'x-decorator-props': { name: B, dataSource: S },
                'x-component': 'RemoteSchemaComponent',
                'x-component-props': { uid: g, noForm: !0 },
              },
            },
          },
        },
      }),
        s(!0);
    },
    [i],
  );
  return (
    <ActionContextProvider value={{ visible: a, setVisible: s }}>{[
        <Dropdown
          menu={{ items: i.map((h) => ({ key: h.id, label: h.title })), onClick: m }}
          disabled={!i.length}>{<Button icon={<PlusOutlined />} type="primary">{[useTranslation('Apply'), ' ', <DownOutlined />]}</Button>}</Dropdown>,
        <SchemaComponentContext.Provider value={w(x({}, t), { designable: !1 })}>{<SchemaComponent
            schema={l}
            components={{
              RemoteSchemaComponent: RemoteSchemaComponent,
              CollectionProvider_deprecated: CollectionProvider_deprecated,
              FlowContextProvider: mo,
              ApplyActionStatusProvider: vo,
              ActionBarProvider: xo,
              WithdrawActionProvider: fo,
            }}
            scope={{ useSubmit: ho, useWithdrawAction: yo }} />}</SchemaComponentContext.Provider>,
      ]}</ActionContextProvider>
  );
}
const ge = {
    title: `{{t("Node", { ns: "${NAMESPACE}" })}}`,
    name: 'flow_nodes',
    fields: [
      {
        type: 'bigInt',
        name: 'id',
        interface: 'm2o',
        uiSchema: {
          type: 'number',
          title: 'ID',
          'x-component': 'RemoteSelect',
          'x-component-props': {
            fieldNames: { label: 'title', value: 'id' },
            service: { resource: 'flow_nodes', params: { filter: { type: 'manual' } } },
          },
        },
      },
      {
        type: 'string',
        name: 'title',
        interface: 'input',
        uiSchema: { type: 'string', title: '{{t("Title")}}', 'x-component': 'Input' },
      },
    ],
  },
  Se = {
    title: `{{t("Workflow", { ns: "${NAMESPACE}" })}}`,
    name: 'workflows',
    fields: [
      {
        type: 'string',
        name: 'title',
        interface: 'input',
        uiSchema: { title: '{{t("Name")}}', type: 'string', 'x-component': 'Input', required: !0 },
      },
      {
        type: 'boolean',
        name: 'enabled',
        interface: 'select',
        uiSchema: {
          type: 'boolean',
          title: '{{t("Status", { ns: "workflow" })}}',
          'x-component': 'Select',
          enum: [
            { label: '{{t("On", { ns: "workflow" })}}', value: !0 },
            { label: '{{t("Off", { ns: "workflow" })}}', value: !1 },
          ],
        },
      },
    ],
  },
  ae = {
    title: `{{t("Approval applications", { ns: "${NAMESPACE}" })}}`,
    name: 'approvals',
    fields: [
      {
        type: 'bigInt',
        name: 'id',
        interface: 'number',
        uiSchema: { type: 'number', title: 'ID', 'x-component': 'InputNumber' },
      },
      {
        type: 'belongsTo',
        name: 'workflow',
        target: 'workflows',
        foreignKey: 'workflowId',
        interface: 'm2o',
        uiSchema: {
          type: 'number',
          title: '{{t("Workflow", { ns: "workflow" })}}',
          'x-component': 'RemoteSelect',
          'x-component-props': { fieldNames: { label: 'title', value: 'id' }, service: { resource: 'workflows' } },
        },
      },
      {
        type: 'belongsTo',
        name: 'createdBy',
        target: 'users',
        foreignKey: 'createdById',
        interface: 'm2o',
        uiSchema: {
          type: 'number',
          title: `{{t("Initiator", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'RemoteSelect',
          'x-component-props': { fieldNames: { label: 'nickname', value: 'id' }, service: { resource: 'users' } },
        },
      },
      {
        type: 'integer',
        name: 'status',
        interface: 'select',
        uiSchema: { type: 'number', title: '{{t("Status", { ns: "workflow" })}}', 'x-component': 'Select', enum: pe },
      },
      {
        name: 'createdAt',
        type: 'date',
        interface: 'createdAt',
        uiSchema: {
          type: 'datetime',
          title: '{{t("Created at")}}',
          'x-component': 'DatePicker',
          'x-component-props': { showTime: !0 },
        },
      },
    ],
  },
  Y = {
    title: `{{t("Approval todos", { ns: "${NAMESPACE}" })}}`,
    name: 'approvalRecords',
    fields: [
      {
        type: 'bigInt',
        name: 'approvalId',
        interface: 'number',
        uiSchema: { type: 'number', title: 'ID', 'x-component': 'InputNumber' },
      },
      {
        type: 'belongsTo',
        name: 'user',
        target: 'users',
        foreignKey: 'userId',
        interface: 'm2o',
        uiSchema: {
          type: 'number',
          title: `{{t("Assignee", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'RemoteSelect',
          'x-component-props': { fieldNames: { label: 'nickname', value: 'id' }, service: { resource: 'users' } },
        },
      },
      {
        type: 'belongsTo',
        name: 'node',
        target: 'flow_nodes',
        foreignKey: 'nodeId',
        interface: 'm2o',
        isAssociation: !0,
        uiSchema: {
          type: 'number',
          title: `{{t("Task node", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'RemoteSelect',
          'x-component-props': { fieldNames: { label: 'title', value: 'id' }, service: { resource: 'flow_nodes' } },
        },
      },
      {
        type: 'belongsTo',
        name: 'workflow',
        target: 'workflows',
        foreignKey: 'workflowId',
        interface: 'm2o',
        uiSchema: {
          type: 'number',
          title: '{{t("Workflow", { ns: "workflow" })}}',
          'x-component': 'RemoteSelect',
          'x-component-props': { fieldNames: { label: 'title', value: 'id' }, service: { resource: 'workflows' } },
        },
      },
      {
        type: 'integer',
        name: 'status',
        interface: 'select',
        uiSchema: { type: 'number', title: '{{t("Status", { ns: "workflow" })}}', 'x-component': 'Select', enum: ue },
      },
      {
        type: 'text',
        name: 'comment',
        interface: 'markdown',
        uiSchema: { type: 'string', 'x-component': 'Markdown', title: `{{t("Comment", { ns: "${NAMESPACE}" })}}` },
      },
      {
        name: 'createdAt',
        type: 'date',
        interface: 'createdAt',
        uiSchema: {
          type: 'datetime',
          title: '{{t("Created at")}}',
          'x-component': 'DatePicker',
          'x-component-props': { showTime: !0 },
        },
      },
      {
        name: 'updatedAt',
        type: 'date',
        interface: 'updatedAt',
        uiSchema: {
          type: 'datetime',
          title: '{{t("Updated at")}}',
          'x-component': 'DatePicker',
          'x-component-props': { showTime: !0 },
        },
      },
    ],
  };
function Co(e) {
  const t = useSchemaInitializerItem(),
    { insert: n } = useSchemaInitializer();
  return _jsx(
    SchemaInitializerItem,
    w(x({ icon: <TableOutlined /> }, t), {
      items: [
        {
          type: 'item',
          title: `{{t("Initiations", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'ApprovalBlock.Initiations',
          collection: 'approvals',
          params: { appends: ['createdBy.nickname', 'workflow.title', 'workflow.enabled'], except: ['data'] },
        },
        {
          type: 'item',
          title: `{{t("Todos", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'ApprovalBlock.Todos',
          collection: 'approvalRecords',
          params: {
            appends: [
              'user.id',
              'user.nickname',
              'node.id',
              'node.title',
              'job.id',
              'job.status',
              'job.result',
              'workflow.id',
              'workflow.title',
              'workflow.enabled',
              'execution.id',
              'execution.status',
            ],
          },
        },
      ],
      onClick: ({ item: a }) => {
        const s = uid();
        n({
          type: 'void',
          name: s,
          'x-uid': s,
          'x-component': 'CardItem',
          'x-decorator': 'ApprovalBlock.Decorator',
          'x-decorator-props': { collection: a.collection, action: 'listCentralized', params: a.params },
          'x-designer': 'TableBlockDesigner',
          properties: { block: { type: 'void', 'x-component': a['x-component'] } },
        });
      },
    }),
  );
}
const bo = {
  type: 'void',
  name: 'recordApprovals',
  properties: {
    actions: {
      type: 'void',
      'x-component': 'ActionBar',
      'x-component-props': { style: { marginBottom: 16 } },
      properties: {
        refresher: {
          type: 'void',
          title: '{{ t("Refresh") }}',
          'x-action': 'refresh',
          'x-component': 'Action',
          'x-use-component-props': 'useRefreshActionProps',
          'x-designer': 'Action.Designer',
          'x-component-props': { icon: 'ReloadOutlined' },
          'x-align': 'right',
        },
      },
    },
    list: {
      type: 'array',
      'x-component': 'List',
      'x-component-props': { locale: { emptyText: `{{ t("No data yet", { ns: "${NAMESPACE}" }) }}` } },
      properties: {
        item: {
          type: 'object',
          'x-component': 'List.Item',
          'x-use-component-props': 'useListItemProps',
          'x-read-pretty': !0,
          properties: {
            grid: {
              type: 'void',
              'x-component': 'Space',
              'x-component-props': { direction: 'vertical' },
              properties: {
                row: {
                  type: 'void',
                  'x-component': 'Space',
                  'x-component-props': { size: 'large', wrap: !0 },
                  properties: {
                    id: {
                      type: 'number',
                      title: '{{t("ID")}}',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-read-pretty': !0,
                    },
                    workflow: {
                      type: 'string',
                      title: '{{t("Workflow", { ns: "workflow" })}}',
                      'x-decorator': 'FormItem',
                      'x-component': 'WorkflowColumn',
                      'x-read-pretty': !0,
                    },
                    status: {
                      type: 'number',
                      title: `{{t("Current status", { ns: "${NAMESPACE}" })}}`,
                      'x-decorator': 'FormItem',
                      'x-component': 'CollectionField',
                      'x-read-pretty': !0,
                    },
                    createdBy: {
                      type: 'string',
                      title: `{{t("Initiator", { ns: "${NAMESPACE}" })}}`,
                      'x-decorator': 'FormItem',
                      'x-component': 'UserColumn',
                      'x-read-pretty': !0,
                    },
                    createdAt: {
                      type: 'string',
                      title: '{{t("Created at")}}',
                      'x-decorator': 'FormItem',
                      'x-component': 'CollectionField',
                      'x-read-pretty': !0,
                    },
                  },
                },
                processRow: {
                  type: 'void',
                  'x-decorator': 'ApprovalBlock.ApprovalDataProvider',
                  'x-component': 'ApprovalBlock.ApprovalProcess',
                  'x-component-props': { actionEnabled: !0 },
                },
              },
            },
          },
        },
      },
    },
  },
};
function se() {
  return (
    <SchemaComponent
      components={{ WorkflowColumn: te, UserColumn: re, ApprovalRecordStatusColumn: xe }}
      schema={bo} />
  );
}
function wo({ params: e, children: t }) {
  const n = useCollection_deprecated(),
    a = useRecord(),
    s = useMemo(
      () => ({
        collection: 'approvals',
        resource: 'approvals',
        action: 'list',
        params: w(x({ sort: ['-createdAt'] }, e), {
          filter: w(x({}, e == null ? void 0 : e.filter), {
            dataKey: `${a[n.filterTargetKey]}`,
            collectionName: joinCollectionName(n.dataSource, n.name),
          }),
          appends: [
            'workflow',
            'approvalExecutions',
            'createdBy.nickname',
            'records',
            'records.node.title',
            'records.node.config',
            'records.job',
            'records.user.nickname',
          ],
          except: ['data', 'approvalExecutions.snapshot', 'records.snapshot'],
        }),
        dragSort: !1,
      }),
      [e, a, n],
    );
  return <ExtendCollectionsProvider collections={[Se, ge, ae, Y]}>{<CollectionProvider_deprecated collection={ae}>{_jsx(List.Decorator, w(x({}, s), { children: t }))}</CollectionProvider_deprecated>}</ExtendCollectionsProvider>;
}
function go(e) {
  const t = useSchemaInitializerItem(),
    { insert: n } = useSchemaInitializer();
  return _jsx(
    SchemaInitializerItem,
    w(x({ icon: <AuditOutlined /> }, t), {
      onClick: () => {
        const a = uid();
        n({
          type: 'void',
          name: a,
          'x-uid': a,
          'x-decorator': 'ApprovalBlock.RecordApprovals.Decorator',
          'x-component': 'CardItem',
          'x-designer': 'List.Designer',
          properties: { block: { type: 'void', 'x-component': 'ApprovalBlock.RecordApprovals' } },
        });
      },
    }),
  );
}
(se.BlockInitializer = go), (se.Decorator = wo);
function So() {
  return (
    <SchemaComponent
      components={{ NodeColumn: me, WorkflowColumn: te, UserColumn: re, ApplyButton: Ao }}
      schema={Ve} />
  );
}
function ko() {
  return (
    <SchemaComponent
      components={{ NodeColumn: me, WorkflowColumn: te, UserColumn: re, ApprovalRecordStatusColumn: xe }}
      schema={Oe} />
  );
}
function Io({ collection: e, action: t = 'list', params: n = { filter: {} }, children: a }) {
  const s = useRecord(),
    i = {
      collection: e,
      resource: e,
      action: t,
      params: w(x({ pageSize: 20, sort: ['-createdAt'] }, n), {
        filter: x(x({}, s != null && s.id ? { dataKey: `${s.id}` } : {}), n.filter),
      }),
      rowKey: 'id',
      showIndex: !0,
      dragSort: !1,
    };
  return <ExtendCollectionsProvider collections={[Se, ge, ae, Y]}>{_jsx(TableBlockProvider, w(x({ name: e }, i), { children: a }))}</ExtendCollectionsProvider>;
}
export function ApprovalBlock() {
  return null;
}
(ApprovalBlock.Decorator = Io),
  (ApprovalBlock.BlockInitializer = Co),
  (ApprovalBlock.Initiations = So),
  (ApprovalBlock.Todos = ko),
  (ApprovalBlock.ViewAction = be),
  (ApprovalBlock.AssigneeViewAction = Ae),
  (ApprovalBlock.ApprovalProcess = uo),
  (ApprovalBlock.RecordApprovals = se),
  (ApprovalBlock.ApprovalDataProvider = Ue);
function K(e, t, n = !1) {
  const a = [];
  return e
    ? t(e) && (!n || !e.properties)
      ? (a.push(e), a)
      : (e.properties &&
          Object.keys(e.properties).forEach((s) => {
            a.push(...K(e.properties[s], t));
          }),
        a)
    : a;
}
export const X = { DRAFT: 0, RETURNED: 1, SUBMITTED: 2, PROCESSING: 3, APPROVED: 4, REJECTED: -1 };
export function ke() {
  const a = useSchemaInitializerItem(),
    { action: e, actionProps: t = {} } = a,
    n = V(a, ['action', 'actionProps']);
  return _jsx(
    ActionInitializer,
    w(x({}, n), {
      schema: {
        type: 'void',
        title: n.title,
        'x-decorator': 'ApplyActionStatusProvider',
        'x-decorator-props': { value: e },
        'x-component': 'Action',
        'x-component-props': w(x({}, t), { useAction: '{{ useSubmit }}' }),
        'x-designer': 'Action.Designer',
        'x-action': `${e}`,
        'x-action-settings': { assignedValues: {} },
      },
    }),
  );
}
export function Po() {
  const e = useSchemaInitializerItem(),
    { insert: t } = useSchemaInitializer(),
    n = useCollection_deprecated(),
    { getTemplateSchemaByMode: a } = useSchemaTemplateManager(),
    s = useRecordCollectionDataSourceItems('FormItem');
  function i(l) {
    return E(this, arguments, function* ({ item: v }) {
      const d = v.template ? yield a(v) : null,
        m = createFormBlockSchema({
          actionInitializers: 'ApprovalApplyAddActionButton',
          actions: {
            submit: {
              type: 'void',
              title: '{{t("Submit")}}',
              'x-decorator': 'ApplyActionStatusProvider',
              'x-decorator-props': { value: X.SUBMITTED },
              'x-component': 'Action',
              'x-component-props': { type: 'primary', htmlType: 'submit', useAction: '{{ useSubmit }}' },
              'x-designer': 'Action.Designer',
              'x-designer-props': {},
              'x-action': `${X.SUBMITTED}`,
              'x-action-settings': { removable: !1, assignedValues: {} },
            },
            withdraw: {
              type: 'void',
              title: `{{t("Withdraw", { ns: "${NAMESPACE}" })}}`,
              'x-decorator': 'WithdrawActionProvider',
              'x-component': 'Action',
              'x-component-props': {
                confirm: {
                  title: `{{t('Withdraw', { ns: "${NAMESPACE}" })}}`,
                  content: `{{t('Are you sure you want to withdraw it?', { ns: "${NAMESPACE}" })}}`,
                },
                useAction: '{{ useWithdrawAction }}',
              },
              'x-designer': 'WithdrawActionDesigner',
              'x-action': 'withdraw',
            },
          },
          dataSource: n.dataSource,
          resource: n.name,
          collection: n.name,
          template: d,
        });
      delete m['x-acl-action-props'], delete m['x-acl-action'];
      const [h] = Object.keys(m.properties),
        [C] = K(m.properties[h], (g) => g['x-component'] === 'ActionBar');
      (C['x-decorator'] = 'ActionBarProvider'),
        (C['x-component-props'].style = { marginTop: '1.5em', flexWrap: 'wrap' }),
        t(m);
    });
  }
  return _jsx(SchemaInitializerItem, w(x({}, e), { onClick: i, items: s }));
}
function Do() {
  return { run() {} };
}
function Eo() {
  return { run() {} };
}
function Fo(e) {
  return e.children;
}
function $o(e) {
  return e.children;
}
function No(e) {
  return null;
}
export function Vo(e) {
  useFlowContext();
  const [t, n] = useState(!1);
  return (
    <_Fragment>{[
        <Button type="primary" onClick={() => n(!0)} disabled={!1}>{useTranslation('Go to configure')}</Button>,
        <ActionContextProvider value={{ visible: t, setVisible: n, formValueChanged: !1 }}>{e.children}</ActionContextProvider>,
      ]}</_Fragment>
  );
}
function Oo({ value: e, onChange: t }) {
  const n = useAPIClient(),
    { workflow: a } = useFlowContext(),
    { components: s } = useContext(SchemaComponentContext),
    { data: i, loading: v } = useRequest(() =>
      E(this, null, function* () {
        var m;
        if (e) {
          const { data: h } = yield n.request({ url: `uiSchemas:getJsonSchema/${e}` });
          if (((m = h.data) == null ? void 0 : m['x-uid']) === e) return h.data;
        }
        const l = uid(),
          d = {
            type: 'void',
            name: l,
            'x-uid': l,
            'x-component': 'Grid',
            'x-initializer': 'ApprovalApplyAddBlockButton',
            properties: {},
          };
        return yield n.resource('uiSchemas').insert({ values: d }), t(l), d;
      }),
    );
  return v
    ? <Spin />
    : <SchemaComponentProvider components={s} designable={!a.executed}>{<SchemaComponent
      memoized={!0}
      scope={{ useSubmit: Do, useWithdrawAction: Eo, useFormBlockProps: useFormBlockProps }}
      components={{ ActionBarProvider: Fo, ApplyActionStatusProvider: $o, WithdrawActionProvider: No }}
      schema={i} />}</SchemaComponentProvider>;
}
export function zo() {
  const { values: e } = useForm(),
    [t, n] = parseCollectionName(e.collection);
  return (
    <SchemaComponent
      components={{ SchemaContent: Oo }}
      schema={{
        name: e.collection,
        type: 'void',
        properties: {
          drawer: {
            type: 'void',
            title: `{{t("Initiator's interface", { ns: "${NAMESPACE}" })}}`,
            'x-component': 'Action.Drawer',
            'x-component-props': {
              className: css`
                .ant-drawer-body {
                  background: var(--nb-box-bg);
                }
              `,
            },
            properties: {
              applyForm: {
                type: 'string',
                'x-decorator': 'CollectionProvider_deprecated',
                'x-decorator-props': { dataSource: t, name: n },
                'x-component': 'SchemaContent',
              },
            },
          },
        },
      }} />
  );
}

function Uo(e) {
  return e.isForeignKey ? e.target === 'users' : e.collectionName === 'users' && e.name === 'id';
}
export function jo(e) {
  return typeof e.value === 'object' && e.value ? _jsx(qo, x({}, e)) : _jsx(_o, x({}, e));
}
function _o({ value: e, onChange: t }) {
  const n = useWorkflowVariableOptions({ types: [Uo] });
  return (
    <Variable.Input scope={n} value={e} onChange={t}>{<RemoteSelect
        fieldNames={{ label: 'nickname', value: 'id' }}
        service={{ resource: 'users' }}
        manual={!1}
        value={e}
        onChange={t} />}</Variable.Input>
  );
}
function qo(e) {
  const t = useField(),
    n = useCollectionFilterOptions('users'),
    { token: a } = useToken();
  return (
    <div style={{ border: `1px dashed ${a.colorBorder}`, padding: a.paddingSM }}>{<SchemaComponent
        basePath={t.address}
        schema={{
          type: 'void',
          properties: {
            filter: {
              type: 'object',
              'x-component': 'Filter',
              'x-component-props': { options: n, dynamicComponent: FilterDynamicComponent },
            },
          },
        }} />}</div>
  );
}
export function Lo(e) {
  const { workflow: t } = useFlowContext(),
    [n, a] = parseCollectionName(t.config.collection),
    s = useSchemaInitializerItem(),
    { insert: i } = useSchemaInitializer(),
    { getTemplateSchemaByMode: v } = useSchemaTemplateManager(),
    l = useRecordCollectionDataSourceItems('FormItem');
  function d(h) {
    return E(this, arguments, function* ({ item: m }) {
      const C = m.template ? yield v(m) : null,
        g = createReadPrettyFormBlockSchema({
          actionInitializers: null,
          resource: a,
          collection: a,
          dataSource: n,
          template: C,
          settings: 'blockSettings:singleDataDetails',
        });
      delete g['x-acl-action-props'], delete g['x-acl-action'];
      const [S] = Object.keys(g.properties);
      lodash.set(g.properties[S], 'x-component-props.useProps', '{{useApprovalDetailBlockProps}}'), i(g);
    });
  }
  return _jsx(SchemaInitializerItem, w(x({}, s), { onClick: d, items: l }));
}
export function ie() {
  const a = useSchemaInitializerItem(),
    { action: e, actionProps: t = {} } = a,
    n = V(a, ['action', 'actionProps']);
  return _jsx(
    ActionInitializer,
    w(x({}, n), {
      schema: {
        type: 'void',
        title: n.title,
        'x-decorator': 'ApprovalActionProvider',
        'x-decorator-props': { status: e },
        'x-component': 'Action',
        'x-component-props': w(x({}, t), { useAction: '{{ useSubmit }}' }),
        'x-designer': 'Action.Designer',
        'x-action': `${e}`,
      },
    }),
  );
}
export function Jo() {
  const e = useSchemaInitializerItem(),
    t = createFormBlockSchema({
      actionInitializers: 'ApprovalProcessAddActionButton',
      actions: {
        approve: {
          type: 'void',
          title: `{{t("Approve", { ns: "${NAMESPACE}" })}}`,
          'x-decorator': 'ApprovalActionProvider',
          'x-decorator-props': { status: b.APPROVED },
          'x-component': 'Action',
          'x-component-props': { type: 'primary', htmlType: 'submit', useAction: '{{ useSubmit }}' },
          'x-designer': 'Action.Designer',
          'x-designer-props': {},
          'x-action': `${b.APPROVED}`,
        },
      },
      resource: 'approvalRecords',
      collection: 'approvalRecords',
    });
  delete t['x-acl-action-props'], delete t['x-acl-action'], (t['x-decorator'] = 'ApprovalFormBlockProvider');
  const [n] = Object.keys(t.properties),
    a = t.properties[n];
  lodash.set(a, 'x-component-props.useProps', '{{useApprovalFormBlockProps}}');
  const [s] = K(t.properties[n], (v) => v['x-component'] === 'ActionBar');
  (s['x-decorator'] = 'ActionBarProvider'),
    lodash.set(s, 'x-component-props.style', { marginTop: '1.5em', flexWrap: 'wrap' }),
    (t['x-block'] = 'action-form');
  const i = w(x({}, e), { schema: t });
  return _jsx(InitializerWithSwitch, w(x({}, i), { item: i, type: 'x-block' }));
}
function Wo(e) {
  return e.children;
}
function Qo(e) {
  return e.children;
}
function Ho(e) {
  var D;
  const t = useFieldSchema(),
    n = useField(),
    a = useRef(null),
    { getAssociationAppends: s } = useAssociationNames(),
    { appends: i, updateAssociationValues: v } = s(),
    { findComponent: l } = useDesignable(),
    d = l((D = n.component) == null ? void 0 : D[0]) || Fragment,
    m = useMemo(() => createForm({}), []),
    h = useMemo(() => x({ appends: i }, e.params), [i, e.params]),
    C = useMemo(() => ({ loading: !1, data: { data: {} } }), []),
    S = useAPIClient().resource(e.collection),
    B = useContext(BlockRequestContext_deprecated),
    P = useMemo(
      () => ({ params: h, form: m, field: n, service: C, updateAssociationValues: v, formBlockRef: a }),
      [n, m, h, C, v],
    );
  return (
    <CollectionProvider_deprecated collection={e.collection}>{<RecordProvider record={{}}>{<FormActiveFieldsProvider name="form">{<BlockRequestContext_deprecated.Provider
            value={{ block: 'form', props: e, field: n, service: C, resource: S, __parent: B }}>{<FormBlockContext.Provider value={P}>{_jsxs(
                d,
                w(x({}, n.componentProps), {
                  children: [
                    <FormV2.Templates style={{ marginBottom: 18 }} form={m} />,
                    <div ref={a}>{<RecursionField schema={t} onlyRenderProperties={!0} />}</div>,
                  ],
                }),
              )}</FormBlockContext.Provider>}</BlockRequestContext_deprecated.Provider>}</FormActiveFieldsProvider>}</RecordProvider>}</CollectionProvider_deprecated>
  );
}
function Yo(e) {
  const { form: t } = useFormBlockContext();
  return { form: t };
}
const Xo = createContext({});
function Zo({ value: e, onChange: t }) {
  const n = useAPIClient(),
    a = usePlugin(PluginWorkflow),
    { values: s, setValuesIn: i } = useForm(),
    { setFormValueChanged: v } = useContext(Ie),
    l = useNodeContext(),
    d = useAvailableUpstreams(l),
    m = useCallback(
      (S) => {
        var D, M;
        const P = K(S.toJSON(), (F) => F['x-decorator'] === 'ApprovalFormBlockProvider').reduce(
          (F, W) => (
            K(W, (Q) => Q['x-component'] === 'Action').forEach((Q) => {
              F.add(Number.parseInt(Q['x-action'], 10));
            }),
            F
          ),
          new Set(),
        );
        (P.size !== ((D = s.actions) == null ? void 0 : D.length) ||
          !((M = s.actions) != null && M.every((F) => P.has(F)))) &&
          v(!0),
          i('actions', [...P]);
      },
      [v, i, s.actions],
    ),
    { data: h, loading: C } = useRequest(() =>
      E(this, null, function* () {
        var P;
        if (e) {
          const { data: D } = yield n.request({ url: `uiSchemas:getJsonSchema/${e}` });
          if (((P = D.data) == null ? void 0 : P['x-uid']) === e) return D.data;
        }
        const S = e != null ? e : uid(),
          B = {
            type: 'void',
            name: S,
            'x-uid': S,
            'x-component': 'Grid',
            'x-initializer': 'ApprovalProcessAddBlockButton',
            properties: {},
          };
        return yield n.resource('uiSchemas').insert({ values: B }), t(S), B;
      }),
    );
  if (C) return <Spin />;
  const g = {};
  return (d.forEach((S) => {
    const B = a.instructions.get(S.type);
    Object.assign(g, B.components);
  }), <Xo.Provider value={s}>{<SchemaComponent
      memoized={!0}
      scope={{
        useSubmit() {
          return { run() {} };
        },
        useApprovalFormBlockProps: Yo,
        useDetailsBlockProps: useFormBlockContext,
      }}
      components={w(x({}, g), {
        FormBlockProvider: ne,
        ApprovalFormBlockProvider: Ho,
        ActionBarProvider: Wo,
        ApprovalActionProvider: Qo,
        DetailsBlockProvider: DetailsBlockProvider,
        SimpleDesigner: SimpleDesigner,
      })}
      schema={h}
      onChange={m} />}</Xo.Provider>);
}
export function Ro() {
  const e = useContext(SchemaComponentContext),
    [, t] = useState(uid()),
    { workflow: n } = useFlowContext();
  return (
    <ExtendCollectionsProvider
      collections={[w(x({}, Y), { fields: Y.fields.filter((a) => a.name === 'comment') })]}>{<SchemaComponentContext.Provider
        value={w(x({}, e), {
          refresh() {
            t(uid());
          },
          designable: !n.executed,
        })}>{<RecordProvider record={{}} parent={!1}>{<SchemaComponent
            components={{ SchemaContent: Zo }}
            schema={{
              name: 'drawer',
              type: 'void',
              title: `{{t("Approver's interface", { ns: "${NAMESPACE}" })}}`,
              'x-component': 'Action.Drawer',
              'x-component-props': {
                className: css`
                  .ant-drawer-body {
                    background: var(--nb-box-bg);
                  }
                `,
              },
              properties: { applyDetail: { type: 'string', 'x-component': 'SchemaContent' } },
            }} />}</RecordProvider>}</SchemaComponentContext.Provider>}</ExtendCollectionsProvider>
  );
}
const Ie = createContext({});
export function et(e) {
  const [t, n] = useState(!1),
    { setFormValueChanged: a } = useActionContext();
  return (
    <Ie.Provider value={{ setFormValueChanged: a }}>{[
        <Button type="primary" onClick={() => n(!0)} disabled={!1}>{useTranslation('Go to configure')}</Button>,
        <ActionContextProvider value={{ visible: t, setVisible: n, formValueChanged: !1 }}>{e.children}</ActionContextProvider>,
      ]}</Ie.Provider>
  );
}
export function ot({ data: e }) {
  var v;
  const t = useCompile(),
    { nodes: n } = useFlowContext(),
    { styles: a } = useStyles(),
    { id: s, config: i } = e;
  return (
    <NodeDefaultView data={e}>{i.branchMode
        ? <div className={a.nodeSubtreeClass}>{<div className={a.branchBlockClass}>{[
            b.REJECTED,
            b.APPROVED,
            ...(((v = e.config.actions) != null ? v : []).includes(b.RETURNED) ? [b.RETURNED] : []),
          ].map((l) =>
            _jsx(
              Branch,
              {
                from: e,
                entry: n.find((d) => d.upstreamId === s && d.branchIndex === l),
                branchIndex: l,
                controller: <Tag
                  color={_[l].color}
                  className={css`
                    position: relative;
                    margin: 1rem 0 0 0;
                  `}>{t(_[l].label)}</Tag>,
                end: l === b.RETURNED || (l === b.REJECTED && i.endOnReject),
              },
              l,
            ),
          )}</div>}</div>
        : null}</NodeDefaultView>
  );
}
function tt({ label: e, tooltip: t }) {
  const n = useCompile();
  return (
    <_Fragment>{[
        <span
          className={css`
            & + .anticon {
              margin-left: 0.25em;
            }
          `}>{n(e)}</span>,
        t &&
          <Tooltip title={n(t)}>{<QuestionCircleOutlined style={{ color: '#666' }} />}</Tooltip>,
      ]}</_Fragment>
  );
}
export function rt(e) {
  return e.map((t) => {
    const { label: n, tooltip: a, value: s } = t;
    return { value: s, label: <tt label={n} tooltip={a} /> };
  });
}
function nt(e, t = null) {
  for (let n = e, a = t; n; n = n.upstream) {
    if (t != null) return n;
    a = n.branchIndex;
  }
  return null;
}
export function at(e, t = null, n) {
  for (let a = e, s = t; a; a = a.upstream) {
    const i = nt(a, s);
    if (n(i, s)) return !0;
    s = a.branchIndex;
  }
  return !1;
}
export function st() {
  const e = useWorkflowExecuted(),
    t = ArrayItems.useArray(),
    [n, a] = useState(!1),
    s = useCallback(() => {
      t.field.push(''), a(!1);
    }, [t.field]),
    i = useCallback(() => {
      t.field.push({ filter: {} }), a(!1);
    }, [t.field]),
    v = <Button
      icon={<PlusOutlined />}
      type="dashed"
      block={!0}
      disabled={e}
      className="ant-formily-array-base-addition">{useTranslation('Add assignee')}</Button>;
  return e
    ? v
    : <Popover
    open={n}
    onOpenChange={a}
    content={<Space direction="vertical" size="small">{[
        <Button type="text" onClick={s}>{useTranslation('Select assignees')}</Button>,
        <Button type="text" onClick={i}>{useTranslation('Query assignees')}</Button>,
      ]}</Space>}>{v}</Popover>;
}
export function it({ value: e, onChange: t }) {
  const n = 0 < e && e < 1 ? '%' : e,
    a = useCallback(
      ({ target: i }) => {
        i.value !== n && t(i.value === '%' ? 0.5 : i.value);
      },
      [t],
    ),
    s = useCallback(
      (i) => {
        t(i / 100);
      },
      [t],
    );
  return (
    <fieldset
      className={css`
        .ant-radio-group {
          .anticon {
            margin-left: 0.5em;
          }
        }
      `}>{[
        <Radio.Group value={n} onChange={a}>{[
            <Radio value="0">{<Tooltip
                title={useTranslation('The approval or rejection by anyone of them is the result.')}
                placement="bottom">{[
                  <span>{useTranslation('Or')}</span>,
                  <QuestionCircleOutlined style={{ color: '#999' }} />,
                ]}</Tooltip>}</Radio>,
            <Radio value="1">{<Tooltip
                title={useTranslation(
                  "If it's approved by all, it's approved. If it's rejected by anyone, it's rejected.",
                )}
                placement="bottom">{[
                  <span>{useTranslation('And')}</span>,
                  <QuestionCircleOutlined style={{ color: '#999' }} />,
                ]}</Tooltip>}</Radio>,
            <Radio value="%">{<Tooltip
                title={useTranslation(
                  'Approved if the approval rate is greater than the set percentage, otherwise rejected.',
                )}
                placement="bottom">{[
                  <span>{useTranslation('Voting')}</span>,
                  <QuestionCircleOutlined style={{ color: '#999' }} />,
                ]}</Tooltip>}</Radio>,
          ]}</Radio.Group>,
        n === '%'
          ? <InputNumber
          addonBefore=">"
          min="1"
          max="99"
          defaultValue="50"
          value={e * 100}
          onChange={s}
          addonAfter="%" />
          : null,
      ]}</fieldset>
  );
}
