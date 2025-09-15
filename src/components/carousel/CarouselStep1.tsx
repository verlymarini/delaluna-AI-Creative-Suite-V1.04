import React, { useState } from 'react';
import { 
  Wand2, 
  RefreshCw,
  AlertCircle,
  Users,
  ArrowRight,
  Plus,
  X
} from 'lucide-react';
import { generateCarousel, type GeneratedCarousel } from '../../lib/ai';
import { Character, GeneratedIdea } from '../../lib/ai';

interface CarouselStep1Props {
  selectedModel: string;
  creatorType: string;
  language?: 'pt' | 'en';
  prefilledIdea?: GeneratedIdea | null;
  onNext: (carousel: GeneratedCarousel) => void;
  onTabChange: (tab: 'ideas' | 'scripts' | 'carousel' | 'planner' | 'insights' | 'characters') => void;
}

const CarouselStep1: React.FC<CarouselStep1Props> = ({ 
  selectedModel, 
  creatorType, 
  language = 'pt',
  prefilledIdea,
  onNext,
  onTabChange
}) => {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [targetAudience, setTargetAudience] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  // Load characters on component mount
  React.useEffect(() => {
    if (prefilledIdea) {
      const fullTopic = `${prefilledIdea.title}

${prefilledIdea.description}

${prefilledIdea.hook ? `Gancho: ${prefilledIdea.hook}` : ''}

${prefilledIdea.keyPoints && prefilledIdea.keyPoints.length > 0 ? 
  `Pontos-chave:\n${prefilledIdea.keyPoints.map(point => `• ${point}`).join('\n')}` : 
  ''
}`.trim();
      
      setTopic(fullTopic);
      
      if (prefilledIdea.keyPoints && prefilledIdea.keyPoints.length > 0) {
        const optimalSlides = Math.min(Math.max(prefilledIdea.keyPoints.length + 2, 3), 10);
        setSlideCount(optimalSlides);
      }
    }
  }, [prefilledIdea]);

  React.useEffect(() => {
    try {
      const storedCharacters = JSON.parse(localStorage.getItem('delaluna_characters') || '[]');
      setCharacters(storedCharacters);
    } catch (error) {
      console.error('Error loading characters:', error);
    }
  }, []);

  const handleGenerateCarousel = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const carousel = await generateCarousel({
        topic,
        slideCount,
        toneOfVoice: characters.find(c => c.id === selectedCharacter)?.communicationStyle || 'casual',
        targetAudience,
        creatorType,
        selectedModel,
        language: 'pt',
        characterId: selectedCharacter || undefined
      });
      
      onNext(carousel);
      window.dispatchEvent(new Event('usage-updated'));
    } catch (err) {
      setError('Erro ao gerar carrossel. Verifique sua API key e tente novamente.');
      console.error('Error generating carousel:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-content">
        <div className="card card-padding bg-gray-50">
        <div className="space-content">
          <div className="space-tight">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tópico do Carrossel
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Descreva o tópico do seu carrossel..."
              rows={3}
              className="textarea"
            />
          </div>

          <div className="space-tight">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <span>Personagem</span>
              <button onClick={() => onTabChange('characters')} className="btn btn-white btn-sm ml-2">
                <Plus className="w-3 h-3" />
              </button>
            </label>
            {characters.length === 0 ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700 mb-2">
                  Você precisa criar um personagem primeiro.
                </p>
                <button onClick={() => onTabChange('characters')} className="btn btn-primary btn-sm">
                  Criar Personagem
                </button>
              </div>
            ) : (
              <>
                <select
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                  className="input"
                >
                  <option value="">
                    Selecione um personagem (opcional)
                  </option>
                  {characters.map(character => (
                    <option key={character.id} value={character.id}>
                      {character.name}
                    </option>
                  ))}
                </select>
                {selectedCharacter && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">
                        {characters.find(c => c.id === selectedCharacter)?.name}
                      </span>
                      <span className="text-xs text-blue-500">
                        • {new Date(characters.find(c => c.id === selectedCharacter)?.createdAt || '').toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-blue-600 italic">
                        "{characters.find(c => c.id === selectedCharacter)?.description}"
                      </p>
                      <div className="grid grid-cols-1 gap-1 text-xs text-blue-600">
                        <div>
                          <span className="font-medium">Personalidade:</span> {characters.find(c => c.id === selectedCharacter)?.personality}
                        </div>
                        <div>
                          <span className="font-medium">Estilo:</span> {characters.find(c => c.id === selectedCharacter)?.communicationStyle}
                        </div>
                        <div>
                          <span className="font-medium">Público:</span> {characters.find(c => c.id === selectedCharacter)?.targetAudience}
                        </div>
                        <div>
                          <span className="font-medium">Conteúdo:</span> {characters.find(c => c.id === selectedCharacter)?.contentFocus}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs text-blue-500 font-medium">Especialidades:</span>
                        {characters.find(c => c.id === selectedCharacter)?.expertise.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                        {characters.find(c => c.id === selectedCharacter)?.expertise.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">
                            +{characters.find(c => c.id === selectedCharacter)?.expertise.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-tight">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Slides
            </label>
            <select
              value={slideCount}
              onChange={(e) => setSlideCount(Number(e.target.value))}
              className="input"
            >
              <option value={3}>3 slides</option>
              <option value={4}>4 slides</option>
              <option value={5}>5 slides</option>
              <option value={6}>6 slides</option>
              <option value={7}>7 slides</option>
              <option value={8}>8 slides</option>
              <option value={9}>9 slides</option>
              <option value={10}>10 slides</option>
            </select>
          </div>

          <div className="space-tight">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Público-Alvo
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Descreva seu público-alvo..."
              className="input"
            />
          </div>

          <button
            onClick={handleGenerateCarousel}
            disabled={isGenerating || !topic}
            className="btn btn-primary btn-lg w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                Gerando Carrossel...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Gerar Textos dos Slides
              </>
            )}
          </button>
          
          {error && (
            <div className="status-error border rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarouselStep1;