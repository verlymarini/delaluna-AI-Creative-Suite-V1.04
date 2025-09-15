export interface IdeaGenerationParams {
  platform: 'youtube' | 'instagram';
  contentTopic: string;
  audienceData?: string;
  creatorType: string;
  selectedModel: string;
  language: 'en' | 'pt';
  toneOfVoice?: string;
  characterId?: string;
}

export interface ScriptGenerationParams {
  platform: 'youtube' | 'instagram';
  contentIdea: string;
  targetDuration: string;
  targetAudience?: string;
  creatorType: string;
  selectedModel: string;
  language: 'en' | 'pt';
  toneOfVoice?: string;
  characterId?: string;
}

export interface GeneratedIdea {
  id: number;
  title: string;
  description: string;
  engagement: number;
  difficulty: number;
  tags: string[];
  hook?: string;
  keyPoints?: string[];
  model?: string;
  createdAt?: string;
}

export interface GeneratedScript {
  title: string;
  hook: string;
  introduction: string;
  mainContent: Array<{
    section: string;
    content: string;
  }>;
  callToAction: string;
  estimatedDuration: string;
  engagementTips: string[];
  model?: string;
  createdAt?: string;
}

interface CarouselSlide {
  id: number;
  title: string;
  content: string;
  visualSuggestion: string;
  layout: 'text-only' | 'text-left' | 'text-center' | 'text-bottom';
  fontSettings?: {
    titleFont: string;
    contentFont: string;
    titleSize: 'small' | 'medium' | 'large';
    contentSize: 'small' | 'medium' | 'large';
    alignment: 'left' | 'center' | 'right';
    titleUppercase: boolean;
    contentUppercase: boolean;
    lineHeight: 'compact' | 'normal' | 'loose';
    titleHighlight?: boolean;
  };
  colorPalette?: {
    background: string;
    titleColor: string;
    contentColor: string;
    accentColor: string;
  };
  backgroundImage?: string;
  imagePosition?: {
    x: number;
    y: number;
  };
}

export interface GeneratedCarousel {
  title: string;
  description: string;
  slides: CarouselSlide[];
  hashtags: string[];
  model?: string;
  createdAt?: string;
}

export interface CarouselGenerationParams {
  topic: string;
  slideCount: number;
  toneOfVoice: string;
  targetAudience?: string;
  creatorType: string;
  selectedModel: string;
  language: 'en' | 'pt';
  characterId?: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  personality: string;
  expertise: string[];
  communicationStyle: string;
  contentFocus: string;
  targetAudience: string;
  createdAt: string;
}

export interface UsageStats {
  tokensUsed: number;
  cost: number;
  model: string;
  timestamp: string;
}