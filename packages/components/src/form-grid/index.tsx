import React, { useContext, useLayoutEffect, useMemo, useRef } from 'react';
import { Grid, IGridOptions, markRaw, observer } from '@tachybase/schema';

import cls from 'classnames';

import { pickDataProps, usePrefixCls } from '../__builtins__';
import { useFormLayout } from '../form-layout';
import useStyle from './style';

const FormGridContext = React.createContext<Grid<HTMLElement>>(null as any);

export interface IFormGridProps extends IGridOptions {
  grid?: Grid<HTMLElement>;
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface IGridColumnProps {
  gridSpan?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const createFormGrid = (props: IFormGridProps) => {
  return markRaw(new Grid(props));
};

export const useFormGrid = () => useContext(FormGridContext);

const InternalFormGrid = observer(
  ({ children, className, style, ...props }: React.PropsWithChildren<IFormGridProps>) => {
    const layout = useFormLayout();
    const options = {
      columnGap: layout?.gridColumnGap ?? 8,
      rowGap: layout?.gridRowGap ?? 4,
      ...props,
    };
    const grid = useMemo(() => markRaw(options?.grid ? options.grid : new Grid(options)), [Grid.id(options)]);
    const ref = useRef<HTMLDivElement>(null);
    const prefixCls = usePrefixCls('formily-grid', props);

    const [wrapSSR, hashId] = useStyle(prefixCls);
    const dataProps = pickDataProps(props);
    useLayoutEffect(() => {
      if (ref.current) {
        return grid.connect(ref.current);
      }
    }, [grid]);
    return (
      <FormGridContext.Provider value={grid}>
        {wrapSSR(
          <div
            {...dataProps}
            className={cls(`${prefixCls}-layout`, hashId, className)}
            style={{
              ...style,
              gridTemplateColumns: grid.templateColumns,
              gap: grid.gap,
            }}
            ref={ref}
          >
            {children}
          </div>,
        )}
      </FormGridContext.Provider>
    );
  },
  {
    forwardRef: true,
  },
);

export const GridColumn: React.FC<React.PropsWithChildren<IGridColumnProps>> = observer(
  ({ gridSpan, children, ...props }) => {
    return (
      <div {...props} style={props.style} data-grid-span={gridSpan}>
        {children}
      </div>
    );
  },
);

GridColumn.defaultProps = {
  gridSpan: 1,
};

export const FormGrid = Object.assign(InternalFormGrid, {
  createFormGrid,
  useFormGrid,
  GridColumn,
});

export default FormGrid;
