import { useContext, useEffect } from 'react';
import { css, useAPIClient, useResourceActionContext } from '@tachybase/client';

import { MoreOutlined } from '@ant-design/icons';
import { App, Dropdown, Empty, Tree } from 'antd';
import { jsx, jsxs } from 'react/jsx-runtime';

import { useTranslation } from '../../../locale';
import { contextK } from '../context/contextK';
import { contextN } from '../context/contextN';
import { k } from '../others/k';
import { schemaHhe } from '../schema/schemaHhe';
import { schemaYye } from '../schema/schemaYye';

export const ComponentX = () => {
  const { data: e, loading: t } = useResourceActionContext();
  const { department, setDepartment, setUser } = useContext(contextK);
  const { treeData, nodeMap, loadData, loadedKeys, setLoadedKeys, initData, expandedKeys, setExpandedKeys } =
    useContext(contextN);

  const h = (v) => {
    if (!v.length) return;
    const l = nodeMap[v[0]];
    setDepartment(l);
    setUser(null);
  };
  const F = (v) => {
    setExpandedKeys(v);
  };
  const C = (v) => {
    setLoadedKeys(v);
  };
  useEffect(() => {
    initData(e == null ? void 0 : e.data);
  }, [e, initData, t]);
  useEffect(() => {
    if (!department) return;
    const v = (u) => (u.parent ? [u.parent.id, ...v(u.parent)] : []),
      l = v(department);
    setExpandedKeys((u) => Array.from(new Set([...u, ...l])));
  }, [department, setExpandedKeys]);

  return jsx('div', {
    className: css`
      height: 57vh;
      overflow: auto;
      .ant-tree-node-content-wrapper {
        overflow: hidden;
      }
    `,
    children:
      treeData != null && treeData.length
        ? jsx(Tree.DirectoryTree, {
            loadData: loadData,
            treeData: treeData,
            loadedKeys: loadedKeys,
            onSelect: h,
            selectedKeys: [department == null ? void 0 : department.id],
            onExpand: F,
            onLoad: C,
            expandedKeys: expandedKeys,
            expandAction: false,
            showIcon: false,
            fieldNames: { key: 'id' },
          })
        : jsx(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE }),
  });
  // return (
  //   useEffect(() => {
  //     initData(e == null ? void 0 : e.data);
  //   }, [e, initData, t]),
  //   useEffect(() => {
  //     if (!department) return;
  //     const v = (u) => (u.parent ? [u.parent.id, ...v(u.parent)] : []),
  //       l = v(department);
  //     setExpandedKeys((u) => Array.from(new Set([...u, ...l])));
  //   }, [department, setExpandedKeys]),
  //   jsx('div', {
  //     className: css`
  //       height: 57vh;
  //       overflow: auto;
  //       .ant-tree-node-content-wrapper {
  //         overflow: hidden;
  //       }
  //     `,
  //     children:
  //       treeData != null && treeData.length
  //         ? jsx(Tree.DirectoryTree, {
  //             loadData: loadData,
  //             treeData: treeData,
  //             loadedKeys: loadedKeys,
  //             onSelect: h,
  //             selectedKeys: [department == null ? void 0 : department.id],
  //             onExpand: F,
  //             onLoad: C,
  //             expandedKeys: expandedKeys,
  //             expandAction: false,
  //             showIcon: false,
  //             fieldNames: { key: 'id' },
  //           })
  //         : jsx(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE }),
  //   })
  // );
};
ComponentX.Item = function ({ node: t, setVisible: o, setDrawer: a }) {
  const { t: r } = useTranslation(),
    { refreshAsync: c } = useResourceActionContext(),
    { setLoadedKeys: i, expandedKeys: x, setExpandedKeys: m } = useContext(contextN),
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
          h(schemaYye);
          break;
        case 'edit':
          h(schemaHhe);
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
