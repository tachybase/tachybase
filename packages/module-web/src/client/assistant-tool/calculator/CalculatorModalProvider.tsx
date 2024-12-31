import { createContext, useContext, useState } from 'react';

import { createPortal } from 'react-dom';

import { CalculatorWrapper } from './Calculator';
import { Draggable } from './Draggable';
import { useStyles } from './style';

export interface CalculatorProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CalculatorContext = createContext<Partial<CalculatorProps>>({});
export const useCalculator = () => {
  return useContext(CalculatorContext);
};

export const CalculatorModalProvider = ({ children }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const { styles } = useStyles();
  return (
    <CalculatorContext.Provider value={{ visible, setVisible }}>
      {children}

      {visible
        ? createPortal(
            <div className={styles.container}>
              <Draggable>
                <CalculatorWrapper />
              </Draggable>
            </div>,
            document.body,
          )
        : null}
    </CalculatorContext.Provider>
  );
};
