import { CarouselGenerationParams, GeneratedCarousel, Character } from './types';
import { saveUsageStats, updateFeatureUsage } from './usage';
import { getCreatorTypeContext, getCharacterContext, getOpenRouterModel } from './utils';
import { generateText } from 'ai';

export async function generateCarousel(params: CarouselGenerationParams): Promise<GeneratedCarousel> {
  const { topic, slideCount, toneOfVoice, targetAudience, creatorType, selectedModel, language, characterId } = params;
  
  try {
    const model = await getOpenRouterModel(selectedModel);
    const creatorContext = getCreatorTypeContext(creatorType);
    
    // Get character context if character is selected
    let character: Character | null = null;
    if (characterId) {
      try {
        const characters = JSON.parse(localStorage.getItem('delaluna_characters') || '[]');
        character = characters.find((c: Character) => c.id === characterId) || null;
      } catch (error) {
        console.error('Error loading character:', error);
      }
    }
    const characterContext = getCharacterContext(character);
    
    const getToneContext = (tone?: string) => {
      const toneContexts = {
        casual: language === 'pt' ? 'tom descontraído, amigável e acessível' : 'relaxed, friendly and approachable tone',
        professional: language === 'pt' ? 'tom formal, confiável e respeitoso' : 'formal, trustworthy and respectful tone',
        humorous: language === 'pt' ? 'tom divertido, engraçado e bem-humorado' : 'fun, entertaining and humorous tone',
        inspirational: language === 'pt' ? 'tom motivador, positivo e inspirador' : 'motivating, positive and inspiring tone',
        educational: language === 'pt' ? 'tom informativo, didático e esclarecedor' : 'informative, instructive and educational tone',
        conversational: language === 'pt' ? 'tom de conversa entre amigos, íntimo e pessoal' : 'friendly conversation tone, intimate and personal',
        authoritative: language === 'pt' ? 'tom de especialista, confiante e autoritativo' : 'expert, confident and authoritative tone',
        storytelling: language === 'pt' ? 'tom narrativo, envolvente e dramático' : 'storytelling, engaging and dramatic tone',
        trendy: language === 'pt' ? 'tom moderno, atual e na moda' : 'trendy, current and hip tone'
      };
      return toneContexts[tone as keyof typeof toneContexts] || toneContexts.casual;
    };
    
    const toneContext = getToneContext(toneOfVoice);
    
    const languageInstruction = language === 'pt' 
      ? 'IMPORTANTE: Responda SEMPRE em português brasileiro. Todo o conteúdo, títulos, descrições devem estar em português.'
      : 'IMPORTANT: Always respond in English. All content, titles, descriptions must be in English.';
    
    const prompt = `
${languageInstruction}

${characterContext}

${language === 'pt' 
  ? `Você é um especialista em criação de carrosséis para Instagram especializado em ${creatorType}.
${character ? `
VOCÊ DEVE ESCREVER COMO: ${character.name}
PERSONALIDADE: ${character.personality}
ESTILO: ${character.communicationStyle}
ESPECIALIDADES: ${character.expertise.join(', ')}
PÚBLICO: ${character.targetAudience}
FOCO: ${character.contentFocus}

O carrossel deve soar exatamente como ${character.name} falaria, usando sua personalidade e expertise únicas.
` : ''}

Crie um carrossel completo para Instagram sobre: "${topic}"

Especificações:
- Número de slides: ${slideCount}
- Tipo de criador: ${creatorType}
- Contexto: ${creatorContext}
- Tom de voz: ${toneContext}
${targetAudience ? `- Público-alvo: ${targetAudience}` : ''}

Crie slides envolventes e educativos que mantenham a audiência interessada.
${character ? `ESCREVA COMO ${character.name}: use sua personalidade e expertise em cada slide!` : ''}`
  : `You are an Instagram carousel creation expert specialized in ${creatorType}.
${character ? `
YOU MUST WRITE AS: ${character.name}
PERSONALITY: ${character.personality}
STYLE: ${character.communicationStyle}
EXPERTISE: ${character.expertise.join(', ')}
AUDIENCE: ${character.targetAudience}
FOCUS: ${character.contentFocus}

The carousel must sound exactly like ${character.name} would speak, using their unique personality and expertise.
` : ''}

Create a complete Instagram carousel about: "${topic}"

Specifications:
- Number of slides: ${slideCount}
- Creator type: ${creatorType}
- Context: ${creatorContext}
- Tone of voice: ${toneContext}
${targetAudience ? `- Target audience: ${targetAudience}` : ''}

Create engaging and educational slides that keep the audience interested.
${character ? `WRITE AS ${character.name}: use their personality and expertise in every slide!` : ''}`}

Responda APENAS com JSON válido:
{
  "title": "título do carrossel",
  "description": "descrição para o post",
  "slides": [
    {
      "id": 1,
      "title": "título do slide",
      "content": "conteúdo principal",
      "visualSuggestion": "sugestão visual",
      "layout": "text-center"
    }
  ],
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]
}
`;

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.8,
      maxTokens: 4000,
    });

    // Fixed cost per request: $0.12 and 120 credits
    const fixedCost = 0.12;
    const requestCount = 1;
    
    // Save usage stats with fixed cost
    saveUsageStats({
      tokensUsed: requestCount,
      cost: fixedCost,
      model: selectedModel,
      timestamp: new Date().toISOString()
    });
    
    // Trigger immediate UI update
    window.dispatchEvent(new Event('usage-updated'));
    
    // Clean the response to ensure valid JSON
    let cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Extract JSON object between first { and last }
    const firstBrace = cleanedText.indexOf('{');
    const lastBrace = cleanedText.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
    }
    
    // Remove markdown formatting characters that could break JSON
    cleanedText = cleanedText
      .replace(/\*\*/g, '')  // Remove bold markdown
      .replace(/(?<!")(\*)(?!")/g, '')  // Remove italic markdown (but not inside strings)
      .replace(/__/g, '')    // Remove bold underscores
      .replace(/(?<!")[_](?!")/g, '');  // Remove italic underscores (but not inside strings)
    
    const response = JSON.parse(cleanedText);
    
    return {
      ...response,
      model: selectedModel,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating carousel:', error);
    throw new Error(`Erro ao gerar carrossel: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}