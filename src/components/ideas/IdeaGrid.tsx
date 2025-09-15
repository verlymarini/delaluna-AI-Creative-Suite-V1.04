import React from 'react';
import { 
  Copy,
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  Target,
  Lightbulb
} from 'lucide-react';
import { Image as ImageIcon } from 'lucide-react';
import { GeneratedIdea } from '../../lib/ai/types';

interface IdeaGridProps {
  ideas: GeneratedIdea[];
  showHistory: boolean;
  onCreateScript: (idea: GeneratedIdea) => void;
  onSchedulePost: (idea: GeneratedIdea) => void;
  onCreateCarousel: (idea: GeneratedIdea) => void;
  getModelDisplayName: (modelId: string) => string;
}

const IdeaGrid: React.FC<IdeaGridProps> = ({
  ideas,
  showHistory,
  onCreateScript,
  onSchedulePost,
  onCreateCarousel,
  getModelDisplayName
}) => {
  if (ideas.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Maintain the same background circles when showing history */}
      <div className="pro-bg-circle pro-gradient-1" style={{ 
        width: '400px', 
        height: '400px', 
        top: '10%', 
        left: '5%',
        position: 'fixed',
        zIndex: -1
      }} />
      <div className="pro-bg-circle pro-gradient-2" style={{ 
        width: '300px', 
        height: '300px', 
        top: '20%', 
        right: '10%',
        position: 'fixed',
        zIndex: -1
      }} />
      <div className="pro-bg-circle pro-gradient-3" style={{ 
        width: '350px', 
        height: '350px', 
        bottom: '15%', 
        left: '15%',
        position: 'fixed',
        zIndex: -1
      }} />
      <div className="pro-bg-circle pro-gradient-4" style={{ 
        width: '250px', 
        height: '250px', 
        bottom: '25%', 
        right: '20%',
        position: 'fixed',
        zIndex: -1
      }} />
      <div className="pro-bg-circle pro-gradient-5" style={{ 
        width: '200px', 
        height: '200px', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        position: 'fixed',
        zIndex: -1
      }} />
      
      {/* Animated entrance for ideas grid */}
      <div className={`transition-all duration-500 ease-in-out ${
        showHistory ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
      }`}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#ffffff' }}>
          {showHistory ? 'Todas as Ideias' : 'Ideias Geradas'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ideas.map((idea, index) => (
            <div 
              key={idea.id} 
              className="card card-padding card-hover"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: showHistory ? 'fadeInUp 0.6s ease-out forwards' : 'none'
              }}
            >
              {showHistory && (
                <div className="flex items-center justify-between mb-3 pb-3 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    {new Date(idea.createdAt || idea.id).toLocaleDateString('pt-BR')}
                  </span>
                  {idea.model && idea.model !== 'undefined' && (
                    <span className="text-xs px-2 py-1 rounded-full" style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      {getModelDisplayName(idea.model)}
                    </span>
                  )}
                </div>
              )}
              
              <div className="space-content">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold flex-1 mr-4" style={{ color: '#ffffff' }}>
                    {idea.title}
                  </h3>
                  <button className="btn btn-ghost btn-sm">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {idea.description}
                </p>
                
                {idea.hook && (
                  <div className="status-warning rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-4 h-4" />
                      <span className="text-sm font-medium">Gancho Sugerido</span>
                    </div>
                    <p className="text-sm">{idea.hook}</p>
                  </div>
                )}
                
                {idea.keyPoints && idea.keyPoints.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2" style={{ color: '#ffffff' }}>
                      Pontos-Chave
                    </h4>
                    <ul className="space-y-1">
                      {idea.keyPoints.slice(0, 3).map((point, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span style={{ color: 'rgba(255, 255, 255, 0.5)' }} className="mt-1 text-xs">•</span>
                          <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {point}
                          </span>
                        </li>
                      ))}
                      {idea.keyPoints.length > 3 && (
                        <li className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          +{idea.keyPoints.length - 3} mais pontos
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{idea.engagement}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{idea.difficulty}/5</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {idea.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-md text-xs font-medium" style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}>
                      {tag}
                    </span>
                  ))}
                  {idea.tags.length > 3 && (
                    <span className="px-2 py-1 rounded-md text-xs" style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}>
                      +{idea.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onCreateScript(idea)}
                    className="flex-1 btn btn-primary text-xs"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    Roteiro
                  </button>
                  <button
                    onClick={() => onCreateCarousel(idea)}
                    className="flex-1 btn btn-secondary text-xs"
                  >
                    <ImageIcon className="w-3 h-3 mr-1" />
                    Carrossel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IdeaGrid;