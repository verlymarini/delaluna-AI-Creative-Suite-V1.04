import React from 'react';

interface IdeaHeaderProps {
  ideasCount: number;
  showHistory: boolean;
  onToggleHistory: () => void;
}

const IdeaHeader: React.FC<IdeaHeaderProps> = ({ 
  ideasCount, 
  showHistory, 
  onToggleHistory 
}) => {
  return (
    <div className="text-center mb-16 mt-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#ffffff' }}>
        O que vamos criar hoje?
      </h1>
      <p className="text-lg md:text-xl mb-8" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
        Crie ideias virais e envolventes com inteligência artificial
      </p>
    </div>
  );
};

export default IdeaHeader;