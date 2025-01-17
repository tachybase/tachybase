import { uid } from '@tachybase/utils/client';

export function buildTree(data, fields) {
  const recursiveBuild = (data, fieldIndex) => {
    if (fieldIndex >= fields.length) {
      return data.map((item) => ({ key: uid(), ...item }));
    }

    const field = fields[fieldIndex];
    const grouped = groupBy(data, field);

    return Object.keys(grouped).map((key) => {
      const value = [...grouped[key].value];
      const item = {
        ...grouped[key],
        key: key + uid(),
        children: recursiveBuild(value, fieldIndex + 1),
      };
      return item;
    });
  };

  const groupBy = (array, key) => {
    return array.reduce((acc, item) => {
      const fieldValue = item[key];
      if (!acc[fieldValue]) acc[fieldValue] = { ...item, value: [] };
      acc[fieldValue].value.push(item);
      return acc;
    }, {});
  };

  return recursiveBuild(data, 0);
}
