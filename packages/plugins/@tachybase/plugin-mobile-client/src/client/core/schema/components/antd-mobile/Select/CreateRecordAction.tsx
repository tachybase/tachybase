import React, { useState } from 'react';
import { css, SchemaComponentOptions, useApp, useCollection } from '@tachybase/client';
import { observer, RecursionField, useField, useFieldSchema } from '@tachybase/schema';

import { Button, CenterPopup, Modal, Popup } from 'antd-mobile';

import { MobileProvider } from '../../../provider';

export const CreateRecordAction = observer(
  (props) => {
    const { fieldSchema } = props as any;

    const [visible, setVisible] = useState(false);
    const addNew = fieldSchema.reduceProperties((buf, schema) => {
      const found = schema.reduceProperties((buf, schema) => {
        if (schema['x-component'] === 'AssociationField.AddNewer') {
          return schema;
        }
        return buf;
      });
      if (found) {
        return found;
      }
      return buf;
    }, {});
    const modalAdd = () => {
      setVisible(true);
    };
    return (
      <div>
        <Button color="primary" fill="outline" onClick={modalAdd}>
          添加
        </Button>

        <Popup
          visible={visible}
          onMaskClick={() => {
            setVisible(false);
          }}
          className={css`
            .adm-popup-body {
              height: 80vh;
              overflow: auto;
            }
          `}
        >
          <MobileProvider>
            <RecursionField schema={addNew} onlyRenderProperties />
          </MobileProvider>
        </Popup>
      </div>
    );
  },
  { displayName: 'CreateRecordAction' },
);
