import React, { useCallback, useMemo, useState } from 'react';
import {
  ActionContextProvider,
  css,
  cx,
  FormProvider,
  Icon,
  SchemaComponent,
  useAPIClient,
  useCompile,
  usePlugin,
} from '@tachybase/client';
import { createForm, ISchema } from '@tachybase/schema';

import { Button, Tag, Tooltip } from 'antd';
import { cloneDeep } from 'lodash';

import WorkflowPlugin, { AutoResizeInput } from '../..';
import { DrawerDescription } from '../../components/DrawerDescription';
import { useFlowContext } from '../../FlowContext';
import { lang } from '../../locale';
import useStyles from '../../style';
import { ArrowDownButton } from './buttons/ArrowDownButton';
import { ArrowUpButton } from './buttons/ArrowUpButton';
import { JobButton } from './buttons/JobButton';
import { RemoveButton } from './buttons/RemoveButton';
import { useFormProviderProps } from './useFormProviderProps';
import { useUpdateAction } from './useUpdateAction';

export const NodeDefaultView = (props) => {
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
          readOnly={workflow.executed}
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
};
