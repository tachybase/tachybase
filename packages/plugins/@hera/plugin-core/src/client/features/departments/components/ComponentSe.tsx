import React, { useContext, useState } from 'react';
import { createStyles, useAPIClient, useRequest } from '@tachybase/client';

import { Button, Dropdown, Empty, Input, theme } from 'antd';
import { jsx, jsxs } from 'react/jsx-runtime';

import { useTranslation } from '../../../locale';
import { DepartmentsContext } from '../context/DepartmentsContext';

const useStyles = createStyles(({ css }) => ({
  searchDropdown: css`
    .ant-dropdown-menu {
      max-height: 500px;
      overflow-y: scroll;
    }
  `,
}));

export const DepartmentsTree = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { setDepartment, setUser } = useContext(DepartmentsContext);
  const [open, setOpen] = useState(false);
  const [keyword, x] = useState('');
  const [m, g] = useState([]);
  const [d, A] = useState([]);
  const [b, h] = useState(true);
  const [F, C] = useState(true);
  const { styles } = useStyles();
  const limit = 10;
  const api = useAPIClient();
  const data = useRequest(
    (params) =>
      api
        .resource('departments')
        .aggregateSearch(params)
        .then((result) => result?.data?.data),
    {
      manual: true,
      onSuccess: (data, params) => {
        const {
          values: { type: q },
        } = params[0] || {};
        if (data) {
          if (!q || (q === 'user' && data.users.length < limit)) {
            h(false);
          }
          if (!q || (q === 'department' && data.departments.length < limit)) {
            C(false);
          }
          g((se) => [...se, ...data.users]);
          A((se) => [...se, ...data.departments]);
        }
      },
    },
  );
  const { run } = data;
  const onSearch = (keyword) => {
    x(keyword);
    g([]);
    A([]);
    h(true);
    C(true);
    if (keyword) {
      run({ values: { keyword, limit } });
      setOpen(true);
    }
  };
  const onChange = (event) => {
    if (!event.target.value) {
      setUser(null);
      x('');
      setOpen(false);
      data.mutate({});
      g([]);
      A([]);
    }
  };
  const NodeLabel = (node) => {
    const title = node.title;
    const parent = node.parent;
    return parent ? NodeLabel(parent) + ' / ' + title : title;
  };
  const LinkButton = (params) => (
    <Button
      type="link"
      style={{ padding: '0 8px' }}
      onClick={(P) => {
        setOpen(true), run({ values: { keyword, limit, ...params } });
      }}
    >
      {t('Load more')}
    </Button>
  );
  const J = () => {
    const M = [];
    return !m.length && !d.length
      ? [
          {
            key: '0',
            label: <Empty description={t('No results')} image={Empty.PRESENTED_IMAGE_SIMPLE} />,
            disabled: true,
          },
        ]
      : (m.length &&
          (M.push({
            key: '0',
            type: 'group',
            label: t('Users'),
            children: m.map((P) => ({
              key: P.username,
              label: jsxs('div', {
                onClick: () => setUser(P),
                children: [
                  jsx('div', { children: P.nickname || P.username }),
                  jsx('div', {
                    style: { fontSize: token.fontSizeSM, color: token.colorTextDescription },
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
              label: jsx(LinkButton, { type: 'user', last: m[m.length - 1].id }),
            })),
        d.length &&
          (M.push({
            key: '1',
            type: 'group',
            label: t('Departments'),
            children: d.map((P) => ({
              key: P.id,
              label: jsx('div', { onClick: () => setDepartment(P), children: NodeLabel(P) }),
            })),
          }),
          F &&
            M.push({
              type: 'group',
              key: '1-loadMore',
              label: <LinkButton type="department" last={d[d.length - 1].id} />,
            })),
        M);
  };
  return (
    <Dropdown
      menu={{ items: J() }}
      overlayClassName={styles.searchDropdown}
      trigger={['click']}
      open={open}
      onOpenChange={(open) => setOpen(open)}
    >
      <Input.Search
        allowClear
        onClick={() => {
          keyword || setOpen(false);
        }}
        onFocus={() => setDepartment(null)}
        onSearch={onSearch}
        onChange={onChange}
        placeholder={t('Search for departments, users')}
        style={{ marginBottom: '20px' }}
      />
    </Dropdown>
  );
};
