import React, { useEffect, useState } from 'react';
import {
  CUSTOM_COMPONENT_TYPE_FIELD,
  KEY_CUSTOM_COMPONENT_LABEL,
  KEY_CUSTOM_COMPONENT_TYPE,
} from '@hera/plugin-core/client';
import { useField, useForm, useFormEffects } from '@formily/react';
import { onFieldInit, onFieldValueChange } from '@formily/core';
import _ from 'lodash';
import { formatQuantity } from '../../utils/currencyUtils';
// 按产品表换算逻辑计算重量
export const RecordItemWeight = (props) => {
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
      const value = ((itemData.product.weight || 0) * itemData.count) / 1000;
      if (value) {
        setResult(formatQuantity(value, 2) + '吨');
      }
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
    if (items) {
      calc();
    }
  }, [items]);
  return <span>{result}</span>;
};

RecordItemWeight.displayName = 'RecordItemWeight';
RecordItemWeight[KEY_CUSTOM_COMPONENT_TYPE] = CUSTOM_COMPONENT_TYPE_FIELD;
RecordItemWeight[KEY_CUSTOM_COMPONENT_LABEL] = '记录单 - 明细 - 重量';
