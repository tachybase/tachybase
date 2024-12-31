import React from 'react';

export const CalculatorKey = ({ onPress, className, ...props }) => {
  return <button onClick={onPress} className={`calculator-key ${className}`} {...props} />;
};
