import React from 'react';
import { SortableItem, withDynamicSchemaProps } from '@tachybase/client';

import { ConfigProvider, Row } from 'antd';

import { canBeDataField } from '../../utils';
import { useTabSearchCollapsibleInputItemAction } from './TabSearchCollapsibleInputItemAction';
import { IButton, IDatePicker, IInput, ISelect } from './TabSearchCollapsibleInputItemChild';

export const TabSearchCollapsibleInputItem = withDynamicSchemaProps(
  (props) => {
    const {
      fieldInterface,
      collectionField,
      Designer,
      options,
      value,
      onSelectChange,
      onInputChange,
      onButtonClick,
      customLabelKey,
      onDateClick,
    } = useTabSearchCollapsibleInputItemAction(props);

    if (!collectionField) {
      return null;
    }

    return (
      <SortableItem>
        <Designer />
        <ConfigProvider
          theme={{
            token: { colorBgContainer: '#f9f9f9', colorBorder: 'none' },
            components: {
              Input: {
                colorBorder: '#f9f9f9',
                activeShadow: 'none',
                hoverBorderColor: 'none',
                activeBorderColor: 'none',
              },
              Divider: { colorSplit: '#c1c2c5' },
            },
          }}
        >
          <Row style={{ marginTop: '2vh', backgroundColor: '#f9f9f9' }}>
            <ISelect options={options} onChange={onSelectChange} customLabelKey={customLabelKey} />
            {canBeDataField(fieldInterface) ? (
              <IDatePicker options={options} value={value} onInputChange={onInputChange} onChange={onDateClick} />
            ) : (
              <IInput options={options} value={value} onChange={onInputChange} />
            )}

            <IButton onClick={onButtonClick} />
          </Row>
        </ConfigProvider>
      </SortableItem>
    );
  },
  { displayName: 'TabSearchCollapsibleInputItem' },
);
