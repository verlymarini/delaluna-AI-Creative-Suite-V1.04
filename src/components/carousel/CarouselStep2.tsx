import React, { useState } from 'react';
import { 
  ArrowLeft,
  Download,
  Calendar,
  Plus,
  Trash2,
  GripVertical
} from 'lucide-react';
import { type GeneratedCarousel } from '../../lib/ai';
import TypographySettings from './TypographySettings';
import ColorPaletteSettings from './ColorPaletteSettings';
import SlidePreviewEditor from './SlidePreviewEditor';

interface CarouselStep2Props {
  carousel: GeneratedCarousel;
  onCarouselUpdate: (carousel: GeneratedCarousel) => void;
  onPrevious: () => void;
  onSchedule: () => void;
}

const CarouselStep2: React.FC<CarouselStep2Props> = ({ 
  carousel, 
  onCarouselUpdate,
  onPrevious,
  onSchedule
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [draggedSlide, setDraggedSlide] = useState<number | null>(null);
  const [dragOverSlide, setDragOverSlide] = useState<number | null>(null);
  const [dragOverTrash, setDragOverTrash] = useState(false);

  const navigateToSlide = (newSlide: number) => {
    if (newSlide === currentSlide) return;
    
    setSlideDirection(newSlide > currentSlide ? 'right' : 'left');
    
    // Small delay to show the transition effect
    setTimeout(() => {
      setCurrentSlide(newSlide);
      setSlideDirection(null);
    }, 150);
  };

  const addNewSlide = () => {
    const newSlide = {
      id: carousel.slides.length + 1,
      title: 'Novo Slide',
      content: 'Clique para editar o conteúdo...',
      visualSuggestion: 'Slide personalizado',
      layout: 'text-center' as const,
      fontSettings: {
        titleFont: carousel.slides[0]?.fontSettings?.titleFont || 'Inter',
        contentFont: carousel.slides[0]?.fontSettings?.contentFont || 'Inter',
        titleSize: carousel.slides[0]?.fontSettings?.titleSize || 'large' as const,
        contentSize: carousel.slides[0]?.fontSettings?.contentSize || 'medium' as const,
        alignment: carousel.slides[0]?.fontSettings?.alignment || 'center' as const,
        titleUppercase: carousel.slides[0]?.fontSettings?.titleUppercase || false,
        contentUppercase: carousel.slides[0]?.fontSettings?.contentUppercase || false,
        lineHeight: carousel.slides[0]?.fontSettings?.lineHeight || 'normal' as const,
        titleHighlight: carousel.slides[0]?.fontSettings?.titleHighlight || false,
        titleHighlightOpacity: carousel.slides[0]?.fontSettings?.titleHighlightOpacity || 1
      },
      colorPalette: {
        background: carousel.slides[0]?.colorPalette?.background || '#ffffff',
        titleColor: carousel.slides[0]?.colorPalette?.titleColor || '#1f2937',
        contentColor: carousel.slides[0]?.colorPalette?.contentColor || '#6b7280',
        accentColor: carousel.slides[0]?.colorPalette?.accentColor || '#3b82f6'
      }
    };

    const updatedCarousel = {
      ...carousel,
      slides: [...carousel.slides, newSlide]
    };

    onCarouselUpdate(updatedCarousel);
    setCurrentSlide(carousel.slides.length); // Navigate to the new slide
  };

  const deleteSlide = (slideIndex: number) => {
    if (carousel.slides.length <= 1) {
      alert('Você precisa ter pelo menos um slide.');
      return;
    }

    const updatedSlides = carousel.slides.filter((_, index) => index !== slideIndex);
    const updatedCarousel = {
      ...carousel,
      slides: updatedSlides
    };

    onCarouselUpdate(updatedCarousel);

    // Adjust current slide if necessary
    if (currentSlide >= updatedSlides.length) {
      setCurrentSlide(updatedSlides.length - 1);
    } else if (currentSlide > slideIndex) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleDragStart = (e: React.DragEvent, slideIndex: number) => {
    setDraggedSlide(slideIndex);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, slideIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlide(slideIndex);
  };

  const handleDragLeave = () => {
    setDragOverSlide(null);
  };

  const handleTrashDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTrash(true);
  };

  const handleTrashDragLeave = () => {
    setDragOverTrash(false);
  };

  const handleTrashDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (draggedSlide !== null && carousel.slides.length > 1) {
      deleteSlide(draggedSlide);
    }
    
    setDraggedSlide(null);
    setDragOverTrash(false);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedSlide === null || draggedSlide === dropIndex) {
      setDraggedSlide(null);
      setDragOverSlide(null);
      return;
    }

    const updatedSlides = [...carousel.slides];
    const draggedSlideData = updatedSlides[draggedSlide];
    
    // Remove the dragged slide
    updatedSlides.splice(draggedSlide, 1);
    
    // Insert at new position
    const insertIndex = draggedSlide < dropIndex ? dropIndex - 1 : dropIndex;
    updatedSlides.splice(insertIndex, 0, draggedSlideData);

    const updatedCarousel = {
      ...carousel,
      slides: updatedSlides
    };

    onCarouselUpdate(updatedCarousel);

    // Update current slide to follow the moved slide
    if (currentSlide === draggedSlide) {
      setCurrentSlide(insertIndex);
    } else if (currentSlide > draggedSlide && currentSlide <= insertIndex) {
      setCurrentSlide(currentSlide - 1);
    } else if (currentSlide < draggedSlide && currentSlide >= insertIndex) {
      setCurrentSlide(currentSlide + 1);
    }

    setDraggedSlide(null);
    setDragOverSlide(null);
  };

  const downloadAllSlides = async () => {
    // Add loading state for bulk download
    const downloadButton = document.querySelector('[data-download-all]') as HTMLButtonElement;
    if (downloadButton) {
      downloadButton.disabled = true;
      downloadButton.textContent = 'Baixando...';
    }
    
    for (let i = 0; i < carousel.slides.length; i++) {
      console.log(`📥 Downloading slide ${i + 1}/${carousel.slides.length}...`);
      
      // Trigger individual slide download
      const downloadButton = document.querySelector(`[data-slide-download="${i}"]`) as HTMLButtonElement;
      if (downloadButton) {
        downloadButton.click();
        // Wait for download to complete before next one
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    // Reset button state
    if (downloadButton) {
      downloadButton.disabled = false;
      downloadButton.textContent = 'Baixar Todos';
    }
    
    console.log('✅ All slides downloaded successfully');
  };

  return (
    <div className="space-content">
      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onPrevious}
          className="btn btn-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </button>
        <div className="flex space-x-2">
          <button
            onClick={downloadAllSlides}
            data-download-all
            className="btn btn-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar Todos
          </button>
          <button 
            onClick={onSchedule}
            className="btn btn-primary"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Agendar Post
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Slides Editor */}
        <div>
          {/* Slide Navigation */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Preview e Edição</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateToSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <span className="text-sm text-gray-600 px-2">
                {currentSlide + 1} / {carousel.slides.length}
              </span>
              <button
                onClick={() => navigateToSlide(Math.min(carousel.slides.length - 1, currentSlide + 1))}
                disabled={currentSlide === carousel.slides.length - 1}
                className="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
          
          {/* Slide Management */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3 relative">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {carousel.slides.length} slide{carousel.slides.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={addNewSlide}
                  className="btn btn-secondary btn-sm"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Novo Slide
                </button>
              </div>
              
              {/* Drag to Delete Trash Area */}
              {draggedSlide !== null && carousel.slides.length > 1 && (
                <div
                  onDragOver={handleTrashDragOver}
                  onDragLeave={handleTrashDragLeave}
                  onDrop={handleTrashDrop}
                  className={`flex items-center justify-center w-10 h-8 rounded-lg border-2 border-dashed transition-all ${
                    dragOverTrash 
                      ? 'border-red-500 bg-red-50 text-red-600' 
                      : 'border-gray-300 bg-gray-50 text-gray-400'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </div>
              )}
            </div>
            
            {/* Slide Thumbnails with Drag & Drop */}
            <div className="flex flex-wrap gap-1">
              {carousel.slides.map((slide, index) => (
                <div
                  key={`${slide.id}-${index}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`relative group cursor-move transition-all ${
                    index === currentSlide 
                      ? 'ring-2 ring-black' 
                      : 'hover:ring-2 hover:ring-gray-300'
                  } ${
                    dragOverSlide === index && draggedSlide !== index
                      ? 'ring-2 ring-blue-400 bg-blue-50'
                      : ''
                  } ${
                    draggedSlide === index
                      ? 'opacity-50 scale-95'
                      : ''
                  }`}
                >
                  {/* Drag Handle */}
                  <div className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <GripVertical className="w-2 h-2 text-gray-400" />
                  </div>
                  
                  {/* Slide Thumbnail */}
                  <div
                    onClick={() => navigateToSlide(index)}
                    className="w-8 h-10 border border-gray-200 rounded flex items-center justify-center text-center bg-white"
                    style={{
                      backgroundColor: slide.colorPalette?.background || '#ffffff'
                    }}
                  >
                    <div 
                      className="text-xs font-bold"
                      style={{
                        color: slide.colorPalette?.titleColor || '#000000'
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Simple Slide Indicators */}
          <div className="flex justify-center space-x-2 mb-4">
            {carousel.slides.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-black' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Current Slide Editor with Transition */}
          <div className="relative overflow-hidden">
            <div 
              className={`transition-transform duration-300 ease-in-out ${
                slideDirection === 'left' ? '-translate-x-full opacity-0' :
                slideDirection === 'right' ? 'translate-x-full opacity-0' :
                'translate-x-0 opacity-100'
              }`}
            >
              <SlidePreviewEditor
                carousel={carousel}
                onCarouselUpdate={onCarouselUpdate}
                slideIndex={currentSlide}
              />
            </div>
          </div>
        </div>

        {/* Typography Settings Sidebar */}
        <div className="space-y-4">
          {/* Color Palette Settings - Moved here */}
          <ColorPaletteSettings 
            carousel={carousel}
            onCarouselUpdate={onCarouselUpdate}
          />
          
          <TypographySettings 
            carousel={carousel}
            onCarouselUpdate={onCarouselUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default CarouselStep2;