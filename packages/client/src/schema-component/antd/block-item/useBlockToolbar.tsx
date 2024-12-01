import React, { useState } from 'react';

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

import BlockToolbar from './BlockToolbar';

export const useBlockToolbar: () => { ref: any; toolbar: any; props: any } = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement: 'top',
    middleware: [
      offset(10), // TODO: constant value
      shift({
        crossAxis: true,
        padding: 10,
      }),
    ],
    open: tooltipOpen,
    onOpenChange: setTooltipOpen,
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
        close: 300,
      },
    }),
    useDismiss(context),
  ]);

  const toolbar = tooltipOpen && (
    <BlockToolbar
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        zIndex: 9999,
      }}
      {...getFloatingProps()}
    />
  );

  return { ref: refs.setReference, props: getReferenceProps(), toolbar };
};
