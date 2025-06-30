import React from 'react';

import { useApp } from '../../../application';
import { useCurrentUserContext } from '../../../user';

type TrackedLinkProps = {
  href: string;
  trackingKey?: string;
  children: React.ReactNode;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
};

export const TrackingLink: React.FC<TrackedLinkProps> = ({
  href,
  trackingKey = 'link',
  children,
  target = '_blank',
  rel = 'noreferrer',
}) => {
  const app = useApp();
  const currentUserContext = useCurrentUserContext();
  const currentUser = currentUserContext?.data?.data;
  const handleClick = () => {
    app.trackingManager.logEvent('click', trackingKey, {
      href,
      userId: currentUser?.id,
    });
  };

  return (
    <a href={href} target={target} rel={rel} onClick={handleClick}>
      {children}
    </a>
  );
};
