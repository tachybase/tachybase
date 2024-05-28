// NOTE: 全部整理完后, 确认运行一段时间, 无误后, 再删除此文件
// 同时,删除注释代码
// 删除无用引用

// 1. 拆解 refined 文件, 根据归类原则
// 2. 反编译文件
// 3. 根据功能进行归类, 根据就近原则
/* eslint-disable */
import { MoreOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import {
  CollectionContext,
  ResourceActionProvider,
  useFilterFieldProps,
  useCollectionManager_deprecated,
  useCompile,
  useCollection_deprecated,
  mergeFilter,
  removeNullCondition,
  Checkbox,
  EllipsisWithTooltip,
  CollectionProvider_deprecated,
  RecordProvider,
  ResourceActionContext,
  SchemaComponent,
  ActionContextProvider,
  createStyles,
  css,
  useAPIClient,
  useActionContext,
  SchemaComponentOptions,
  useFilterFieldOptions,
  useRecord,
  useRequest,
  useResourceActionContext,
} from '@tachybase/client';
import { RolesManagerContext } from '@tachybase/plugin-acl/client';
import { uid, useField, useFieldSchema, useForm } from '@tachybase/schema';
import {
  App,
  Button,
  Col,
  Divider,
  Dropdown,
  Empty,
  Input,
  Row,
  Select,
  Table,
  Tag,
  Tree,
  TreeSelect,
  theme,
} from 'antd';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState, Fragment } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useTranslation } from '../../locale';

var wt = Object.defineProperty,
  Ft = Object.defineProperties;
var Mt = Object.getOwnPropertyDescriptors;
var me = Object.getOwnPropertySymbols;
var Tt = Object.prototype.hasOwnProperty,
  It = Object.prototype.propertyIsEnumerable;
export var de = (w, s, n) =>
    s in w ? wt(w, s, { enumerable: true, configurable: true, writable: true, value: n }) : (w[s] = n),
  y = (w, s) => {
    for (var n in s || (s = {})) Tt.call(s, n) && de(w, n, s[n]);
    if (me) for (var n of me(s)) It.call(s, n) && de(w, n, s[n]);
    return w;
  },
  T = (w, s) => Ft(w, Mt(s));
var k = (w, s, n) =>
  new Promise((D, p) => {
    var j = (V) => {
        try {
          N(n.next(V));
        } catch (I) {
          p(I);
        }
      },
      Y = (V) => {
        try {
          N(n.throw(V));
        } catch (I) {
          p(I);
        }
      },
      N = (V) => (V.done ? D(V.value) : Promise.resolve(V.value).then(j, Y));
    N((n = n.apply(w, s)).next());
  });
const xe = () => {
  const { t: e } = useTranslation();
  return jsx(SchemaComponent, {
    scope: { t: e },
    schema: {
      type: 'void',
      properties: {
        newDepartment: {
          type: 'void',
          title: e('New department'),
          'x-component': 'Action',
          'x-component-props': { type: 'text', icon: 'PlusOutlined', style: { width: '100%', textAlign: 'left' } },
          properties: {
            drawer: {
              type: 'void',
              'x-component': 'Action.Drawer',
              'x-decorator': 'Form',
              title: e('New department'),
              properties: {
                title: { 'x-component': 'CollectionField', 'x-decorator': 'FormItem', required: true },
                parent: {
                  'x-component': 'CollectionField',
                  'x-decorator': 'FormItem',
                  'x-collection-field': 'departments.parent',
                  'x-component-props': { component: 'DepartmentSelect' },
                },
                roles: {
                  'x-component': 'CollectionField',
                  'x-decorator': 'FormItem',
                  'x-collection-field': 'departments.roles',
                },
                footer: {
                  type: 'void',
                  'x-component': 'Action.Drawer.Footer',
                  properties: {
                    cancel: {
                      title: '{{t("Cancel")}}',
                      'x-component': 'Action',
                      'x-component-props': { useAction: '{{ cm.useCancelAction }}' },
                    },
                    submit: {
                      title: '{{t("Submit")}}',
                      'x-component': 'Action',
                      'x-component-props': { type: 'primary', useAction: '{{ useCreateDepartment }}' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};
const ye = {
  type: 'object',
  properties: {
    [uid()]: {
      type: 'void',
      'x-component': 'Action.Drawer',
      'x-decorator': 'Form',
      'x-decorator-props': {
        useValues(e) {
          const t = useActionContext(),
            o = useRecord();
          return useRequest(
            () => Promise.resolve({ data: { parent: { ...o } } }),
            T({ ...e }, { refreshDeps: [t.visible] }),
          );
        },
      },
      title: '{{t("New sub department")}}',
      properties: {
        title: { 'x-component': 'CollectionField', 'x-decorator': 'FormItem' },
        parent: {
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'departments.parent',
          'x-component-props': { component: 'DepartmentSelect' },
        },
        roles: {
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'departments.roles',
        },
        footer: {
          type: 'void',
          'x-component': 'Action.Drawer.Footer',
          properties: {
            cancel: {
              title: '{{t("Cancel")}}',
              'x-component': 'Action',
              'x-component-props': { useAction: '{{ cm.useCancelAction }}' },
            },
            submit: {
              title: '{{t("Submit")}}',
              'x-component': 'Action',
              'x-component-props': { type: 'primary', useAction: '{{ useCreateDepartment }}' },
            },
          },
        },
      },
    },
  },
};
const he = {
  type: 'object',
  properties: {
    [uid()]: {
      type: 'void',
      'x-component': 'Action.Drawer',
      'x-decorator': 'Form',
      'x-decorator-props': {
        useValues(e) {
          const t = useAPIClient(),
            o = useActionContext(),
            a = useRecord(),
            r = useRequest(
              () =>
                t
                  .resource('departments')
                  .get({ filterByTk: a.id, appends: ['parent(recursively=true)', 'roles', 'owners'] })
                  .then((c) => (c == null ? void 0 : c.data)),
              T({ ...e }, { manual: true }),
            );
          return (
            useEffect(() => {
              o.visible && r.run();
            }, [o.visible]),
            r
          );
        },
      },
      title: '{{t("Edit department")}}',
      properties: {
        title: { 'x-component': 'CollectionField', 'x-decorator': 'FormItem' },
        parent: {
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'departments.parent',
          'x-component-props': { component: 'SuperiorDepartmentSelect' },
        },
        roles: {
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'departments.roles',
        },
        owners: { title: '{{t("Owners")}}', 'x-component': 'DepartmentOwnersField', 'x-decorator': 'FormItem' },
        footer: {
          type: 'void',
          'x-component': 'Action.Drawer.Footer',
          properties: {
            cancel: {
              title: '{{t("Cancel")}}',
              'x-component': 'Action',
              'x-component-props': { useAction: '{{ cm.useCancelAction }}' },
            },
            submit: {
              title: '{{t("Submit")}}',
              'x-component': 'Action',
              'x-component-props': { type: 'primary', useAction: '{{ useUpdateDepartment }}' },
            },
          },
        },
      },
    },
  },
};
const fe = {
    type: 'void',
    properties: {
      drawer: {
        title: '{{t("Select Owners")}}',
        'x-component': 'Action.Drawer',
        properties: {
          resource: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': 'RequestProvider',
            properties: {
              actions: {
                type: 'void',
                'x-component': 'ActionBar',
                'x-component-props': { style: { marginBottom: 16 } },
                properties: {
                  filter: {
                    type: 'void',
                    title: '{{ t("Filter") }}',
                    default: { $and: [{ username: { $includes: '' } }, { nickname: { $includes: '' } }] },
                    'x-action': 'filter',
                    'x-component': 'Filter.Action',
                    'x-use-component-props': 'useFilterActionProps',
                    'x-component-props': { icon: 'FilterOutlined' },
                    'x-align': 'left',
                  },
                },
              },
              table: {
                type: 'void',
                'x-component': 'Table.Void',
                'x-component-props': {
                  rowKey: 'id',
                  rowSelection: { type: 'checkbox', onChange: '{{ handleSelect }}' },
                  useDataSource: '{{ cm.useDataSourceFromRAC }}',
                },
                properties: {
                  username: {
                    type: 'void',
                    'x-decorator': 'Table.Column.Decorator',
                    'x-component': 'Table.Column',
                    properties: {
                      username: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true },
                    },
                  },
                  nickname: {
                    type: 'void',
                    'x-decorator': 'Table.Column.Decorator',
                    'x-component': 'Table.Column',
                    properties: {
                      nickname: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true },
                    },
                  },
                  phone: {
                    type: 'void',
                    'x-decorator': 'Table.Column.Decorator',
                    'x-component': 'Table.Column',
                    properties: { phone: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true } },
                  },
                  email: {
                    type: 'void',
                    'x-decorator': 'Table.Column.Decorator',
                    'x-component': 'Table.Column',
                    properties: { email: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true } },
                  },
                },
              },
            },
          },
          footer: {
            type: 'void',
            'x-component': 'Action.Drawer.Footer',
            properties: {
              cancel: {
                title: '{{t("Cancel")}}',
                'x-component': 'Action',
                'x-component-props': { useAction: '{{ cm.useCancelAction }}' },
              },
              confirm: {
                title: '{{t("Confirm")}}',
                'x-component': 'Action',
                'x-component-props': { type: 'primary', useAction: '{{ useSelectOwners }}' },
              },
            },
          },
        },
      },
    },
  },
  Q = {
    name: 'departments',
    fields: [
      {
        type: 'bigInt',
        name: 'id',
        primaryKey: true,
        autoIncrement: true,
        interface: 'id',
        uiSchema: { type: 'id', title: '{{t("ID")}}' },
      },
      {
        name: 'title',
        type: 'string',
        interface: 'input',
        uiSchema: { type: 'string', title: '{{t("Department name")}}', 'x-component': 'Input', required: true },
      },
      {
        name: 'parent',
        type: 'belongsTo',
        interface: 'm2o',
        collectionName: 'departments',
        foreignKey: 'parentId',
        target: 'departments',
        targetKey: 'id',
        treeParent: true,
        uiSchema: { title: '{{t("Superior department")}}', 'x-component': 'DepartmentSelect' },
      },
      {
        interface: 'm2m',
        type: 'belongsToMany',
        name: 'roles',
        target: 'roles',
        collectionName: 'departments',
        through: 'departmentsRoles',
        foreignKey: 'departmentId',
        otherKey: 'roleName',
        targetKey: 'name',
        sourceKey: 'id',
        uiSchema: {
          title: '{{t("Roles")}}',
          'x-component': 'AssociationField',
          'x-component-props': { multiple: true, fieldNames: { label: 'title', value: 'name' } },
        },
      },
      {
        interface: 'm2m',
        type: 'belongsToMany',
        name: 'owners',
        collectionName: 'departments',
        target: 'users',
        through: 'departmentsUsers',
        foreignKey: 'departmentId',
        otherKey: 'userId',
        targetKey: 'id',
        sourceKey: 'id',
        scope: { isOwner: true },
        uiSchema: {
          title: '{{t("Owners")}}',
          'x-component': 'AssociationField',
          'x-component-props': { multiple: true, fieldNames: { label: 'nickname', value: 'id' } },
        },
      },
    ],
  };
const ve = {
  name: 'users',
  fields: [
    {
      name: 'id',
      type: 'bigInt',
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      uiSchema: { type: 'number', title: '{{t("ID")}}', 'x-component': 'InputNumber', 'x-read-pretty': true },
      interface: 'id',
    },
    {
      interface: 'input',
      type: 'string',
      name: 'nickname',
      uiSchema: { type: 'string', title: '{{t("Nickname")}}', 'x-component': 'Input' },
    },
    {
      interface: 'input',
      type: 'string',
      name: 'username',
      unique: true,
      uiSchema: {
        type: 'string',
        title: '{{t("Username")}}',
        'x-component': 'Input',
        'x-validator': { username: true },
        required: true,
      },
    },
    {
      interface: 'email',
      type: 'string',
      name: 'email',
      unique: true,
      uiSchema: {
        type: 'string',
        title: '{{t("Email")}}',
        'x-component': 'Input',
        'x-validator': 'email',
        required: true,
      },
    },
    {
      interface: 'phone',
      type: 'string',
      name: 'phone',
      unique: true,
      uiSchema: {
        type: 'string',
        title: '{{t("Phone")}}',
        'x-component': 'Input',
        'x-validator': 'phone',
        required: true,
      },
    },
    {
      interface: 'm2m',
      type: 'belongsToMany',
      name: 'roles',
      target: 'roles',
      foreignKey: 'userId',
      otherKey: 'roleName',
      onDelete: 'CASCADE',
      sourceKey: 'id',
      targetKey: 'name',
      through: 'rolesUsers',
      uiSchema: {
        type: 'array',
        title: '{{t("Roles")}}',
        'x-component': 'AssociationField',
        'x-component-props': { multiple: true, fieldNames: { label: 'title', value: 'name' } },
      },
    },
    {
      name: 'departments',
      type: 'belongsToMany',
      interface: 'm2m',
      target: 'departments',
      foreignKey: 'userId',
      otherKey: 'departmentId',
      onDelete: 'CASCADE',
      sourceKey: 'id',
      targetKey: 'id',
      through: 'departmentsUsers',
      uiSchema: { type: 'array', title: '{{t("Departments")}}', 'x-component': 'DepartmentField' },
    },
    {
      interface: 'm2m',
      type: 'belongsToMany',
      name: 'mainDepartment',
      target: 'departments',
      foreignKey: 'userId',
      otherKey: 'departmentId',
      onDelete: 'CASCADE',
      sourceKey: 'id',
      targetKey: 'id',
      through: 'departmentsUsers',
      throughScope: { isMain: true },
      uiSchema: { type: 'array', title: '{{t("Main department")}}', 'x-component': 'DepartmentField' },
    },
  ],
};
const K = React.createContext({ user: {}, department: {} });
export const GeComponent = (e) => {
  const [t, o] = useState(null),
    [a, r] = useState(null),
    c = useRequest({
      resource: 'users',
      action: 'list',
      params: {
        appends: ['departments', 'departments.parent(recursively=true)'],
        filter: a ? { 'departments.id': a.id } : {},
        pageSize: 50,
      },
    });
  useEffect(() => {
    c.run();
  }, [a]);
  const i = { resource: 'departments', action: 'list', params: { pagination: false, filter: { parentId: null } } },
    x = useRequest(i);
  return jsx(K.Provider, {
    value: {
      user: t,
      setUser: o,
      department: a,
      setDepartment: r,
      usersResource: { service: c },
      departmentsResource: { service: x },
    },
    children: e.children,
  });
};
const Ce = (e) => {
  const { departmentsResource: t } = useContext(K),
    { service: o } = t || {};
  return jsx(ResourceActionContext.Provider, {
    value: { ...o },
    children: jsx(CollectionProvider_deprecated, { collection: Q, children: e.children }),
  });
};
const be = (e) => {
  const { usersResource: t } = useContext(K),
    { service: o } = t || {};
  return jsx(ResourceActionContext.Provider, {
    value: { ...o },
    children: jsx(CollectionProvider_deprecated, { collection: ve, children: e.children }),
  });
};
const X = () => {
  const { data: e, loading: t } = useResourceActionContext(),
    { department: o, setDepartment: a, setUser: r } = useContext(K),
    {
      treeData: c,
      nodeMap: i,
      loadData: x,
      loadedKeys: m,
      setLoadedKeys: g,
      initData: d,
      expandedKeys: A,
      setExpandedKeys: b,
    } = useContext(_),
    h = (v) => {
      if (!v.length) return;
      const l = i[v[0]];
      a(l), r(null);
    },
    F = (v) => {
      b(v);
    },
    C = (v) => {
      g(v);
    };
  return (
    useEffect(() => {
      d(e == null ? void 0 : e.data);
    }, [e, d, t]),
    useEffect(() => {
      if (!o) return;
      const v = (u) => (u.parent ? [u.parent.id, ...v(u.parent)] : []),
        l = v(o);
      b((u) => Array.from(new Set([...u, ...l])));
    }, [o, b]),
    jsx('div', {
      className: css`
        height: 57vh;
        overflow: auto;
        .ant-tree-node-content-wrapper {
          overflow: hidden;
        }
      `,
      children:
        c != null && c.length
          ? jsx(Tree.DirectoryTree, {
              loadData: x,
              treeData: c,
              loadedKeys: m,
              onSelect: h,
              selectedKeys: [o == null ? void 0 : o.id],
              onExpand: F,
              onLoad: C,
              expandedKeys: A,
              expandAction: false,
              showIcon: false,
              fieldNames: { key: 'id' },
            })
          : jsx(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE }),
    })
  );
};
X.Item = function ({ node: t, setVisible: o, setDrawer: a }) {
  const { t: r } = useTranslation(),
    { refreshAsync: c } = useResourceActionContext(),
    { setLoadedKeys: i, expandedKeys: x, setExpandedKeys: m } = useContext(_),
    { modal: g, message: d } = App.useApp(),
    A = useAPIClient(),
    b = () => {
      g.confirm({
        title: r('Delete'),
        content: r('Are you sure you want to delete it?'),
        onOk: () =>
          k(this, null, function* () {
            yield A.resource('departments').destroy({ filterByTk: t.id }),
              d.success(r('Deleted successfully')),
              m((v) => v.filter((l) => l !== t.id));
            const C = [...x];
            i([]), m([]), yield c(), m(C);
          }),
      });
    },
    h = (C) => {
      a({ schema: C, node: t }), o(true);
    },
    F = ({ key: C, domEvent: v }) => {
      switch ((v.stopPropagation(), C)) {
        case 'new-sub':
          h(ye);
          break;
        case 'edit':
          h(he);
          break;
        case 'delete':
          b();
      }
    };
  return jsxs('div', {
    style: { display: 'flex', justifyContent: 'space-between', overflow: 'hidden' },
    children: [
      jsx('div', {
        style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        children: t.title,
      }),
      jsx(Dropdown, {
        menu: {
          items: [
            { label: r('New sub department'), key: 'new-sub' },
            { label: r('Edit department'), key: 'edit' },
            { label: r('Delete department'), key: 'delete' },
          ],
          onClick: F,
        },
        children: jsx('div', {
          style: { marginLeft: '15px' },
          children: jsx(MoreOutlined, {}),
        }),
      }),
    ],
  });
};
const Ae = createStyles(({ css: e }) => ({
  searchDropdown: e`
      .ant-dropdown-menu {
        max-height: 500px;
        overflow-y: scroll;
      }
    `,
}));
const Se = () => {
  const { t: e } = useTranslation(),
    { token: t } = theme.useToken(),
    { setDepartment: o, setUser: a } = useContext(K),
    [r, c] = useState(false),
    [i, x] = useState(''),
    [m, g] = useState([]),
    [d, A] = useState([]),
    [b, h] = useState(true),
    [F, C] = useState(true),
    { styles: v } = Ae(),
    l = 10,
    u = useAPIClient(),
    f = useRequest(
      (M) =>
        u
          .resource('departments')
          .aggregateSearch(M)
          .then((P) => {
            var q;
            return (q = P == null ? void 0 : P.data) == null ? void 0 : q.data;
          }),
      {
        manual: true,
        onSuccess: (M, P) => {
          const {
            values: { type: q },
          } = P[0] || {};
          M &&
            ((!q || q === 'user') && M.users.length < l && h(false),
            (!q || q === 'department') && M.departments.length < l && C(false),
            g((se) => [...se, ...M.users]),
            A((se) => [...se, ...M.departments]));
        },
      },
    ),
    { run: S } = f,
    O = (M) => {
      x(M), g([]), A([]), h(true), C(true), M && (S({ values: { keyword: M, limit: l } }), c(true));
    },
    $ = (M) => {
      M.target.value || (a(null), x(''), c(false), f.mutate({}), g([]), A([]));
    },
    W = (M) => {
      const P = M.title,
        q = M.parent;
      return q ? W(q) + ' / ' + P : P;
    },
    H = (M) =>
      jsx(Button, {
        type: 'link',
        style: { padding: '0 8px' },
        onClick: (P) => {
          c(true), S({ values: { keyword: i, limit: l, ...M } });
        },
        children: e('Load more'),
      }),
    J = () => {
      const M = [];
      return !m.length && !d.length
        ? [
            {
              key: '0',
              label: jsx(Empty, {
                description: e('No results'),
                image: Empty.PRESENTED_IMAGE_SIMPLE,
              }),
              disabled: true,
            },
          ]
        : (m.length &&
            (M.push({
              key: '0',
              type: 'group',
              label: e('Users'),
              children: m.map((P) => ({
                key: P.username,
                label: jsxs('div', {
                  onClick: () => a(P),
                  children: [
                    jsx('div', { children: P.nickname || P.username }),
                    jsx('div', {
                      style: { fontSize: t.fontSizeSM, color: t.colorTextDescription },
                      children: `${P.username}${P.phone ? ' | ' + P.phone : ''}${P.email ? ' | ' + P.email : ''}`,
                    }),
                  ],
                }),
              })),
            }),
            b &&
              M.push({
                type: 'group',
                key: '0-loadMore',
                label: jsx(H, { type: 'user', last: m[m.length - 1].id }),
              })),
          d.length &&
            (M.push({
              key: '1',
              type: 'group',
              label: e('Departments'),
              children: d.map((P) => ({
                key: P.id,
                label: jsx('div', { onClick: () => o(P), children: W(P) }),
              })),
            }),
            F &&
              M.push({
                type: 'group',
                key: '1-loadMore',
                label: jsx(H, { type: 'department', last: d[d.length - 1].id }),
              })),
          M);
    };
  return jsx(Dropdown, {
    menu: { items: J() },
    overlayClassName: v.searchDropdown,
    trigger: ['click'],
    open: r,
    onOpenChange: (M) => c(M),
    children: jsx(Input.Search, {
      allowClear: true,
      onClick: () => {
        i || c(false);
      },
      onFocus: () => o(null),
      onSearch: O,
      onChange: $,
      placeholder: e('Search for departments, users'),
      style: { marginBottom: '20px' },
    }),
  });
};
const De = (e) => {
  const { label: t } = e || {},
    [o, a] = useState([]),
    [r, c] = useState({}),
    [i, x] = useState([]),
    [m, g] = useState([]),
    d = useCallback((C) => {
      const v = {},
        l = (f) => {
          let S = f ? { ...f } : null;
          for (; S; ) {
            const O = S.parentId || 'root';
            v[O]
              ? (v[O].childrenMap[S.id] = S)
              : (v[O] = T({ ...(S.parent || { id: O }) }, { childrenMap: { [S.id]: S } })),
              (S = S.parent);
          }
        },
        u = (f) => {
          const S = {};
          f.children &&
            f.children.length &&
            f.children.forEach((O) => {
              (S[O.id] = O), u(O);
            }),
            (v[f.id] = T({ ...f }, { childrenMap: S }));
        };
      return (
        C &&
          C.length &&
          C.forEach((f) => {
            l(f), u(f);
          }),
        v
      );
    }, []),
    A = useCallback((C) => {
      const v = (l) => {
        var u;
        return !C[l] || C[l].isLeaf
          ? null
          : Object.values(((u = C[l]) == null ? void 0 : u.childrenMap) || {}).map((f: object) =>
              T({ ...f }, { title: t ? React.createElement(t, { node: f }) : f.title, children: v(f.id) }),
            );
      };
      return v('root');
    }, []),
    b = useCallback(
      (C) => {
        const v = d(C);
        c(v);
        const l = A(v) || [];
        a(l);
      },
      [a, d, A],
    ),
    h = (C, v) => {
      const l = d(v),
        u = { ...l, ...r };
      return (
        v.forEach((f) => {
          u[C].childrenMap[f.id] = f;
        }),
        c(u),
        A(u)
      );
    },
    F = useCallback(
      (C) => {
        if (!r[C]) return [];
        const v = [];
        return (
          v.push(...Object.keys(r[C].childrenMap).map((l) => Number(l))),
          Object.keys(r[C].childrenMap).forEach((l) => {
            v.push(...F(l));
          }),
          v
        );
      },
      [r],
    );
  return {
    initData: b,
    treeData: o,
    setTreeData: a,
    nodeMap: r,
    updateTreeData: h,
    constructTreeData: A,
    getChildrenIds: F,
    loadedKeys: m,
    setLoadedKeys: g,
    expandedKeys: i,
    setExpandedKeys: x,
  };
};
function we(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, 'default') ? e.default : e;
}
var Fe = function (t) {
  return Me(t) && !Te(t);
};
function Me(e) {
  return !!e && typeof e == 'object';
}
function Te(e) {
  var t = Object.prototype.toString.call(e);
  return t === '[object RegExp]' || t === '[object Date]' || Pe(e);
}
var Ie = typeof Symbol == 'function' && Symbol.for,
  Oe = Ie ? Symbol.for('react.element') : 60103;
function Pe(e) {
  return e.$$typeof === Oe;
}
function ke(e) {
  return Array.isArray(e) ? [] : {};
}
function L(e, t) {
  return t.clone !== false && t.isMergeableObject(e) ? B(ke(e), e, t) : e;
}
function Ee(e, t, o) {
  return e.concat(t).map(function (a) {
    return L(a, o);
  });
}
function Ke(e, t) {
  if (!t.customMerge) return B;
  var o = t.customMerge(e);
  return typeof o == 'function' ? o : B;
}
function Ne(e) {
  return Object.getOwnPropertySymbols
    ? Object.getOwnPropertySymbols(e).filter(function (t) {
        return Object.propertyIsEnumerable.call(e, t);
      })
    : [];
}
function ae(e) {
  return Object.keys(e).concat(Ne(e));
}
function ce(e, t) {
  try {
    return t in e;
  } catch (o) {
    return false;
  }
}
function qe(e, t) {
  return ce(e, t) && !(Object.hasOwnProperty.call(e, t) && Object.propertyIsEnumerable.call(e, t));
}
function Ve(e, t, o) {
  var a = {};
  return (
    o.isMergeableObject(e) &&
      ae(e).forEach(function (r) {
        a[r] = L(e[r], o);
      }),
    ae(t).forEach(function (r) {
      qe(e, r) || (ce(e, r) && o.isMergeableObject(t[r]) ? (a[r] = Ke(r, o)(e[r], t[r], o)) : (a[r] = L(t[r], o)));
    }),
    a
  );
}
function B(e, t, o) {
  (o = o || {}),
    (o.arrayMerge = o.arrayMerge || Ee),
    (o.isMergeableObject = o.isMergeableObject || Fe),
    (o.cloneUnlessOtherwiseSpecified = L);
  var a = Array.isArray(t),
    r = Array.isArray(e),
    c = a === r;
  return c ? (a ? o.arrayMerge(e, t, o) : Ve(e, t, o)) : L(t, o);
}
B.all = function (t, o) {
  if (!Array.isArray(t)) throw new Error('first argument should be an array');
  return t.reduce(function (a, r) {
    return B(a, r, o);
  }, {});
};
const je = B;
const Ue = je;
const ie = we(Ue);
const G = (e) => {
  const { resource: t = 'departments', resourceOf: o, params: a = {} } = e || {},
    c = useAPIClient().resource(t, o),
    i = De(e),
    { setTreeData: x, updateTreeData: m, setLoadedKeys: g, initData: d } = i,
    A = (C) =>
      k(this, [C], function* ({ key: h, children: F }) {
        var l;
        if (F != null && F.length) return;
        const { data: v } = yield c.list(
          ie(a, { pagination: false, appends: ['parent(recursively=true)'], filter: { parentId: h } }),
        );
        (l = v == null ? void 0 : v.data) != null && l.length && x(m(h, v == null ? void 0 : v.data));
      }),
    b = (h) =>
      k(this, null, function* () {
        const { data: F } = yield c.list(
          ie(a, {
            pagination: false,
            filter: { title: { $includes: h } },
            appends: ['parent(recursively=true)'],
            pageSize: 100,
          }),
        );
        d(F == null ? void 0 : F.data);
      });
  return T({ ...i }, { loadData: A, getByKeyword: b });
};
const Z = () => {
  var a, r;
  const e = useContext(CollectionContext),
    t = useFilterFieldOptions(e.fields),
    o = useResourceActionContext();
  return useFilterFieldProps({
    options: t,
    params: ((r = (a = o.state) == null ? void 0 : a.params) == null ? void 0 : r[0]) || o.params,
    service: o,
  });
};
const Be = () => {
  const [e, t] = useState(false),
    o = useRecord(),
    a = useField(),
    [r, c] = useState([]),
    i = useRef([]),
    x = (d, A) => {
      i.current = A;
    },
    m = () => {
      const { setVisible: d } = useActionContext();
      return {
        run() {
          const A = a.value || [];
          a.setValue([...A, ...i.current]), (i.current = []), d(false);
        },
      };
    };
  useEffect(() => {
    a.value && c(a.value.map((d) => ({ value: d.id, label: d.nickname || d.username })));
  }, [a.value]);
  const g = (d) => {
    var A;
    return jsx(ResourceActionProvider, {
      collection: 'users',
      request: {
        resource: `departments/${o.id}/members`,
        action: 'list',
        params: { filter: (A = a.value) != null && A.length ? { id: { $notIn: a.value.map((b) => b.id) } } : {} },
      },
      children: d.children,
    });
  };
  return jsxs(ActionContextProvider, {
    value: { visible: e, setVisible: t },
    children: [
      jsx(Select, {
        open: false,
        onChange: (d) => {
          if (!d) {
            a.setValue([]);
            return;
          }
          a.setValue(d.map(({ label: A, value: b }) => ({ id: b, nickname: A })));
        },
        mode: 'multiple',
        value: r,
        labelInValue: true,
        onDropdownVisibleChange: (d) => t(d),
      }),
      jsx(SchemaComponent, {
        schema: fe,
        components: { RequestProvider: g },
        scope: { department: o, handleSelect: x, useSelectOwners: m },
      }),
    ],
  });
};
const _ = React.createContext({});
const $e = () => {
  const e = useForm(),
    t = useField(),
    o = useActionContext(),
    { refreshAsync: a } = useResourceActionContext(),
    r = useAPIClient(),
    { expandedKeys: c, setLoadedKeys: i, setExpandedKeys: x } = useContext(_);
  return {
    run() {
      return k(this, null, function* () {
        try {
          yield e.submit(),
            (t.data = t.data || {}),
            (t.data.loading = true),
            yield r.resource('departments').create({ values: e.values }),
            o.setVisible(false),
            yield e.reset(),
            (t.data.loading = false);
          const g = [...c];
          i([]), x([]), yield a(), x(g);
        } catch (g) {
          t.data && (t.data.loading = false);
        }
      });
    },
  };
};
const Le = () => {
  const e = useField(),
    t = useForm(),
    o = useActionContext(),
    { refreshAsync: a } = useResourceActionContext(),
    r = useAPIClient(),
    { id: c } = useRecord(),
    { expandedKeys: i, setLoadedKeys: x, setExpandedKeys: m } = useContext(_),
    { department: g, setDepartment: d } = useContext(K);
  return {
    run() {
      return k(this, null, function* () {
        yield t.submit(), (e.data = e.data || {}), (e.data.loading = true);
        try {
          yield r.resource('departments').update({ filterByTk: c, values: t.values }),
            d({ department: g, ...t.values }),
            o.setVisible(false),
            yield t.reset();
          const b = [...i];
          x([]), m([]), yield a(), m(b);
        } catch (b) {
          console.log(b);
        } finally {
          e.data.loading = false;
        }
      });
    },
  };
};
const _e = () => {
  const { t: e } = useTranslation(),
    [t, o] = useState(false),
    [a, r] = useState({}),
    { department: c, setDepartment: i } = useContext(K),
    { token: x } = theme.useToken(),
    m = G({ label: ({ node: g }) => jsx(X.Item, { node: g, setVisible: o, setDrawer: r }) });
  return jsx(SchemaComponentOptions, {
    scope: { useCreateDepartment: $e, useUpdateDepartment: Le },
    children: jsxs(_.Provider, {
      value: m,
      children: [
        jsxs(Row, {
          children: [
            jsx(Se, {}),
            jsx(Button, {
              type: 'text',
              icon: jsx(UserOutlined, {}),
              style: { textAlign: 'left', marginBottom: '5px', background: c ? '' : x.colorBgTextHover },
              onClick: () => {
                i(null);
              },
              block: true,
              children: e('All users'),
            }),
            jsx(xe, {}),
          ],
        }),
        jsx(Divider, { style: { margin: '12px 0' } }),
        jsx(X, {}),
        jsx(ActionContextProvider, {
          value: { visible: t, setVisible: o },
          children: jsx(RecordProvider, {
            record: a.node || {},
            children: jsx(SchemaComponent, {
              scope: { t: e },
              components: { DepartmentOwnersField: Be },
              schema: a.schema || {},
            }),
          }),
        }),
      ],
    }),
  });
};
const ze = {
  type: 'void',
  'x-component': 'Space',
  properties: {
    remove: {
      type: 'void',
      title: '{{t("Remove")}}',
      'x-component': 'Action',
      'x-component-props': {
        icon: 'UserDeleteOutlined',
        confirm: {
          title: "{{t('Remove members')}}",
          content: "{{t('Are you sure you want to remove these members?')}}",
        },
        style: { marginRight: 8 },
        useAction: '{{ useBulkRemoveMembersAction }}',
      },
    },
    create: {
      type: 'void',
      title: '{{t("Add members")}}',
      'x-component': 'Action',
      'x-component-props': { type: 'primary', icon: 'UserAddOutlined' },
      properties: { drawer: { type: 'void', 'x-component': 'AddMembers' } },
    },
  },
};
const We = {
  type: 'void',
  properties: {
    remove: {
      title: '{{ t("Remove") }}',
      'x-component': 'Action.Link',
      'x-component-props': {
        confirm: { title: "{{t('Remove member')}}", content: "{{t('Are you sure you want to remove it?')}}" },
        useAction: '{{ useRemoveMemberAction }}',
      },
    },
  },
};
const He = (e, t) => ({
  type: 'void',
  properties: T(
    y(
      {},
      t
        ? {}
        : {
            actions: {
              type: 'void',
              'x-component': 'ActionBar',
              'x-component-props': { style: { marginBottom: 16 } },
              properties: {
                [uid()]: {
                  type: 'void',
                  title: '{{ t("Filter") }}',
                  'x-action': 'filter',
                  'x-component': 'Filter.Action',
                  'x-use-component-props': 'useFilterActionProps',
                  'x-component-props': { icon: 'FilterOutlined' },
                  'x-align': 'left',
                },
                actions: { type: 'void', 'x-component': 'MemberActions' },
              },
            },
          },
    ),
    {
      table: {
        type: 'void',
        'x-component': 'Table.Void',
        'x-component-props': {
          rowKey: 'id',
          rowSelection: { type: 'checkbox' },
          useDataSource: '{{ useMembersDataSource }}',
          pagination: { showTotal: '{{ useShowTotal }}' },
        },
        properties: T(
          y(
            {
              nickname: {
                type: 'void',
                'x-decorator': 'Table.Column.Decorator',
                'x-component': 'Table.Column',
                properties: { nickname: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true } },
              },
              username: {
                type: 'void',
                'x-decorator': 'Table.Column.Decorator',
                'x-component': 'Table.Column',
                properties: { username: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true } },
              },
              departments: {
                type: 'void',
                'x-decorator': 'Table.Column.Decorator',
                'x-component': 'Table.Column',
                properties: {
                  departments: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true },
                },
              },
            },
            e
              ? {
                  isOwner: {
                    type: 'void',
                    'x-decorator': 'Table.Column.Decorator',
                    'x-component': 'Table.Column',
                    'x-component-props': { style: { minWidth: 100 } },
                    title: '{{t("Owner")}}',
                    properties: { isOwner: { type: 'boolean', 'x-component': 'IsOwnerField' } },
                  },
                }
              : {},
          ),
          {
            phone: {
              type: 'void',
              'x-decorator': 'Table.Column.Decorator',
              'x-component': 'Table.Column',
              properties: { phone: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true } },
            },
            email: {
              type: 'void',
              'x-decorator': 'Table.Column.Decorator',
              'x-component': 'Table.Column',
              properties: { email: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true } },
            },
            actions: {
              type: 'void',
              title: '{{t("Actions")}}',
              'x-component': 'Table.Column',
              properties: {
                actions: {
                  type: 'void',
                  'x-component': 'Space',
                  'x-component-props': { split: '|' },
                  properties: y(
                    {
                      update: {
                        type: 'void',
                        title: '{{t("Configure")}}',
                        'x-component': 'Action.Link',
                        'x-component-props': { type: 'primary' },
                        properties: {
                          drawer: {
                            type: 'void',
                            'x-component': 'Action.Drawer',
                            'x-decorator': 'FormV2',
                            title: '{{t("Configure")}}',
                            properties: {
                              departments: {
                                title: '{{t("Departments")}}',
                                'x-decorator': 'FormItem',
                                'x-component': 'UserDepartmentsField',
                              },
                            },
                          },
                        },
                      },
                    },
                    e ? { remove: { type: 'void', 'x-component': 'RowRemoveAction' } } : {},
                  ),
                },
              },
            },
          },
        ),
      },
    },
  ),
});
const Ge = {
  type: 'object',
  properties: {
    drawer: {
      type: 'void',
      'x-component': 'Action.Drawer',
      'x-decorator': 'Form',
      title: '{{t("Add members")}}',
      properties: {
        resource: {
          type: 'void',
          'x-decorator': 'FormItem',
          'x-component': 'ResourceActionProvider',
          'x-component-props': {
            collection: 'users',
            request: {
              resource: 'users',
              action: 'listExcludeDept',
              params: { departmentId: '{{ department?.id }}' },
            },
          },
          properties: {
            actions: {
              type: 'void',
              'x-component': 'ActionBar',
              'x-component-props': { style: { marginBottom: 16 } },
              properties: {
                filter: {
                  type: 'void',
                  title: '{{ t("Filter") }}',
                  default: { $and: [{ username: { $includes: '' } }, { nickname: { $includes: '' } }] },
                  'x-action': 'filter',
                  'x-component': 'Filter.Action',
                  'x-use-component-props': 'useFilterActionProps',
                  'x-component-props': { icon: 'FilterOutlined' },
                  'x-align': 'left',
                },
              },
            },
            table: {
              type: 'void',
              'x-component': 'Table.Void',
              'x-component-props': {
                rowKey: 'id',
                rowSelection: { type: 'checkbox', onChange: '{{ handleSelect }}' },
                useDataSource: '{{ cm.useDataSourceFromRAC }}',
              },
              properties: {
                username: {
                  type: 'void',
                  'x-decorator': 'Table.Column.Decorator',
                  'x-component': 'Table.Column',
                  properties: {
                    username: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true },
                  },
                },
                nickname: {
                  type: 'void',
                  'x-decorator': 'Table.Column.Decorator',
                  'x-component': 'Table.Column',
                  properties: {
                    nickname: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true },
                  },
                },
                phone: {
                  type: 'void',
                  'x-decorator': 'Table.Column.Decorator',
                  'x-component': 'Table.Column',
                  properties: { phone: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true } },
                },
                email: {
                  type: 'void',
                  'x-decorator': 'Table.Column.Decorator',
                  'x-component': 'Table.Column',
                  properties: { email: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true } },
                },
              },
            },
          },
        },
        footer: {
          type: 'void',
          'x-component': 'Action.Drawer.Footer',
          properties: {
            cancel: {
              title: '{{t("Cancel")}}',
              'x-component': 'Action',
              'x-component-props': { useAction: '{{ cm.useCancelAction }}' },
            },
            submit: {
              title: '{{t("Submit")}}',
              'x-component': 'Action',
              'x-component-props': { type: 'primary', useAction: '{{ useAddMembersAction }}' },
            },
          },
        },
      },
    },
  },
};
const Je = {
  type: 'void',
  properties: {
    drawer: {
      title: '{{t("Select Departments")}}',
      'x-decorator': 'Form',
      'x-component': 'Action.Drawer',
      properties: {
        table: {
          type: 'void',
          'x-decorator': 'FormItem',
          'x-component': 'DepartmentTable',
          'x-component-props': { useDataSource: '{{ useDataSource }}', useDisabled: '{{ useDisabled }}' },
        },
        footer: {
          type: 'void',
          'x-component': 'Action.Drawer.Footer',
          properties: {
            cancel: {
              title: '{{t("Cancel")}}',
              'x-component': 'Action',
              'x-component-props': { useAction: '{{ cm.useCancelAction }}' },
            },
            confirm: {
              title: '{{t("Submit")}}',
              'x-component': 'Action',
              'x-component-props': { type: 'primary', useAction: '{{ useAddDepartments }}' },
            },
          },
        },
      },
    },
  },
};
const z = (e) => {
  const t = e.title,
    o = e.parent;
  return o ? z(o) + ' / ' + t : t;
};
const Ye = () => {
  const { setDepartment: e } = useContext(K),
    o = useField().value || [],
    a = o.reduce((c, i) => ((c[i.id] = i), c), {}),
    r = o.map((c, i) =>
      jsxs(
        'span',
        {
          children: [
            jsx('a', {
              onClick: (x) => {
                x.preventDefault(), e(a[c.id]);
              },
              children: z(c),
            }),
            i !== o.length - 1 ? jsx('span', { style: { marginRight: 4, color: '#aaa' }, children: ',' }) : '',
          ],
        },
        i,
      ),
    );
  return jsx(EllipsisWithTooltip, { ellipsis: true, children: r });
};
const Qe = () => {
  const { department: e } = useContext(K),
    o = (useRecord().departments || []).find((a) => (a == null ? void 0 : a.id) === (e == null ? void 0 : e.id));
  return jsx(Checkbox.ReadPretty, { value: o == null ? void 0 : o.departmentsUsers.isOwner });
};
const R = React.createContext({});
const Xe = () => {
  const { setHasFilter: e, setExpandedKeys: t } = useContext(R),
    { t: o } = useTranslation(),
    a = useContext(CollectionContext),
    r = useFilterFieldOptions(a.fields),
    c = useResourceActionContext(),
    { run: i, defaultRequest: x } = c,
    m = useField(),
    { params: g } = x || {};
  return {
    options: r,
    onSubmit: (d) =>
      k(this, null, function* () {
        const A = g.filter,
          b = removeNullCondition(d == null ? void 0 : d.filter);
        i(T(y({}, g), { page: 1, pageSize: 10, filter: mergeFilter([b, A]) }));
        const h = (b == null ? void 0 : b.$and) || (b == null ? void 0 : b.$or);
        h != null && h.length
          ? ((m.title = o('{{count}} filter items', { count: (h == null ? void 0 : h.length) || 0 })), e(true))
          : ((m.title = o('Filter')), e(false));
      }),
    onReset() {
      i(
        T(y({}, g || {}), {
          filter: T(y({}, (g == null ? void 0 : g.filter) || {}), { parentId: null }),
          page: 1,
          pageSize: 10,
        }),
      ),
        (m.title = o('Filter')),
        e(false),
        t([]);
    },
  };
};
const Ze = () => ({ disabled: () => false });
const Re = ({ useDisabled: e = Ze }) => {
  const { t } = useTranslation(),
    o = useResourceActionContext();
  console.log(o);
  const { run: a, data: r, loading: c, defaultRequest: i } = o,
    { resource: x, resourceOf: m, params: g } = i || {},
    { treeData: d, initData: A, loadData: b } = G({ resource: x, resourceOf: m, params: g }),
    h = useField(),
    { disabled: F } = e(),
    { hasFilter: C, expandedKeys: v, setExpandedKeys: l } = useContext(R);
  useEffect(() => {
    C || A(r == null ? void 0 : r.data);
  }, [r, A, c, C]);
  const u = {};
  if ((g != null && g.pageSize && (u.defaultPageSize = g.pageSize), !u.total && r != null && r.meta)) {
    const { count: f, page: S, pageSize: O } = r.meta;
    (u.total = f), (u.current = S), (u.pageSize = O);
  }
  return jsx(Table, {
    rowKey: 'id',
    columns: [{ dataIndex: 'title', title: t('Department name'), render: (f, S) => (C ? z(S) : f) }],
    rowSelection: {
      selectedRowKeys: ((h == null ? void 0 : h.value) || []).map((f) => f.id),
      onChange: (f, S) => {
        var O;
        return (O = h == null ? void 0 : h.setValue) == null ? void 0 : O.call(h, S);
      },
      getCheckboxProps: (f) => ({ disabled: F(f) }),
    },
    pagination: T(y({ showSizeChanger: true }, u), {
      onChange(f, S) {
        var O;
        a(T(y({}, ((O = o == null ? void 0 : o.params) == null ? void 0 : O[0]) || {}), { page: f, pageSize: S }));
      },
    }),
    dataSource: C ? (r == null ? void 0 : r.data) || [] : d,
    expandable: {
      onExpand: (f, S) => {
        b({ key: S.id, children: S.children });
      },
      expandedRowKeys: v,
      onExpandedRowsChange: (f) => l(f),
    },
  });
};
const et = (e) => {
  const [t, o] = useState([]),
    [a, r] = useState(false),
    { useDataSource: c } = e,
    i = c({ manual: true });
  return (
    useEffect(() => {
      i.run({ filter: { parentId: null }, pageSize: 10 });
    }, []),
    jsx(ResourceActionContext.Provider, {
      value: y({}, i),
      children: jsx(CollectionProvider_deprecated, {
        collection: Q,
        children: jsx(R.Provider, {
          value: { expandedKeys: t, setExpandedKeys: o, hasFilter: a, setHasFilter: r },
          children: e.children,
        }),
      }),
    })
  );
};
const pe = ({ useDataSource: e, useDisabled: t }) =>
  jsx(SchemaComponent, {
    scope: { useDisabled: t, useFilterActionProps: Xe },
    components: { InternalDepartmentTable: Re, RequestProvider: et },
    schema: {
      type: 'void',
      properties: {
        [uid()]: {
          type: 'void',
          'x-component': 'RequestProvider',
          'x-component-props': { useDataSource: e },
          properties: {
            actions: {
              type: 'void',
              'x-component': 'ActionBar',
              'x-component-props': { style: { marginBottom: 16 } },
              properties: {
                filter: {
                  type: 'void',
                  title: '{{ t("Filter") }}',
                  default: { $and: [{ title: { $includes: '' } }] },
                  'x-action': 'filter',
                  'x-component': 'Filter.Action',
                  'x-use-component-props': 'useFilterActionProps',
                  'x-component-props': { icon: 'FilterOutlined' },
                  'x-align': 'left',
                },
              },
            },
            departments: {
              type: 'array',
              'x-component': 'InternalDepartmentTable',
              'x-component-props': { useDisabled: '{{ useDisabled }}' },
            },
          },
        },
      },
    },
  });
const tt = (e) => {
  const t = {
      resource: 'departments',
      action: 'list',
      params: { appends: ['parent(recursively=true)'], sort: ['createdAt'] },
    },
    o = useRequest(t, e);
  return T(y({}, o), { defaultRequest: t });
};
const ot = () => {
  const { modal: e, message: t } = App.useApp(),
    { t: o } = useTranslation(),
    [a, r] = useState(false),
    c = useRecord(),
    i = useField(),
    { refresh: x } = useResourceActionContext(),
    m = (l) =>
      l != null && l.length
        ? l.map((u) => {
            var f, S;
            return T(y({}, u), {
              isMain: (f = u.departmentsUsers) == null ? void 0 : f.isMain,
              isOwner: (S = u.departmentsUsers) == null ? void 0 : S.isOwner,
              title: z(u),
            });
          })
        : [],
    g = useAPIClient();
  useRequest(
    () =>
      g
        .resource('users.departments', c.id)
        .list({ appends: ['parent(recursively=true)'], pagination: false })
        .then((l) => {
          var f;
          const u = m((f = l == null ? void 0 : l.data) == null ? void 0 : f.data);
          i.setValue(u);
        }),
    { ready: c.id },
  );
  const d = () => {
      const l = useAPIClient(),
        u = useForm(),
        { departments: f } = u.values || {};
      return {
        run() {
          return k(this, null, function* () {
            yield l.resource('users.departments', c.id).add({ values: f.map((O) => O.id) }),
              u.reset(),
              i.setValue([
                ...i.value,
                ...f.map((O, $) => T(y({}, O), { isMain: $ === 0 && i.value.length === 0, title: z(O) })),
              ]),
              r(false),
              x();
          });
        },
      };
    },
    A = (l) => {
      e.confirm({
        title: o('Remove department'),
        content: o('Are you sure you want to remove it?'),
        onOk: () =>
          k(this, null, function* () {
            yield g.resource('users.departments', c.id).remove({ values: [l.id] }),
              t.success(o('Deleted successfully')),
              i.setValue(
                i.value
                  .filter((u) => u.id !== l.id)
                  .map((u, f) => T(y({}, u), { isMain: (l.isMain && f === 0) || u.isMain })),
              ),
              x();
          }),
      });
    },
    b = (l) =>
      k(this, null, function* () {
        yield g.resource('users').setMainDepartment({ values: { userId: c.id, departmentId: l.id } }),
          t.success(o('Set successfully')),
          i.setValue(i.value.map((u) => T(y({}, u), { isMain: u.id === l.id }))),
          x();
      }),
    h = (l) =>
      k(this, null, function* () {
        yield g.resource('departments').setOwner({ values: { userId: c.id, departmentId: l.id } }),
          t.success(o('Set successfully')),
          i.setValue(i.value.map((u) => T(y({}, u), { isOwner: u.id === l.id ? true : u.isOwner }))),
          x();
      }),
    F = (l) =>
      k(this, null, function* () {
        yield g.resource('departments').removeOwner({ values: { userId: c.id, departmentId: l.id } }),
          t.success(o('Set successfully')),
          i.setValue(i.value.map((u) => T(y({}, u), { isOwner: u.id === l.id ? false : u.isOwner }))),
          x();
      }),
    C = (l, u) => {
      switch (l) {
        case 'setMain':
          b(u);
          break;
        case 'setOwner':
          h(u);
          break;
        case 'removeOwner':
          F(u);
          break;
        case 'remove':
          A(u);
      }
    },
    v = () => ({ disabled: (l) => i.value.some((u) => u.id === l.id) });
  return jsxs(ActionContextProvider, {
    value: { visible: a, setVisible: r },
    children: [
      jsxs(Fragment, {
        children: [
          ((i == null ? void 0 : i.value) || []).map((l) =>
            jsxs(
              Tag,
              {
                style: { padding: '5px 8px', background: 'transparent', marginBottom: '5px' },
                children: [
                  jsx('span', { style: { marginRight: '5px' }, children: l.title }),
                  l.isMain ? jsx(Tag, { color: 'processing', bordered: false, children: o('Main') }) : '',
                  jsx(Dropdown, {
                    menu: {
                      items: [
                        ...(l.isMain ? [] : [{ label: o('Set as main department'), key: 'setMain' }]),
                        { label: o('Remove'), key: 'remove' },
                      ],
                      onClick: ({ key: u }) => C(u, l),
                    },
                    children: jsx('div', {
                      style: { float: 'right' },
                      children: jsx(MoreOutlined, {}),
                    }),
                  }),
                ],
              },
              l.id,
            ),
          ),
          jsx(Button, { icon: jsx(PlusOutlined, {}), onClick: () => r(true) }),
        ],
      }),
      jsx(SchemaComponent, {
        schema: Je,
        components: { DepartmentTable: pe },
        scope: { user: c, useDataSource: tt, useAddDepartments: d, useDisabled: v },
      }),
    ],
  });
};
const nt = () => {
  const { department: e } = useContext(K),
    { refresh: t } = useResourceActionContext(),
    o = useRef([]),
    a = useAPIClient(),
    r = () => ({
      run() {
        return k(this, null, function* () {
          const x = o.current;
          x != null &&
            x.length &&
            (yield a.resource('departments.members', e.id).add({ values: x }), (o.current = []), t());
        });
      },
    }),
    c = (i) => {
      o.current = i;
    };
  return jsx(SchemaComponent, {
    scope: { useAddMembersAction: r, department: e, handleSelect: c },
    schema: Ge,
  });
};
const rt = () => {
  const { t: e } = useTranslation(),
    { message: t } = App.useApp(),
    o = useAPIClient(),
    { state: a, setState: r, refresh: c } = useResourceActionContext(),
    { department: i } = useContext(K);
  return {
    run() {
      return k(this, null, function* () {
        const m = a == null ? void 0 : a.selectedRowKeys;
        if (!(m != null && m.length)) {
          t.warning(e('Please select members'));
          return;
        }
        yield o.resource('departments.members', i.id).remove({ values: m }),
          r == null || r({ selectedRowKeys: [] }),
          c();
      });
    },
  };
};
const st = () => {
  const e = useAPIClient(),
    { department: t } = useContext(K),
    { id: o } = useRecord(),
    { refresh: a } = useResourceActionContext();
  return {
    run() {
      return k(this, null, function* () {
        yield e.resource('departments.members', t.id).remove({ values: [o] }), a();
      });
    },
  };
};
const at = (e) => {
  const { user: t } = useContext(K),
    o = useResourceActionContext();
  return (
    useEffect(() => {
      if (t) {
        e == null || e.onSuccess({ data: [t] });
        return;
      }
      o.loading || e == null || e.onSuccess(o.data);
    }, [t, o.loading]),
    o
  );
};
const ct = () => {
  var o;
  const { data: e } = useResourceActionContext(),
    { t } = useTranslation();
  return t('Total {{count}} members', { count: (o = e == null ? void 0 : e.meta) == null ? void 0 : o.count });
};
const it = () => {
  const { t: e } = useTranslation(),
    { department: t, user: o } = useContext(K),
    { data: a, setState: r } = useResourceActionContext();
  useEffect(() => {
    r == null || r({ selectedRowKeys: [] });
  }, [a, r]);
  const c = () => (t ? jsx(SchemaComponent, { schema: ze }) : null),
    i = () => (t ? jsx(SchemaComponent, { scope: { useRemoveMemberAction: st }, schema: We }) : null),
    x = useMemo(() => He(t, o), [t, o]);
  return jsxs(Fragment, {
    children: [
      o
        ? jsx('h2', { children: e('Search results') })
        : jsx('h2', { children: e((t == null ? void 0 : t.title) || 'All users') }),
      jsx(SchemaComponent, {
        scope: {
          useBulkRemoveMembersAction: rt,
          useMembersDataSource: at,
          t: e,
          useShowTotal: ct,
          useFilterActionProps: Z,
        },
        components: {
          MemberActions: c,
          AddMembers: nt,
          RowRemoveAction: i,
          DepartmentField: Ye,
          IsOwnerField: Qe,
          UserDepartmentsField: ot,
        },
        schema: x,
      }),
    ],
  });
};
const le = (e) => {
  const t = useField(),
    [o, a] = useState({ label: null, value: null }),
    { treeData: r, initData: c, getByKeyword: i, loadData: x, loadedKeys: m, setLoadedKeys: g, originData: d } = e,
    A = (h) =>
      k(this, null, function* () {
        if (!h) {
          c(d);
          return;
        }
        yield i(h);
      }),
    b = useCallback((h) => {
      const F = h.title,
        C = h.parent;
      return C ? b(C) + ' / ' + F : F;
    }, []);
  return (
    useEffect(() => {
      c(d);
    }, [d, c]),
    useEffect(() => {
      if (!t.value) {
        a({ label: null, value: null });
        return;
      }
      a({ label: b(t.value) || t.value.label, value: t.value.id });
    }, [t.value, b]),
    jsx(TreeSelect, {
      value: o,
      onSelect: (h, F) => {
        t.setValue(F);
      },
      onChange: (h) => {
        h || t.setValue(null);
      },
      treeData: r,
      treeLoadedKeys: m,
      onTreeLoad: (h) => g(h),
      loadData: (h) => x({ key: h.id, children: h.children }),
      fieldNames: { value: 'id' },
      showSearch: true,
      allowClear: true,
      treeNodeFilterProp: 'title',
      onSearch: A,
      labelInValue: true,
    })
  );
};
const pt = () => {
  const e = G(),
    { departmentsResource: t } = useContext(K),
    {
      service: { data: o },
    } = t || {};
  return jsx(le, T(y({}, e), { originData: o == null ? void 0 : o.data }));
};
const lt = () => {
  const e = G(),
    { setTreeData: t, getChildrenIds: o } = e,
    a = useRecord(),
    { departmentsResource: r } = useContext(K),
    {
      service: { data: c },
    } = r || {};
  return (
    useEffect(() => {
      if (!a.id) return;
      const i = o(a.id);
      i.push(a.id),
        t((x) => {
          const m = (g) =>
            g.map((d) => (i.includes(d.id) && (d.disabled = true), d.children && (d.children = m(d.children)), d));
          return m(x);
        });
    }, [t, a.id, o]),
    jsx(le, T(y({}, e), { originData: c == null ? void 0 : c.data }))
  );
};
const ut = () =>
  jsx(SchemaComponentOptions, {
    components: { SuperiorDepartmentSelect: lt, DepartmentSelect: pt },
    scope: { useFilterActionProps: Z },
    children: jsxs(Row, {
      gutter: 48,
      style: { flexWrap: 'nowrap' },
      children: [
        jsx(Col, {
          span: 6,
          style: { borderRight: '1px solid #eee', minWidth: '300px' },
          children: jsx(Ce, { children: jsx(_e, {}) }),
        }),
        jsx(Col, {
          flex: 'auto',
          style: { overflow: 'hidden' },
          children: jsx(be, { children: jsx(it, {}) }),
        }),
      ],
    }),
  });
export const MmtComponent = () =>
  jsx(SchemaComponent, {
    components: { DepartmentManagement: ut },
    schema: {
      type: 'void',
      properties: {
        [uid()]: { type: 'void', 'x-decorator': 'CardItem', 'x-component': 'DepartmentManagement' },
      },
    },
  });
const dt = () => ({
  type: 'void',
  properties: {
    actions: {
      type: 'void',
      'x-component': 'ActionBar',
      'x-component-props': { style: { marginBottom: 16 } },
      properties: {
        [uid()]: {
          type: 'void',
          title: '{{ t("Filter") }}',
          'x-action': 'filter',
          'x-component': 'Filter.Action',
          'x-use-component-props': 'useFilterActionProps',
          'x-component-props': { icon: 'FilterOutlined' },
          'x-align': 'left',
        },
        actions: {
          type: 'void',
          'x-component': 'Space',
          properties: {
            remove: {
              type: 'void',
              title: '{{t("Remove")}}',
              'x-component': 'Action',
              'x-component-props': {
                icon: 'MinusOutlined',
                confirm: {
                  title: "{{t('Remove')}}",
                  content: "{{t('Are you sure you want to remove these departments?')}}",
                },
                style: { marginRight: 8 },
                useAction: '{{ useBulkRemoveDepartments }}',
              },
            },
            create: {
              type: 'void',
              title: '{{t("Add departments")}}',
              'x-component': 'Action',
              'x-component-props': { type: 'primary', icon: 'PlusOutlined' },
              properties: {
                drawer: {
                  type: 'void',
                  'x-component': 'Action.Drawer',
                  'x-decorator': 'FormV2',
                  title: '{{t("Add departments")}}',
                  properties: {
                    table: {
                      type: 'void',
                      'x-decorator': 'FormItem',
                      'x-component': 'DepartmentTable',
                      'x-component-props': {
                        useDataSource: '{{ useDataSource }}',
                        useDisabled: '{{ useDisabled }}',
                      },
                    },
                    footer: {
                      type: 'void',
                      'x-component': 'Action.Drawer.Footer',
                      properties: {
                        cancel: {
                          title: '{{t("Cancel")}}',
                          'x-component': 'Action',
                          'x-component-props': { useAction: '{{ cm.useCancelAction }}' },
                        },
                        submit: {
                          title: '{{t("Submit")}}',
                          'x-component': 'Action',
                          'x-component-props': { type: 'primary', useAction: '{{ useAddDepartments }}' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    table: {
      type: 'void',
      'x-component': 'Table.Void',
      'x-component-props': {
        rowKey: 'id',
        rowSelection: { type: 'checkbox' },
        useDataSource: '{{ cm.useDataSourceFromRAC }}',
      },
      properties: {
        title: {
          type: 'void',
          title: '{{t("Department name")}}',
          'x-decorator': 'Table.Column.Decorator',
          'x-component': 'Table.Column',
          properties: { title: { type: 'string', 'x-component': 'DepartmentTitle' } },
        },
        actions: {
          type: 'void',
          title: '{{t("Actions")}}',
          'x-component': 'Table.Column',
          properties: {
            actions: {
              type: 'void',
              'x-component': 'Space',
              'x-component-props': { split: '|' },
              properties: {
                remove: {
                  type: 'void',
                  title: '{{ t("Remove") }}',
                  'x-component': 'Action.Link',
                  'x-component-props': {
                    confirm: {
                      title: "{{t('Remove department')}}",
                      content: "{{t('Are you sure you want to remove it?')}}",
                    },
                    useAction: '{{ useRemoveDepartment }}',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});
const xt = () => {
  const e = useAPIClient(),
    { role: t } = useContext(RolesManagerContext),
    { data: o } = useRecord(),
    { refresh: a } = useResourceActionContext();
  return {
    run() {
      return k(this, null, function* () {
        yield e.resource(`roles/${t == null ? void 0 : t.name}/departments`).remove({ values: [o.id] }), a();
      });
    },
  };
};
const yt = () => {
  const { t: e } = useTranslation(),
    { message: t } = App.useApp(),
    o = useAPIClient(),
    { state: a, setState: r, refresh: c } = useResourceActionContext(),
    { role: i } = useContext(RolesManagerContext);
  return {
    run() {
      return k(this, null, function* () {
        const m = a == null ? void 0 : a.selectedRowKeys;
        if (!(m != null && m.length)) {
          t.warning(e('Please select departments'));
          return;
        }
        yield o.resource(`roles/${i == null ? void 0 : i.name}/departments`).remove({ values: m }),
          r == null || r({ selectedRowKeys: [] }),
          c();
      });
    },
  };
};
const ht = () => {
  const e = useRecord(),
    t = (o) => {
      const a = o.title,
        r = o.parent;
      return r ? t(r) + ' / ' + a : a;
    };
  return jsx(Fragment, { children: t(e) });
};
const ft = (e) => {
  const t = {
      resource: 'departments',
      action: 'list',
      params: { appends: ['roles', 'parent(recursively=true)'], sort: ['createdAt'] },
    },
    o = useRequest(t, e);
  return T(y({}, o), { defaultRequest: t });
};
const vt = () => {
  const { role: e } = useContext(RolesManagerContext);
  return {
    disabled: (t) => {
      var o;
      return (o = t == null ? void 0 : t.roles) == null
        ? void 0
        : o.some((a) => a.name === (e == null ? void 0 : e.name));
    },
  };
};
const gt = () => {
  const { role: e } = useContext(RolesManagerContext),
    t = useAPIClient(),
    o = useForm(),
    { setVisible: a } = useActionContext(),
    { refresh: r } = useResourceActionContext(),
    { departments: c } = o.values || {};
  return {
    run() {
      return k(this, null, function* () {
        yield t.resource('roles.departments', e.name).add({ values: c.map((x) => x.id) }), o.reset(), a(false), r();
      });
    },
  };
};
export const Departments = () => {
  const { t: e } = useTranslation(),
    { role: t } = useContext(RolesManagerContext),
    o = useRequest(
      {
        resource: `roles/${t == null ? void 0 : t.name}/departments`,
        action: 'list',
        params: { appends: ['parent', 'parent.parent(recursively=true)'] },
      },
      { ready: !!t },
    );
  useEffect(() => {
    o.run();
  }, [t]);
  const a = useMemo(() => dt(), [t]);
  return jsx(ResourceActionContext.Provider, {
    value: y({}, o),
    children: jsx(CollectionProvider_deprecated, {
      collection: Q,
      children: jsx(SchemaComponent, {
        schema: a,
        components: { DepartmentTable: pe, DepartmentTitle: ht },
        scope: {
          useFilterActionProps: Z,
          t: e,
          useRemoveDepartment: xt,
          useBulkRemoveDepartments: yt,
          useDataSource: ft,
          useDisabled: vt,
          useAddDepartments: gt,
        },
      }),
    }),
  });
};
const bt = (e) => e['x-component'] === 'CollectionField';
export const oe = () => {
  const { getField: e } = useCollection_deprecated(),
    t = useCompile(),
    o = useFieldSchema(),
    { getCollectionJoinField: a } = useCollectionManager_deprecated(),
    r = o.reduceProperties((i, x) => (bt(x) ? x : i), null);
  if (!r) return {};
  const c = e(r.name) || a(r == null ? void 0 : r['x-collection-field']);
  return { columnSchema: o, fieldSchema: r, collectionField: c, uiSchema: t(c == null ? void 0 : c.uiSchema) };
};
