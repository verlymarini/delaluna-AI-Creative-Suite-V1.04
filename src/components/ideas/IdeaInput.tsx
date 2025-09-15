import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface IdeaInputProps {
  contentTopic: string;
  onContentTopicChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const IdeaInput: React.FC<IdeaInputProps> = ({
  contentTopic,
  onContentTopicChange,
  onGenerate,
  isGenerating
}) => {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="relative">
        <textarea
          value={contentTopic}
          onChange={(e) => onContentTopicChange(e.target.value)}
          placeholder="Digite sua ideia e nós vamos desenvolvê-la juntos..."
          rows={4}
          className="w-full px-6 py-4 text-lg rounded-2xl resize-none"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            backdropFilter: 'blur(10px)'
          }}
        />
        
        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={isGenerating || !contentTopic}
          className="absolute bottom-4 right-4 px-6 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 hover:bg-opacity-30"
          style={{
            background: 'rgba(249, 225, 255, 0.2)',
            color: '#F9E1FF',
            border: 'none'
          }}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin mr-2 inline" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Gerar Ideias
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default IdeaInput;