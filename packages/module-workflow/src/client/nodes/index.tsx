import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActionContextProvider,
  css,
  cx,
  FormProvider,
  Icon,
  SchemaComponent,
  SchemaInitializerItemType,
  useActionContext,
  useAPIClient,
  useCompile,
  usePlugin,
  useResourceActionContext,
} from '@tachybase/client';
import { createForm, ISchema, useForm } from '@tachybase/schema';
import { parse, str2moment } from '@tachybase/utils/client';

import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { App, Button, Dropdown, Input, message, Tag, Tooltip } from 'antd';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

import WorkflowPlugin from '..';
import { AddButton } from '../AddButton';
import { DrawerDescription } from '../components/DrawerDescription';
import { StatusButton } from '../components/StatusButton';
import { JobStatusOptionsMap } from '../constants';
import { useFlowContext } from '../FlowContext';
import { useGetAriaLabelOfAddButton } from '../hooks/useGetAriaLabelOfAddButton';
import { lang } from '../locale';
import useStyles from '../style';
import { UseVariableOptions, VariableOption } from '../variable';

export type NodeAvailableContext = {
  engine: WorkflowPlugin;
  workflow: object;
  upstream: object;
  branchIndex: number;
};

export const enum BuiltinGroupType {
  CONTROL = 'control',
  COLLECTION = 'collection',
  EXTENDED = 'extended',
  MANUAL = 'manual',
  ADVANCED = 'advanced',
}

export type GroupType = BuiltinGroupType | string;

export abstract class Instruction {
  title: string;
  type: string;
  group: GroupType;
  description?: string;
  options?: { label: string; value: any; key: string }[];
  fieldset: { [key: string]: ISchema };
  view?: ISchema;
  scope?: { [key: string]: any };
  components?: { [key: string]: any };
  Component?(props): JSX.Element;
  useVariables?(node, options?: UseVariableOptions): VariableOption;
  useScopeVariables?(node, options?): VariableOption[];
  useInitializers?(node): SchemaInitializerItemType | null;
  isAvailable?(ctx: NodeAvailableContext): boolean;
  end?: boolean | ((node) => boolean);
}

function useUpdateAction() {
  const form = useForm();
  const api = useAPIClient();
  const ctx = useActionContext();
  const { refresh } = useResourceActionContext();
  const data = useNodeContext();
  const { workflow } = useFlowContext();
  return {
    async run() {
      if (workflow.executed) {
        message.error(lang('Node in executed workflow cannot be modified'));
        return;
      }
      await form.submit();
      await api.resource('flow_nodes').update?.({
        filterByTk: data.id,
        values: {
          config: form.values,
        },
      });
      ctx.setFormValueChanged(false);
      // ctx.setVisible(false);
      message.success('success');
      refresh();
    },
  };
}

export const NodeContext = React.createContext<any>({});

export function useNodeContext() {
  return useContext(NodeContext);
}

export function useAvailableUpstreams(node, filter?) {
  const stack: any[] = [];
  if (!node) {
    return [];
  }
  for (let current = node.upstream; current; current = current.upstream) {
    if (typeof filter !== 'function' || filter(current)) {
      stack.push(current);
    }
  }

  return stack;
}

export function useUpstreamScopes(node) {
  const stack: any[] = [];
  if (!node) {
    return [];
  }

  for (let current = node; current; current = current.upstream) {
    if (current.upstream && current.branchIndex != null) {
      stack.push(current.upstream);
    }
  }

  return stack;
}

// TODO
const AutoResizeInput = ({ ...props }) => {
  const [inputWidth, setInputWidth] = useState(0); // 初始宽度
  const spanRef = useRef(null);

  const handleInputChange = (e) => {
    // TODO fix width offset
    setInputWidth(spanRef.current.offsetWidth + 30.2); // 更新宽度
    props.onChange?.(e);
  };

  useEffect(() => {
    setInputWidth(spanRef.current.offsetWidth + 30.2); // 初始宽度
  }, []);

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <Input
        {...props}
        onChange={handleInputChange}
        style={{
          width: `${inputWidth}px`,
        }}
      />
      <span
        ref={spanRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre',
          font: 'inherit',
        }}
      >
        {props.value || props.placeholder}
      </span>
    </div>
  );
};

export function Node({ data }) {
  const { styles } = useStyles();
  const { getAriaLabel } = useGetAriaLabelOfAddButton(data);
  const workflowPlugin = usePlugin(WorkflowPlugin);
  const { Component = NodeDefaultView, end } = workflowPlugin.instructions.get(data.type);
  return (
    <NodeContext.Provider value={data}>
      <div className={cx(styles.nodeBlockClass)}>
        <Component data={data} />
        {!end || (typeof end === 'function' && !end(data)) ? (
          <AddButton aria-label={getAriaLabel()} upstream={data} />
        ) : (
          <div className="end-sign">
            <CloseOutlined />
          </div>
        )}
      </div>
    </NodeContext.Provider>
  );
}

export function ArrowDownButton() {
  const { t } = useTranslation();
  const api = useAPIClient();
  const { workflow, nodes, refresh } = useFlowContext() ?? {};
  const current = useNodeContext();
  const { modal } = App.useApp();

  if (!workflow) {
    return null;
  }
  const resource = api.resource('flow_nodes');

  async function onMoveDown() {
    await resource.moveDown?.({
      filterByTk: current.id,
    });
    refresh();
  }

  return workflow.executed ? null : (
    <Button
      type="text"
      shape="circle"
      icon={<Icon type="ArrowDownOutlined" />}
      onClick={onMoveDown}
      className="workflow-node-remove-button"
    />
  );
}

export function ArrowUpButton() {
  const api = useAPIClient();
  const { workflow, nodes, refresh } = useFlowContext() ?? {};
  const current = useNodeContext();

  if (!workflow) {
    return null;
  }
  const resource = api.resource('flow_nodes');

  async function onMoveUp() {

      await resource.moveUp?.({
        filterByTk: current.id,
      });
      refresh();

  }

  return workflow.executed ? null : (
    <Button
      type="text"
      shape="circle"
      icon={<Icon type="ArrowUpOutlined" />}
      onClick={onMoveUp}
      className="workflow-node-remove-button"
    />
  );
}

export function RemoveButton() {
  const { t } = useTranslation();
  const api = useAPIClient();
  const { workflow, nodes, refresh } = useFlowContext() ?? {};
  const current = useNodeContext();
  const { modal } = App.useApp();

  if (!workflow) {
    return null;
  }
  const resource = api.resource('flow_nodes');

  async function onRemove() {
    async function onOk() {
      await resource.destroy?.({
        filterByTk: current.id,
      });
      refresh();
    }

    const usingNodes = nodes.filter((node) => {
      if (node === current) {
        return false;
      }

      const template = parse(node.config);
      const refs = template.parameters.filter(
        ({ key }) => key.startsWith(`$jobsMapByNodeKey.${current.key}.`) || key === `$jobsMapByNodeKey.${current.key}`,
      );
      return refs.length;
    });

    if (usingNodes.length) {
      modal.error({
        title: lang('Can not delete'),
        content: lang(
          'The result of this node has been referenced by other nodes ({{nodes}}), please remove the usage before deleting.',
          { nodes: usingNodes.map((item) => `#${item.id}`).join(', ') },
        ),
      });
      return;
    }

    const hasBranches = !nodes.find((item) => item.upstream === current && item.branchIndex != null);
    const message = hasBranches
      ? t('Are you sure you want to delete it?')
      : lang('This node contains branches, deleting will also be preformed to them, are you sure?');

    modal.confirm({
      title: t('Delete'),
      content: message,
      onOk,
    });
  }

  return workflow.executed ? null : (
    <Button
      type="text"
      shape="circle"
      icon={<DeleteOutlined />}
      onClick={onRemove}
      className="workflow-node-remove-button"
    />
  );
}

export function JobButton() {
  const { execution, setViewJob } = useFlowContext();
  const { jobs } = useNodeContext() ?? {};
  const { styles } = useStyles();

  if (!execution) {
    return null;
  }

  if (!jobs.length) {
    return <StatusButton className={styles.nodeJobButtonClass} disabled />;
  }

  function onOpenJob({ key }) {
    const job = jobs.find((item) => item.id === key);
    setViewJob(job);
  }

  return jobs.length > 1 ? (
    <Dropdown
      menu={{
        items: jobs.map((job) => {
          return {
            key: job.id,
            label: (
              <>
                <StatusButton statusMap={JobStatusOptionsMap} status={job.status} />
                <time>{str2moment(job.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</time>
              </>
            ),
          };
        }),
        onClick: onOpenJob,
        className: styles.dropdownClass,
      }}
    >
      <StatusButton
        statusMap={JobStatusOptionsMap}
        status={jobs[jobs.length - 1].status}
        className={styles.nodeJobButtonClass}
      />
    </Dropdown>
  ) : (
    <StatusButton
      statusMap={JobStatusOptionsMap}
      status={jobs[0].status}
      onClick={() => setViewJob(jobs[0])}
      className={styles.nodeJobButtonClass}
    />
  );
}

function useFormProviderProps() {
  return { form: useForm() };
}

export function NodeDefaultView(props) {
  const { data, children } = props;
  const compile = useCompile();
  const api = useAPIClient();
  const { workflow, refresh } = useFlowContext() ?? {};
  const { styles } = useStyles();
  const workflowPlugin = usePlugin(WorkflowPlugin);
  const instruction = workflowPlugin.instructions.get(data.type);
  const detailText = workflow.executed ? '{{t("View")}}' : '{{t("Configure")}}';
  const typeTitle = compile(instruction.title);

  const [editingTitle, setEditingTitle] = useState<string>(data.title ?? typeTitle);
  const [editingConfig, setEditingConfig] = useState(false);
  const [formValueChanged, setFormValueChanged] = useState(false);

  const form = useMemo(() => {
    const values = cloneDeep(data.config);
    return createForm({
      initialValues: values,
      disabled: workflow.executed,
    });
  }, [data, workflow]);

  const resetForm = useCallback(
    (editing) => {
      setEditingConfig(editing);
      if (!editing) {
        form.reset();
      }
    },
    [form],
  );

  const onChangeTitle = useCallback(
    async function (next) {
      const title = next || typeTitle;
      setEditingTitle(title);
      if (title === data.title) {
        return;
      }
      await api.resource('flow_nodes').update?.({
        filterByTk: data.id,
        values: {
          title,
        },
      });
      refresh();
    },
    [data],
  );

  const onOpenDrawer = useCallback(function (ev) {
    if (ev.target === ev.currentTarget) {
      setEditingConfig(true);
      return;
    }
    if (ev.target?.classList?.contains('workflow-node-edit')) {
      setEditingConfig(true);
    }
    const whiteSet = new Set(['workflow-node-meta', 'workflow-node-config-button', 'ant-input-disabled']);
    for (let el = ev.target; el && el !== ev.currentTarget && el !== document.documentElement; el = el.parentNode) {
      if ((Array.from(el.classList) as string[]).some((name: string) => whiteSet.has(name))) {
        setEditingConfig(true);
        ev.stopPropagation();
        return;
      }
    }
  }, []);

  const schema = {
    type: 'void',
    properties: {
      ...(instruction.view ? { view: instruction.view } : {}),
      button: {
        type: 'void',
        'x-content': detailText,
        'x-component': Button,
        'x-component-props': {
          type: 'link',
          className: 'workflow-node-config-button',
        },
      },
      [data.id]: {
        type: 'void',
        title: (
          <div
            className={css`
              display: flex;
              justify-content: space-between;

              strong {
                font-weight: bold;
              }

              .ant-tag {
                margin-inline-end: 0;
              }

              code {
                font-weight: normal;
              }
            `}
          >
            <strong>{data.title}</strong>
            <Tooltip title={lang('Variable key of node')}>
              <Tag>
                <code>{data.key}</code>
              </Tag>
            </Tooltip>
          </div>
        ),
        'x-decorator': 'FormV2',
        'x-use-decorator-props': 'useFormProviderProps',
        'x-component': 'Action.Area',
        properties: {
          ...(instruction.description
            ? {
                description: {
                  type: 'void',
                  'x-component': DrawerDescription,
                  'x-component-props': {
                    label: lang('Node type'),
                    title: instruction.title,
                    description: instruction.description,
                  },
                },
              }
            : {}),
          fieldset: {
            type: 'void',
            'x-component': 'fieldset',
            'x-component-props': {
              className: css`
                .ant-input,
                .ant-select,
                .ant-cascader-picker,
                .ant-picker,
                .ant-input-number,
                .ant-input-affix-wrapper {
                  &.auto-width {
                    width: auto;
                    min-width: 6em;
                  }
                }
              `,
            },
            properties: instruction.fieldset,
          },
          actions: workflow.executed
            ? null
            : {
                type: 'void',
                'x-component': 'ActionArea.Footer',
                properties: {
                  cancel: {
                    title: '{{t("Cancel")}}',
                    'x-component': 'Action',
                    'x-component-props': {
                      useAction: '{{ cm.useCancelAction }}',
                    },
                  },
                  submit: {
                    title: '{{t("Submit")}}',
                    'x-component': 'Action',
                    'x-component-props': {
                      type: 'primary',
                      useAction: useUpdateAction,
                    },
                  },
                },
              },
        },
      } as ISchema,
    },
  };

  return (
    <div className={cx(styles.nodeClass, `workflow-node-type-${data.type}`)}>
      <div
        role="button"
        aria-label={`${typeTitle}-${editingTitle}`}
        className={cx(styles.nodeCardClass, { configuring: editingConfig })}
        onClick={onOpenDrawer}
      >
        <div className="workflow-node-prefix">
          <Icon type="dispatcher" />
        </div>
        <AutoResizeInput
          className="workflow-node-edit"
          disabled={workflow.executed}
          value={editingTitle}
          onChange={(ev) => setEditingTitle(ev.target.value)}
          onBlur={(ev) => onChangeTitle(ev.target.value)}
        />
        <div className="workflow-node-suffix">
          <div className="icon-button">
            <ArrowUpButton />
          </div>
          <div className="icon-button">
            <ArrowDownButton />
          </div>
          <div className="icon-button">
            <RemoveButton />
          </div>
          <div className="icon-button">
            <JobButton />
          </div>
        </div>
        <ActionContextProvider
          value={{
            visible: editingConfig,
            setVisible: resetForm,
            formValueChanged,
            setFormValueChanged,
          }}
        >
          <FormProvider form={form}>
            <SchemaComponent
              scope={{
                ...instruction.scope,
                useFormProviderProps,
              }}
              components={instruction.components}
              schema={schema}
            />
          </FormProvider>
        </ActionContextProvider>
      </div>
      {children}
    </div>
  );
}
