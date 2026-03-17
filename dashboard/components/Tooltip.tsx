import React, { useState } from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<Props> = ({ title, children, placement = 'top' }) => {
  const [visible, setVisible] = useState(false);

  const posClass = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full  left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full  top-1/2 -translate-y-1/2 ml-2',
  }[placement];

  const arrowClass = {
    top:    'absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900',
    bottom: 'absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900',
    left:   'absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900',
    right:  'absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900',
  }[placement];

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          className={`absolute z-[200] ${posClass} px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none shadow-lg`}
          role="tooltip"
        >
          {title}
          <span className={arrowClass} />
        </span>
      )}
    </span>
  );
};
