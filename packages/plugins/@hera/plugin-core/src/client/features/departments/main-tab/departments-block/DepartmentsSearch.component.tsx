import React, { useContext, useState } from 'react';
import { createStyles, useAPIClient, useRequest } from '@tachybase/client';

import { Button, Dropdown, Empty, Input, theme } from 'antd';

import { useTranslation } from '../../../../locale';
import { ContextDepartments } from '../context/Department.context';

const useStyles = createStyles(({ css }) => ({
  searchDropdown: css`
    .ant-dropdown-menu {
      max-height: 500px;
      overflow-y: scroll;
    }
  `,
}));
// NOTE: 左边部门搜索组件
export const DepartmentsSearch = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { styles } = useStyles();
  const limit = 10;
  const api = useAPIClient();

  const { setDepartment, setUser } = useContext(ContextDepartments);
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isUsersBeyond, setIsUsersBeyond] = useState(true);
  const [isDepartmentBeyond, setIsDepartmentBeyond] = useState(true);

  const data = useRequest(
    (params) =>
      api
        .resource('departments')
        .aggregateSearch(params)
        .then((result) => result?.data?.data),
    {
      manual: true,
      onSuccess: (data, params) => {
        const { values } = params[0] || {};
        const { type } = values || {};

        if (data) {
          if (!type || (type === 'user' && data.users.length < limit)) {
            setIsUsersBeyond(false);
          }
          if (!type || (type === 'department' && data.departments.length < limit)) {
            setIsDepartmentBeyond(false);
          }
          setUsers((prev) => [...prev, ...data.users]);
          setDepartments((prev) => [...prev, ...data.departments]);
        }
      },
    },
  );
  const { run } = data;
  const onSearch = (keyword) => {
    setKeyword(keyword);
    setUsers([]);
    setDepartments([]);
    setIsUsersBeyond(true);
    setIsDepartmentBeyond(true);
    if (keyword) {
      run({ values: { keyword, limit } });
      setOpen(true);
    }
  };
  const onChange = (event) => {
    if (!event.target.value) {
      setUser(null);
      setKeyword('');
      setOpen(false);
      data.mutate({});
      setUsers([]);
      setDepartments([]);
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
        setOpen(true);
        run({
          values: {
            keyword,
            limit,
            ...params,
          },
        });
      }}
    >
      {t('Load more')}
    </Button>
  );
  const getItems = () => {
    const resultItems = [];
    return !users.length && !departments.length
      ? [
          {
            key: '0',
            label: <Empty description={t('No results')} image={Empty.PRESENTED_IMAGE_SIMPLE} />,
            disabled: true,
          },
        ]
      : (users.length &&
          (resultItems.push({
            key: '0',
            type: 'group',
            label: t('Users'),
            children: users.map((userInfo) => ({
              key: userInfo.username,
              label: (
                <div onClick={() => {}}>
                  <div>{userInfo.nickname || userInfo.username}</div>,
                  <div
                    style={{
                      fontSize: token.fontSizeSM,
                      color: token.colorTextDescription,
                    }}
                  >
                    {`${userInfo.username}${userInfo.phone ? ' | ' + userInfo.phone : ''}${userInfo.email ? ' | ' + userInfo.email : ''}`}
                  </div>
                </div>
              ),
            })),
          }),
          isUsersBeyond &&
            resultItems.push({
              type: 'group',
              key: '0-loadMore',
              label: <LinkButton type="user" last={users[users.length - 1].id} />,
            })),
        departments.length &&
          (resultItems.push({
            key: '1',
            type: 'group',
            label: t('Departments'),
            children: departments.map((departmentInfo) => ({
              key: departmentInfo.id,
              label: (
                <div
                  onClick={() => {
                    setDepartment(departmentInfo);
                  }}
                >
                  {NodeLabel(departmentInfo)}
                </div>
              ),
            })),
          }),
          isDepartmentBeyond &&
            resultItems.push({
              type: 'group',
              key: '1-loadMore',
              label: <LinkButton type="department" last={departments[departments.length - 1].id} />,
            })),
        resultItems);
  };
  return (
    <Dropdown
      menu={{
        items: getItems(),
      }}
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
