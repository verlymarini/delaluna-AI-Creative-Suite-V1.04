import { Character } from './types';

export const getCreatorTypeContext = (creatorType: string) => {
  const contexts = {
    influencer: 'lifestyle, reviews, entretenimento, tendências, dicas pessoais, moda, beleza',
    music: 'análises musicais, reviews de álbuns, descobertas musicais, história da música, artistas emergentes',
    expert: 'conteúdo educacional, tutoriais, explicações técnicas, conhecimento especializado, cursos',
    dark: 'mistério, true crime, histórias sombrias, investigações, narrativas envolventes, casos reais'
  };
  return contexts[creatorType as keyof typeof contexts] || contexts.influencer;
};

export const getCharacterContext = (character: Character | null) => {
  if (!character) return '';
  
  return `
CHARACTER PERSONA - EMBODY THIS COMPLETELY:
- Character Name: ${character.name}
- Character Description: ${character.description}
- Personality: ${character.personality}
- Communication Style: ${character.communicationStyle}
- Expertise Areas: ${character.expertise.join(', ')}
- Target Audience: ${character.targetAudience}
- Content Focus: ${character.contentFocus}

CRITICAL INSTRUCTIONS:
1. Write EVERYTHING as if you ARE this character
2. Use their exact communication style: ${character.communicationStyle}
3. Focus on their expertise: ${character.expertise.join(', ')}
4. Target their specific audience: ${character.targetAudience}
5. Reflect their personality in every word: ${character.personality}
6. Stay within their content focus: ${character.contentFocus}
7. The character's voice should be unmistakable in the output
`;
};

export const getPlatformContext = (platform: string) => {
  return platform === 'youtube' 
    ? 'vídeos longos (5-20 min), thumbnails chamativas, títulos otimizados para SEO, descrições detalhadas'
    : 'conteúdo visual rápido, stories, reels de 15-60 segundos, hashtags estratégicas, formato vertical';
};

export const getOpenRouterModel = async (selectedModel: string) => {
  // Get API key from localStorage instead of environment variables
  let openrouterKey = '';
  
  try {
    const savedKeys = localStorage.getItem('delaluna_api_keys');
    if (savedKeys) {
      const keys = JSON.parse(savedKeys);
      const activeKey = keys.find((key: any) => key.status === 'active');
      if (activeKey) {
        openrouterKey = activeKey.key.trim();
      }
    }
  } catch (error) {
    console.error('Error loading API key from localStorage:', error);
  }
  
  // Fallback to environment variable if no key in localStorage
  if (!openrouterKey) {
    openrouterKey = import.meta.env.VITE_OPENROUTER_API_KEY?.trim() || '';
  }
  
  if (!openrouterKey || openrouterKey === '' || openrouterKey === 'your_openrouter_api_key_here') {
    throw new Error('OpenRouter API key not configured. Please add your API key in the API Key Management section.');
  }

  const { createOpenAI } = await import('@ai-sdk/openai');
  
  const openrouter = createOpenAI({
    apiKey: openrouterKey,
    baseURL: 'https://openrouter.ai/api/v1',
    headers: {
      'HTTP-Referer': 'https://delaluna.ai',
      'X-Title': 'Delaluna AI Creator Platform'
    }
  });
  
  // Map model IDs to OpenRouter paths
  const modelMap: Record<string, string> = {
    'qwen/qwen3-235b-a22b:free': 'qwen/qwen3-235b-a22b:free',
    'deepseek-r1': 'deepseek/deepseek-r1-0528:free',
    'deepseek': 'deepseek/deepseek-chat',
    'claude-sonnet': 'anthropic/claude-3.5-sonnet',
    'gpt-4': 'openai/gpt-4-turbo',
    'llama': 'meta-llama/llama-3.1-70b-instruct',
    'grok': 'x-ai/grok-beta',
    'gemini': 'google/gemini-2.0-flash-exp'
  };
  
  // Handle custom models
  if (selectedModel.startsWith('custom-')) {
    try {
      const customModels = JSON.parse(localStorage.getItem('delaluna_custom_models') || '[]');
      const customModel = customModels.find((m: any) => m.id === selectedModel);
      if (customModel && customModel.openrouterPath) {
        return openrouter(customModel.openrouterPath);
      }
    } catch (error) {
      console.error('Error loading custom model:', error);
    }
  }
  
  const modelPath = modelMap[selectedModel] || modelMap['claude-sonnet'];
  return openrouter(modelPath);
};