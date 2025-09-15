import React, { useState } from 'react';
import { type GeneratedCarousel } from '../../lib/ai';

interface ColorPalette {
  id: string;
  name: string;
  background: string;
  titleColor: string;
  contentColor: string;
  accentColor: string;
}

interface ColorPaletteSettingsProps {
  carousel: GeneratedCarousel;
  onCarouselUpdate: (carousel: GeneratedCarousel) => void;
}

const ColorPaletteSettings: React.FC<ColorPaletteSettingsProps> = ({ 
  carousel, 
  onCarouselUpdate
}) => {
  // Only Modern and Dark Mode palettes
  const colorPalettes: ColorPalette[] = [
    { id: 'modern', name: 'Modern', background: '#ffffff', titleColor: '#1f2937', contentColor: '#6b7280', accentColor: '#3b82f6' },
    { id: 'dark', name: 'Dark Mode', background: '#1f2937', titleColor: '#ffffff', contentColor: '#d1d5db', accentColor: '#60a5fa' }
  ];

  // Custom colors state
  const [customColors, setCustomColors] = useState({
    background: carousel.slides[0]?.colorPalette?.background || '#ffffff',
    titleColor: carousel.slides[0]?.colorPalette?.titleColor || '#1f2937',
    contentColor: carousel.slides[0]?.colorPalette?.contentColor || '#6b7280',
    accentColor: carousel.slides[0]?.colorPalette?.accentColor || '#3b82f6'
  });

  const applyColorPaletteToAllSlides = (paletteId: string) => {
    const selectedColors = colorPalettes.find(c => c.id === paletteId);
    if (!selectedColors) return;
    
    const updatedSlides = carousel.slides.map(slide => ({
      ...slide,
      colorPalette: {
        background: selectedColors.background,
        titleColor: selectedColors.titleColor,
        contentColor: selectedColors.contentColor,
        accentColor: selectedColors.accentColor
      }
    }));
    
    onCarouselUpdate({
      ...carousel,
      slides: updatedSlides
    });

    // Update custom colors to match
    setCustomColors({
      background: selectedColors.background,
      titleColor: selectedColors.titleColor,
      contentColor: selectedColors.contentColor,
      accentColor: selectedColors.accentColor
    });
  };

  // Apply custom colors automatically when they change
  React.useEffect(() => {
    const updatedSlides = carousel.slides.map(slide => ({
      ...slide,
      colorPalette: {
        background: customColors.background,
        titleColor: customColors.titleColor,
        contentColor: customColors.contentColor,
        accentColor: customColors.accentColor
      }
    }));
    
    onCarouselUpdate({
      ...carousel,
      slides: updatedSlides
    });
  }, [customColors, carousel.slides.length, onCarouselUpdate]);

  return (
    <div className="card card-padding">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Paleta de Cores</h3>
      
      <div className="space-y-3">
        {/* Predefined Palettes */}
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-2">Predefinidas</h4>
          <div className="grid grid-cols-2 gap-2">
            {colorPalettes.map(palette => (
              <button
                key={palette.id}
                onClick={() => applyColorPaletteToAllSlides(palette.id)}
                className="p-2 border border-gray-200 rounded text-left transition-all hover:border-gray-300"
              >
                <div className="flex items-center space-x-1 mb-1">
                  <div 
                    className="w-3 h-3 border border-gray-300 rounded-sm"
                    style={{ backgroundColor: palette.background }}
                  />
                  <div 
                    className="w-3 h-3 border border-gray-300 rounded-sm"
                    style={{ backgroundColor: palette.titleColor }}
                  />
                  <div 
                    className="w-3 h-3 border border-gray-300 rounded-sm"
                    style={{ backgroundColor: palette.accentColor }}
                  />
                </div>
                <div className="text-xs font-medium">{palette.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-2">Personalizadas</h4>
          <div className="space-y-2 mb-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Fundo</label>
              <div className="flex items-center space-x-1">
                <input
                  type="color"
                  value={customColors.background}
                  onChange={(e) => setCustomColors({...customColors, background: e.target.value})}
                  className="w-6 h-6 border border-gray-300 cursor-pointer rounded"
                />
                <input
                  type="text"
                  value={customColors.background}
                  onChange={(e) => setCustomColors({...customColors, background: e.target.value})}
                  className="flex-1 px-1 py-1 text-xs border border-gray-300 font-mono rounded"
                  placeholder="#ffffff"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Título</label>
              <div className="flex items-center space-x-1">
                <input
                  type="color"
                  value={customColors.titleColor}
                  onChange={(e) => setCustomColors({...customColors, titleColor: e.target.value})}
                  className="w-6 h-6 border border-gray-300 cursor-pointer rounded"
                />
                <input
                  type="text"
                  value={customColors.titleColor}
                  onChange={(e) => setCustomColors({...customColors, titleColor: e.target.value})}
                  className="flex-1 px-1 py-1 text-xs border border-gray-300 font-mono rounded"
                  placeholder="#1f2937"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Conteúdo</label>
              <div className="flex items-center space-x-1">
                <input
                  type="color"
                  value={customColors.contentColor}
                  onChange={(e) => setCustomColors({...customColors, contentColor: e.target.value})}
                  className="w-6 h-6 border border-gray-300 cursor-pointer rounded"
                />
                <input
                  type="text"
                  value={customColors.contentColor}
                  onChange={(e) => setCustomColors({...customColors, contentColor: e.target.value})}
                  className="flex-1 px-1 py-1 text-xs border border-gray-300 font-mono rounded"
                  placeholder="#6b7280"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Destaque</label>
              <div className="flex items-center space-x-1">
                <input
                  type="color"
                  value={customColors.accentColor}
                  onChange={(e) => setCustomColors({...customColors, accentColor: e.target.value})}
                  className="w-6 h-6 border border-gray-300 cursor-pointer rounded"
                />
                <input
                  type="text"
                  value={customColors.accentColor}
                  onChange={(e) => setCustomColors({...customColors, accentColor: e.target.value})}
                  className="flex-1 px-1 py-1 text-xs border border-gray-300 font-mono rounded"
                  placeholder="#3b82f6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteSettings;