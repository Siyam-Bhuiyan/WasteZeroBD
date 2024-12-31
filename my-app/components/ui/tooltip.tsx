import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export const TooltipProvider: React.FC = ({ children }) => <>{children}</>;

export const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-8 bg-black text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {content}
      </div>
    </div>
  );
};

export const TooltipContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span>{children}</span>
);

export const TooltipTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="inline-flex items-center">{children}</div>
);
