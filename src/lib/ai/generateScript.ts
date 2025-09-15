import { generateText } from 'ai';
import { ScriptGenerationParams, GeneratedScript, Character } from './types';
import { saveUsageStats, updateFeatureUsage } from './usage';
import { getCreatorTypeContext, getCharacterContext, getPlatformContext, getOpenRouterModel } from './utils';

export async function generateScript(params: ScriptGenerationParams): Promise<GeneratedScript> {
  const { platform, contentIdea, targetDuration, targetAudience, creatorType, selectedModel, language, characterId } = params;
  
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
    
    const languageInstruction = language === 'pt' 
      ? 'IMPORTANTE: Responda SEMPRE em português brasileiro. Todo o roteiro, títulos, descrições e conteúdo devem estar em português.'
      : 'IMPORTANT: Always respond in English. All script content, titles, descriptions must be in English.';
    
    const prompt = `
${languageInstruction}

${characterContext}

${language === 'pt' 
  ? `Você é um roteirista especializado em ${platform} para canais do tipo "${creatorType}".
${character ? `
VOCÊ DEVE ESCREVER COMO: ${character.name}
PERSONALIDADE: ${character.personality}
ESTILO: ${character.communicationStyle}
ESPECIALIDADES: ${character.expertise.join(', ')}
PÚBLICO: ${character.targetAudience}
FOCO: ${character.contentFocus}

O roteiro deve soar exatamente como ${character.name} falaria, usando sua personalidade e expertise únicas.
` : ''}

Crie um roteiro completo e detalhado para a seguinte ideia: "${contentIdea}"

Especificações:
- Plataforma: ${platform}
- Duração alvo: ${targetDuration} minutos
- Tipo de canal: ${creatorType}
- Contexto: ${creatorContext}
- Formato: ${platformContext}
${targetAudience ? `- Público-alvo: ${targetAudience}` : ''}

O roteiro deve incluir:
1. Título otimizado para ${platform}
2. Gancho inicial (primeiros 15 segundos) - CRUCIAL para retenção
3. Introdução envolvente
4. 3-5 seções de conteúdo principal com transições suaves
5. Call-to-action estratégico
6. Duração estimada realista
7. 5-6 dicas específicas de engajamento

IMPORTANTE: 
- Seja específico e detalhado
- Inclua momentos de interação com a audiência
- Adicione sugestões de elementos visuais quando relevante
- Foque na retenção de audiência
${character ? `- ESCREVA COMO ${character.name}: use sua personalidade, estilo e expertise em cada palavra!` : ''}`
  : `You are a scriptwriter specialized in ${platform} for ${creatorType} channels.
${character ? `
YOU MUST WRITE AS: ${character.name}
PERSONALITY: ${character.personality}
STYLE: ${character.communicationStyle}
EXPERTISE: ${character.expertise.join(', ')}
AUDIENCE: ${character.targetAudience}
FOCUS: ${character.contentFocus}

The script must sound exactly like ${character.name} would speak, using their unique personality and expertise.
` : ''}

Create a complete and detailed script for the following idea: "${contentIdea}"

Specifications:
- Platform: ${platform}
- Target duration: ${targetDuration} minutes
- Channel type: ${creatorType}
- Context: ${creatorContext}
- Format: ${platformContext}
${targetAudience ? `- Target audience: ${targetAudience}` : ''}

The script should include:
1. Title optimized for ${platform}
2. Initial hook (first 15 seconds) - CRUCIAL for retention
3. Engaging introduction
4. 3-5 main content sections with smooth transitions
5. Strategic call-to-action
6. Realistic estimated duration
7. 5-6 specific engagement tips

IMPORTANT: 
- Be specific and detailed
- Include audience interaction moments
- Add visual element suggestions when relevant
- Focus on audience retention
${character ? `- WRITE AS ${character.name}: use their personality, style and expertise in every word!` : ''}`}

Responda APENAS com JSON válido:
{
  "title": "título otimizado",
  "hook": "gancho inicial detalhado",
  "introduction": "introdução completa",
  "mainContent": [
    {
      "section": "nome da seção",
      "content": "conteúdo detalhado da seção"
    }
  ],
  "callToAction": "call-to-action específico",
  "estimatedDuration": "X minutos",
  "engagementTips": ["dica específica 1", "dica específica 2"]
}
`;

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
      maxTokens: 4000,
    });

    // Fixed cost per request: $0.12 and 120 credits
    const fixedCost = 0.12;
    const requestCount = 1; // 1 request per script generation
    
    // Save usage stats with fixed cost
    saveUsageStats({
      tokensUsed: requestCount,
      cost: fixedCost,
      model: selectedModel,
      timestamp: new Date().toISOString()
    });
    
    updateFeatureUsage('scripts', requestCount);
    
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
    console.error('Error generating script:', error);
    throw new Error(`Erro ao gerar roteiro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}