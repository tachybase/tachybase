import { GenerateStyle } from '../../__builtins__';

export const getGridStyle: GenerateStyle = (token) => {
  const { componentCls } = token;

  const colCls = `${componentCls}-item-col`;

  const genGrid = (grid: number) => {
    return {
      flex: `0 0 ${(grid / 24) * 100}%`,
      maxWidth: `${(grid / 24) * 100}%`,
    };
  };
  const genGrids = () => {
    return Array.from({ length: 24 }, (_, i) => {
      const gridCls = `${colCls}-${i + 1}`;
      return {
        [gridCls]: genGrid(i + 1),
      };
    }).reduce((acc, cur) => ({ ...acc, ...cur }), {});
  };

  return {
    [componentCls]: {
      ...genGrids(),
    },
  };
};
