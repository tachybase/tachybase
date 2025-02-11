import React, { useEffect, useState } from 'react';
import {
  ActionContextProvider,
  cx,
  SchemaComponent,
  TableBlockProvider,
  useApp,
  useDocumentTitle,
  useResourceActionContext,
  useResourceContext,
  WorkflowSelect,
} from '@tachybase/client';
import { str2moment } from '@tachybase/utils/client';

import { DownOutlined, EllipsisOutlined, RightOutlined } from '@ant-design/icons';
import { App, Breadcrumb, Button, Dropdown, message, Modal, Result, Spin, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { CanvasContentWrapper } from './CanvasContentWrapper';
import { ExecutionLink } from './components/ExecutionLink';
import { ExecutionRetryAction } from './components/ExecutionRetryAction';
import { ExecutionStatusColumn } from './components/ExecutionStatus';
import { BackButton } from './components/GoBackButton';
import { FlowContext, useFlowContext } from './FlowContext';
import { lang, NAMESPACE } from './locale';
import { executionSchema } from './schemas/executions';
import useStyles from './style';
import { getWorkflowDetailPath, getWorkflowExecutionsPath, linkNodes } from './utils';

function ExecutionResourceProvider({ params, filter = {}, ...others }) {
  const { workflow } = useFlowContext();
  const props = {
    ...others,
    params: {
      ...params,
      filter: {
        ...params?.filter,
        key: workflow.key,
      },
    },
  };
  return <TableBlockProvider {...props} />;
}

export function WorkflowCanvas() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const app = useApp();
  const { data, refresh, loading } = useResourceActionContext();
  const { resource } = useResourceContext();
  const { setTitle } = useDocumentTitle();
  const [visible, setVisible] = useState(false);
  const [moveVisible, setMoveVisible] = useState(false);
  const [moveKey, setMoveKey] = useState(null);
  const { styles } = useStyles();
  const { modal } = App.useApp();

  useEffect(() => {
    const { title } = data?.data ?? {};
    setTitle?.(`${lang('Workflow')}${title ? `: ${title}` : ''}`);
  }, [data?.data]);

  if (!data?.data) {
    if (loading) {
      return <Spin />;
    }
    return <Result status="404" title="Not found" />;
  }

  const { nodes = [], revisions = [], ...workflow } = data?.data ?? {};
  linkNodes(nodes);

  const entry = nodes.find((item) => !item.upstream);

  function onSwitchVersion({ key }) {
    if (key !== workflow.id) {
      navigate(getWorkflowDetailPath(key));
    }
  }

  async function onToggle(value) {
    await resource.update({
      filterByTk: workflow.id,
      values: {
        enabled: value,
      },
    });
    refresh();
  }

  async function onRetry() {
    const {
      data: { data: executionId },
    } = await resource.retry({
      filterByTk: workflow.id,
      filter: {
        key: workflow.key,
      },
    });

    navigate(getWorkflowExecutionsPath(executionId.executionId));
  }

  async function onRevision() {
    const {
      data: { data: revision },
    } = await resource.revision({
      filterByTk: workflow.id,
      filter: {
        key: workflow.key,
      },
    });
    message.success(t('Operation succeeded'));

    navigate(getWorkflowDetailPath(revision.id));
    // setRefreshKey(uid());
  }

  async function onDelete() {
    const content = workflow.current
      ? lang('Delete a main version will cause all other revisions to be deleted too.')
      : '';
    modal.confirm({
      title: t('Are you sure you want to delete it?'),
      content,
      async onOk() {
        await resource.destroy({
          filterByTk: workflow.id,
        });
        message.success(t('Operation succeeded'));

        navigate(
          workflow.current
            ? app.systemSettingsManager.getRoutePath('workflow')
            : getWorkflowDetailPath(revisions.find((item) => item.current)?.id),
        );
      },
    });
  }

  const handleMoveOk = async () => {
    if (moveKey) {
      await resource.moveWorkflow({
        id: workflow.id,
        targetKey: moveKey,
      });
      message.success(lang('Move success'));
      setMoveVisible(false);
      workflow.key = moveKey;
      refresh();
    } else {
      message.error(lang('Select target workflow'));
    }
  };

  async function onMenuCommand({ key }) {
    switch (key) {
      case 'history':
        setVisible(true);
        return;
      case 'Retry':
        return onRetry();
      case 'revision':
        return onRevision();
      case 'delete':
        return onDelete();
      case 'move':
        setMoveKey(null);
        setMoveVisible(true);
        return;
      default:
        break;
    }
  }

  const revisionable =
    workflow.executed &&
    !revisions.find((item) => !item.executed && new Date(item.createdAt) > new Date(workflow.createdAt));

  return (
    <FlowContext.Provider
      value={{
        workflow,
        nodes,
        refresh,
      }}
    >
      <div className="workflow-toolbar">
        <header>
          <BackButton />
          <Breadcrumb
            items={[
              {
                title: (
                  <Link to={app.systemSettingsManager.getRoutePath(`business-components.${NAMESPACE}`)}>
                    {lang('Workflow')}
                  </Link>
                ),
              },
              { title: <strong>{workflow.title}</strong> },
            ]}
          />
        </header>
        <aside>
          <div className="workflow-versions">
            <Dropdown
              trigger={['click']}
              menu={{
                onClick: onSwitchVersion,
                defaultSelectedKeys: [`${workflow.id}`],
                className: cx(styles.dropdownClass, styles.workflowVersionDropdownClass),
                items: revisions
                  .sort((a, b) => b.id - a.id)
                  .map((item, index) => ({
                    role: 'button',
                    'aria-label': `version-${index}`,
                    key: `${item.id}`,
                    icon: item.current ? <RightOutlined /> : null,
                    className: cx({
                      executed: item.executed,
                      unexecuted: !item.executed,
                      enabled: item.enabled,
                    }),
                    label: (
                      <>
                        <strong>{`#${item.id}`}</strong>
                        <time>{str2moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</time>
                      </>
                    ),
                  })),
              }}
            >
              <Button type="text" aria-label="version">
                <label>{lang('Version')}</label>
                <span>{workflow?.id ? `#${workflow.id}` : null}</span>
                <DownOutlined />
              </Button>
            </Dropdown>
          </div>
          <Switch
            checked={workflow.enabled}
            onChange={onToggle}
            checkedChildren={lang('On')}
            unCheckedChildren={lang('Off')}
          />
          <Dropdown
            menu={{
              items: [
                {
                  role: 'button',
                  'aria-label': 'history',
                  key: 'history',
                  label: lang('Execution history'),
                  disabled: !workflow.allExecuted,
                },
                {
                  role: 'button',
                  'aria-label': 'Retry',
                  key: 'Retry',
                  label: lang('Retry'),
                  disabled: !workflow.allExecuted,
                },
                {
                  role: 'button',
                  'aria-label': 'revision',
                  key: 'revision',
                  label: lang('Copy to new version'),
                  disabled: !revisionable,
                },
                { role: 'button', 'aria-label': 'delete', key: 'delete', label: t('Delete') },
                {
                  role: 'button',
                  'aria-label': 'move',
                  key: 'move',
                  label: lang('Move'),
                  disabled: workflow.current,
                },
              ] as any[],
              onClick: onMenuCommand,
            }}
          >
            <Button aria-label="more" type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
          <ActionContextProvider value={{ visible, setVisible }}>
            <SchemaComponent
              schema={executionSchema}
              components={{
                ExecutionResourceProvider,
                ExecutionLink,
                ExecutionStatusColumn,
              }}
              scope={{
                ExecutionRetryAction,
              }}
            />
          </ActionContextProvider>
        </aside>
      </div>
      <CanvasContentWrapper entry={entry} />

      <Modal
        title={lang('Move workflow')}
        visible={moveVisible}
        onOk={handleMoveOk}
        onCancel={() => {
          setMoveVisible(false);
        }}
      >
        <p>{lang('Move current version to another workflow')}</p>
        <WorkflowSelect
          buttonAction="submit"
          noCollection
          label="title"
          actionType="update"
          value={moveKey}
          filterType={workflow.type}
          filterSync={workflow.sync}
          filterKey={{ $ne: workflow.key }} //限制选择同type,同sync,enabled:true,不包含自己
          // filterEnabled={{ $in: [true, false] }}
          onChange={(value) => setMoveKey(value)}
        />
      </Modal>
    </FlowContext.Provider>
  );
}
