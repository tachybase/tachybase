import * as tClient from '@tachybase/client';
import react from 'react';
import * as i18next from 'react-i18next';
import jsxRuntime from 'react/jsx-runtime';
import * as tSchema from '@tachybase/schema';
import * as antd from 'antd';
import dayjs from 'dayjs';
import lodash from 'lodash';
import antIcons from '@ant-design/icons';

var se = Object.defineProperty,
  ie = Object.defineProperties;
var ce = Object.getOwnPropertyDescriptors;
var U = Object.getOwnPropertySymbols;
var le = Object.prototype.hasOwnProperty,
  de = Object.prototype.propertyIsEnumerable;
var E = (c, t, a) => (t in c ? se(c, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : (c[t] = a)),
  y = (c, t) => {
    for (var a in t || (t = {})) le.call(t, a) && E(c, a, t[a]);
    if (U) for (var a of U(t)) de.call(t, a) && E(c, a, t[a]);
    return c;
  },
  b = (c, t) => ie(c, ce(t));
var B = (c, t, a) => (E(c, typeof t != 'symbol' ? t + '' : t, a), a);
var z = (c, t, a) =>
  new Promise((N, r) => {
    var C = (k) => {
        try {
          F(a.next(k));
        } catch (M) {
          r(M);
        }
      },
      A = (k) => {
        try {
          F(a.throw(k));
        } catch (M) {
          r(M);
        }
      },
      F = (k) => (k.done ? N(k.value) : Promise.resolve(k.value).then(C, A));
    F((a = a.apply(c, t)).next());
  });
const V = 'comments';
function T(e) {
  return tClient.tval(e, { ns: V });
}
function D() {
  return i18next.useTranslation(V);
}
class K extends tClient.CollectionTemplate {
  constructor() {
    super(...arguments);
    B(this, 'name', 'comment');
    B(this, 'title', T('Comment Collection'));
    B(this, 'order', 2);
    B(this, 'color', 'orange');
    B(this, 'default', {
      fields: [
        {
          name: 'content',
          type: 'text',
          length: 'long',
          interface: 'vditor',
          deletable: !1,
          uiSchema: {
            type: 'string',
            title: T('Comment Content'),
            interface: 'vditor',
            'x-component': 'MarkdownVditor',
          },
        },
      ],
    });
    B(this, 'presetFieldsDisabled', !0);
    B(
      this,
      'configurableProperties',
      tClient.getConfigurableProperties('title', 'name', 'inherits', 'category', 'description', 'presetFields'),
    );
  }
}
const q = tClient.genStyleHook('nb-comment', (e) => {
    const { componentCls: o } = e;
    return {
      [o]: {
        [`${o}-item-container-container`]: {
          '&:first-child': { border: '5px solid #d0d7deb3', position: 'relative', zIndex: 1, borderRadius: 8 },
        },
        [`${o}-item-container-border`]: {
          border: '1px solid #d0d7deb3',
          position: 'relative',
          zIndex: 1,
          borderRadius: 8,
        },
        [`${o}-item-container-line`]: {
          position: 'absolute',
          top: 0,
          bottom: 0,
          content: '',
          display: 'block',
          width: 2,
          left: 16,
          backgroundColor: '#d0d7deb3',
          zIndex: 0,
        },
        '.ant-list-pagination': { marginTop: e.marginXS },
        '.ant-card-head': { padding: '0 !important', fontWeight: 'normal', backgroundColor: '#f6f8fa' },
        [`${o}-item-title`]: {
          color: '#636c76',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 16,
          borderRadius: '8px 8px 0 0 ',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          [`${o}-item-title-left`]: {
            backgroundColor: '#f6f8fa',
            color: '#636c76',
            display: 'flex',
            alignItems: 'center',
            columnGap: 6,
            'span:first-child': { fontWeight: 'bold', fontSize: 14 },
            'span:not(:first-child)': { fontWeight: 'normal', fontSize: 14 },
          },
          [`${o}-item-title-right`]: { marginRight: 16, flexShrink: 0 },
        },
        [`${o}-item-editor`]: {
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'white',
          borderRadius: '0 0 8px 8px',
          [`${o}-item-editor-button-area`]: { marginTop: 10, display: 'flex', columnGap: 5 },
        },
      },
    };
  }),
  W = (e) => {
    var v, I;
    const o = tSchema.useFieldSchema(),
      s = tSchema.useField(),
      [n] = react.useState(new Map()),
      { wrapSSR: m, hashId: l, componentCls: h } = q();
    tSchema.useForm();
    const { service: i } = tClient.useBlockRequestContext(),
      { run: d, params: f } = i,
      p = (v = i == null ? void 0 : i.data) == null ? void 0 : v.meta,
      L = react.useCallback(
        (S) => (
          n.has(S) || n.set(S, new tSchema.Schema({ type: 'object', properties: { [S]: o.properties.item } })), n.get(S)
        ),
        [o.properties, n],
      ),
      P = react.useCallback(
        (S, g) => {
          d(b(y({}, f == null ? void 0 : f[0]), { page: S, pageSize: g }));
        },
        [d, f],
      );
    return i != null && i.loading
      ? jsxRuntime.jsx('div', {
          style: { display: 'flex', justifyContent: 'center' },
          children: jsxRuntime.jsx(antd.Spin, { spinning: !0 }),
        })
      : m(
          jsxRuntime.jsx('div', {
            className: `${h} ${l}`,
            children: jsxRuntime.jsx(
              antd.List,
              b(y({}, e), {
                pagination:
                  !p || p.count <= p.pageSize
                    ? !1
                    : {
                        onChange: P,
                        total: (p == null ? void 0 : p.count) || 0,
                        pageSize: (p == null ? void 0 : p.pageSize) || 10,
                        current: (p == null ? void 0 : p.page) || 1,
                      },
                children: jsxRuntime.jsx('div', {
                  style: { display: 'flex', flexDirection: 'column' },
                  children:
                    (I = s.value) != null && I.length
                      ? s.value.map((S, g) => {
                          const u = g === 0,
                            x = g === s.value.length - 1;
                          return jsxRuntime.jsx(
                            'div',
                            {
                              style: { position: 'relative', padding: `${u ? 0 : '10px'} 0 ${x ? 0 : '10px'} 0` },
                              children: jsxRuntime.jsx(tSchema.RecursionField, {
                                basePath: s.address,
                                name: g,
                                onlyRenderProperties: !0,
                                schema: L(g),
                              }),
                            },
                            g,
                          );
                        })
                      : null,
                }),
              }),
            ),
          }),
        );
  },
  G = tClient.withDynamicSchemaProps(W),
  Y = tSchema.observer((e) => {
    var P, v, I, S, g;
    const { editing: o, setEditing: s } = e,
      n = tSchema.useField(),
      { t: m } = D(),
      { componentCls: l } = q(),
      h = tClient.useCollectionParentRecordData(),
      { resource: i, service: d } = tClient.useBlockRequestContext(),
      f = react.useCallback(
        () =>
          z(this, null, function* () {
            var u, x;
            yield i.update({
              filterByTk: (u = n.value) == null ? void 0 : u.id,
              values: { content: (x = n == null ? void 0 : n.value) == null ? void 0 : x.content },
            }),
              d.refresh();
          }),
        [i, d, n.value],
      ),
      p = tClient.useCollectionFields(),
      L = react.useMemo(() => {
        var u, x;
        return (x = (u = p.find((j) => j.name === 'content')) == null ? void 0 : u.uiSchema) == null
          ? void 0
          : x['x-component-props'];
      }, [p]);
    return jsxRuntime.jsx(tClient.RecordProvider, {
      record: n.value,
      parent: h,
      children: jsxRuntime.jsxs('div', {
        className: `${l}-item-container`,
        children: [
          jsxRuntime.jsx('div', { className: `${l}-item-container-line` }),
          jsxRuntime.jsx(antd.Card, {
            size: 'small',
            title: jsxRuntime.jsxs('div', {
              className: `${l}-item-title`,
              children: [
                jsxRuntime.jsxs('div', {
                  className: `${l}-item-title-left`,
                  children: [
                    jsxRuntime.jsx('span', {
                      children:
                        (v = (P = n == null ? void 0 : n.value) == null ? void 0 : P.createdBy) == null
                          ? void 0
                          : v.nickname,
                    }),
                    jsxRuntime.jsx('span', { children: m('commented') }),
                    jsxRuntime.jsx(antd.Tooltip, {
                      title: dayjs((I = n == null ? void 0 : n.value) == null ? void 0 : I.createdAt).format(
                        'YYYY-MM-DD HH:mm:ss',
                      ),
                      children: jsxRuntime.jsx('span', {
                        children: dayjs((S = n == null ? void 0 : n.value) == null ? void 0 : S.createdAt).fromNow(),
                      }),
                    }),
                  ],
                }),
                jsxRuntime.jsx('div', { className: `${l}-item-title-right`, children: e.children }),
              ],
            }),
            children: jsxRuntime.jsxs('div', {
              className: `${l}-item-editor`,
              children: [
                jsxRuntime.jsx(tSchema.RecursionField, {
                  basePath: n.address,
                  name: 'content',
                  schema: {
                    type: 'string',
                    name: 'content',
                    'x-component': 'MarkdownVditor',
                    'x-component-props': b(y({}, L), {
                      value: (g = n == null ? void 0 : n.value) == null ? void 0 : g.content,
                    }),
                    'x-read-pretty': !0,
                  },
                }),
                o &&
                  jsxRuntime.jsxs('div', {
                    className: `${l}-item-editor-button-area`,
                    children: [
                      jsxRuntime.jsx(antd.Button, {
                        onClick: () => {
                          n.form.setFieldState(`${n.address}.content`, (u) => {
                            u.pattern = 'readPretty';
                          }),
                            s(!1);
                        },
                        children: m('Cancel'),
                      }),
                      jsxRuntime.jsx(antd.Button, {
                        type: 'primary',
                        onClick: () => {
                          s(!1),
                            f(),
                            n.form.setFieldState(`${n.address}.content`, (u) => {
                              u.pattern = 'readPretty';
                            });
                        },
                        children: m('Update Comment'),
                      }),
                    ],
                  }),
              ],
            }),
          }),
        ],
      }),
    });
  }),
  $ = react.createContext({});
function H(e) {
  tSchema.useField();
  const o = tSchema.useFieldSchema(),
    [s, n] = react.useState(!1),
    { dn: m } = tClient.useDesignable();
  react.useEffect(() => {
    var d;
    const i = (d = m.current['x-component-props']) == null ? void 0 : d.createAble;
    n(i === void 0 ? !0 : i);
  }, []);
  const l = react.useCallback(
      (i) => {
        const d = Object.assign({}, o['x-component-props'], i);
        (o['x-component-props'] = d),
          m.emit('patch', { schema: { 'x-uid': o['x-uid'], 'x-component-props': o['x-component-props'] } }),
          m.refresh();
      },
      [m, o],
    ),
    h = react.useCallback(
      (i) => {
        l({ createAble: i }), n(i);
      },
      [n, l],
    );
  return jsxRuntime.jsx($.Provider, { value: { createAble: s, setCreateAble: h }, children: e.children });
}
function O() {
  return react.useContext($);
}
const X = tClient.withDynamicSchemaProps((e) => {
  var o;
  return jsxRuntime.jsx(
    H,
    b(y({}, e), {
      children: jsxRuntime.jsx(
        tClient.List.Decorator,
        b(y({}, e), {
          children: jsxRuntime.jsx(tClient.CollectionManagerProvider, {
            dataSource: e.dataSource,
            children: jsxRuntime.jsx(tClient.CollectionProvider, {
              name: `${(o = e.association) != null ? o : e.collection}`,
              children: e.children,
            }),
          }),
        }),
      ),
    }),
  );
});
function J() {
  var g;
  const e = tSchema.useField(),
    o = react.useCallback(
      (u) => {
        e.setValue(b(y({}, e.value), { content: u }));
      },
      [e],
    ),
    { t: s } = D(),
    { wrapSSR: n, componentCls: m, hashId: l } = q(),
    h = react.useMemo(() => {
      var u, x;
      return ((x = (u = e.value) == null ? void 0 : u.content) == null ? void 0 : x.trim().length) > 0;
    }, [e.value]),
    { resource: i, service: d } = tClient.useBlockRequestContext(),
    f = react.useCallback(
      () =>
        z(this, null, function* () {
          yield i.create({ values: e.value }), o(''), d.refresh();
        }),
      [i, e, d, o],
    ),
    { createAble: p } = O(),
    L = tClient.useACLActionParamsContext(),
    { designable: P } = tClient.useDesignable(),
    v = !P && (((g = e == null ? void 0 : e.data) == null ? void 0 : g.hidden) || !L),
    I = tClient.useCollectionFields(),
    S = react.useMemo(() => {
      var u, x;
      return (x = (u = I.find((j) => j.name === 'content')) == null ? void 0 : u.uiSchema) == null
        ? void 0
        : x['x-component-props'];
    }, [I]);
  return !p || v
    ? null
    : n(
        jsxRuntime.jsxs('div', {
          style: { marginTop: 10 },
          className: `${m} ${l}`,
          children: [
            jsxRuntime.jsx(tSchema.RecursionField, {
              basePath: e.address,
              name: 'content',
              schema: {
                type: 'string',
                'x-component': 'MarkdownVditor',
                'x-component-props': b(y({}, S), {
                  onChange: (u) => {
                    o(u);
                  },
                }),
                'x-read-pretty': !1,
                'x-read-only': !1,
                name: 'content',
              },
            }),
            jsxRuntime.jsx(antd.Button, {
              disabled: !h,
              onClick: () => f(),
              type: 'primary',
              style: { marginTop: 10 },
              children: s('Comment'),
            }),
          ],
        }),
      );
}
const w = () => null;
(w.ActionBar = tClient.ActionBar), (w.List = G), (w.Item = Y), (w.Decorator = X), (w.Submit = J);
const Z = new tClient.SchemaSettings({
  name: 'blockSettings:comment',
  items: [
    { name: 'title', Component: tClient.SchemaSettingsBlockTitleItem },
    {
      name: 'SetTheDataScope',
      Component: tClient.SchemaSettingsDataScope,
      useComponentProps() {
        var l, h;
        const { name: e } = tClient.useCollection_deprecated(),
          o = tSchema.useFieldSchema(),
          { form: s } = tClient.useFormBlockContext(),
          n = tSchema.useField(),
          { dn: m } = tClient.useDesignable();
        return {
          collectionName: e,
          defaultFilter:
            ((h = (l = o == null ? void 0 : o['x-decorator-props']) == null ? void 0 : l.params) == null
              ? void 0
              : h.filter) || {},
          form: s,
          onSubmit: ({ filter: i }) => {
            (i = tClient.removeNullCondition(i)),
              lodash.set(o, 'x-decorator-props.params.filter', i),
              (n.decoratorProps.params = b(y({}, o['x-decorator-props'].params), { page: 1 })),
              m.emit('patch', { schema: { 'x-uid': o['x-uid'], 'x-decorator-props': o['x-decorator-props'] } });
          },
        };
      },
    },
    { name: 'divider', type: 'divider' },
    {
      name: 'EnableCreate',
      type: 'switch',
      useComponentProps() {
        const { setCreateAble: e, createAble: o } = O(),
          { t: s } = D();
        return { title: s('Enable Create'), checked: o, onChange: e };
      },
    },
    {
      name: 'remove',
      type: 'remove',
      componentProps: { removeParentsIfNoChildren: !0, breakRemoveOn: { 'x-component': 'Grid' } },
    },
  ],
});
function R(e) {
  let o;
  return (
    e.association && (o = tClient.useParentRecordCommon(e.association)),
    { parentRecord: o, params: { pageSize: 100, appends: ['createdBy'], sort: ['createdAt'] } }
  );
}
const _ = (e) => {
    const { collectionName: o, dataSource: s, association: n, rowKey: m } = e;
    return {
      type: 'void',
      'x-acl-action': `${n || o}:view`,
      'x-decorator': 'Comment.Decorator',
      'x-use-decorator-props': 'useCommentBlockDecoratorProps',
      'x-decorator-props': {
        collection: o,
        dataSource: s,
        association: n,
        readPretty: !0,
        action: 'list',
        runWhenParamsChanged: !0,
      },
      'x-component': 'CardItem',
      'x-toolbar': 'BlockSchemaToolbar',
      'x-settings': 'blockSettings:comment',
      properties: {
        list: {
          type: 'array',
          'x-component': 'Comment.List',
          properties: {
            item: {
              type: 'object',
              'x-component': 'Comment.Item',
              'x-read-pretty': !0,
              properties: {
                actionBar: {
                  type: 'void',
                  'x-align': 'left',
                  'x-initializer': 'comment:configureItemActions',
                  'x-component': 'ActionBar',
                  'x-component-props': { layout: 'one-column' },
                },
              },
            },
          },
        },
        submit: {
          type: 'string',
          'x-component': 'Comment.Submit',
          'x-acl-action': `${n || o}:create`,
          'x-decorator': 'ACLCollectionProvider',
          'x-decorator-props': { collection: o, dataSource: s, association: n },
        },
      },
    };
  },
  ee = ({
    filterCollections: e,
    filterOtherRecordsCollection: o,
    onlyCurrentDataSource: s,
    hideSearch: n,
    showAssociationFields: m,
    hideOtherRecordsInPopup: l,
  }) => {
    const { insert: h } = tClient.useSchemaInitializer(),
      i = tClient.useSchemaInitializerItem();
    react.useContext(tSchema.SchemaOptionsContext);
    const { getCollection: d } = tClient.useCollectionManager_deprecated();
    return jsxRuntime.jsx(
      tClient.DataBlockInitializer,
      b(y({}, i), {
        componentType: 'Comment',
        icon: jsxRuntime.jsx(antIcons.CommentOutlined, {}),
        onlyCurrentDataSource: s,
        hideSearch: n,
        filter: e,
        filterOtherRecordsCollection: o,
        showAssociationFields: m,
        hideOtherRecordsInPopup: l,
        onCreateBlockSchema: (L) =>
          z(this, [L], function* ({ item: f, fromOthersInPopup: p }) {
            const P = d(f.name, f.dataSource),
              v = f.associationField;
            h(
              _(
                v && !p
                  ? {
                      dataSource: f.dataSource,
                      rowKey: P.filterTargetKey || 'id',
                      association: `${v.collectionName}.${v.name}`,
                    }
                  : { collectionName: f.name, dataSource: f.dataSource, rowKey: P.filterTargetKey || 'id' },
              ),
            );
          }),
      }),
    );
  };
function te() {
  var h;
  const e = tSchema.useField(),
    { t: o } = D(),
    [s, n] = react.useState(!1),
    m = tClient.useACLActionParamsContext(),
    { designable: l } = tClient.useDesignable();
  return (
    react.useEffect(() => {
      const i = e.address.slice(0, e.address.length - 2);
      e.form.setFieldState(i.concat('content'), (d) => {
        d.pattern = s ? 'editable' : 'readPretty';
      }),
        e.form.setFieldState(i, (d) => {
          d.componentProps = b(y({}, d.componentProps), { editing: s, setEditing: n });
        });
    }, [s, e.address, e.form]),
    !l && (((h = e == null ? void 0 : e.data) != null && h.hidden) || !m)
      ? null
      : jsxRuntime.jsx('a', {
          style: { fontSize: 14 },
          onClick: () => {
            n(!0);
          },
          children: o('Edit'),
        })
  );
}
function oe(e) {
  const o = { type: 'void', title: '{{t("Edit")}}', 'x-component': 'UpdateCommentActionButton' };
  return jsxRuntime.jsx(tClient.ActionInitializer, b(y({}, e), { schema: o }));
}
function ne() {
  var l;
  const e = tSchema.useField(),
    { t: o } = D(),
    s = tClient.useACLActionParamsContext(),
    { designable: n } = tClient.useDesignable(),
    m = react.useCallback(() => {
      var f;
      const h = e.address.slice(0, e.address.length - 4).concat('submit.content'),
        i = e.address.slice(0, e.address.length - 2).concat('content'),
        d = (f = e.form.getValuesIn(i)) != null ? f : '';
      e.form.setValuesIn(
        h,
        `${d
          .split(
            `
`,
          )
          .map((p) => `> ${p}`).join(`
`)}`,
      );
    }, [e.address, e.form]);
  return !n && (((l = e == null ? void 0 : e.data) != null && l.hidden) || !s)
    ? null
    : jsxRuntime.jsx('a', { style: { fontSize: 14 }, onClick: m, children: o('Quote Reply') });
}
function re(e) {
  const { t: o } = D(),
    s = { type: 'void', title: o('Quote Reply'), 'x-component': 'QuoteReplyCommentActionButton' };
  return jsxRuntime.jsx(tClient.ActionInitializer, b(y({}, e), { schema: s }));
}
const ae = new tClient.SchemaInitializer({
  name: 'comment:configureItemActions',
  title: '{{t("Configure actions")}}',
  icon: 'SettingOutlined',
  items: [
    {
      type: 'itemGroup',
      name: 'enableActions',
      title: '{{t("Enable actions")}}',
      children: [
        {
          name: 'edit',
          title: '{{t("Edit")}}',
          Component: 'UpdateCommentActionInitializer',
          schema: { 'x-action': 'update', 'x-decorator': 'ACLActionProvider', 'x-align': 'left' },
          useVisible() {
            const e = tClient.useCollection_deprecated();
            return (e.template !== 'view' || (e == null ? void 0 : e.writableView)) && e.template !== 'sql';
          },
        },
        {
          name: 'delete',
          title: '{{t("Delete")}}',
          Component: 'DestroyActionInitializer',
          schema: {
            'x-component': 'Action.Link',
            'x-action': 'destroy',
            'x-decorator': 'ACLActionProvider',
            'x-align': 'left',
          },
          useVisible() {
            return tClient.useCollection_deprecated().template !== 'sql';
          },
        },
        {
          name: 'reply',
          title: T('Quote Reply'),
          Component: 'QuoteReplyCommentActionInitializer',
          schema: { 'x-action': 'create', 'x-decorator': 'ACLActionProvider', 'x-align': 'left' },
          useVisible() {
            return tClient.useCollection_deprecated().template !== 'sql';
          },
        },
      ],
    },
  ],
});
class Q extends tClient.Plugin {
  afterAdd() {
    return z(this, null, function* () {});
  }
  beforeLoad() {
    return z(this, null, function* () {});
  }
  load() {
    return z(this, null, function* () {
      this.app.dataSourceManager.addCollectionTemplates([K]),
        this.app.schemaInitializerManager.addItem('page:addBlock', 'dataBlocks.comment', {
          title: T('Comment'),
          Component: 'CommentBlockInitializer',
          useComponentProps() {
            return {
              filterCollections({ collection: o }) {
                return o.template === 'comment';
              },
            };
          },
        }),
        this.app.schemaInitializerManager.addItem('popup:common:addBlock', 'dataBlocks.comment', {
          title: T('Comment'),
          Component: 'CommentBlockInitializer',
          useVisible() {
            const o = tClient.useCollection();
            return react.useMemo(
              () =>
                o.fields.some(
                  (s) => tClient.canMakeAssociationBlock(s) && ['hasMany', 'belongsToMany'].includes(s.type),
                ),
              [o.fields],
            );
          },
          useComponentProps() {
            const o = tClient.useCollectionManager();
            return {
              onlyCurrentDataSource: !0,
              filterCollections({ associationField: s }) {
                if (s) {
                  if (!['hasMany', 'belongsToMany'].includes(s.type)) return !1;
                  const n = o.getCollection(s.target);
                  return (n == null ? void 0 : n.template) === 'comment';
                }
                return !1;
              },
              filterOtherRecordsCollection(s) {
                return (s == null ? void 0 : s.template) === 'comment';
              },
              showAssociationFields: !0,
              hideOtherRecordsInPopup: !1,
              hideSearch: !0,
            };
          },
        }),
        this.app.addComponents({
          CommentBlockInitializer: ee,
          Comment: w,
          UpdateCommentActionInitializer: oe,
          UpdateCommentActionButton: te,
          QuoteReplyCommentActionButton: ne,
          QuoteReplyCommentActionInitializer: re,
        }),
        this.app.addScopes({ useCommentBlockDecoratorProps: R }),
        this.schemaSettingsManager.add(Z),
        this.schemaInitializerManager.add(ae);
    });
  }
}

export default Q;
