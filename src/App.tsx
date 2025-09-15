import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import IdeasTab from './components/dashboard/IdeasTab';
import ScriptsTab from './components/dashboard/ScriptsTab';
import CarouselTab from './components/dashboard/CarouselTab';
import PlannerTab from './components/dashboard/PlannerTab';
import InsightsTab from './components/dashboard/InsightsTab';
import CharacterTab from './components/dashboard/CharacterTab';
import ModelSelection from './components/dashboard/ModelSelection';
import ApiKeyManagement from './components/dashboard/ApiKeyManagement';
import { type GeneratedIdea, type GeneratedScript } from './lib/ai';
import { type GeneratedCarousel } from './lib/ai';

// Persistent storage helpers
const STORAGE_KEYS = {
  IDEAS_HISTORY: 'delaluna_ideas_history',
  SCRIPTS_HISTORY: 'delaluna_scripts_history',
  CAROUSELS_HISTORY: 'delaluna_carousels_history'
};

const loadFromStorage = <T extends {}>(key: string): T[] => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading from storage:', error);
    return [];
  }
};

const saveToStorage = <T extends {}>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

interface DashboardProps {
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'ideas' | 'scripts' | 'carousel' | 'planner' | 'insights' | 'characters'>('ideas');
  const [showModelSelection, setShowModelSelection] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [selectedModel, setSelectedModel] = useState('deepseek-r1');
  const [creatorType, setCreatorType] = useState<string>('influencer');
  
  // Persistent history state
  const [ideasHistory, setIdeasHistory] = useState<GeneratedIdea[]>(() => 
    loadFromStorage<GeneratedIdea>(STORAGE_KEYS.IDEAS_HISTORY)
  );
  const [scriptsHistory, setScriptsHistory] = useState<GeneratedScript[]>(() => 
    loadFromStorage<GeneratedScript>(STORAGE_KEYS.SCRIPTS_HISTORY)
  );
  const [carouselsHistory, setCarouselsHistory] = useState<GeneratedCarousel[]>(() => 
    loadFromStorage<GeneratedCarousel>(STORAGE_KEYS.CAROUSELS_HISTORY)
  );
  
  // Content flow state
  const [prefilledScript, setPrefilledScript] = useState<GeneratedIdea | null>(null);
  const [prefilledPost, setPrefilledPost] = useState<{ idea?: GeneratedIdea; script?: GeneratedScript } | null>(null);
  const [prefilledCarousel, setPrefilledCarousel] = useState<GeneratedIdea | null>(null);

  // Save to localStorage whenever history changes
  React.useEffect(() => {
    saveToStorage(STORAGE_KEYS.IDEAS_HISTORY, ideasHistory);
  }, [ideasHistory]);

  React.useEffect(() => {
    saveToStorage(STORAGE_KEYS.SCRIPTS_HISTORY, scriptsHistory);
  }, [scriptsHistory]);

  React.useEffect(() => {
    saveToStorage(STORAGE_KEYS.CAROUSELS_HISTORY, carouselsHistory);
  }, [carouselsHistory]);

  // History management functions
  const addToIdeasHistory = (ideas: GeneratedIdea[]) => {
    setIdeasHistory(prev => [...ideas, ...prev]);
  };

  const addToScriptsHistory = (script: GeneratedScript) => {
    setScriptsHistory(prev => [script, ...prev]);
  };

  const addToCarouselsHistory = (carousel: GeneratedCarousel) => {
    setCarouselsHistory(prev => [carousel, ...prev]);
  };

  const handleCreateScript = (idea: GeneratedIdea) => {
    setPrefilledScript(idea);
    setActiveTab('scripts');
  };

  const handleScheduleFromIdea = (idea: GeneratedIdea) => {
    setPrefilledPost({ idea });
    setActiveTab('planner');
  };

  const handleScheduleFromScript = (script: GeneratedScript) => {
    setPrefilledPost({ script });
    setActiveTab('planner');
  };

  const handleCreateCarousel = (idea: GeneratedIdea) => {
    setPrefilledCarousel(idea);
    setActiveTab('carousel');
  };

  const handleBackToIdeas = () => {
    setPrefilledScript(null);
    setActiveTab('ideas');
  };

  const handleBackToIdeasFromCarousel = () => {
    setPrefilledCarousel(null);
    setActiveTab('ideas');
  };

  // Clear prefilled data when switching tabs manually
  const handleTabChange = (tab: 'ideas' | 'scripts' | 'carousel' | 'planner' | 'insights' | 'characters') => {
    if (tab !== activeTab) {
      setPrefilledScript(null);
      setPrefilledPost(null);
      setPrefilledCarousel(null);
    }
    setActiveTab(tab);
  };

  // Autonomous floating animation for circles
  React.useEffect(() => {
    const circles = document.querySelectorAll('.pro-bg-circle');
    
    circles.forEach((circle, index) => {
      const element = circle as HTMLElement;
      const duration = 15 + (index * 3); // Different duration for each circle (15s, 18s, 21s, 24s, 27s)
      const delay = index * 1.5; // Stagger the start times
      
      // Apply CSS animation
      element.style.animation = `floatInSpace ${duration}s ease-in-out ${delay}s infinite`;
      element.style.willChange = 'transform';
    });
    
    // Cleanup function
    return () => {
      const circles = document.querySelectorAll('.pro-bg-circle');
      circles.forEach((circle) => {
        const element = circle as HTMLElement;
        element.style.animation = '';
        element.style.willChange = 'auto';
      });
    };
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'ideas':
        return (
          <IdeasTab 
            selectedModel={selectedModel} 
            creatorType={creatorType} 
            language="pt"
            onCreateScript={handleCreateScript}
            onSchedulePost={handleScheduleFromIdea}
            onCreateCarousel={handleCreateCarousel}
            ideasHistory={ideasHistory}
            onAddToHistory={addToIdeasHistory}
            onTabChange={handleTabChange}
            onModelChange={setSelectedModel}
            onCreatorTypeChange={setCreatorType}
            onShowModelSelection={() => setShowModelSelection(true)}
          />
        );
      case 'scripts':
        return (
          <ScriptsTab 
            selectedModel={selectedModel} 
            creatorType={creatorType} 
            language="pt"
            prefilledIdea={prefilledScript}
            onScheduleScript={handleScheduleFromScript}
            onBackToIdeas={prefilledScript ? handleBackToIdeas : undefined}
            scriptsHistory={scriptsHistory}
            onAddToHistory={addToScriptsHistory}
            onTabChange={handleTabChange}
          />
        );
      case 'carousel':
        return (
          <CarouselTab 
            selectedModel={selectedModel} 
            creatorType={creatorType} 
            language="pt"
            prefilledIdea={prefilledCarousel}
            onBackToIdeas={prefilledCarousel ? handleBackToIdeasFromCarousel : undefined}
            carouselsHistory={carouselsHistory}
            onAddToHistory={addToCarouselsHistory}
            onTabChange={handleTabChange}
          />
        );
      case 'planner':
        return (
          <PlannerTab 
            language="pt"
            prefilledPost={prefilledPost}
          />
        );
      case 'insights':
        return <InsightsTab language="pt" />;
      case 'characters':
        return <CharacterTab />;
      default:
        return (
          <IdeasTab 
            selectedModel={selectedModel} 
            creatorType={creatorType} 
            language="pt"
            onCreateScript={handleCreateScript}
            onSchedulePost={handleScheduleFromIdea}
            onCreateCarousel={handleCreateCarousel}
            ideasHistory={ideasHistory}
            onAddToHistory={addToIdeasHistory}
            onTabChange={handleTabChange}
            onModelChange={setSelectedModel}
            onCreatorTypeChange={setCreatorType}
            onShowModelSelection={() => setShowModelSelection(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#2E303D' }}>
      {/* Pro Feature Background Circles */}
      <div className="pro-bg-circle pro-gradient-1" style={{ 
        width: '400px', 
        height: '400px', 
        top: '10%', 
        left: '5%' 
      }} />
      <div className="pro-bg-circle pro-gradient-2" style={{ 
        width: '300px', 
        height: '300px', 
        top: '20%', 
        right: '10%' 
      }} />
      <div className="pro-bg-circle pro-gradient-3" style={{ 
        width: '350px', 
        height: '350px', 
        bottom: '15%', 
        left: '15%' 
      }} />
      <div className="pro-bg-circle pro-gradient-4" style={{ 
        width: '250px', 
        height: '250px', 
        bottom: '25%', 
        right: '20%' 
      }} />
      <div className="pro-bg-circle pro-gradient-5" style={{ 
        width: '200px', 
        height: '200px', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)' 
      }} />

      <Layout
        user={user}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        creatorType={creatorType}
        onCreatorTypeChange={setCreatorType}
        onShowModelSelection={() => setShowModelSelection(true)}
        onShowApiKeys={() => setShowApiKeys(true)}
        selectedModel={selectedModel}
      >
        {renderActiveTab()}
      </Layout>

      {showModelSelection && (
        <ModelSelection
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          onClose={() => setShowModelSelection(false)}
        />
      )}

      {showApiKeys && (
        <ApiKeyManagement
          onClose={() => setShowApiKeys(false)}
        />
      )}
    </div>
  );
};

function App() {
  const [user, setUser] = useState<any>({ name: 'Thiago Verly', email: 'creator@example.com' });

  return <Dashboard user={user} />;
}

export default App;