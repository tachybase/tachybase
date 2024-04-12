import { SortableItem, withDynamicSchemaProps } from '@nocobase/client';
import { Grid } from 'antd-mobile';
import React from 'react';
import { useTabSearchCollapsibleInputItemAction } from './TabSearchCollapsibleInputItemAction';
import { IButton, IDatePicker, IInput, ISelect } from './TabSearchCollapsibleInputMItemChild';
import { canBeDataField } from '../../utils';

export const TabSearchCollapsibleInputMItem = withDynamicSchemaProps(
  (props) => {
    const {
      collectionField,
      Designer,
      options,
      value,
      onSelectChange,
      onInputChange,
      onButtonClick,
      customLabelKey,
      fieldInterface,
      onDateClick,
    } = useTabSearchCollapsibleInputItemAction(props);

    if (!collectionField) {
      return null;
    }
    return (
      <SortableItem>
        <Designer />
        <Grid columns={4} style={{ backgroundColor: '#f9f9f9', borderRadius: '5px', margin: '5px 0 0 0' }}>
          <ISelect options={options} onChange={onSelectChange} customLabelKey={customLabelKey} />
          {canBeDataField(fieldInterface) ? (
            <IDatePicker value={value} onChange={onDateClick} onInputChange={onInputChange} options={options} />
          ) : (
            <>
              <IInput options={options} value={value} onChange={onInputChange} />
              <IButton onClick={onButtonClick} />
            </>
          )}
        </Grid>
      </SortableItem>
    );
  },
  { displayName: 'TabSearchCollapsibleInputItem' },
);
