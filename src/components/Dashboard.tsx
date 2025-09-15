import React, { useState } from 'react';
import Layout from './layout/Layout';
import IdeasTab from './dashboard/IdeasTab';
import ScriptsTab from './dashboard/ScriptsTab';
import CarouselTab from './dashboard/CarouselTab';
import PlannerTab from './dashboard/PlannerTab';
import InsightsTab from './dashboard/InsightsTab';
import CharacterTab from './dashboard/CharacterTab';
import ModelSelection from './dashboard/ModelSelection';
import ApiKeyManagement from './dashboard/ApiKeyManagement';
import { type GeneratedIdea, type GeneratedScript } from '../lib/ai';
import { type GeneratedCarousel } from '../lib/ai';

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

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'ideas':
        return (
          <IdeasTab 
            selectedModel={selectedModel} 
            creatorType={creatorType} 
            onCreateScript={handleCreateScript}
            onSchedulePost={handleScheduleFromIdea}
            onCreateCarousel={handleCreateCarousel}
            ideasHistory={ideasHistory}
            onAddToHistory={addToIdeasHistory}
            onTabChange={handleTabChange}
          />
        );
      case 'scripts':
        return (
          <ScriptsTab 
            selectedModel={selectedModel} 
            creatorType={creatorType} 
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
            prefilledPost={prefilledPost}
          />
        );
      case 'insights':
        return <InsightsTab />;
      case 'characters':
        return <CharacterTab />;
      default:
        return (
          <IdeasTab 
            selectedModel={selectedModel} 
            creatorType={creatorType} 
            onCreateScript={handleCreateScript}
            onSchedulePost={handleScheduleFromIdea}
            ideasHistory={ideasHistory}
            onAddToHistory={addToIdeasHistory}
            onTabChange={handleTabChange}
          />
        );
    }
  };

  return (
    <>
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
    </>
  );
};

export default Dashboard;