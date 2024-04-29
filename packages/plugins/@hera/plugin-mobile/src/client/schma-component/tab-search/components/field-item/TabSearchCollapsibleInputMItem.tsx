import { SortableItem, css, withDynamicSchemaProps } from '@nocobase/client';
import { Checkbox, Grid, Switch } from 'antd-mobile';
import React from 'react';
import { useTabSearchCollapsibleInputItemAction } from './TabSearchCollapsibleInputItemAction';
import { IButton, IDatePicker, IInput, ISelect } from './TabSearchCollapsibleInputMItemChild';
import { canBeDataField } from '../../utils';
import { tval, useTranslation } from '../../../../locale';

export const TabSearchCollapsibleInputMItem = withDynamicSchemaProps(
  (props) => {
    const {
      collectionField,
      Designer,
      options,
      value,
      needSort,
      onSelectChange,
      onInputChange,
      onButtonClick,
      customLabelKey,
      fieldInterface,
      onDateClick,
      setNeedSort,
    } = useTabSearchCollapsibleInputItemAction(props);
    const { t } = useTranslation();

    if (!collectionField) {
      return null;
    }
    return (
      <SortableItem>
        <Designer />
        <Grid
          columns={4}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: '10px',
            backgroundColor: '#f9f9f9',
            borderRadius: '5px',
            margin: '5px 0 0 0',
          }}
        >
          <ISelect options={options} onChange={onSelectChange} customLabelKey={customLabelKey} />
          {canBeDataField(fieldInterface) ? (
            <IDatePicker value={value} onChange={onDateClick} onInputChange={onInputChange} options={options} />
          ) : (
            <>
              <IInput options={options} value={value} onChange={onInputChange} />
              <div
                className={css`
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                `}
              >
                <Checkbox
                  className={css`
                    margin-right: 10px;
                  `}
                  checked={needSort}
                  onChange={setNeedSort}
                >
                  {t('sort')}
                </Checkbox>
                <IButton onClick={onButtonClick} />
              </div>
            </>
          )}
        </Grid>
      </SortableItem>
    );
  },
  { displayName: 'TabSearchCollapsibleInputItem' },
);
