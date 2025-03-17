import React, { useEffect, useMemo, useState } from 'react';
import {
  SchemaComponent,
  useActionContext,
  useAPIClient,
  useDataBlockRequest,
  useDataBlockResource,
  useFilterByTk,
} from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { App, Button, Dropdown, message, Modal, Upload } from 'antd';

import { useFlowContext } from '../../../FlowContext';
import { useTranslation } from '../../../locale';
import { useProps } from './AddButton.props';
import useStyles from './AddButton.style';

interface AddButtonProps {
  upstream;
  branchIndex?: number | null;
  [key: string]: any;
}

/**
 * 添加按钮以及节点之间的连接线
 */
export const AddButton = (props: AddButtonProps) => {
  const { styles } = useStyles();
  const form = useForm();
  const [isUploadVisible, setUploadVisible] = useState(false);
  const { upstream, branchIndex = null } = props;
  const { workflow, menu } = useProps(props);
  const { t } = useTranslation();
  if (!workflow) {
    return null;
  }

  const handleUploadCancel = () => {
    setUploadVisible((prev) => {
      console.log('%c Line:36 🍺 prev', 'font-size:18px;color:#2eafb0;background:#465975', prev);
      return false;
    });
    form.reset();
  };

  const updatedMenu = {
    ...menu,
    onClick: (info) => {
      if (info.key === 'load') {
        setUploadVisible(true);
      } else {
        menu.onClick(info);
      }
    },
  };

  const schema = useMemo(() => {
    return {
      type: 'void',
      'x-decorator': 'FormV2',
      properties: {
        file: {
          type: 'object',
          title: '{{ t("File") }}',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Upload.Attachment',
          'x-component-props': {
            action: 'attachments:create',
            multiple: false,
            style: {
              marginTop: '20px',
            },
          },
        },
        footer: {
          type: 'void',
          'x-component': 'ActionBar',
          'x-component-props': {
            style: {
              justifyContent: 'right',
            },
          },
          properties: {
            cancel: {
              type: 'void',
              title: '{{t("Cancel")}}',
              'x-component': 'Action',
              'x-component-props': {
                useAction() {
                  return {
                    async run() {
                      handleUploadCancel();
                    },
                  };
                },
              },
            },
            submit: {
              type: 'void',
              title: '{{t("Submit")}}',
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
                useAction() {
                  const { t } = useTranslation();
                  const api = useAPIClient();
                  const { workflow, refresh } = useFlowContext() ?? {};
                  const { values } = useForm();

                  return {
                    async run() {
                      try {
                        const response = await fetch(values.file.url);
                        const jsonData = await response.json();
                        if (workflow) {
                          await api.resource('workflows.nodes', workflow.id).create({
                            values: {
                              type: jsonData.type,
                              upstreamId: upstream?.id ?? null,
                              branchIndex,
                              title: jsonData.title,
                              config: jsonData.config,
                            },
                          });
                          handleUploadCancel();
                          message.success(t('Operation succeeded'));
                          refresh();
                        }
                      } catch (error) {
                        handleUploadCancel();
                        console.error('JSON解析失败:', error);
                        refresh();
                      }
                    },
                  };
                },
              },
            },
          },
        },
      },
    };
  }, [isUploadVisible]);

  useEffect(() => {
    console.log('👀 visible变化了:', isUploadVisible);
  }, [isUploadVisible]);

  return (
    <App>
      <div className={styles.addButtonClass}>
        <Dropdown
          trigger={['click']}
          disabled={workflow.executed}
          overlayClassName={styles.dropDownClass}
          menu={updatedMenu}
        >
          <Button
            className="add-btn"
            icon={<PlusOutlined />}
            type="primary"
            aria-label={props['aria-label'] || 'add-button'}
          />
        </Dropdown>
        <Modal open={isUploadVisible} footer={null} closable={false} title={t('Upload node')}>
          <SchemaComponent schema={schema} />
        </Modal>
      </div>
    </App>
  );
};
