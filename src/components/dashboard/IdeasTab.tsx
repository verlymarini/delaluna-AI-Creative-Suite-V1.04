import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { generateIdeas, type GeneratedIdea } from '../../lib/ai';
import { Character } from '../../lib/ai/types';

// Modular components
import IdeaHeader from '../ideas/IdeaHeader';
import IdeaInput from '../ideas/IdeaInput';
import IdeaConfiguration from '../ideas/IdeaConfiguration';
import CharacterInfo from '../ideas/CharacterInfo';
import IdeaGrid from '../ideas/IdeaGrid';
import EmptyState from '../ideas/EmptyState';

interface IdeasTabProps {
  selectedModel: string;
  creatorType: string;
  language: 'pt' | 'en';
  onCreateScript: (idea: GeneratedIdea) => void;
  onSchedulePost: (idea: GeneratedIdea) => void;
  onCreateCarousel: (idea: GeneratedIdea) => void;
  ideasHistory: GeneratedIdea[];
  onAddToHistory: (ideas: GeneratedIdea[]) => void;
  onTabChange: (tab: string) => void;
  onModelChange: (model: string) => void;
  onCreatorTypeChange: (type: string) => void;
  onShowModelSelection: () => void;
}

const IdeasTab: React.FC<IdeasTabProps> = ({ 
  selectedModel, 
  creatorType, 
  language,
  onCreateScript, 
  onSchedulePost,
  onCreateCarousel,
  ideasHistory,
  onAddToHistory,
  onTabChange,
  onModelChange,
  onCreatorTypeChange,
  onShowModelSelection
}) => {
  const getModelDisplayName = (modelId: string) => {
    // Check if it's a custom model
    if (modelId.startsWith('custom-')) {
      try {
        const customModels = JSON.parse(localStorage.getItem('delaluna_custom_models') || '[]');
        const customModel = customModels.find((m: any) => m.id === modelId);
        return customModel ? customModel.name : modelId;
      } catch {
        return modelId;
      }
    }
    
    // Default model names
    const modelNames: Record<string, string> = {
      'qwen/qwen3-235b-a22b:free': 'Qwen 3 235B Free',
      'deepseek-r1': 'DeepSeek R1 Free',
      'deepseek': 'DeepSeek Chat V3',
      'claude-sonnet': 'Claude Sonnet 4',
      'gpt-4': 'GPT-4.1',
      'llama': 'Llama 4 Maverick',
      'grok': 'Grok 4',
      'gemini': 'Gemini 2.5 Flash'
    };
    
    return modelNames[modelId] || modelId;
  };

  const [contentTopic, setContentTopic] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [error, setError] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);

  // Load characters on component mount
  React.useEffect(() => {
    try {
      const storedCharacters = JSON.parse(localStorage.getItem('delaluna_characters') || '[]');
      setCharacters(storedCharacters);
    } catch (error) {
      console.error('Error loading characters:', error);
    }
  }, []);

  const handleGenerateIdeas = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const generatedIdeas = await generateIdeas({
        platform: 'instagram',
        contentTopic,
        audienceData: characters.find(c => c.id === selectedCharacter)?.targetAudience || '',
        creatorType,
        selectedModel,
        language: 'pt',
        characterId: selectedCharacter || undefined
      });
      
      setIdeas(generatedIdeas);
      onAddToHistory(generatedIdeas);
      
      // Trigger immediate usage stats update in Sidebar
      window.dispatchEvent(new Event('usage-updated'));
    } catch (err) {
      setError('Erro ao gerar ideias. Verifique sua API key e tente novamente.');
      console.error('Error generating ideas:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedCharacterData = characters.find(c => c.id === selectedCharacter);

  return (
    <div className="space-section">
      {/* Header */}
      <IdeaHeader 
        ideasCount={ideasHistory.length}
        showHistory={showHistory}
        onToggleHistory={() => setShowHistory(!showHistory)}
      />

      {/* Main Input Area */}
      <IdeaInput 
        contentTopic={contentTopic}
        onContentTopicChange={setContentTopic}
        onGenerate={handleGenerateIdeas}
        isGenerating={isGenerating}
      />

      {/* Configuration Panel */}
      <IdeaConfiguration 
        selectedModel={selectedModel}
        selectedCharacter={selectedCharacter}
        characters={characters}
        ideasCount={ideasHistory.length}
        showHistory={showHistory}
        onToggleHistory={() => setShowHistory(!showHistory)}
        onModelChange={onShowModelSelection}
        onCharacterChange={setSelectedCharacter}
        onTabChange={onTabChange}
        getModelDisplayName={getModelDisplayName}
      />

      {/* Error Display */}
      {error && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="status-error rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Character Info Display */}
      {selectedCharacterData && (
        <CharacterInfo character={selectedCharacterData} />
      )}

      {/* Ideas Grid */}
      {(ideas.length > 0 || (showHistory && ideasHistory.length > 0)) ? (
        <IdeaGrid 
          ideas={ideas.length > 0 ? ideas : ideasHistory}
          showHistory={showHistory}
          onCreateScript={onCreateScript}
          onSchedulePost={onSchedulePost}
          onCreateCarousel={onCreateCarousel}
          getModelDisplayName={getModelDisplayName}
        />
      ) : null}
    </div>
  );
};

export default IdeasTab;