import { transformers } from '../settings/GroupBlockConfigure';

export const fieldTransformers = (item, data, api) => {
  const { option: tOption } = transformers;
  const locale = api.auth.getLocale();
  if (item) {
    const format = item.format;
    const digits = item?.digits;
    if (format && format !== 'decimal') {
      const component = tOption.find((tValue) => tValue.value === format).component;
      data = String(data).includes(',') ? String(data).replace(/,/g, '') : data;
      return component(data, locale);
    } else if (format && format === 'decimal' && digits) {
      const component = tOption
        .filter((tValue) => tValue.value === 'decimal')[0]
        .childrens.filter((decimalOption) => decimalOption.value === digits)[0].component;
      data = String(data).includes(',') ? String(data).replace(/,/g, '') : data;
      return component(data);
    }
  }
};
