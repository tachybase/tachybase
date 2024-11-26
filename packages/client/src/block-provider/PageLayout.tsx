import React from 'react';

/**
 * @deprecated
 * @param props
 * @returns
 */
export const PageLayout = (props) => {
  if (props.visible) {
    return <div>{props.children}</div>;
  } else {
    return null;
  }
};
