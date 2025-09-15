import React from 'react';
import { Plus, Users, Lightbulb } from 'lucide-react';
import { Character } from '../../lib/ai/types';

interface IdeaConfigurationProps {
  selectedModel: string;
  selectedCharacter: string;
  characters: Character[];
  ideasCount: number;
  showHistory: boolean;
  onToggleHistory: () => void;
  onModelChange: () => void;
  onCharacterChange: (characterId: string) => void;
  onTabChange: (tab: string) => void;
  getModelDisplayName: (modelId: string) => string;
}

const IdeaConfiguration: React.FC<IdeaConfigurationProps> = ({
  selectedModel,
  selectedCharacter,
  characters,
  ideasCount,
  showHistory,
  onToggleHistory,
  onModelChange,
  onCharacterChange,
  onTabChange,
  getModelDisplayName
}) => {
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        {/* AI Model Selection */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-white/70">Modelo:</span>
          <button
            onClick={onModelChange}
            className="px-3 py-1 rounded-lg text-sm font-medium transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#F9E1FF'
            }}
          >
            {getModelDisplayName(selectedModel)}
          </button>
        </div>

        {/* Character Selection */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-white/70">Personagem:</span>
          {characters.length === 0 ? (
            <button 
              onClick={() => onTabChange('characters')} 
              className="px-3 py-1 rounded-lg text-sm font-medium transition-all"
              style={{
                background: 'rgba(252, 235, 0, 0.2)',
                border: '1px solid rgba(252, 235, 0, 0.3)',
                color: '#FCEB00'
              }}
            >
              <Plus className="w-3 h-3 mr-1 inline" />
              Criar Personagem
            </button>
          ) : (
            <select
              value={selectedCharacter}
              onChange={(e) => onCharacterChange(e.target.value)}
              className="px-3 py-1 rounded-lg text-sm bg-transparent border"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff'
              }}
            >
              <option value="" style={{ background: '#2E303D', color: '#ffffff' }}>
                Selecionar personagem
              </option>
              {characters.map(character => (
                <option key={character.id} value={character.id} style={{ background: '#2E303D', color: '#ffffff' }}>
                  {character.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Audience Data - Auto from Character */}
        {selectedCharacter && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-white/70">Público:</span>
            <span className="text-sm text-featured max-w-xs truncate">
              {characters.find(c => c.id === selectedCharacter)?.targetAudience}
            </span>
          </div>
        )}
      </div>
      
      {/* Ideas Box Link */}
      {ideasCount > 0 && !showHistory && (
        <div className="text-center mt-8">
          <a
            href="#"
            onClick={onToggleHistory}
            className="inline-flex items-center space-x-2 text-sm font-medium transition-all duration-200 hover:opacity-80"
            style={{ color: '#F9E1FF' }}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Abrir todas as ideias ({ideasCount})</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default IdeaConfiguration;