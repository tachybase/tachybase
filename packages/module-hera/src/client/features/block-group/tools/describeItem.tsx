import { ReqData } from '../GroupBlock';
import { fieldTransformers } from './fieldTransformers';

export const describeItem = (configItem, result, service, params, api) => {
  const item = [];
  if (configItem.type === 'field') {
    const measuresData = service.data?.data?.data || [];
    if (measuresData) {
      let data = measuresData.map((value) => {
        return value[configItem.field];
      })[0];
      data = fieldTransformers(configItem, data, api);
      const label = params.measures.find((value) => value.field[0] === configItem.field).label;
      item.push({
        key: configItem.field,
        label,
        children: data,
      });
    }
  } else if (configItem.type === 'custom') {
    if (Object.keys(result).length && result?.['data']?.data) {
      const data: ReqData = { ...result?.['data']?.data };
      const label = data.labels;
      data.values.forEach((valueItem, index) => {
        let childrenText = '';
        label.forEach((value, index) => {
          if (index === 0) return;
          childrenText += `${value}${fieldTransformers(configItem, valueItem[index], api)}  `;
        });
        item.push({
          key: index,
          label: valueItem[0],
          children: childrenText,
        });
      });
    }
  }
  return item;
};
