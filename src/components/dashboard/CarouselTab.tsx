import React, { useState } from 'react';
import { 
  Image as ImageIcon,
  ArrowLeft,
  Clock,
  CheckCircle,
  Copy,
  Users
} from 'lucide-react';
import { type GeneratedCarousel, type GeneratedIdea } from '../../lib/ai';
import CarouselStep1 from '../carousel/CarouselStep1';
import CarouselStep2 from '../carousel/CarouselStep2';

interface CarouselTabProps {
  selectedModel: string;
  creatorType: string;
  language?: 'pt' | 'en';
  carouselsHistory: GeneratedCarousel[];
  onAddToHistory: (carousel: GeneratedCarousel) => void;
  prefilledIdea?: GeneratedIdea | null;
  onBackToIdeas?: () => void;
  onTabChange: (tab: 'ideas' | 'scripts' | 'carousel' | 'planner' | 'insights' | 'characters') => void;
}

const CarouselTab: React.FC<CarouselTabProps> = ({ 
  selectedModel, 
  creatorType, 
  language = 'pt',
  carouselsHistory,
  onAddToHistory,
  prefilledIdea,
  onBackToIdeas,
  onTabChange
}) => {
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

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedCarousel, setGeneratedCarousel] = useState<GeneratedCarousel | null>(null);
  const [showHistory, setShowHistory] = useState(true);

  const handleStep1Complete = (carousel: GeneratedCarousel) => {
    // Initialize slides with default font and color settings
    const enhancedCarousel = {
      ...carousel,
      slides: carousel.slides.map(slide => ({
        ...slide,
        fontSettings: {
          titleFont: 'Inter',
          contentFont: 'Inter',
          titleSize: 'large' as const,
          contentSize: 'medium' as const,
          alignment: 'center' as const,
          titleUppercase: false,
          contentUppercase: false,
          lineHeight: 'normal' as const
        },
        colorPalette: {
          background: '#ffffff',
          titleColor: '#1f2937',
          contentColor: '#6b7280',
          accentColor: '#3b82f6'
        }
      }))
    };
    
    setGeneratedCarousel(enhancedCarousel);
    onAddToHistory(enhancedCarousel);
    setCurrentStep(2);
  };

  const handleCarouselUpdate = (carousel: GeneratedCarousel) => {
    setGeneratedCarousel(carousel);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setShowHistory(true); // Keep history open when going back
  };
  const handleSchedulePost = () => {
    // Handle scheduling logic here
    console.log('Scheduling carousel post...');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CarouselStep1
            selectedModel={selectedModel}
            creatorType={creatorType}
            language={language}
            prefilledIdea={prefilledIdea}
            onNext={handleStep1Complete}
            onTabChange={onTabChange}
          />
        );
      case 2:
        return generatedCarousel ? (
          <CarouselStep2
            carousel={generatedCarousel}
            onCarouselUpdate={handleCarouselUpdate}
            onPrevious={handleBackToStep1}
            onSchedule={handleSchedulePost}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="space-section pt-8">
      {/* Header */}
      <div className="space-content">
        {prefilledIdea && onBackToIdeas && currentStep === 1 && (
          <button
            onClick={onBackToIdeas}
            className="btn btn-ghost mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Ideias
          </button>
        )}
        
        <div className="flex items-center space-x-3 mb-4 bg-white border border-gray-200 rounded-lg p-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">
              Gerador de Carrossel
            </h1>
            <p className="text-gray-600">
              Crie slides profissionais com textos e design únicos
            </p>
          </div>
        </div>
      </div>
      
      {/* Multi-step Content */}
      {renderCurrentStep()}

      {/* History Toggle - Only show on step 1 */}
      {currentStep === 1 && carouselsHistory.length > 0 && (
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="btn btn-white"
        >
          <Clock className="w-4 h-4 mr-2" />
          {showHistory ? 'Ocultar Histórico' : `Ver Histórico (${carouselsHistory.length})`}
        </button>
      )}

      {/* History Display - Only show on step 1 */}
      {currentStep === 1 && carouselsHistory.length > 0 && showHistory && (
        <div className="space-content">
          <h2 className="text-xl font-bold text-gray-900">Histórico de Carrosséis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {carouselsHistory.map((carousel, index) => (
              <div key={carousel.title + index} className="group cursor-pointer">
                {/* Card with 4:5 ratio simulating carousel slide */}
                <div 
                  className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 mb-3"
                  style={{ aspectRatio: '4/5' }}
                  onClick={() => {
                    setGeneratedCarousel(carousel);
                    setCurrentStep(2);
                    setShowHistory(false);
                   // Scroll to top when starting to edit carousel
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {/* Slide preview simulation */}
                  <div 
                    className="absolute inset-0 flex flex-col justify-center items-center p-4 text-center"
                    style={{
                      backgroundColor: carousel.slides[0]?.colorPalette?.background || '#ffffff'
                    }}
                  >
                    <h3 
                      className="font-bold text-sm mb-2 line-clamp-2"
                      style={{
                        color: carousel.slides[0]?.colorPalette?.titleColor || '#1f2937',
                        fontFamily: carousel.slides[0]?.fontSettings?.titleFont || 'Inter'
                      }}
                    >
                      {carousel.slides[0]?.title || carousel.title}
                    </h3>
                    <p 
                      className="text-xs line-clamp-3"
                      style={{
                        color: carousel.slides[0]?.colorPalette?.contentColor || '#6b7280',
                        fontFamily: carousel.slides[0]?.fontSettings?.contentFont || 'Inter'
                      }}
                    >
                      {carousel.slides[0]?.content || carousel.description}
                    </p>
                  </div>
                  
                  {/* Slide count indicator */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                    {carousel.slides.length}
                  </div>
                  
                  {/* Model badge */}
                  {carousel.model && carousel.model !== 'undefined' && (
                    <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {getModelDisplayName(carousel.model)}
                    </div>
                  )}
                </div>
                
                {/* Card info below */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(carousel.createdAt || Date.now()).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>{carousel.slides.length}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {carousel.hashtags.slice(0, 2).map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {carousel.hashtags.length > 2 && (
                      <span className="px-1.5 py-0.5 bg-gray-50 text-gray-600 rounded text-xs">
                        +{carousel.hashtags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Carousel Generated State - Only show on step 1 */}
      {currentStep === 1 && !generatedCarousel && carouselsHistory.length === 0 && (
        <div className="card card-padding text-center">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum carrossel gerado
          </h3>
          <p className="text-gray-600">
            Configure os parâmetros e clique em "Gerar Textos dos Slides"
          </p>
        </div>
      )}
    </div>
  );
};

export default CarouselTab;