import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy,
  Sparkles,
  User,
  Brain,
  Heart,
  Target,
  MessageCircle,
  Briefcase,
  X,
  Wand2,
  RefreshCw,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { generateText } from 'ai';
import { getOpenRouterModel } from '../../lib/ai/utils';

interface Character {
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

interface CharacterTabProps {
}

const CharacterTab: React.FC<CharacterTabProps> = () => {
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const stored = localStorage.getItem('delaluna_characters');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  
  const [showModal, setShowModal] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [aiDescription, setAiDescription] = useState('');
  const [isGeneratingCharacter, setIsGeneratingCharacter] = useState(false);
  const [aiError, setAiError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    personality: '',
    expertise: [''],
    communicationStyle: 'casual',
    contentFocus: '',
    targetAudience: ''
  });

  const generateCharacterWithAI = async () => {
    if (!aiDescription.trim()) return;
    
    setIsGeneratingCharacter(true);
    setAiError('');
    
    try {
      const { getOpenRouterModel: getModel } = await import('../../lib/ai/utils');
      const model = await getModel('claude-sonnet');
      
      const languageInstruction = 'IMPORTANTE: Responda SEMPRE em português brasileiro. Todos os campos devem estar em português.';
      
      const prompt = `
${languageInstruction}

Você é um especialista em criação de personagens para criadores de conteúdo.

Baseado na seguinte descrição: "${aiDescription}"

Crie um personagem completo para criação de conteúdo com os seguintes campos:

1. Nome: Um nome profissional apropriado
2. Descrição: Breve descrição (1-2 frases)
3. Personalidade: Descrição detalhada da personalidade, tom de voz e características únicas (2-3 frases)
4. Especialidades: Lista de 4-6 áreas de especialização específicas
5. Estilo de Comunicação: Escolha entre: casual, professional, friendly, authoritative, inspirational, educational, motivational, creative
6. Foco do Conteúdo: Que tipo de conteúdo este personagem cria (2-3 frases)
7. Público-Alvo: Para quem este personagem fala (1-2 frases)

Seja específico e criativo. O personagem deve ser autêntico e adequado para criação de conteúdo.

Responda APENAS com JSON válido no formato:
{
  "name": "nome do personagem",
  "description": "descrição breve",
  "personality": "personalidade detalhada",
  "expertise": ["especialidade1", "especialidade2", "especialidade3", "especialidade4"],
  "communicationStyle": "estilo",
  "contentFocus": "foco do conteúdo",
  "targetAudience": "público-alvo"
}
`;

      const { text } = await generateText({
        model,
        prompt,
        temperature: 0.8,
        maxTokens: 2000,
      });

      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const characterData = JSON.parse(cleanedText);
      
      setFormData({
        name: characterData.name || '',
        description: characterData.description || '',
        personality: characterData.personality || '',
        expertise: characterData.expertise || [''],
        communicationStyle: characterData.communicationStyle || 'casual',
        contentFocus: characterData.contentFocus || '',
        targetAudience: characterData.targetAudience || ''
      });
      
      // Open the modal with the generated character data
      setShowModal(true);
      
    } catch (error) {
      console.error('Error generating character:', error);
      setAiError('Erro ao gerar personagem. Verifique sua API key e tente novamente.');
    } finally {
      setIsGeneratingCharacter(false);
    }
  };

  const saveCharacters = (newCharacters: Character[]) => {
    setCharacters(newCharacters);
    localStorage.setItem('delaluna_characters', JSON.stringify(newCharacters));
  };

  const handleTemplateSelect = (template: any) => {
    setFormData({
      name: template.name,
      description: template.description,
      personality: template.personality,
      expertise: template.expertise,
      communicationStyle: template.communicationStyle,
      contentFocus: template.contentFocus,
      targetAudience: template.targetAudience
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.personality) return;

    const character: Character = {
      id: editingCharacter?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      personality: formData.personality,
      expertise: formData.expertise.filter(e => e.trim()),
      communicationStyle: formData.communicationStyle,
      contentFocus: formData.contentFocus,
      targetAudience: formData.targetAudience,
      createdAt: editingCharacter?.createdAt || new Date().toISOString()
    };

    if (editingCharacter) {
      saveCharacters(characters.map(c => c.id === character.id ? character : c));
    } else {
      saveCharacters([...characters, character]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    saveCharacters(characters.filter(c => c.id !== id));
  };

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
    setFormData({
      name: character.name,
      description: character.description,
      personality: character.personality,
      expertise: character.expertise,
      communicationStyle: character.communicationStyle,
      contentFocus: character.contentFocus,
      targetAudience: character.targetAudience
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCharacter(null);
    setAiDescription('');
    setAiError('');
    setFormData({
      name: '',
      description: '',
      personality: '',
      expertise: [''],
      communicationStyle: 'casual',
      contentFocus: '',
      targetAudience: ''
    });
  };

  const addExpertise = () => {
    setFormData({
      ...formData,
      expertise: [...formData.expertise, '']
    });
  };

  const updateExpertise = (index: number, value: string) => {
    const newExpertise = [...formData.expertise];
    newExpertise[index] = value;
    setFormData({
      ...formData,
      expertise: newExpertise
    });
  };

  const removeExpertise = (index: number) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter((_, i) => i !== index)
    });
  };

  const communicationStyles = [
    { value: 'casual', label: 'Casual' },
    { value: 'professional', label: 'Profissional' },
    { value: 'friendly', label: 'Amigável' },
    { value: 'authoritative', label: 'Autoritativo' },
    { value: 'inspirational', label: 'Inspiracional' },
    { value: 'educational', label: 'Educativo' },
    { value: 'motivational', label: 'Motivacional' },
    { value: 'creative', label: 'Criativo' }
  ];

  return (
    <div className="space-section pt-8">
      {/* Header */}
      <div className="space-content">
        <div className="flex items-center space-x-3 mb-4 bg-white border border-gray-200 rounded-lg p-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-black">
              Personagens
            </h1>
            <p className="text-gray-600">
              Seus personagens geram conteúdo com personalidade única
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Personagem
          </button>
        </div>
      </div>

      {/* AI Character Generator */}
      <div className="card card-padding bg-gradient-to-r from-gray-50 to-white border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Wand2 className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">
            Gerador de Personagens IA
          </h2>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">
          Descreva o tipo de especialista que você quer e a IA criará um personagem completo para você.
        </p>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descreva o Especialista
            </label>
            <textarea
              value={aiDescription}
              onChange={(e) => setAiDescription(e.target.value)}
              placeholder="Ex: Um chef especializado em culinária vegana que ensina receitas saudáveis e sustentáveis..."
              rows={3}
              className="textarea bg-white border-gray-300 text-black placeholder-gray-500"
            />
          </div>
          
          <button
            onClick={generateCharacterWithAI}
            disabled={isGeneratingCharacter || !aiDescription.trim()}
            className="btn btn-primary w-full bg-black text-white hover:bg-gray-800"
          >
            {isGeneratingCharacter ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                Gerando Personagem...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Personagem com IA
              </>
            )}
          </button>
          
          {aiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{aiError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Created Characters */}
      <div className="card">
        <div className="card-padding border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Seus Personagens ({characters.length})
            </h2>
            {characters.length > 0 && (
              <span className="text-sm text-gray-500">
                Clique em um personagem para editar
              </span>
            )}
          </div>
        </div>
        
        <div className="card-padding">
          {characters.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Nenhum personagem criado
              </h3>
              <p className="text-gray-600 mb-4">
                Crie seu primeiro personagem para gerar conteúdo personalizado
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-primary"
              >
                Criar Personagem
              </button>
            </div>
          ) : (
            <div className="space-items">
              {characters.map((character) => (
                <div 
                  key={character.id} 
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-black hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleEdit(character)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{character.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{character.description}</p>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-3">{character.personality}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {character.expertise.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                          {character.expertise.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                              +{character.expertise.length - 3}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-3 h-3" />
                            <span className="capitalize">{character.communicationStyle}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(character.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigator.clipboard.writeText(character.personality)}
                        className="btn btn-white"
                        title="Copiar personalidade"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleEdit(character)}
                        className="btn btn-ghost hover:bg-gray-50 hover:text-black"
                        title="Editar personagem"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(character.id)}
                        className="btn btn-ghost text-gray-500 hover:text-red-600 hover:bg-red-50"
                        title="Excluir personagem"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Character Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCharacter 
                    ? 'Editar Personagem'
                    : 'Criar Personagem'
                  }
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="btn btn-ghost btn-sm"
                  title="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-content">
              {/* AI Generated Notice */}
              {aiDescription && (
                <div className="status-info border rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Personagem gerado por IA
                    </span>
                  </div>
                  <p className="text-sm">{aiDescription}</p>
                </div>
              )}
              
              {/* Character Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Personagem
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input"
                  placeholder="Ex: Dr. Maria Silva"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                  className="textarea"
                  placeholder="Breve descrição do personagem..."
                />
              </div>

              {/* Personality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personalidade
                </label>
                <textarea
                  value={formData.personality}
                  onChange={(e) => setFormData({...formData, personality: e.target.value})}
                  rows={3}
                  className="textarea"
                  placeholder="Descreva a personalidade, tom de voz e características únicas..."
                />
              </div>

              {/* Expertise Areas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Áreas de Especialização
                </label>
                <div className="space-tight">
                  {formData.expertise.map((expertise, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={expertise}
                        onChange={(e) => updateExpertise(index, e.target.value)}
                        className="input flex-1"
                        placeholder="Ex: Nutrição esportiva"
                      />
                      {formData.expertise.length > 1 && (
                        <button
                          onClick={() => removeExpertise(index)}
                          className="btn btn-ghost btn-sm text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addExpertise}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Adicionar Especialização
                  </button>
                </div>
              </div>

              {/* Communication Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estilo de Comunicação
                </label>
                <select
                  value={formData.communicationStyle}
                  onChange={(e) => setFormData({...formData, communicationStyle: e.target.value})}
                  className="input"
                >
                  {communicationStyles.map(style => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content Focus */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foco do Conteúdo
                </label>
                <textarea
                  value={formData.contentFocus}
                  onChange={(e) => setFormData({...formData, contentFocus: e.target.value})}
                  rows={2}
                  className="textarea"
                  placeholder="Que tipo de conteúdo este personagem cria?"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Público-Alvo
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  className="input"
                  placeholder="Para quem este personagem fala?"
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name || !formData.personality}
                className="btn btn-primary"
              >
                {editingCharacter 
                  ? 'Salvar Alterações'
                  : 'Criar Personagem'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterTab;