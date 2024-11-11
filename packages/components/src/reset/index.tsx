import React from 'react';

import { IFieldResetOptions, IFormFeedback } from '@formily/core';
import { useParentForm } from '@formily/react';
import { isFn } from '@formily/shared';
import { Button, ButtonProps } from 'antd';

export interface IResetProps extends IFieldResetOptions, ButtonProps {
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => any;
  onResetValidateSuccess?: (payload: any) => void;
  onResetValidateFailed?: (feedbacks: IFormFeedback[]) => void;
}

export const Reset: React.FC<React.PropsWithChildren<IResetProps>> = ({
  forceClear,
  validate,
  onResetValidateSuccess,
  onResetValidateFailed,
  ...props
}) => {
  const form = useParentForm();
  return (
    <Button
      {...props}
      onClick={(e) => {
        if (isFn(props.onClick)) {
          if (props.onClick(e) === false) return;
        }
        form
          .reset('*', {
            forceClear,
            validate,
          })
          .then(onResetValidateSuccess)
          .catch(onResetValidateFailed);
      }}
    >
      {props.children}
    </Button>
  );
};

export default Reset;
