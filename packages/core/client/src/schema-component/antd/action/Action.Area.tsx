import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer, RecursionField, useField, useFieldSchema } from '@tachybase/schema';

import { createPortal } from 'react-dom';

import { useStyles } from './Action.Area.style';
import { useActionContext } from './hooks';
import { ComposedActionDrawer } from './types';

const ActionAreaContext = React.createContext<any>({});

export const ActionAreaProvider = ({ children }: { children: React.ReactNode }) => {
  const [component, setComponent] = useState(() => {});
  const [prevSetVisible, setPrevSetVisible] = useState(() => {});
  const ref = useRef();
  return (
    <ActionAreaContext.Provider value={{ component, setComponent, prevSetVisible, setPrevSetVisible, ref }}>
      {children}
    </ActionAreaContext.Provider>
  );
};

export const useActionAreaStub = () => {
  const { component } = useContext(ActionAreaContext);
  return component;
};

export const ActionAreaStub = () => {
  const { ref } = useContext(ActionAreaContext);
  return <div ref={ref}></div>;
};

export const ActionAreaPlayer = ({ children }) => {
  const { visible, setVisible } = useActionContext();
  const { prevSetVisible, setPrevSetVisible, ref = { current: null } } = useContext(ActionAreaContext);
  useEffect(() => {
    if (visible) {
      setPrevSetVisible?.(() => {
        prevSetVisible?.(false);
        return setVisible;
      });
    }
  }, [visible]);

  return visible && ref.current ? createPortal(children, ref.current) : null;
};

export const ActionArea: ComposedActionDrawer = observer(
  (props) => {
    const { footerNodeName = 'Action.Drawer.Footer' } = props;
    const schema = useFieldSchema();
    const field = useField();
    const { styles } = useStyles();

    const Current = () => (
      <div className={styles}>
        <RecursionField
          basePath={field.address}
          schema={schema}
          onlyRenderProperties
          filterProperties={(s) => {
            return s['x-component'] !== footerNodeName;
          }}
        />
      </div>
    );

    return (
      <ActionAreaPlayer>
        <Current />
      </ActionAreaPlayer>
    );
  },
  { displayName: 'ActionArea' },
);

ActionArea.Footer = observer(
  () => {
    const field = useField();
    const schema = useFieldSchema();
    return <RecursionField basePath={field.address} schema={schema} onlyRenderProperties />;
  },
  { displayName: 'ActionArea.Footer' },
);

export default ActionArea;
