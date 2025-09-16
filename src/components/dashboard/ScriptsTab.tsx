import React, { useState } from 'react';
import { 
  FileText, 
  Wand2, 
  Youtube, 
  Instagram,
  Music,
  Clock,
  Users,
  Copy,
  Download,
  RefreshCw,
  AlertCircle,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Plus,
  X,
  Edit3,
  Save
} from 'lucide-react';
import { generateScript, type GeneratedScript } from '../../lib/ai';
import { type GeneratedIdea } from '../../lib/ai';
import { Character } from '../../lib/ai';

import { getUsageStats } from '../../lib/ai';

interface ScriptsTabProps {
  selectedModel: string;
  creatorType: string;
  language: 'pt' | 'en';
  prefilledIdea?: GeneratedIdea | null;
  onScheduleScript: (script: GeneratedScript) => void;
  onBackToIdeas?: () => void;
  scriptsHistory: GeneratedScript[];
  onAddToHistory: (script: GeneratedScript) => void;
  onTabChange: (tab: string) => void;
}

const ScriptsTab: React.FC<ScriptsTabProps> = ({ 
  selectedModel, 
  creatorType, 
  language,
  prefilledIdea, 
  onScheduleScript,
  onBackToIdeas,
  scriptsHistory,
  onAddToHistory,
  onTabChange
}) => {
  const getModelDisplayName = (modelId: string) => {
    // Check if it's a custom model
    if (modelId.startsWith('custom-')) {
      try {
        const customModels = JSON.parse(localStorage.getItem('delaluna_custom_models') || '[]');
        const customModel = customModels.find((m: any) => m.id === modelId);
        return customModel ? customModel.name : modelId;
      } catch {
        return modelId;
      }
    }
    
    // Default model names
    const modelNames: Record<string, string> = {
      'qwen/qwen3-235b-a22b:free': 'Qwen 3 235B Free',
      'deepseek-r1': 'DeepSeek R1 Free',
      'deepseek': 'DeepSeek Chat V3',
      'claude-sonnet': 'Claude Sonnet 4',
      'gpt-4': 'GPT-4.1',
      'llama': 'Llama 4 Maverick',
      'grok': 'Grok 4',
      'gemini': 'Gemini 2.5 Flash'
    };
    
    return modelNames[modelId] || modelId;
  };

  const [scriptType, setScriptType] = useState<'youtube' | 'instagram'>('instagram');
  const [contentIdea, setContentIdea] = useState(prefilledIdea?.title || '');
  const [targetDuration, setTargetDuration] = useState('5-10');
  const [targetAudience, setTargetAudience] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [error, setError] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);
  const [editingScript, setEditingScript] = useState<GeneratedScript | null>(null);
  const [editedScript, setEditedScript] = useState<GeneratedScript | null>(null);
  
  // Force update usage stats when script is generated
  React.useEffect(() => {
    if (generatedScript) {
      // Small delay to ensure usage stats are updated after API call
      setTimeout(() => {
        window.dispatchEvent(new Event('usage-updated'));
      }, 1000);
    }
  }, [generatedScript]);

  // Load characters on component mount
  React.useEffect(() => {
    try {
      const storedCharacters = JSON.parse(localStorage.getItem('delaluna_characters') || '[]');
      setCharacters(storedCharacters);
    } catch (error) {
      console.error('Error loading characters:', error);
    }
  }, []);

  React.useEffect(() => {
    if (prefilledIdea) {
      // Create a comprehensive content idea from the generated idea
      const fullContentIdea = `${prefilledIdea.title}

${prefilledIdea.description}

${prefilledIdea.hook ? `Gancho: ${prefilledIdea.hook}` : ''}

${prefilledIdea.keyPoints && prefilledIdea.keyPoints.length > 0 ? 
  `Pontos-chave:\n${prefilledIdea.keyPoints.map(point => `• ${point}`).join('\n')}` : 
  ''
}`;
      
      setContentIdea(fullContentIdea.trim());
      setScriptType('instagram');
    }
  }, [prefilledIdea]);

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const script = await generateScript({
        platform: scriptType,
        contentIdea,
        targetDuration,
        targetAudience,
        creatorType,
        selectedModel,
        language: 'pt',
        toneOfVoice: characters.find(c => c.id === selectedCharacter)?.communicationStyle || 'casual',
        characterId: selectedCharacter || undefined
      });
      
      setGeneratedScript(script);
      onAddToHistory(script);
      
      // Trigger immediate usage stats update in Sidebar
      window.dispatchEvent(new Event('usage-updated'));
    } catch (err) {
      setError('Erro ao gerar roteiro. Verifique sua API key e tente novamente.');
      console.error('Error generating script:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyScriptToClipboard = (script: GeneratedScript) => {
    const scriptText = `
${script.title}

🎣 GANCHO:
${script.hook}

👋 INTRODUÇÃO:
${script.introduction}

📋 CONTEÚDO PRINCIPAL:
${script.mainContent.map((section, index) => `
${index + 1}. ${section.section}
${section.content}
`).join('')}

📢 CALL TO ACTION:
${script.callToAction}

💡 DICAS DE ENGAJAMENTO:
${script.engagementTips.map((tip, index) => `${index + 1}. ${tip}`).join('\n')}

⏱️ Duração estimada: ${script.estimatedDuration}
    `.trim();
    
    navigator.clipboard.writeText(scriptText).then(() => {
      // Show success feedback
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<svg class="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Copiado!';
        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2000);
      }
    }).catch(err => {
      console.error('Erro ao copiar:', err);
      alert('Erro ao copiar roteiro');
    });
  };

  const downloadScriptAsPDF = async (script: GeneratedScript) => {
    try {
      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Por favor, permita pop-ups para baixar o PDF');
        return;
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${script.title}</title>
          <style>
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
              background: white;
            }
            h1 {
              color: #1f2937;
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 30px;
              text-align: center;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 15px;
            }
            h2 {
              color: #374151;
              font-size: 20px;
              font-weight: 600;
              margin-top: 30px;
              margin-bottom: 15px;
              padding: 10px 15px;
              background: #f3f4f6;
              border-left: 4px solid #3b82f6;
            }
            h3 {
              color: #4b5563;
              font-size: 16px;
              font-weight: 600;
              margin-top: 25px;
              margin-bottom: 10px;
            }
            p {
              margin-bottom: 15px;
              text-align: justify;
            }
            .section {
              margin-bottom: 25px;
              padding: 20px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              background: #fafafa;
            }
            .hook {
              background: #fef3c7;
              border-left-color: #f59e0b;
            }
            .intro {
              background: #dbeafe;
              border-left-color: #3b82f6;
            }
            .content {
              background: #f0f9ff;
              border-left-color: #0ea5e9;
            }
            .cta {
              background: #dcfce7;
              border-left-color: #22c55e;
            }
            .tips {
              background: #fae8ff;
              border-left-color: #a855f7;
            }
            ul {
              padding-left: 20px;
            }
            li {
              margin-bottom: 8px;
            }
            .meta {
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            @media print {
              body { margin: 0; padding: 20px; }
              .section { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>${script.title}</h1>
          
          <div class="section hook">
            <h2>🎣 Gancho (Primeiros 15 segundos)</h2>
            <p>${script.hook}</p>
          </div>
          
          <div class="section intro">
            <h2>👋 Introdução</h2>
            <p>${script.introduction}</p>
          </div>
          
          <div class="section content">
            <h2>📋 Conteúdo Principal</h2>
            ${script.mainContent.map((section, index) => `
              <h3>${index + 1}. ${section.section}</h3>
              <p>${section.content}</p>
            `).join('')}
          </div>
          
          <div class="section cta">
            <h2>📢 Call to Action</h2>
            <p>${script.callToAction}</p>
          </div>
          
          <div class="section tips">
            <h2>💡 Dicas de Engajamento</h2>
            <ul>
              ${script.engagementTips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
          </div>
          
          <div class="meta">
            <p><strong>Duração estimada:</strong> ${script.estimatedDuration}</p>
            <p><strong>Gerado em:</strong> ${new Date(script.createdAt || Date.now()).toLocaleDateString('pt-BR')}</p>
            ${script.model ? `<p><strong>Modelo:</strong> ${getModelDisplayName(script.model)}</p>` : ''}
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const startEditingScript = (script: GeneratedScript) => {
    setEditingScript(script);
    setEditedScript({ ...script });
  };

  const cancelEditing = () => {
    setEditingScript(null);
    setEditedScript(null);
  };

  const saveScriptDraft = () => {
    if (!editedScript) return;
    
    try {
      // Update the script in history
      const updatedHistory = scriptsHistory.map(script => 
        script.createdAt === editingScript?.createdAt ? editedScript : script
      );
      
      // Save to localStorage
      localStorage.setItem('delaluna_scripts_history', JSON.stringify(updatedHistory));
      
      // Update current script if it's the one being edited
      if (generatedScript && generatedScript.createdAt === editingScript?.createdAt) {
        setGeneratedScript(editedScript);
      }
      
      // Show success feedback
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<svg class="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Salvo!';
        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2000);
      }
      
      // Close editing mode
      setEditingScript(null);
      setEditedScript(null);
      
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
      alert('Erro ao salvar rascunho. Tente novamente.');
    }
  };

  const updateEditedScript = (field: string, value: any) => {
    if (!editedScript) return;
    
    if (field.startsWith('mainContent.')) {
      const [, index, subField] = field.split('.');
      const updatedMainContent = [...editedScript.mainContent];
      updatedMainContent[parseInt(index)] = {
        ...updatedMainContent[parseInt(index)],
        [subField]: value
      };
      setEditedScript({
        ...editedScript,
        mainContent: updatedMainContent
      });
    } else if (field === 'engagementTips') {
      setEditedScript({
        ...editedScript,
        engagementTips: value
      });
    } else {
      setEditedScript({
        ...editedScript,
        [field]: value
      });
    }
  };

  return (
    <div className="space-section pt-8">
      {/* Header */}
      <div className="space-content">
        {prefilledIdea && onBackToIdeas && (
          <button
            onClick={onBackToIdeas}
            className="btn btn-ghost mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Ideias
          </button>
        )}
        
        <div className="flex items-center space-x-3 mb-4 bg-white border border-gray-200 rounded-lg p-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">
              Gerador de Roteiros
            </h1>
            <p className="text-gray-600">
              Crie roteiros completos e estruturados para seus vídeos
            </p>
          </div>
        </div>
        
        {prefilledIdea && (
          <div className="status-info border rounded-lg p-3 mt-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Criando roteiro a partir da ideia:
              </span>
            </div>
            <p className="font-medium">{prefilledIdea.title}</p>
            <p className="text-sm mt-1">{prefilledIdea.description}</p>
            {prefilledIdea.hook && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs font-medium text-yellow-800">
                  Gancho: {prefilledIdea.hook}
                </p>
              </div>
            )}
            {prefilledIdea.keyPoints && prefilledIdea.keyPoints.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-700 mb-1">
                  Pontos-chave:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {prefilledIdea.keyPoints.slice(0, 3).map((point, index) => (
                    <li key={index} className="flex items-start space-x-1">
                      <span>•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                  {prefilledIdea.keyPoints.length > 3 && (
                    <li className="text-gray-500">
                      +{prefilledIdea.keyPoints.length - 3} mais
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Configuration Panel */}
      <div className="card card-padding bg-gray-50">
        <div className="space-content">
          {/* Content Idea */}
          <div className="space-tight">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tópico do Roteiro
            </label>
            <textarea
              value={contentIdea}
              onChange={(e) => setContentIdea(e.target.value)}
              placeholder="Descreva o tópico do seu roteiro..."
              rows={3}
              className="textarea"
            />
          </div>

          {/* Character Selection */}
          <div className="space-tight">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <span>Personagem</span>
              <button onClick={() => onTabChange('characters')} className="btn btn-white btn-sm ml-2">
                <Plus className="w-3 h-3" />
              </button>
            </label>
            {characters.length === 0 ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700 mb-2">
                  Você precisa criar um personagem primeiro.
                </p>
                <button onClick={() => onTabChange('characters')} className="btn btn-primary btn-sm">
                  Criar Personagem
                </button>
              </div>
            ) : (
              <>
                <select
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                  className="input"
                >
                  <option value="">
                    Selecione um personagem (opcional)
                  </option>
                  {characters.map(character => (
                    <option key={character.id} value={character.id}>
                      {character.name}
                    </option>
                  ))}
                </select>
                {selectedCharacter && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">
                        {characters.find(c => c.id === selectedCharacter)?.name}
                      </span>
                      <span className="text-xs text-blue-500">
                        • {new Date(characters.find(c => c.id === selectedCharacter)?.createdAt || '').toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-blue-600 italic">
                        "{characters.find(c => c.id === selectedCharacter)?.description}"
                      </p>
                      <div className="grid grid-cols-1 gap-1 text-xs text-blue-600">
                        <div>
                          <span className="font-medium">Personalidade:</span> {characters.find(c => c.id === selectedCharacter)?.personality}
                        </div>
                        <div>
                          <span className="font-medium">Estilo:</span> {characters.find(c => c.id === selectedCharacter)?.communicationStyle}
                        </div>
                        <div>
                          <span className="font-medium">Público:</span> {characters.find(c => c.id === selectedCharacter)?.targetAudience}
                        </div>
                        <div>
                          <span className="font-medium">Conteúdo:</span> {characters.find(c => c.id === selectedCharacter)?.contentFocus}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs text-blue-500 font-medium">Especialidades:</span>
                        {characters.find(c => c.id === selectedCharacter)?.expertise.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                        {characters.find(c => c.id === selectedCharacter)?.expertise.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">
                            +{characters.find(c => c.id === selectedCharacter)?.expertise.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Target Duration */}
          <div className="space-tight">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duração Alvo
            </label>
            <select
              value={targetDuration}
              onChange={(e) => setTargetDuration(e.target.value)}
              className="input"
            >
              <option value="1-3">1-3 minutos</option>
              <option value="5-10">5-10 minutos</option>
              <option value="10-20">10-20 minutos</option>
              <option value="20+">20+ minutos</option>
            </select>
          </div>

          {/* Target Audience */}
          <div className="space-tight">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Público-Alvo
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Descreva seu público-alvo..."
              className="input"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateScript}
            disabled={isGenerating || !contentIdea}
            className="btn btn-primary btn-lg w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                Gerando Roteiro...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Gerar Roteiro
              </>
            )}
          </button>
          
          {error && (
            <div className="status-error border rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* History Toggle */}
      {scriptsHistory.length > 0 && (
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="btn btn-white"
        >
          <Clock className="w-4 h-4 mr-2" />
          {showHistory ? 'Ocultar Histórico' : `Mostrar Histórico (${scriptsHistory.length})`}
        </button>
      )}

      {/* Generated Scripts */}
      {(showHistory && scriptsHistory.length > 0) && (
        <div className="space-content">
          <h2 className="text-xl font-bold text-gray-900">Histórico de Roteiros</h2>
          
          <div className="space-items">
            {scriptsHistory.map((script, index) => (
              <div key={script!.title + index} className="card card-padding card-hover">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                  <div className="space-tight">
                    <span className="text-xs text-gray-500">
                      Gerado em {new Date(script!.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                    {script!.model && script!.model !== 'undefined' && (
                      <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                        {getModelDisplayName(script!.model)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-content">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-4">{script!.title}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{script!.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>Audiência geral</span>
                    </div>
                  </div>

                  {/* Script Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="status-warning border rounded-lg p-3">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">🎣 Gancho</h4>
                      <p className="text-sm line-clamp-2">{script!.hook}</p>
                    </div>
                    <div className="status-info border rounded-lg p-3">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">👋 Introdução</h4>
                      <p className="text-sm line-clamp-2">{script!.introduction}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {script!.mainContent.length} seções • {script!.engagementTips.length} dicas
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setGeneratedScript(script!);
                          setShowHistory(false);
                        }}
                        className="btn btn-primary"
                      >
                        Ver Roteiro
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Script Editor Modal */}
      {editingScript && editedScript && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Editar Roteiro</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={saveScriptDraft}
                    className="btn btn-primary"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Rascunho
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="btn btn-ghost btn-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-content">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={editedScript.title}
                  onChange={(e) => updateEditedScript('title', e.target.value)}
                  className="input"
                />
              </div>

              {/* Hook */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🎣 Gancho</label>
                <textarea
                  value={editedScript.hook}
                  onChange={(e) => updateEditedScript('hook', e.target.value)}
                  rows={3}
                  className="textarea"
                />
              </div>

              {/* Introduction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">👋 Introdução</label>
                <textarea
                  value={editedScript.introduction}
                  onChange={(e) => updateEditedScript('introduction', e.target.value)}
                  rows={3}
                  className="textarea"
                />
              </div>

              {/* Main Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📋 Conteúdo Principal</label>
                <div className="space-tight">
                  {editedScript.mainContent.map((section, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="mb-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Seção {index + 1}
                        </label>
                        <input
                          type="text"
                          value={section.section}
                          onChange={(e) => updateEditedScript(`mainContent.${index}.section`, e.target.value)}
                          className="input text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Conteúdo
                        </label>
                        <textarea
                          value={section.content}
                          onChange={(e) => updateEditedScript(`mainContent.${index}.content`, e.target.value)}
                          rows={3}
                          className="textarea text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📢 Call to Action</label>
                <textarea
                  value={editedScript.callToAction}
                  onChange={(e) => updateEditedScript('callToAction', e.target.value)}
                  rows={2}
                  className="textarea"
                />
              </div>

              {/* Engagement Tips */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">💡 Dicas de Engajamento</label>
                <div className="space-tight">
                  {editedScript.engagementTips.map((tip, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                      <input
                        type="text"
                        value={tip}
                        onChange={(e) => {
                          const newTips = [...editedScript.engagementTips];
                          newTips[index] = e.target.value;
                          updateEditedScript('engagementTips', newTips);
                        }}
                        className="input flex-1 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">⏱️ Duração Estimada</label>
                <input
                  type="text"
                  value={editedScript.estimatedDuration}
                  onChange={(e) => updateEditedScript('estimatedDuration', e.target.value)}
                  className="input"
                  placeholder="Ex: 8-10 minutos"
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Suas alterações serão salvas como rascunho
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={cancelEditing}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveScriptDraft}
                    className="btn btn-primary"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Rascunho
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* No Script Generated State */}
      {!generatedScript && !showHistory && (
        <div className="card card-padding text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum roteiro gerado
          </h3>
          <p className="text-gray-600">
            Configure os parâmetros e clique em "Gerar Roteiro"
          </p>
        </div>
      )}

      {/* Full Script View */}
      {generatedScript && !showHistory && (
        <div className="card">
          <div className="card-padding border-b border-gray-200">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900 flex-1 mr-4">{generatedScript.title}</h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => copyScriptToClipboard(generatedScript)}
                  className="btn btn-white"
                  title="Copiar roteiro"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => downloadScriptAsPDF(generatedScript)}
                  className="btn btn-white"
                  title="Baixar PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => startEditingScript(generatedScript)}
                  className="btn btn-secondary"
                  title="Editar roteiro"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Editar
                </button>
                <button 
                  onClick={() => onScheduleScript(generatedScript)}
                  className="btn btn-primary"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar
                </button>
              </div>
            </div>
          </div>

          <div className="card-padding space-content">
            {/* Hook */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">🎣 Gancho</h3>
              <div className="status-warning border rounded-lg p-3">
                <p className="text-gray-800">{generatedScript.hook}</p>
              </div>
            </div>

            {/* Introduction */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">👋 Introdução</h3>
              <div className="status-info border rounded-lg p-3">
                <p className="text-gray-800">{generatedScript.introduction}</p>
              </div>
            </div>

            {/* Main Content */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">📋 Conteúdo Principal</h3>
              <div className="space-tight">
                {generatedScript.mainContent.map((section: any, index: number) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">{section.section}</h4>
                    <p className="text-sm text-gray-700">{section.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">📢 Call to Action</h3>
              <div className="status-success border rounded-lg p-3">
                <p className="text-gray-800">{generatedScript.callToAction}</p>
              </div>
            </div>

            {/* Engagement Tips */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">💡 Dicas de Engajamento</h3>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <ul className="space-tight">
                  {generatedScript.engagementTips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
            
          <div className="card-padding border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Roteiro pronto para agendamento e publicação
              </div>
              <div className="flex space-x-2">
                <button className="btn btn-secondary btn-sm">
                  Salvar Rascunho
                </button>
                <button 
                  onClick={() => onScheduleScript(generatedScript)}
                  className="btn btn-primary btn-sm"
                >
                  Agendar Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptsTab;