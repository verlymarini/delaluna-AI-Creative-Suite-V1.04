import React, { useState } from 'react';
import { 
  Lightbulb, 
  FileText, 
  Image,
  Calendar, 
  BarChart3,
  Users,
  Settings,
  Key,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface FloatingMenuProps {
  activeTab: string;
  onTabChange: (tab: 'ideas' | 'scripts' | 'carousel' | 'planner' | 'insights' | 'characters') => void;
  onShowModelSelection: () => void;
  onShowApiKeys: () => void;
  selectedModel: string;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ 
  activeTab, 
  onTabChange, 
  onShowModelSelection,
  onShowApiKeys,
  selectedModel
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getModelDisplayName = (modelId: string) => {
    if (modelId.startsWith('custom-')) {
      try {
        const customModels = JSON.parse(localStorage.getItem('delaluna_custom_models') || '[]');
        const customModel = customModels.find((m: any) => m.id === modelId);
        return customModel ? customModel.name : modelId;
      } catch {
        return modelId;
      }
    }
    
    const modelNames: Record<string, string> = {
      'deepseek-r1': 'DeepSeek R1',
      'deepseek': 'DeepSeek V3',
      'claude-sonnet': 'Claude Sonnet',
      'gpt-4': 'GPT-4.1',
      'llama': 'Llama 4',
      'grok': 'Grok 4',
      'gemini': 'Gemini 2.5'
    };
    
    return modelNames[modelId] || modelId;
  };

  const menuItems = [
    { id: 'ideas', label: 'Ideias', icon: Lightbulb, primary: true },
    { id: 'scripts', label: 'Roteiros', icon: FileText },
    { id: 'carousel', label: 'Carrossel', icon: Image },
    { id: 'characters', label: 'Personagens', icon: Users },
    { id: 'planner', label: 'Planejador', icon: Calendar, disabled: true },
    { id: 'insights', label: 'Insights', icon: BarChart3, disabled: true },
  ];

  const settingsItems = [
    { id: 'models', label: 'Modelos IA', icon: Settings, action: onShowModelSelection },
    { id: 'api-keys', label: 'API Keys', icon: Key, action: onShowApiKeys },
  ];

  return (
    <div className="floating-menu">
      {/* Dark overlay when menu is expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[-2]"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      <div className="flex flex-col items-end space-y-2">
        {/* Expanded Menu Items */}
        {isExpanded && (
          <div className="flex flex-col items-end space-y-2 mb-2">
            {/* Settings Items */}
            {settingsItems.map(item => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-xs font-medium text-white">{item.label}</div>
                  {item.id === 'models' && (
                    <div className="text-xs text-gray-300">{getModelDisplayName(selectedModel)}</div>
                  )}
                </div>
                <button
                  onClick={item.action}
                  className="floating-menu-item"
                >
                  <item.icon className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />
            
            {/* Navigation Items */}
            {menuItems.map(item => {
              const isActive = activeTab === item.id;
              const IconComponent = item.icon;
              
              return (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-xs font-medium text-white">{item.label}</div>
                    {item.primary && (
                      <div className="text-xs text-featured">Principal</div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (!item.disabled) {
                        onTabChange(item.id as any);
                        setIsExpanded(false);
                      }
                    }}
                    disabled={item.disabled}
                    className={`floating-menu-item ${
                      isActive ? 'floating-menu-item-active' : ''
                    } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={() => setIsExpanded(true)}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: 'rgba(138, 188, 229, 0.2)',
            boxShadow: '0 4px 20px rgba(138, 188, 229, 0.3)',
            transform: isExpanded ? 'rotate(180deg)' : 'scale(1)',
            ...(isExpanded ? {} : { ':hover': { transform: 'scale(1.1)' } })
          }}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" style={{ color: '#8ABCE5' }} />
          ) : (
            <Sparkles className="w-5 h-5" style={{ color: '#8ABCE5' }} />
          )}
        </button>
      </div>

      {/* Click outside to close */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-[-1] pointer-events-none"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default FloatingMenu;