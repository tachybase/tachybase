import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import {
  autoUpdate,
  offset,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from '@floating-ui/react';

import { useDesignable } from '../../hooks';
import BlockToolbar from './BlockToolbar';

export const ToolbarContext = createContext<any>({});

export const ToolbarProvider = ({ children, onVisibilityChange }) => {
  const [childStates, setChildStates] = useState({});

  // 注册子组件，返回注销方法
  const registerChild = useCallback((id, isVisible) => {
    setChildStates((prev) => ({ ...prev, [id]: isVisible }));

    return () => {
      setChildStates((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    };
  }, []);

  // 计算父组件状态
  const isVisible = Object.values(childStates).some((visible) => visible);

  // 通知外部
  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(!isVisible);
    }
  }, [isVisible, onVisibilityChange]);

  return <ToolbarContext.Provider value={{ registerChild }}>{children}</ToolbarContext.Provider>;
};

export const useToolbar = () => {
  return useContext(ToolbarContext);
};

export const useBlockToolbar: () => { open: boolean; ref: any; toolbar: any; props: any } = () => {
  // TODO: add global state, queue styles.
  const [open, setOpen] = useState(false);
  const { designable } = useDesignable();

  const { refs, floatingStyles, context } = useFloating({
    placement: 'top',
    middleware: [
      offset(10), // TODO: constant value
      shift({
        crossAxis: true,
        padding: 10,
      }),
    ],
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
  });

  const {
    getReferenceProps, // TODO
    getFloatingProps, // TODO
  } = useInteractions([
    useHover(context, {
      handleClose: safePolygon(),
      delay: {
        open: 0,
        close: 100,
      },
    }),
    useDismiss(context),
  ]);

  const toolbar = open && designable && (
    <BlockToolbar
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        zIndex: 9999,
      }}
      {...getFloatingProps()}
    />
  );

  return { open, ref: refs.setReference, props: getReferenceProps(), toolbar };
};
