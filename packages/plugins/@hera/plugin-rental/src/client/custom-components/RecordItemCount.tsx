import React, { useEffect, useState } from 'react';
import {
  CUSTOM_COMPONENT_TYPE_FIELD,
  KEY_CUSTOM_COMPONENT_LABEL,
  KEY_CUSTOM_COMPONENT_TYPE,
} from '@hera/plugin-core/client';
import { useField, useForm, useFormEffects } from '@formily/react';
import { onFieldInit, onFieldValueChange } from '@formily/core';
import _ from 'lodash';
import { useRequest } from '@nocobase/client';
import { formatQuantity } from '../../utils/currencyUtils';

export const RecordItemCount = (props) => {
  const reqProductCategory = useRequest<any>({
    resource: 'product_category',
    action: 'list',
    params: {
      pageSize: 99999,
    },
  });
  const [items, setItems] = useState([]);
  const [result, setResult] = useState('-');
  // 先做重量
  const form = useForm();
  const field = useField();
  const currentItemsPath = field.path.parent().parent().entire + '.*';
  const calc = () => {
    const path = field.path.entire as string;
    const regx = path.match(/\d+/g);
    if (!regx) return;
    const itemiIndex = regx[0];
    const itemData = items[itemiIndex];
    if (itemData.product && itemData.count) {
      const category = reqProductCategory.data.data.find((category) => category.id === itemData.product.category_id);
      if (!category) return;
      const value = category.convertible ? (itemData.product.ratio || 0) * itemData.count : itemData.count;
      const unit = category.convertible ? category.conversion_unit : category.unit;
      setResult(formatQuantity(value, 2) + unit);
    }
  };

  useFormEffects(() => {
    onFieldInit(currentItemsPath, () => {
      setItems(_.cloneDeep(form.values.items));
    });
    onFieldValueChange(currentItemsPath, () => {
      setItems(_.cloneDeep(form.values.items));
    });
  });
  useEffect(() => {
    if (!reqProductCategory.loading) {
      calc();
    }
  }, [items, reqProductCategory.loading]);
  return <span>{result}</span>;
};

RecordItemCount.displayName = 'RecordItemCount';
RecordItemCount[KEY_CUSTOM_COMPONENT_TYPE] = CUSTOM_COMPONENT_TYPE_FIELD;
RecordItemCount[KEY_CUSTOM_COMPONENT_LABEL] = '记录单 - 明细 - 换算数量';
