import React from 'react';
import { Upload, Wand2, RefreshCw, AlertCircle } from 'lucide-react';

interface SlideImageUploadProps {
  slideIndex: number;
  slideImages: {[key: number]: string};
  imageOpacity: {[key: number]: number};
  imagePrompt: string;
  isGeneratingImage: boolean;
  freepikError: string;
  onSlideImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageOpacityChange: (opacity: number) => void;
  onImagePromptChange: (prompt: string) => void;
  onGenerateImageWithAI: () => void;
}

const SlideImageUpload: React.FC<SlideImageUploadProps> = ({
  slideIndex,
  slideImages,
  imageOpacity,
  imagePrompt,
  isGeneratingImage,
  freepikError,
  onSlideImageUpload,
  onImageOpacityChange,
  onImagePromptChange,
  onGenerateImageWithAI
}) => {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-700 mb-2">
        Imagem do Slide
      </label>
      
      {/* AI Image Generator */}
      <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Wand2 className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-medium text-purple-700">Gerador de Imagem IA</span>
        </div>
        
        <div className="space-y-2">
          <textarea
            value={imagePrompt}
            onChange={(e) => onImagePromptChange(e.target.value)}
            placeholder="Descreva a imagem que você quer gerar... Ex: uma paisagem moderna minimalista com cores suaves"
            rows={2}
            className="w-full px-2 py-1 text-xs border border-purple-200 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white"
          />
          
          <button
            onClick={onGenerateImageWithAI}
            disabled={isGeneratingImage || !imagePrompt.trim()}
            className="w-full px-3 py-2 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGeneratingImage ? (
              <>
                <RefreshCw className="w-3 h-3 mr-1 animate-spin inline" />
                Gerando Imagem...
              </>
            ) : (
              <>
                <Wand2 className="w-3 h-3 mr-1 inline" />
                Gerar Imagem com IA
              </>
            )}
          </button>
          
          {freepikError && (
            <div className="flex items-center space-x-1 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <div className="whitespace-pre-line text-xs">{freepikError}</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="file"
          accept="image/*"
          onChange={onSlideImageUpload}
          className="hidden"
          id={`image-upload-${slideIndex}`}
        />
        <label
          htmlFor={`image-upload-${slideIndex}`}
          className="btn btn-secondary btn-sm cursor-pointer"
        >
          <Upload className="w-3 h-3 mr-1" />
          Escolher Imagem
        </label>
        {slideImages[slideIndex] && (
          <span className="text-xs text-green-600">✓ Imagem carregada</span>
        )}
      </div>
      
      {slideImages[slideIndex] && (
        <div className="space-y-2">
          {/* Image Thumbnail with 4:5 ratio */}
          <img
            src={slideImages[slideIndex]}
            alt={`Slide ${slideIndex + 1}`}
            className="w-12 h-15 object-cover border border-gray-200"
            style={{ aspectRatio: '4/5', width: '48px', height: '60px' }}
          />
          
          {/* Image Opacity Control */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Opacidade da Imagem: {Math.round((imageOpacity[slideIndex] || 0.2) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={imageOpacity[slideIndex] || 0.2}
              onChange={(e) => onImageOpacityChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideImageUpload;