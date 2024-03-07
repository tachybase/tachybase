import transformers from '../block/transformers';
import { lang } from '../locale';
import { ChartRendererProps } from '../renderer';
import { getSelectedFields } from '../utils';
import { FieldOption } from './query';

/**
 * useFieldTypes
 * Get field types for using transformers
 * Only supported types will be displayed
 * Some interfaces and types will be mapped to supported types
 */
export const useFieldTypes = (fields: FieldOption[]) => (field: any) => {
  const selectedField = field.query('.field').get('value');
  const query = field.query('query').get('value') || {};
  const selectedFields = getSelectedFields(fields, query);
  const fieldProps = selectedFields.find((field) => field.value === selectedField);
  const supports = Object.keys(transformers);
  field.dataSource = supports.map((key) => ({
    label: lang(key),
    value: key,
  }));
  const map = {
    createdAt: 'datetime',
    updatedAt: 'datetime',
    double: 'number',
    integer: 'number',
    percent: 'number',
  };
  const fieldInterface = fieldProps?.interface;
  const fieldType = fieldProps?.type;
  const key = map[fieldInterface] || map[fieldType] || fieldType;
  if (supports.includes(key)) {
    field.setState({
      value: key,
      disabled: true,
    });
    return;
  }
  field.setState({
    disabled: false,
  });
};

export const useTransformers = (field: any) => {
  const selectedType = field.query('.type').get('value');
  if (!selectedType) {
    field.dataSource = [];
    return;
  }
  const options = Object.keys(transformers[selectedType] || {}).map((key) => ({
    label: lang(key),
    value: key,
  }));
  field.dataSource = options;
};

//添加小数判断方法
export const useTransformersDecimal = (field: any) => {
  const selectedType = field.query('.type').get('value');
  const selectedFormat = field.query('.format').get('value');
  if (!selectedFormat || !selectedType || selectedFormat != 'Decimal') {
    field.dataSource = [];
  } else {
    const options = Object.keys(transformers[selectedType][selectedFormat] || {}).map((key) => ({
      label: lang(key),
      value: key,
    }));
    field.dataSource = options;
  }
};

export const useFieldTransformer = (transform: ChartRendererProps['transform'], locale = 'en-US') => {
  return (transform || [])
    .filter((item) => {
      if (item.format) {
        //对小数做了判断
        if (item.format == 'Decimal') {
          if (item.specific) {
            return item.field && item.type && item.format && item.specific;
          }
        } else {
          return item.field && item.type && item.format;
        }
      }
    })
    .reduce((mp, item) => {
      const transformer = item.specific
        ? transformers[item.type][item.format][item.specific]
        : transformers[item.type][item.format];
      if (!transformer) {
        return mp;
      }
      mp[item.field] = (val: any) => transformer(val, locale);
      return mp;
    }, {});
};
