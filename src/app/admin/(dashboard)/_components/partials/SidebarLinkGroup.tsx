'use client'; // Only needed if using in app directory with client components

import React, { useState } from 'react';

interface SidebarLinkGroupProps {
  children: (handleClick: () => void, open: boolean) => React.ReactNode;
  activecondition: boolean;
}

const SidebarLinkGroup: React.FC<SidebarLinkGroupProps> = ({
  children,
  activecondition,
}) => {
  const [open, setOpen] = useState(activecondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <li
      className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-gradient-to-r ${
        activecondition
          ? 'from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]'
          : ''
      }`}
    >
      {children(handleClick, open)}
    </li>
  );
};

export default SidebarLinkGroup;
