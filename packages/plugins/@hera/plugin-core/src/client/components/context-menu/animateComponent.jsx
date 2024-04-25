import React from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';

const AnimateComponent = ({ children, isVisible, timeout, className }) => {
  const nodeRef = React.useRef(null);

  return (
    <CSSTransition nodeRef={nodeRef} in={isVisible} timeout={timeout} classNames={className} unmountOnExit>
      {children}
    </CSSTransition>
  );
};

export default AnimateComponent;
