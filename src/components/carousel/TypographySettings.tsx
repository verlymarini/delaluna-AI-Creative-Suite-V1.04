import React, { useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight, Upload, Trash2, Type } from 'lucide-react';
import { type GeneratedCarousel } from '../../lib/ai';

interface FontPreset {
  id: string;
  name: string;
  titleFont: string;
  contentFont: string;
  category: 'serif' | 'sans-serif' | 'slab-serif' | 'monospace' | 'handwriting' | 'display';
  preview: string;
}

interface CustomFont {
  id: string;
  name: string;
  fontFamily: string;
  file: File;
  url: string;
}

interface TypographySettingsProps {
  carousel: GeneratedCarousel;
  onCarouselUpdate: (carousel: GeneratedCarousel) => void;
}

const TypographySettings: React.FC<TypographySettingsProps> = ({ 
  carousel, 
  onCarouselUpdate 
}) => {
  const [customFonts, setCustomFonts] = useState<CustomFont[]>(() => {
    try {
      const stored = localStorage.getItem('delaluna_custom_fonts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Font presets (20 combinations)
  const fontPresets: FontPreset[] = [
    { id: 'clean', name: 'Clean Modern', titleFont: 'Inter', contentFont: 'Inter', category: 'sans-serif', preview: 'Aa' },
    { id: 'elegant', name: 'Elegant Serif', titleFont: 'Playfair Display', contentFont: 'Source Sans Pro', category: 'serif', preview: 'Aa' },
    { id: 'bold', name: 'Bold Impact', titleFont: 'Montserrat', contentFont: 'Open Sans', category: 'sans-serif', preview: 'Aa' },
    { id: 'minimal', name: 'Minimal Clean', titleFont: 'Poppins', contentFont: 'Lato', category: 'sans-serif', preview: 'Aa' },
    { id: 'classic', name: 'Classic Times', titleFont: 'Merriweather', contentFont: 'PT Sans', category: 'serif', preview: 'Aa' },
    { id: 'handwritten', name: 'Handwritten', titleFont: 'Dancing Script', contentFont: 'Open Sans', category: 'handwriting', preview: 'Aa' },
    { id: 'creative', name: 'Creative Mix', titleFont: 'Oswald', contentFont: 'Nunito', category: 'display', preview: 'Aa' },
    { id: 'friendly', name: 'Friendly Round', titleFont: 'Nunito', contentFont: 'Open Sans', category: 'sans-serif', preview: 'Aa' },
    { id: 'editorial', name: 'Editorial', titleFont: 'Crimson Text', contentFont: 'Lato', category: 'serif', preview: 'Aa' },
    { id: 'modern-serif', name: 'Modern Serif', titleFont: 'Libre Baskerville', contentFont: 'Source Sans Pro', category: 'serif', preview: 'Aa' },
    { id: 'geometric', name: 'Geometric', titleFont: 'Raleway', contentFont: 'Poppins', category: 'sans-serif', preview: 'Aa' },
    { id: 'script-elegant', name: 'Script Elegant', titleFont: 'Great Vibes', contentFont: 'Lato', category: 'handwriting', preview: 'Aa' },
    { id: 'rounded', name: 'Rounded Soft', titleFont: 'Nunito', contentFont: 'Nunito', category: 'sans-serif', preview: 'Aa' },
    { id: 'contrast', name: 'High Contrast', titleFont: 'Playfair Display', contentFont: 'Inter', category: 'serif', preview: 'Aa' },
    { id: 'corporate', name: 'Corporate', titleFont: 'Roboto', contentFont: 'Open Sans', category: 'sans-serif', preview: 'Aa' },
    { id: 'artistic', name: 'Artistic', titleFont: 'Crimson Text', contentFont: 'Raleway', category: 'serif', preview: 'Aa' },
    { id: 'casual-script', name: 'Casual Script', titleFont: 'Kalam', contentFont: 'Source Sans Pro', category: 'handwriting', preview: 'Aa' },
    { id: 'luxury', name: 'Luxury', titleFont: 'Playfair Display', contentFont: 'Crimson Text', category: 'serif', preview: 'Aa' },
    { id: 'startup', name: 'Startup', titleFont: 'Montserrat', contentFont: 'Poppins', category: 'sans-serif', preview: 'Aa' },
    { id: 'signature', name: 'Signature Style', titleFont: 'Pacifico', contentFont: 'Open Sans', category: 'handwriting', preview: 'Aa' },
    { id: 'editorial-modern', name: 'Editorial Modern', titleFont: 'Merriweather', contentFont: 'Inter', category: 'serif', preview: 'Aa' },
    { id: 'handwritten-bold', name: 'Handwritten Bold', titleFont: 'Caveat', contentFont: 'Roboto', category: 'handwriting', preview: 'Aa' },
    { id: 'tech-modern', name: 'Tech Modern', titleFont: 'Inter', contentFont: 'Ubuntu', category: 'sans-serif', preview: 'Aa' },
    { id: 'vintage-script', name: 'Vintage Script', titleFont: 'Satisfy', contentFont: 'Lato', category: 'handwriting', preview: 'Aa' }
  ];

  const saveCustomFonts = (fonts: CustomFont[]) => {
    setCustomFonts(fonts);
    localStorage.setItem('delaluna_custom_fonts', JSON.stringify(fonts.map(f => ({
      id: f.id,
      name: f.name,
      fontFamily: f.fontFamily,
      url: f.url
    }))));
  };

  const handleFontUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.name.match(/\.(woff|woff2|ttf|otf)$/i)) {
        alert(`Arquivo ${file.name} não é uma fonte válida. Use .woff, .woff2, .ttf ou .otf`);
        continue;
      }

      try {
        // Create object URL for the font file
        const fontUrl = URL.createObjectURL(file);
        
        // Extract font name from filename
        const fontName = file.name.replace(/\.(woff|woff2|ttf|otf)$/i, '');
        const fontFamily = `CustomFont_${Date.now()}_${i}`;

        // Create @font-face rule
        const fontFace = new FontFace(fontFamily, `url(${fontUrl})`);
        
        // Load the font
        await fontFace.load();
        
        // Add to document fonts
        document.fonts.add(fontFace);

        // Create custom font object
        const customFont: CustomFont = {
          id: `custom-${Date.now()}-${i}`,
          name: fontName,
          fontFamily: fontFamily,
          file: file,
          url: fontUrl
        };

        // Add to custom fonts list
        setCustomFonts(prev => {
          const updated = [...prev, customFont];
          saveCustomFonts(updated);
          return updated;
        });

      } catch (error) {
        console.error('Error loading font:', error);
        alert(`Erro ao carregar fonte ${file.name}`);
      }
    }

    // Clear input
    event.target.value = '';
  };

  const removeCustomFont = (fontId: string) => {
    const fontToRemove = customFonts.find(f => f.id === fontId);
    if (fontToRemove) {
      // Revoke object URL to free memory
      URL.revokeObjectURL(fontToRemove.url);
      
      // Remove from custom fonts
      const updatedFonts = customFonts.filter(f => f.id !== fontId);
      saveCustomFonts(updatedFonts);
    }
  };

  const applyFontPresetToAllSlides = (presetId: string) => {
    const selectedFont = fontPresets.find(f => f.id === presetId);
    if (!selectedFont) return;
    
    const updatedSlides = carousel.slides.map(slide => ({
      ...slide,
      fontSettings: {
        ...slide.fontSettings,
        titleFont: selectedFont.titleFont,
        contentFont: selectedFont.contentFont
      }
    }));
    
    onCarouselUpdate({
      ...carousel,
      slides: updatedSlides
    });
  };

  const updateAllSlidesSettings = (settings: any) => {
    const updatedSlides = carousel.slides.map(slide => ({
      ...slide,
      fontSettings: { ...slide.fontSettings, ...settings }
    }));
    
    onCarouselUpdate({
      ...carousel,
      slides: updatedSlides
    });
  };

  const updateTitleFont = (fontFamily: string) => {
    updateAllSlidesSettings({ titleFont: fontFamily });
  };

  const updateContentFont = (fontFamily: string) => {
    updateAllSlidesSettings({ contentFont: fontFamily });
  };

  // Get all available fonts (system + custom)
  const getAllFonts = () => {
    const systemFonts = [
      'Inter', 'Playfair Display', 'Montserrat', 'Open Sans', 'Poppins', 'Lato',
      'Merriweather', 'Dancing Script', 'Oswald', 'Nunito', 'Crimson Text',
      'Libre Baskerville', 'Source Sans Pro', 'Raleway', 'Great Vibes', 'Roboto',
      'Kalam', 'Pacifico', 'Caveat', 'Ubuntu', 'Satisfy', 'PT Sans'
    ];
    
    const customFontsList = customFonts.map(f => ({
      name: f.name,
      fontFamily: f.fontFamily,
      isCustom: true
    }));

    return [
      ...systemFonts.map(font => ({ name: font, fontFamily: font, isCustom: false })),
      ...customFontsList
    ];
  };

  const allFonts = getAllFonts();

  return (
    <div className="card card-padding">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Tipografia</h3>
      
      <div className="space-y-3">

        {/* Font Presets */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Combinação de Fontes
          </label>
          <div className="grid grid-cols-4 gap-2">
            {fontPresets.map(preset => {
              const isSelected = carousel.slides[0]?.fontSettings?.titleFont === preset.titleFont && 
                               carousel.slides[0]?.fontSettings?.contentFont === preset.contentFont;
              
              return (
                <button
                  key={preset.id}
                  onClick={() => applyFontPresetToAllSlides(preset.id)}
                  className={`p-1.5 rounded-lg border text-center transition-all min-w-0 ${
                    isSelected
                      ? 'border-gray-500 bg-gray-50 text-gray-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div 
                    className="text-xs font-semibold text-gray-900 mb-1 truncate"
                    style={{ fontFamily: preset.titleFont }}
                  >
                    {preset.name.split(' ')[0] || 'Font'}
                  </div>
                  <div 
                    className="text-xs text-gray-500 truncate"
                    style={{ fontFamily: preset.contentFont }}
                  >
                    {preset.name.split(' ')[1] || preset.name.split(' ')[0] || 'Preview'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Font Upload */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Upload de Fontes Personalizadas
          </label>
          <div className="space-y-2">
            <input
              type="file"
              accept=".woff,.woff2,.ttf,.otf"
              multiple
              onChange={handleFontUpload}
              className="hidden"
              id="font-upload"
            />
            <label
              htmlFor="font-upload"
              className="btn btn-secondary btn-sm cursor-pointer w-full"
            >
              <Upload className="w-3 h-3 mr-1" />
              Escolher Fontes (.woff, .woff2, .ttf, .otf)
            </label>
            
            {/* Custom Fonts List */}
            {customFonts.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-600">Fontes Carregadas:</div>
                {customFonts.map(font => (
                  <div key={font.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                    <div className="flex items-center space-x-2">
                      <Type className="w-3 h-3 text-gray-500" />
                      <span 
                        className="font-medium"
                        style={{ fontFamily: font.fontFamily }}
                      >
                        {font.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeCustomFont(font.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Individual Font Selection */}
        <div>
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Fontes Individuais</h4>
          <div className="space-y-2">
            {/* Title Font */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Fonte do Título</label>
              <select
                value={carousel.slides[0]?.fontSettings?.titleFont || 'Inter'}
                onChange={(e) => updateTitleFont(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {allFonts.map(font => (
                  <option key={font.fontFamily} value={font.fontFamily}>
                    {font.name} {font.isCustom ? '(Personalizada)' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Content Font */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Fonte do Conteúdo</label>
              <select
                value={carousel.slides[0]?.fontSettings?.contentFont || 'Inter'}
                onChange={(e) => updateContentFont(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {allFonts.map(font => (
                  <option key={font.fontFamily} value={font.fontFamily}>
                    {font.name} {font.isCustom ? '(Personalizada)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Text Size Controls */}
        <div>
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Tamanhos</h4>
          <div className="space-y-2">
            {/* Title Size */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Título</label>
              <div className="grid grid-cols-3 gap-1">
                {['small', 'medium', 'large'].map(size => (
                  <button
                    key={size}
                    onClick={() => updateAllSlidesSettings({ titleSize: size })}
                    className={`p-2 rounded text-xs transition-all ${
                      carousel.slides[0]?.fontSettings?.titleSize === size 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {size === 'small' && 'P'}
                    {size === 'medium' && 'M'}
                    {size === 'large' && 'G'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Content Size */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Conteúdo</label>
              <div className="grid grid-cols-3 gap-1">
                {['small', 'medium', 'large'].map(size => (
                  <button
                    key={size}
                    onClick={() => updateAllSlidesSettings({ contentSize: size })}
                    className={`p-2 rounded text-xs transition-all ${
                      carousel.slides[0]?.fontSettings?.contentSize === size 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {size === 'small' && 'P'}
                    {size === 'medium' && 'M'}
                    {size === 'large' && 'G'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Alignment Controls */}
        <div>
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Alinhamento</h4>
          <div className="space-y-2">
            {/* Horizontal */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Horizontal</label>
              <div className="grid grid-cols-3 gap-1">
                {['left', 'center', 'right'].map(alignment => (
                  <button
                    key={alignment}
                    onClick={() => updateAllSlidesSettings({ alignment })}
                    className={`p-2 rounded text-xs transition-all ${
                      carousel.slides[0]?.fontSettings?.alignment === alignment 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {alignment === 'left' && <AlignLeft className="w-3 h-3 mx-auto" />}
                    {alignment === 'center' && <AlignCenter className="w-3 h-3 mx-auto" />}
                    {alignment === 'right' && <AlignRight className="w-3 h-3 mx-auto" />}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Vertical */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Vertical</label>
              <div className="grid grid-cols-3 gap-1">
                {['top', 'center', 'bottom'].map(verticalAlignment => (
                  <button
                    key={verticalAlignment}
                    onClick={() => updateAllSlidesSettings({ verticalAlignment })}
                    className={`p-2 rounded text-xs transition-all ${
                      carousel.slides[0]?.fontSettings?.verticalAlignment === verticalAlignment 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {verticalAlignment === 'top' && '⬆'}
                    {verticalAlignment === 'center' && '●'}
                    {verticalAlignment === 'bottom' && '⬇'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Text Style Options */}
        <div>
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Estilo</h4>
          <div className="space-y-2">
            {/* Title Highlight Checkbox */}
            <div>
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={carousel.slides[0]?.fontSettings?.titleHighlight || false}
                  onChange={(e) => updateAllSlidesSettings({ titleHighlight: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-700">Destacar título com background</span>
              </label>
            </div>
            
            {/* Title Highlight Opacity - Only show when highlight is enabled */}
            {carousel.slides[0]?.fontSettings?.titleHighlight && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Opacidade do Destaque: {Math.round((carousel.slides[0]?.fontSettings?.titleHighlightOpacity || 1) * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={carousel.slides[0]?.fontSettings?.titleHighlightOpacity || 1}
                  onChange={(e) => updateAllSlidesSettings({ titleHighlightOpacity: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            )}
            
            {/* Uppercase Toggle */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Maiúsculas</label>
              <button
                onClick={() => updateAllSlidesSettings({ titleUppercase: !carousel.slides[0]?.fontSettings?.titleUppercase })}
                className={`w-full p-2 rounded text-xs transition-all ${
                  carousel.slides[0]?.fontSettings?.titleUppercase 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {carousel.slides[0]?.fontSettings?.titleUppercase ? 'MAIÚSCULA' : 'Minúscula'}
              </button>
            </div>
            
            {/* Line Height */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Espaçamento</label>
              <div className="grid grid-cols-3 gap-1">
                {['compact', 'normal', 'loose'].map(height => (
                  <button
                    key={height}
                    onClick={() => updateAllSlidesSettings({ lineHeight: height })}
                    className={`p-2 rounded text-xs transition-all ${
                      carousel.slides[0]?.fontSettings?.lineHeight === height 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {height === 'compact' && '━'}
                    {height === 'normal' && '═'}
                    {height === 'loose' && '≡'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypographySettings;