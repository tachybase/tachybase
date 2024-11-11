import React from 'react';

export const PageLayout = (props) => {
  if (props.visible) {
    return <div>{props.children}</div>;
  } else {
    return null;
  }
};
