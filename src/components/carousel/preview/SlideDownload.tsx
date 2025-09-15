import React from 'react';
import { Download } from 'lucide-react';
import { type GeneratedCarousel } from '../../../lib/ai';

interface SlideDownloadProps {
  slideIndex: number;
  carousel: GeneratedCarousel;
  slideImages: {[key: number]: string};
  imageOpacity: {[key: number]: number};
  backgroundOpacity: {[key: number]: number};
}

const SlideDownload: React.FC<SlideDownloadProps> = ({
  slideIndex,
  carousel,
  slideImages,
  imageOpacity,
  backgroundOpacity
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const slide = carousel.slides[slideIndex];

  const downloadSlide = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      console.log('🎯 Starting slide download with exact preview styles...');
      
      // Get the actual preview element to copy its computed styles
      const previewElement = document.getElementById(`slide-preview-${slideIndex}`);
      if (!previewElement) {
        throw new Error('Preview element not found');
      }
      
      // Get computed styles from the preview
      const previewStyles = window.getComputedStyle(previewElement);
      const titleElement = previewElement.querySelector('h4');
      const contentElement = previewElement.querySelector('p');
      
      if (!titleElement || !contentElement) {
        throw new Error('Title or content element not found in preview');
      }
      
      const titleStyles = window.getComputedStyle(titleElement);
      const contentStyles = window.getComputedStyle(contentElement);
      
      console.log('📐 Preview dimensions:', {
        width: previewElement.offsetWidth,
        height: previewElement.offsetHeight,
        aspectRatio: previewElement.offsetWidth / previewElement.offsetHeight
      });
      
      console.log('🎨 Title styles:', {
        fontSize: titleStyles.fontSize,
        fontFamily: titleStyles.fontFamily,
        fontWeight: titleStyles.fontWeight,
        color: titleStyles.color,
        textAlign: titleStyles.textAlign,
        lineHeight: titleStyles.lineHeight
      });
      
      console.log('📝 Content styles:', {
        fontSize: contentStyles.fontSize,
        fontFamily: contentStyles.fontFamily,
        color: contentStyles.color,
        textAlign: contentStyles.textAlign,
        lineHeight: contentStyles.lineHeight
      });

      // Create canvas with exact preview proportions but higher resolution
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Use Instagram post dimensions (4:5 ratio)
      const width = 1080;
      const height = 1350;
      canvas.width = width;
      canvas.height = height;

      console.log('📐 Canvas created:', { width, height });

      // Fill background color (exact from preview)
      const backgroundColor = previewStyles.backgroundColor || slide.colorPalette?.background || '#ffffff';
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      console.log('🎨 Background filled:', backgroundColor);

      // Draw background image if exists (exact opacity from preview)
      if (slideImages[slideIndex]) {
        try {
          console.log('🖼️ Loading background image...');
          const bgImage = await loadImage(slideImages[slideIndex]);
          const opacity = imageOpacity[slideIndex] || 0.8;
          
          ctx.globalAlpha = opacity;
          ctx.drawImage(bgImage, 0, 0, width, height);
          ctx.globalAlpha = 1.0;
          console.log('✅ Background image drawn with opacity:', opacity);
        } catch (error) {
          console.warn('⚠️ Could not load background image:', error);
        }
      }

      // Get exact positioning from preview
      const previewRect = previewElement.getBoundingClientRect();
      const titleRect = titleElement.getBoundingClientRect();
      const contentRect = contentElement.getBoundingClientRect();
      
      // Calculate relative positions
      const titleRelativeTop = (titleRect.top - previewRect.top) / previewRect.height;
      const contentRelativeTop = (contentRect.top - previewRect.top) / previewRect.height;
      
      console.log('📍 Element positions:', {
        titleRelativeTop,
        contentRelativeTop,
        previewHeight: previewRect.height
      });

      // Parse font sizes and convert to canvas scale
      const titleFontSize = parseFloat(titleStyles.fontSize) * (width / previewRect.width);
      const contentFontSize = parseFloat(contentStyles.fontSize) * (width / previewRect.width);
      
      console.log('📏 Scaled font sizes:', {
        titleFontSize,
        contentFontSize,
        scaleFactor: width / previewRect.width
      });

      // Extract font family (remove quotes and fallbacks)
      const getTitleFont = (fontFamily: string) => {
        return fontFamily.split(',')[0].replace(/['"]/g, '').trim();
      };
      
      const titleFont = getTitleFont(titleStyles.fontFamily);
      const contentFont = getTitleFont(contentStyles.fontFamily);
      
      console.log('🔤 Fonts:', { titleFont, contentFont });

      // Set text alignment from preview
      const textAlign = titleStyles.textAlign as CanvasTextAlign;
      ctx.textAlign = textAlign;
      
      // Calculate X position based on alignment
      let titleX = width / 2; // center default
      if (textAlign === 'left') titleX = 60;
      else if (textAlign === 'right') titleX = width - 60;

      // Draw title with exact styles from preview
      const titleText = slide.title || 'Título';
      const titleColor = titleStyles.color;
      const titleWeight = titleStyles.fontWeight;
      
      // Handle title highlight if present
      if (slide.fontSettings?.titleHighlight) {
        const accentColor = slide.colorPalette?.accentColor || '#3b82f6';
        const highlightOpacity = slide.fontSettings?.titleHighlightOpacity || 1;
        
        // Convert hex to rgba
        const r = parseInt(accentColor.slice(1, 3), 16);
        const g = parseInt(accentColor.slice(3, 5), 16);
        const b = parseInt(accentColor.slice(5, 7), 16);
        
        // Set font for measurement
        ctx.font = `${titleWeight} ${titleFontSize}px ${titleFont}, Arial, sans-serif`;
        
        // Split title into lines and draw background for each line
        const titleLines = wrapText(ctx, titleText, titleX, height * titleRelativeTop + titleFontSize, width - 120, titleFontSize * 1.2);
        
        // Draw background for each line individually (inline style)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${highlightOpacity})`;
        titleLines.forEach(line => {
          const lineMetrics = ctx.measureText(line.text.trim());
          const lineWidth = lineMetrics.width;
          const padding = 16; // 16px padding horizontal
          const verticalPadding = 8; // 8px padding vertical
          
          // Calculate background position for this line
          let lineBgX = titleX - lineWidth / 2 - padding;
          if (textAlign === 'left') lineBgX = titleX - padding;
          else if (textAlign === 'right') lineBgX = titleX - lineWidth - padding;
          
          // Draw rounded rectangle background for this line
          const bgY = line.y - titleFontSize + verticalPadding;
          const bgWidth = lineWidth + (padding * 2);
          const bgHeight = titleFontSize + (verticalPadding * 2);
          const borderRadius = 8;
          
          // Draw rounded rectangle
          ctx.beginPath();
          ctx.moveTo(lineBgX + borderRadius, bgY);
          ctx.lineTo(lineBgX + bgWidth - borderRadius, bgY);
          ctx.quadraticCurveTo(lineBgX + bgWidth, bgY, lineBgX + bgWidth, bgY + borderRadius);
          ctx.lineTo(lineBgX + bgWidth, bgY + bgHeight - borderRadius);
          ctx.quadraticCurveTo(lineBgX + bgWidth, bgY + bgHeight, lineBgX + bgWidth - borderRadius, bgY + bgHeight);
          ctx.lineTo(lineBgX + borderRadius, bgY + bgHeight);
          ctx.quadraticCurveTo(lineBgX, bgY + bgHeight, lineBgX, bgY + bgHeight - borderRadius);
          ctx.lineTo(lineBgX, bgY + borderRadius);
          ctx.quadraticCurveTo(lineBgX, bgY, lineBgX + borderRadius, bgY);
          ctx.closePath();
          ctx.fill();
        });
        
        // Set text color to white for highlighted text
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = titleColor;
      }
      
      // Draw title text
      ctx.font = `${titleWeight} ${titleFontSize}px ${titleFont}, Arial, sans-serif`;
      
      // Handle line breaks in title
      const titleLines = wrapText(ctx, titleText, titleX, height * titleRelativeTop + titleFontSize, width - 120, titleFontSize * 1.2);
      titleLines.forEach(line => {
        ctx.fillText(line.text.trim(), titleX, line.y);
      });
      
      console.log('✅ Title drawn:', titleText);

      // Draw content with exact styles from preview
      const contentText = slide.content || 'Conteúdo';
      const contentColor = contentStyles.color;
      const contentWeight = contentStyles.fontWeight;
      
      ctx.font = `${contentWeight} ${contentFontSize}px ${contentFont}, Arial, sans-serif`;
      ctx.fillStyle = contentColor;
      
      const contentY = height * contentRelativeTop + contentFontSize;
      
      // Handle line breaks in content
      const contentLines = wrapText(ctx, contentText, titleX, contentY, width - 120, contentFontSize * 1.5);
      contentLines.forEach(line => {
        ctx.fillText(line.text.trim(), titleX, line.y);
      });
      
      console.log('✅ Content drawn:', contentText);

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Could not create blob from canvas');
        }
        
        const link = document.createElement('a');
        link.download = `slide-${slideIndex + 1}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        
        // Cleanup
        URL.revokeObjectURL(link.href);
        
        console.log('✅ Download completed successfully');
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('❌ Download error:', error);
      alert('Erro ao baixar slide. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        lines.push({ text: line, y: currentY });
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    lines.push({ text: line, y: currentY });
    
    return lines;
  };

  return (
    <button
      onClick={downloadSlide}
      disabled={isDownloading}
      className={`btn btn-white btn-sm ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
      data-slide-download={slideIndex}
    >
      <Download className="w-3 h-3 mr-1" />
      {isDownloading ? 'Gerando...' : 'Baixar'}
    </button>
  );
};

export default SlideDownload;