import React from 'react';
import Header from './Header';
import FloatingMenu from './FloatingMenu';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  activeTab: string;
  onTabChange: (tab: 'ideas' | 'scripts' | 'carousel' | 'planner' | 'insights' | 'characters') => void;
  creatorType: string;
  onCreatorTypeChange: (type: string) => void;
  onShowModelSelection: () => void;
  onShowApiKeys: () => void;
  selectedModel: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  user,
  activeTab,
  onTabChange,
  creatorType,
  onCreatorTypeChange,
  onShowModelSelection,
  onShowApiKeys,
  selectedModel,
}) => {
  return (
    <div className="min-h-screen">
      <Header user={user} />
      
      <main className="pt-20 px-6 min-h-screen w-full">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <FloatingMenu
        activeTab={activeTab}
        onTabChange={onTabChange}
        onShowModelSelection={onShowModelSelection}
        onShowApiKeys={onShowApiKeys}
        selectedModel={selectedModel}
      />
    </div>
  )
}

export default Layout;