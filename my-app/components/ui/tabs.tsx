import * as React from "react";

interface TabsProps {
  children: React.ReactNode;
}

export const Tabs = ({ children }: TabsProps) => (
  <div className="tabs-container">{children}</div>
);

interface TabsListProps {
  children: React.ReactNode;
}

export const TabsList = ({ children }: TabsListProps) => (
  <div className="tabs-list flex space-x-4">{children}</div>
);

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  activeTab: string;
  onClick: (value: string) => void;
}

export const TabsTrigger = ({ children, value, activeTab, onClick }: TabsTriggerProps) => (
  <button
    className={`tabs-trigger px-4 py-2 rounded ${
      activeTab === value ? "bg-green-500 text-white" : "bg-gray-200"
    }`}
    onClick={() => onClick(value)}
  >
    {children}
  </button>
);

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  activeTab: string;
}

export const TabsContent = ({ children, value, activeTab }: TabsContentProps) => {
  return activeTab === value ? <div className="tabs-content p-4">{children}</div> : null;
};
