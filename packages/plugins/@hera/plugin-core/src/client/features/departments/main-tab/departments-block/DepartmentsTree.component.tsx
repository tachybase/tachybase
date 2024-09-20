import React, { useEffect } from 'react';
import { css, useAPIClient, useResourceActionContext } from '@tachybase/client';

import { MoreOutlined } from '@ant-design/icons';
import { App, Dropdown, Empty, Tree } from 'antd';

import { useTranslation } from '../../../../locale';
import { useContextDepartments } from '../context/Department.context';
import { useContextDepartmentsExpanded } from '../context/DepartmentsExpanded.context';
import { schemaDepartmentEdit } from './schemas/schemaDepartmentEdit';
import { schemaDepartmentNewSub } from './schemas/schemaDepartmentNewSub';

// 部门左边-部门列表
export const DepartmentsTree = () => {
  const { data, loading } = useResourceActionContext();
  const { department, setDepartment, setUser } = useContextDepartments();
  const { treeData, nodeMap, loadData, loadedKeys, setLoadedKeys, initData, expandedKeys, setExpandedKeys } =
    useContextDepartmentsExpanded() as any;

  const onSelect = async (keys) => {
    if (!keys.length) {
      return;
    }
    const department = nodeMap[keys[0]];
    setDepartment(department);
    setUser(null);
  };

  const onExpand = (key) => {
    setExpandedKeys(key);
  };

  const onLoad = (key) => {
    setLoadedKeys(key);
  };

  useEffect(() => {
    initData(data?.data);
  }, [data, initData, loading]);

  useEffect(() => {
    if (!department) {
      return;
    }

    const getDepartmentIds = (department) =>
      department.parent ? [department.parent.id, ...getDepartmentIds(department.parent)] : [];

    const departmentIds = getDepartmentIds(department);

    setExpandedKeys((keys) => Array.from(new Set([...keys, ...departmentIds])));
  }, [department, setExpandedKeys]);

  return (
    <div
      className={css`
        height: 57vh;
        overflow: auto;
        .ant-tree-node-content-wrapper {
          overflow: hidden;
        }
      `}
    >
      {treeData?.length ? (
        <Tree.DirectoryTree
          loadData={loadData}
          treeData={treeData}
          loadedKeys={loadedKeys}
          onSelect={onSelect}
          selectedKeys={[department?.id]}
          onExpand={onExpand}
          onLoad={onLoad}
          expandedKeys={expandedKeys}
          expandAction={false}
          showIcon={false}
          fieldNames={{ key: 'id' }}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
};

const DepartmentsTreeItem = ({ node, setVisible, setDrawer }) => {
  const { t } = useTranslation();
  const { refreshAsync } = useResourceActionContext();
  const { setLoadedKeys, expandedKeys, setExpandedKeys } = useContextDepartmentsExpanded();
  const { modal, message } = App.useApp();
  const API = useAPIClient();
  const showModalDelete = () => {
    modal.confirm({
      title: t('Delete department'),
      content: t('Are you sure you want to delete it?'),
      onOk: async () => {
        await API.resource('departments').destroy({ filterByTk: node.id });

        message.success(t('Deleted successfully'));

        setExpandedKeys((keys) => keys.filter((target) => target !== node.id));

        const newExpandedKeys = [...expandedKeys];

        setLoadedKeys([]);
        setExpandedKeys([]);

        await refreshAsync();

        setExpandedKeys(newExpandedKeys);
      },
    });
  };
  const setSchema = (schema) => {
    setDrawer({ schema, node });
    setVisible(true);
  };
  const onClick: any = ({ key, domeEvent }) => {
    domeEvent?.stopPropagation();
    switch (key) {
      case 'new-sub':
        setSchema(schemaDepartmentNewSub);
        break;
      case 'edit':
        setSchema(schemaDepartmentEdit);
        break;
      case 'delete':
        showModalDelete();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {node.title}
      </div>
      <Dropdown
        menu={{
          items: [
            { label: t('New sub department'), key: 'new-sub' },
            { label: t('Edit department'), key: 'edit' },
            { label: t('Delete department'), key: 'delete' },
          ],
          onClick,
        }}
      >
        <div style={{ marginLeft: '15px' }}>
          <MoreOutlined />
        </div>
      </Dropdown>
    </div>
  );
};

DepartmentsTree.Item = DepartmentsTreeItem;
