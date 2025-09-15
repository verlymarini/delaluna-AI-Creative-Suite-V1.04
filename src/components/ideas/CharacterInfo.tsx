import React from 'react';
import { Users } from 'lucide-react';
import { Character } from '../../lib/ai/types';

interface CharacterInfoProps {
  character: Character;
}

const CharacterInfo: React.FC<CharacterInfoProps> = ({ character }) => {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="card card-padding">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="w-4 h-4 text-featured" />
          <span className="text-sm font-medium text-featured">
            {character.name}
          </span>
        </div>
        <p className="text-sm text-white/80 mb-3">
          {character.description}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-white/70">
          <div>
            <span className="font-medium text-white">Personalidade:</span> {character.personality}
          </div>
          <div>
            <span className="font-medium text-white">Estilo:</span> {character.communicationStyle}
          </div>
          <div>
            <span className="font-medium text-white">Público:</span> {character.targetAudience}
          </div>
          <div>
            <span className="font-medium text-white">Conteúdo:</span> {character.contentFocus}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          <span className="text-xs text-white font-medium">Especialidades:</span>
          {character.expertise.slice(0, 4).map((skill, index) => (
            <span key={index} className="px-2 py-1 rounded text-xs font-medium" style={{
              background: 'rgba(249, 225, 255, 0.1)',
              color: '#F9E1FF'
            }}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterInfo;