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
  const { prevSetVisible, setPrevSetVisible, ref } = useContext(ActionAreaContext);
  useEffect(() => {
    if (visible) {
      setPrevSetVisible?.(() => {
        prevSetVisible?.(false);
        // 因为无法判断是不是自己之前的那个 setVisible，如果是同一个 setVisible 那么上面那个设置会导致不显示
        setVisible(true);
        return setVisible;
      });
    }
  }, [visible]);

  return visible && ref.current ? createPortal(children, ref.current) : null;
};

export const ActionArea: ComposedActionDrawer = observer(
  (props) => {
    const { footerNodeName = 'ActionArea.Footer' } = props;
    const schema = useFieldSchema();
    const field = useField();
    const { styles } = useStyles();

    const Current = () => (
      <>
        <div className={styles.footer}>
          <div className="title">
            <strong>{field.title}</strong>
          </div>
          <RecursionField
            basePath={field.address}
            schema={schema}
            onlyRenderProperties
            filterProperties={(s) => {
              return s['x-component'] === footerNodeName;
            }}
          />
        </div>

        <div className={styles.container}>
          <RecursionField
            basePath={field.address}
            schema={schema}
            onlyRenderProperties
            filterProperties={(s) => {
              return s['x-component'] !== footerNodeName;
            }}
          />
        </div>
      </>
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
