import { createStyles, useAPIClient, useRequest } from '@tachybase/client';
import { Button, Dropdown, Empty, Input, theme } from 'antd';
import { useContext, useState } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useTranslation } from '../../../locale';
import { contextK } from '../context/contextK';

const createStyleAe = createStyles(({ css }) => ({
  searchDropdown: css`
    .ant-dropdown-menu {
      max-height: 500px;
      overflow-y: scroll;
    }
  `,
}));

export const ComponentSe = () => {
  const { t: e } = useTranslation();
  const { token: t } = theme.useToken();
  const { setDepartment: setDepartment, setUser: setUser } = useContext(contextK);
  const [r, c] = useState(false);
  const [i, x] = useState('');
  const [m, g] = useState([]);
  const [d, A] = useState([]);
  const [b, h] = useState(true);
  const [F, C] = useState(true);
  const { styles } = createStyleAe();
  const l = 10;
  const api = useAPIClient();
  const data = useRequest(
    (M) =>
      api
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
  );
  const { run: S } = data;
  const O = (M) => {
    x(M), g([]), A([]), h(true), C(true), M && (S({ values: { keyword: M, limit: l } }), c(true));
  };
  const $ = (M) => {
    M.target.value || (setUser(null), x(''), c(false), data.mutate({}), g([]), A([]));
  };
  const W = (M) => {
    const P = M.title,
      q = M.parent;
    return q ? W(q) + ' / ' + P : P;
  };
  const H = (M) =>
    jsx(Button, {
      type: 'link',
      style: { padding: '0 8px' },
      onClick: (P) => {
        c(true), S({ values: { keyword: i, limit: l, ...M } });
      },
      children: e('Load more'),
    });
  const J = () => {
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
                onClick: () => setUser(P),
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
              label: jsx('div', { onClick: () => setDepartment(P), children: W(P) }),
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
    overlayClassName: styles.searchDropdown,
    trigger: ['click'],
    open: r,
    onOpenChange: (M) => c(M),
    children: jsx(Input.Search, {
      allowClear: true,
      onClick: () => {
        i || c(false);
      },
      onFocus: () => setDepartment(null),
      onSearch: O,
      onChange: $,
      placeholder: e('Search for departments, users'),
      style: { marginBottom: '20px' },
    }),
  });
};
