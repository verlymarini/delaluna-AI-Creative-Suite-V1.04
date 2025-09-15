import { generateText } from 'ai';
import { IdeaGenerationParams, GeneratedIdea, Character } from './types';
import { saveUsageStats, updateFeatureUsage } from './usage';
import { getCreatorTypeContext, getCharacterContext, getPlatformContext, getOpenRouterModel } from './utils';

export async function generateIdeas(params: IdeaGenerationParams): Promise<GeneratedIdea[]> {
  const { platform, contentTopic, audienceData, creatorType, selectedModel, language, toneOfVoice, characterId } = params;
  
  try {
    const model = await getOpenRouterModel(selectedModel);
    const creatorContext = getCreatorTypeContext(creatorType);
    const platformContext = getPlatformContext(platform);
    
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
      ? 'IMPORTANTE: Responda SEMPRE em português brasileiro. Todas as ideias, títulos, descrições e conteúdo devem estar em português.'
      : 'IMPORTANT: Always respond in English. All ideas, titles, descriptions and content must be in English.';
    
    const prompt = `
${languageInstruction}

${characterContext}

${language === 'pt' 
  ? `Você é um especialista em criação de conteúdo para ${platform} especializado em ${creatorType}.

Gere 4 ideias criativas e envolventes sobre o tópico "${contentTopic}" para um canal do tipo "${creatorType}".

Contexto do criador: ${creatorContext}
Contexto da plataforma: ${platformContext}
Tom de voz desejado: ${toneContext}
${audienceData ? `Dados da audiência: ${audienceData}` : ''}

Para cada ideia, forneça (seguindo o tom de voz especificado):
1. Título chamativo e otimizado para ${platform}
2. Descrição detalhada e envolvente (2-3 frases)
3. Score de engajamento estimado (70-95)
4. Nível de dificuldade de produção (1-5)
5. 3-4 tags relevantes
6. Gancho inicial para capturar atenção nos primeiros 5 segundos
7. 4-5 pontos-chave específicos a abordar no conteúdo

IMPORTANTE: Seja específico sobre "${contentTopic}", use o ${toneContext} e crie ideias únicas que se destacam no ${platform}.`
  : `You are a content creation expert for ${platform} specialized in ${creatorType}.

Generate 4 creative and engaging ideas about the topic "${contentTopic}" for a ${creatorType} channel.

Creator context: ${creatorContext}
Platform context: ${platformContext}
Desired tone of voice: ${toneContext}
${audienceData ? `Audience data: ${audienceData}` : ''}

For each idea, provide (following the specified tone of voice):
1. Catchy title optimized for ${platform}
2. Detailed and engaging description (2-3 sentences)
3. Estimated engagement score (70-95)
4. Production difficulty level (1-5)
5. 3-4 relevant tags
6. Initial hook to capture attention in the first 5 seconds
7. 4-5 specific key points to address in the content

IMPORTANT: Be specific about "${contentTopic}", use the ${toneContext} and create unique ideas that stand out on ${platform}.`}

Responda APENAS com JSON válido no formato:
{
  "ideas": [
    {
      "title": "título específico e chamativo",
      "description": "descrição detalhada e envolvente",
      "engagement": 85,
      "difficulty": 3,
      "tags": ["tag1", "tag2", "tag3", "tag4"],
      "hook": "gancho inicial específico",
      "keyPoints": ["ponto específico 1", "ponto específico 2", "ponto específico 3", "ponto específico 4"]
    }
  ]
}
`;

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.8,
      maxTokens: 3000,
    });

    // Fixed cost per request: $0.12 and 120 credits
    const fixedCost = 0.12;
    const requestCount = 1; // 1 request per idea generation
    
    // Save usage stats with fixed cost
    saveUsageStats({
      tokensUsed: requestCount,
      cost: fixedCost,
      model: selectedModel,
      timestamp: new Date().toISOString()
    });
    
    updateFeatureUsage('ideas', requestCount);

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
    
    return response.ideas.map((idea: any, index: number) => ({
      id: Date.now() + index,
      ...idea,
      model: selectedModel,
      createdAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error generating ideas:', error);
    throw new Error(`Erro ao gerar ideias: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}