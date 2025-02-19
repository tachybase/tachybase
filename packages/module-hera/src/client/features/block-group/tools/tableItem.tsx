import { ReqData } from '../GroupBlock';
import { fieldTransformers } from './fieldTransformers';

export const tableItem = (configItem, result, service, params, api) => {
  const columns = [];
  const options = [];
  if (configItem.type === 'custom') {
    if (Object.keys(result).length && result?.['data']?.data) {
      const data: ReqData = { ...result?.['data']?.data };
      data.labels.forEach((value, index) => {
        columns.push({ title: value, dataIndex: 'value' + index, key: index });
      });
      data.values.forEach((value, index) => {
        const item = {
          key: index,
        };
        columns.forEach((colItem, index) => {
          const data =
            typeof value[index] === 'string' ? value[index] : fieldTransformers(configItem, value[index], api);
          item[colItem.dataIndex] = data;
        });
        options.push(item);
      });
    }
  } else if (configItem.type === 'field') {
    const measuresData = service.data?.data;
    if (measuresData) {
      let data = measuresData.map((value) => {
        return value[configItem.field];
      })[0];
      data = fieldTransformers(configItem, data, api);
      const label = params.measures.find((value) => value.field[0] === configItem.field).label;
      columns.push(
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '数量',
          dataIndex: 'number',
          key: 'number',
        },
      );
      options.push({
        key: label,
        name: label,
        number: data,
      });
    }
  }

  return { columns, options };
};
