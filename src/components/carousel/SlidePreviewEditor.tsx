import React, { useState } from 'react';
import { type GeneratedCarousel } from '../../lib/ai';
import SlideImageUpload from './preview/SlideImageUpload';
import SlidePreview from './preview/SlidePreview';
import SlideDownload from './preview/SlideDownload';

interface SlidePreviewEditorProps {
  carousel: GeneratedCarousel;
  onCarouselUpdate: (carousel: GeneratedCarousel) => void;
  slideIndex: number;
}

const SlidePreviewEditor: React.FC<SlidePreviewEditorProps> = ({ 
  carousel, 
  onCarouselUpdate,
  slideIndex,
}) => {
  const [slideImages, setSlideImages] = useState<{[key: number]: string}>({});
  const [imageOpacity, setImageOpacity] = useState<{[key: number]: number}>({});
  const [backgroundOpacity, setBackgroundOpacity] = useState<{[key: number]: number}>({});
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [freepikError, setFreepikError] = useState('');
  const [freepikTaskId, setFreepikTaskId] = useState<string | null>(null);

  const slide = carousel.slides[slideIndex];

  const updateSlideText = (field: 'title' | 'content', value: string) => {
    const updatedSlides = carousel.slides.map((s, index) => {
      if (index === slideIndex) {
        return { ...s, [field]: value };
      }
      return s;
    });
    
    onCarouselUpdate({
      ...carousel,
      slides: updatedSlides
    });
  };

  const updateSlideSettings = (settings: any) => {
    const updatedSlides = carousel.slides.map((s, index) => {
      if (index === slideIndex) {
        return { 
          ...s, 
          fontSettings: { ...s.fontSettings, ...settings }
        };
      }
      return s;
    });
    
    onCarouselUpdate({
      ...carousel,
      slides: updatedSlides
    });
  };

  const handleSlideImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSlideImages(prev => ({
            ...prev,
            [slideIndex]: e.target.result as string
          }));
          // Set default opacity to 20% (0.2)
          setImageOpacity(prev => ({
            ...prev,
            [slideIndex]: prev[slideIndex] || 0.8
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const updateImageOpacity = (opacity: number) => {
    setImageOpacity(prev => ({
      ...prev,
      [slideIndex]: opacity
    }));
  };

  const updateBackgroundOpacity = (opacity: number) => {
    setBackgroundOpacity(prev => ({
      ...prev,
      [slideIndex]: opacity
    }));
  };

  const generateImageWithAI = async () => {
    if (!imagePrompt.trim()) return;
    
    setIsGeneratingImage(true);
    setFreepikError('');
    
    try {
      // Get Freepik API key from localStorage
      const storedKeys = localStorage.getItem('delaluna_freepik_keys');
      let freepikApiKey = '';
      
      if (storedKeys) {
        try {
          const keys = JSON.parse(storedKeys);
          const activeKey = keys.find((key: any) => key.status === 'active');
          if (activeKey) {
            freepikApiKey = activeKey.key;
          }
        } catch (error) {
          console.error('Error parsing stored Freepik keys:', error);
        }
      }
      
      if (!freepikApiKey) {
        setFreepikError(`
          ❌ Chave API Freepik não configurada
          
          Para gerar imagens com IA, você precisa:
          • Ir em "Gerenciar Chaves API"
          • Adicionar sua chave da API Freepik
          • Ativar a chave
          
          💡 Ou use o upload manual de imagens.
        `);
        setIsGeneratingImage(false);
        return;
      }
      
      console.log('🔧 Gerando imagem diretamente via API Freepik...');
      console.log('📝 Prompt:', imagePrompt.trim());
      
      // Use Supabase Edge Function URL
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/freepik-generate`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'X-Freepik-API-Key': freepikApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          prompt: imagePrompt.trim(),
          aspect_ratio: 'social_post_4_5',
          styling: {
            effects: {
              color: 'vibrant',
              framing: 'portrait',
              lightning: 'dramatic'
            }
          }
        })
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Freepik API Error Response:', errorText);
        
        let errorMessage = `Erro na API Freepik (${response.status}): `;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error && errorData.error.message) {
            errorMessage += errorData.error.message;
          } else if (errorData.message) {
            errorMessage += errorData.message;
          } else {
            errorMessage += response.statusText;
          }
          if (errorData.error && errorData.error.details) {
            errorMessage += ` - ${errorData.error.details}`;
          }
        } catch (e) {
          errorMessage += response.statusText;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('✅ Freepik API Response data:', data);
      
      if (data.data && data.data.task_id) {
        setFreepikTaskId(data.data.task_id);
        console.log('🎯 Task ID recebido:', data.data.task_id);
      } else {
        console.error('❌ Resposta sem task_id no data:', data);
        throw new Error('Resposta inválida da API Freepik - task_id não encontrado');
      }
      
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setFreepikError(`
          ❌ Erro de conexão
          
          Possíveis causas:
          • Conexão de internet instável
          • API Freepik temporariamente indisponível
          • Chave API inválida ou expirada
          
          💡 Tente:
          • Verificar sua conexão
          • Verificar se sua chave API está correta
          • Tentar novamente em alguns minutos
        `);
      } else {
        setFreepikError(`
          ❌ ${error instanceof Error ? error.message : 'Erro desconhecido'}
          
          💡 Tente novamente ou use o upload manual de imagens.
        `);
      }
      setIsGeneratingImage(false);
    }
  };

  const pollFreepikImageStatus = async () => {
    if (!freepikTaskId) return;
    
    try {
      // Get Freepik API key from localStorage
      const storedKeys = localStorage.getItem('delaluna_freepik_keys');
      let freepikApiKey = '';
      
      if (storedKeys) {
        try {
          const keys = JSON.parse(storedKeys);
          const activeKey = keys.find((key: any) => key.status === 'active');
          if (activeKey) {
            freepikApiKey = activeKey.key;
          }
        } catch (error) {
          console.error('Error parsing stored Freepik keys:', error);
        }
      }
      
      if (!freepikApiKey) {
        setFreepikError('Chave API Freepik não encontrada. Configure nas configurações.');
        setIsGeneratingImage(false);
        setFreepikTaskId(null);
        return;
      }
      
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/freepik-status/${freepikTaskId}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-Freepik-API-Key': freepikApiKey,
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Freepik Status API error:', errorText);
        throw new Error(`Erro ao verificar status via API Freepik (${response.status}): ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊 Freepik Status API response:', data);
      
      if (data.data) {
        if (data.data.status === 'COMPLETED' && data.data.generated && data.data.generated.length > 0) {
          // Imagem gerada com sucesso
          setSlideImages(prev => ({
            ...prev,
            [slideIndex]: data.data.generated[0]
          }));
          setImageOpacity(prev => ({
            ...prev,
            [slideIndex]: prev[slideIndex] || 0.8
          }));
          setIsGeneratingImage(false);
          setFreepikTaskId(null);
          console.log('✅ Imagem gerada com sucesso:', data.data.generated[0]);
        } else if (data.data.status === 'FAILED') {
          const errorMsg = data.data.error ? data.data.error.message || data.data.error : 'Falha ao gerar imagem';
          setFreepikError(`Falha ao gerar imagem: ${errorMsg}`);
          setIsGeneratingImage(false);
          setFreepikTaskId(null);
          console.error('❌ Image generation failed:', data.data.error);
        } else if (data.data.status === 'IN_PROGRESS' || data.data.status === 'CREATED') {
          console.log('⏳ Imagem ainda sendo processada...');
          // Continue polling
        }
      } else {
        console.error('❌ Resposta inválida da API Freepik de status:', data);
        setFreepikError('Resposta inválida ao verificar status da imagem.');
        setIsGeneratingImage(false);
        setFreepikTaskId(null);
      }
      
    } catch (error) {
      console.error('Erro ao verificar status da imagem:', error);
      setFreepikError(`Erro ao verificar status via API Freepik: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setIsGeneratingImage(false);
      setFreepikTaskId(null);
    }
  };

  // Polling effect for Freepik image generation
  React.useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    
    if (freepikTaskId && isGeneratingImage) {
      // Start polling every 3 seconds
      pollInterval = setInterval(pollFreepikImageStatus, 3000);
    }
    
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [freepikTaskId, isGeneratingImage]);

  return (
    <div className="card card-padding">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Slide {slideIndex + 1}
        </h3>
        <SlideDownload
          slideIndex={slideIndex}
          carousel={carousel}
          slideImages={slideImages}
          imageOpacity={imageOpacity}
          backgroundOpacity={backgroundOpacity}
        />
      </div>

      <SlidePreview
        carousel={carousel}
        slideIndex={slideIndex}
        slideImages={slideImages}
        imageOpacity={imageOpacity}
        backgroundOpacity={backgroundOpacity}
        onSlideTextUpdate={updateSlideText}
      />

      <SlideImageUpload
        slideIndex={slideIndex}
        slideImages={slideImages}
        imageOpacity={imageOpacity}
        imagePrompt={imagePrompt}
        isGeneratingImage={isGeneratingImage}
        freepikError={freepikError}
        onSlideImageUpload={handleSlideImageUpload}
        onImageOpacityChange={updateImageOpacity}
        onImagePromptChange={setImagePrompt}
        onGenerateImageWithAI={generateImageWithAI}
      />
    </div>
  );
};

export default SlidePreviewEditor;