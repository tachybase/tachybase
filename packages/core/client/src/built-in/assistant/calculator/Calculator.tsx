import React, { useEffect, useState } from 'react';

import { CalculatorDisplay } from './CalculatorDisplay';
import { CalculatorKey } from './CalculatorKey';
import { useStyles } from './style';

const CalculatorOperations = {
  '/': (prevValue, nextValue) => prevValue / nextValue,
  '*': (prevValue, nextValue) => prevValue * nextValue,
  '+': (prevValue, nextValue) => prevValue + nextValue,
  '-': (prevValue, nextValue) => prevValue - nextValue,
  '=': (prevValue, nextValue) => nextValue,
};

const Calculator = React.forwardRef<{ className: string }, any>(({ className }, ref) => {
  const [value, setValue] = useState(null);
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clearAll = () => {
    setValue(null);
    setDisplayValue('0');
    setOperator(null);
    setWaitingForOperand(false);
  };

  const clearDisplay = () => {
    setDisplayValue('0');
  };

  const clearLastChar = () => {
    setDisplayValue(displayValue.substring(0, displayValue.length - 1) || '0');
  };

  const toggleSign = () => {
    const newValue = parseFloat(displayValue) * -1;
    setDisplayValue(String(newValue));
  };

  const inputPercent = () => {
    const currentValue = parseFloat(displayValue);

    if (currentValue === 0) return;

    const fixedDigits = displayValue.replace(/^-?\d*\.?/, '');
    const newValue = parseFloat(displayValue) / 100;

    setDisplayValue(String(newValue.toFixed(fixedDigits.length + 2)));
  };

  const inputDot = () => {
    if (!/\./.test(displayValue)) {
      setDisplayValue(displayValue + '.');
      setWaitingForOperand(false);
    }
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplayValue(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? String(digit) : displayValue + digit);
    }
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(displayValue);

    if (value == null) {
      setValue(inputValue);
    } else if (operator) {
      const currentValue = value || 0;
      const newValue = CalculatorOperations[operator](currentValue, inputValue);
      setValue(newValue);
      setDisplayValue(String(newValue));
    }
    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      let { key } = event;

      if (key === 'Enter') key = '=';

      if (/\d/.test(key)) {
        event.preventDefault();
        inputDigit(parseInt(key, 10));
      } else if (key in CalculatorOperations) {
        event.preventDefault();
        performOperation(key);
      } else if (key === '.') {
        event.preventDefault();
        inputDot();
      } else if (key === '%') {
        event.preventDefault();
        inputPercent();
      } else if (key === 'Backspace') {
        event.preventDefault();
        clearLastChar();
      } else if (key === 'Clear') {
        event.preventDefault();

        if (displayValue !== '0') {
          clearDisplay();
        } else {
          clearAll();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const clearKey = displayValue !== '0';
  const clearText = clearKey ? 'C' : 'AC';

  return (
    <div className="calculator" ref={ref as any}>
      <CalculatorDisplay value={displayValue} />
      <div className="calculator-keypad">
        <div className="input-keys">
          <div className="function-keys">
            <CalculatorKey className="key-clear" onPress={() => (clearKey ? clearDisplay() : clearAll())}>
              {clearText}
            </CalculatorKey>
            <CalculatorKey className="key-sign" onPress={() => toggleSign()}>
              ±
            </CalculatorKey>
            <CalculatorKey className="key-percent" onPress={() => inputPercent()}>
              %
            </CalculatorKey>
          </div>
          <div className="digit-keys">
            <CalculatorKey className="key-0" onPress={() => inputDigit(0)}>
              0
            </CalculatorKey>
            <CalculatorKey className="key-dot" onPress={() => inputDot()}>
              ●
            </CalculatorKey>
            <CalculatorKey className="key-1" onPress={() => inputDigit(1)}>
              1
            </CalculatorKey>
            <CalculatorKey className="key-2" onPress={() => inputDigit(2)}>
              2
            </CalculatorKey>
            <CalculatorKey className="key-3" onPress={() => inputDigit(3)}>
              3
            </CalculatorKey>
            <CalculatorKey className="key-4" onPress={() => inputDigit(4)}>
              4
            </CalculatorKey>
            <CalculatorKey className="key-5" onPress={() => inputDigit(5)}>
              5
            </CalculatorKey>
            <CalculatorKey className="key-6" onPress={() => inputDigit(6)}>
              6
            </CalculatorKey>
            <CalculatorKey className="key-7" onPress={() => inputDigit(7)}>
              7
            </CalculatorKey>
            <CalculatorKey className="key-8" onPress={() => inputDigit(8)}>
              8
            </CalculatorKey>
            <CalculatorKey className="key-9" onPress={() => inputDigit(9)}>
              9
            </CalculatorKey>
          </div>
        </div>
        <div className="operator-keys">
          <CalculatorKey className="key-divide" onPress={() => performOperation('/')}>
            ÷
          </CalculatorKey>
          <CalculatorKey className="key-multiply" onPress={() => performOperation('*')}>
            ×
          </CalculatorKey>
          <CalculatorKey className="key-subtract" onPress={() => performOperation('-')}>
            −
          </CalculatorKey>
          <CalculatorKey className="key-add" onPress={() => performOperation('+')}>
            +
          </CalculatorKey>
          <CalculatorKey className="key-equals" onPress={() => performOperation('=')}>
            =
          </CalculatorKey>
        </div>
      </div>
    </div>
  );
});

export const CalculatorWrapper = React.forwardRef((props, ref) => {
  const { styles } = useStyles();
  return <Calculator ref={ref as any} className={styles.container} />;
});
