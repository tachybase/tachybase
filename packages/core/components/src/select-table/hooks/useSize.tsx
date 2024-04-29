import { SizeType } from 'antd/es/config-provider/SizeContext';

interface ISize {
  (
    fieldSize: SizeType,
    searchSize: SizeType,
    tableSize: SizeType,
  ): {
    searchSize: SizeType;
    tableSize: SizeType;
  };
}

const useSize: ISize = (fieldSize = 'middle', searchSize, tableSize) => {
  const fieldSizeMap: any = {
    small: {
      searchSize: 'small',
      tableSize: 'small',
    },
    default: {
      searchSize: 'middle',
      tableSize: 'middle',
    },
    large: {
      searchSize: 'large',
      tableSize: 'default',
    },
  };
  const { searchSize: fieldSearchSize, tableSize: fieldTableSize } = fieldSizeMap[fieldSize] || {};

  return {
    searchSize: searchSize || fieldSearchSize,
    tableSize: tableSize || fieldTableSize,
  };
};

export { useSize };
