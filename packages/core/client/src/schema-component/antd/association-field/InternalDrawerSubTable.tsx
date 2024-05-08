import { EditOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { observer, useField, useFieldSchema } from '@tachybase/schema';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InternalSubTable } from './InternalSubTable';
import { Button, Drawer } from 'antd';
import { SubFormProvider, useAssociationFieldContext } from './hooks';
import { ActionContext, ActionContextProvider } from '../action/context';
import { ReadPrettyInternalViewer } from './InternalViewer';
import { useCollectionManager } from '../../../data-source';
import { FlagProvider } from '../../../flag-provider';

export const InternaDrawerSubTable = observer(
  (props) => {
    const { options } = useAssociationFieldContext();
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation();
    const nesterProps = {
      ...props,
      shouldMountElement: true,
    };

    const titleProps = {
      ...props,
      enableLink: true,
    };

    const field = useField();
    const fieldSchema = useFieldSchema();
    const cm = useCollectionManager();

    const ctx = useContext(ActionContext);
    return (
      <>
        <span
          style={{ cursor: 'pointer', display: 'flex' }}
          onClick={() => {
            setVisible(true);
          }}
        >
          <div
            className={css`
              max-width: 95%;
            `}
          >
            <ReadPrettyInternalViewer {...titleProps} />
          </div>
          <EditOutlined style={{ display: 'inline-flex', marginLeft: '5px' }} />
        </span>
        <ActionContextProvider value={{ ...ctx, visible, setVisible, openMode: 'drawer' }}>
          <Drawer
            title={t(options?.uiSchema?.rawTitle)}
            open={visible}
            onClose={() => {
              setVisible(false);
            }}
            style={{ backgroundColor: '#f3f3f3' }}
            width={'70%'}
            destroyOnClose
            extra={
              <Button type="primary" onClick={() => setVisible(false)}>
                确认
              </Button>
            }
          >
            <FlagProvider isInSubForm>
              <SubFormProvider
                value={{ value: field.value, collection: cm.getCollection(fieldSchema['x-collection-field']) }}
              >
                <InternalSubTable {...nesterProps} />
              </SubFormProvider>
            </FlagProvider>
          </Drawer>
        </ActionContextProvider>
      </>
    );
  },
  { displayName: 'InternaDrawerSubTable' },
);
