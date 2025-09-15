import React from 'react';
import { type GeneratedCarousel } from '../../../lib/ai';

interface SlidePreviewProps {
  carousel: GeneratedCarousel;
  slideIndex: number;
  slideImages: {[key: number]: string};
  imageOpacity: {[key: number]: number};
  backgroundOpacity: {[key: number]: number};
  onSlideTextUpdate: (field: 'title' | 'content', value: string) => void;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({
  carousel,
  slideIndex,
  slideImages,
  imageOpacity,
  backgroundOpacity,
  onSlideTextUpdate
}) => {
  const slide = carousel.slides[slideIndex];

  return (
    <div
      id={`slide-preview-${slideIndex}`}
      className="w-full border border-gray-200 p-6 flex flex-col items-center mb-3 relative overflow-hidden"
      style={{
        aspectRatio: '4/5', // Force 4:5 ratio (1080x1350)
        backgroundColor: slide.colorPalette?.background || '#ffffff',
        opacity: backgroundOpacity[slideIndex] || 1
      }}
    >
      {slideImages[slideIndex] && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${slideImages[slideIndex]})`,
            opacity: imageOpacity[slideIndex] || 0.8
          }}
        />
      )}
      <div 
        className="relative z-10 flex flex-col h-full w-full"
        style={{
          justifyContent: slide.fontSettings?.verticalAlignment === 'top' ? 'flex-start' :
                         slide.fontSettings?.verticalAlignment === 'bottom' ? 'flex-end' : 'center',
          alignItems: slide.fontSettings?.alignment === 'left' ? 'flex-start' :
                     slide.fontSettings?.alignment === 'right' ? 'flex-end' : 'center',
          textAlign: slide.fontSettings?.alignment || 'center'
        }}
      >
        <h4 
          contentEditable
          suppressContentEditableWarning={true}
          onBlur={(e) => {
            const text = e.currentTarget.innerHTML
              .replace(/<div>/g, '<br>')
              .replace(/<\/div>/g, '')
              .replace(/<br\s*\/?>/g, '\n')
              .replace(/&nbsp;/g, ' ')
              .replace(/<[^>]*>/g, '');
            onSlideTextUpdate('title', text);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.blur();
            }
            if (e.key === 'Enter' && e.shiftKey) {
              e.preventDefault();
              document.execCommand('insertHTML', false, '<br>');
            }
          }}
          className="font-bold mb-2 outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 rounded px-1 py-0.5 cursor-text transition-colors"
          style={{
            color: slide.colorPalette?.titleColor || '#000000',
            fontFamily: slide.fontSettings?.titleFont || 'Inter',
            fontSize: slide.fontSettings?.titleSize === 'small' ? '1.5rem' :
                      slide.fontSettings?.titleSize === 'large' ? '2.5rem' : '2rem',
            textTransform: slide.fontSettings?.titleUppercase ? 'uppercase' : 'none',
            textAlign: slide.fontSettings?.alignment || 'center',
            lineHeight: slide.fontSettings?.lineHeight === 'compact' ? '1.2' : 
                       slide.fontSettings?.lineHeight === 'loose' ? '1.8' : '1.3',
            fontWeight: slide.fontSettings?.titleSize === 'large' ? '800' : '700',
            marginBottom: '1rem'
          }}
        >
          <span style={slide.fontSettings?.titleHighlight ? {
            backgroundColor: (() => {
              const accentColor = slide.colorPalette?.accentColor || '#3b82f6';
              const highlightOpacity = slide.fontSettings?.titleHighlightOpacity || 1;
              const r = parseInt(accentColor.slice(1, 3), 16);
              const g = parseInt(accentColor.slice(3, 5), 16);
              const b = parseInt(accentColor.slice(5, 7), 16);
              return `rgba(${r}, ${g}, ${b}, ${highlightOpacity})`;
            })(),
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '8px',
           display: 'inline',
            width: 'fit-content',
            maxWidth: '100%',
            boxDecorationBreak: 'clone',
            WebkitBoxDecorationBreak: 'clone'
          } : {}}>
            {slide.title || 'Clique para editar título'}
          </span>
        </h4>
        <p 
          contentEditable
          suppressContentEditableWarning={true}
          onBlur={(e) => {
            const text = e.currentTarget.innerHTML
              .replace(/<div>/g, '<br>')
              .replace(/<\/div>/g, '')
              .replace(/<br\s*\/?>/g, '\n')
              .replace(/&nbsp;/g, ' ')
              .replace(/<[^>]*>/g, '');
            onSlideTextUpdate('content', text);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.blur();
            }
            if (e.key === 'Enter' && e.shiftKey) {
              e.preventDefault();
              document.execCommand('insertHTML', false, '<br>');
            }
          }}
          className="leading-relaxed outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 rounded px-1 py-0.5 cursor-text transition-colors min-h-[60px] w-full"
          style={{
            fontSize: slide.fontSettings?.contentSize === 'small' ? '0.875rem' :
                     slide.fontSettings?.contentSize === 'large' ? '1.125rem' : '1rem',
            textAlign: slide.fontSettings?.alignment || 'center',
            lineHeight: slide.fontSettings?.lineHeight === 'compact' ? '1.2' : 
                       slide.fontSettings?.lineHeight === 'loose' ? '1.8' : '1.5',
            color: slide.colorPalette?.contentColor || '#000000'
          }}
        >
          {slide.content || 'Clique para editar conteúdo...'}
        </p>
      </div>
    </div>
  );
};

export default SlidePreview;