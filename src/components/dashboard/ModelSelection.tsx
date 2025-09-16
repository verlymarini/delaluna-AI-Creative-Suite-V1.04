import React from 'react';
import { X, Brain, Zap, Target, Plus, Trash2 } from 'lucide-react';

interface ModelSelectionProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
  onClose: () => void;
}

interface CustomModel {
  id: string;
  name: string;
  description: string;
  openrouterPath: string;
  addedAt: string;
}

const ModelSelection: React.FC<ModelSelectionProps> = ({ 
  selectedModel, 
  onSelectModel, 
  onClose
}) => {
  const [customModels, setCustomModels] = React.useState<CustomModel[]>(() => {
    try {
      const stored = localStorage.getItem('delaluna_custom_models');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newModel, setNewModel] = React.useState({
    name: '',
    description: '',
    openrouterPath: ''
  });

  const saveCustomModels = (models: CustomModel[]) => {
    setCustomModels(models);
    localStorage.setItem('delaluna_custom_models', JSON.stringify(models));
  };

  const addCustomModel = () => {
    if (!newModel.name || !newModel.openrouterPath) return;
    
    const customModel: CustomModel = {
      id: `custom-${Date.now()}`,
      name: newModel.name,
      description: newModel.description || 'Modelo personalizado',
      openrouterPath: newModel.openrouterPath,
      addedAt: new Date().toISOString()
    };
    
    saveCustomModels([...customModels, customModel]);
    setNewModel({ name: '', description: '', openrouterPath: '' });
    setShowAddForm(false);
  };

  const removeCustomModel = (id: string) => {
    saveCustomModels(customModels.filter(m => m.id !== id));
    if (selectedModel === id) {
      onSelectModel('deepseek-r1');
    }
  };

  const models = [
    {
      id: 'claude-sonnet',
      name: 'Claude Sonnet 4', 
      description: 'Modelo avançado da Anthropic. Excelente para conteúdo criativo.',
      strengths: ['Conteúdo criativo', 'Análise profunda', 'Texto natural'],
      speed: 'Rápido',
      cost: 'Médio',
      icon: Brain,
      recommended: false
    },
    {
      id: 'gpt-4',
      name: 'GPT-4.1', 
      description: 'Modelo da OpenAI. Ótimo para ideias e roteiros.',
      strengths: ['Versatilidade', 'Roteiros', 'Brainstorming'],
      speed: 'Médio',
      cost: 'Alto',
      icon: Target,
      recommended: false
    },
    {
      id: 'llama',
      name: 'Llama 4 Maverick', 
      description: 'Modelo da Meta. Excelente para tarefas criativas.',
      strengths: ['Open Source', 'Versatilidade', 'Criatividade'],
      speed: 'Muito Rápido',
      cost: 'Baixo',
      icon: Zap,
      recommended: false
    },
    {
      id: 'grok',
      name: 'Grok 4', 
      description: 'Modelo da xAI com personalidade única. Ótimo para humor.',
      strengths: ['Humor', 'Originalidade', 'Conversação'],
      speed: 'Rápido',
      cost: 'Médio',
      icon: Brain,
      recommended: false
    },
    {
      id: 'deepseek-r1',
      name: 'DeepSeek R1 Free', 
      description: 'Modelo mais avançado da DeepSeek. Completamente gratuito.',
      strengths: ['Versatilidade', 'Criatividade', 'Gratuito'],
      speed: 'Rápido',
      cost: 'Free',
      icon: Zap,
      recommended: true
    },
    {
      id: 'deepseek',
      name: 'DeepSeek Chat V3', 
      description: 'Modelo avançado da DeepSeek. Gratuito e eficiente.',
      strengths: ['Versatilidade', 'Criatividade', 'Gratuito'],
      speed: 'Rápido',
      cost: 'Free',
      icon: Zap,
      recommended: false
    },
    {
      id: 'gemini',
      name: 'Gemini 2.5 Flash', 
      description: 'Modelo rápido do Google. Ótimo para tarefas diversas.',
      strengths: ['Velocidade', 'Versatilidade', 'Texto natural'],
      speed: 'Muito Rápido',
      cost: 'Baixo',
      icon: Target,
      recommended: false
    }
  ];
  
  const allModels = [...models, ...customModels.map(cm => ({
    id: cm.id,
    name: cm.name,
    description: cm.description,
    strengths: ['Personalizado', 'Versatilidade', 'Criatividade'],
    speed: 'Rápido',
    cost: 'Médio',
    icon: Brain,
    recommended: false,
    isCustom: true
  }))];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="rounded-xl w-full max-w-5xl max-h-[85vh] overflow-y-auto" style={{
        background: 'rgba(46, 48, 61, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="p-3 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold" style={{ color: '#ffffff' }}>Selecionar Modelo IA</h2>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Todos os modelos via OpenRouter
          </p>
        </div>

        <div className="p-3">
          {/* Add Custom Model Button */}
          <div className="mb-4">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-secondary btn-sm w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Modelo Personalizado
            </button>
          </div>

          {/* Add Custom Model Form */}
          {showAddForm && (
            <div className="mb-4 p-3 rounded-lg border" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#ffffff' }}>
                Novo Modelo Personalizado
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Nome do Modelo
                  </label>
                  <input
                    type="text"
                    value={newModel.name}
                    onChange={(e) => setNewModel({...newModel, name: e.target.value})}
                    placeholder="Ex: Mistral Medium 3.1"
                    className="input text-xs"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Caminho OpenRouter
                  </label>
                  <input
                    type="text"
                    value={newModel.openrouterPath}
                    onChange={(e) => setNewModel({...newModel, openrouterPath: e.target.value})}
                    placeholder="mistralai/mistral-medium-3.1"
                    className="input text-xs"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Descrição (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newModel.description}
                    onChange={(e) => setNewModel({...newModel, description: e.target.value})}
                    placeholder="Descrição do modelo..."
                    className="input text-xs"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={addCustomModel}
                  disabled={!newModel.name || !newModel.openrouterPath}
                  className="btn btn-primary flex-1"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {allModels.map(model => {
              const IconComponent = model.icon;
              const isSelected = selectedModel === model.id;
              const isCustomModel = 'isCustom' in model && model.isCustom;
              
              return (
                <div
                  key={model.id}
                  onClick={() => onSelectModel(model.id)}
                  className={`relative rounded-lg p-3 cursor-pointer transition-all hover:shadow-sm ${
                    isSelected 
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-400' 
                      : 'hover:bg-white/5'
                  }`}
                  style={{
                    border: isSelected ? '1px solid #958AF6' : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {model.recommended && (
                    <div className="absolute -top-1 left-2">
                      <span className="bg-black text-white px-1.5 py-0.5 rounded text-xs font-medium">
                        Recomendado
                      </span>
                    </div>
                  )}
                  
                  {isCustomModel && (
                    <div className="absolute -top-1 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCustomModel(model.id);
                        }}
                        className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-2 h-2" />
                      </button>
                    </div>
                  )}
                  
                  {model.recommended && !isCustomModel && (
                    <div className="absolute -top-1 left-2">
                      <span className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ background: '#F9E1FF', color: '#2E303D' }}>
                        Recomendado
                      </span>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                          isSelected 
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                            : 'bg-white/10'
                        }`}>
                          <IconComponent className={`w-3 h-3 ${
                            isSelected ? 'text-white' : 'text-gray-600'
                          }`} />
                        </div>
                        <h3 className="text-sm font-semibold" style={{ color: '#ffffff' }}>
                          {model.name}
                        </h3>
                      </div>
                      
                      <div className={`w-3 h-3 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        isSelected 
                          ? 'border-purple-400 bg-gradient-to-r from-purple-500 to-blue-500' 
                          : 'border-white/30'
                      }`}>
                        {isSelected && (
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {model.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        {!isCustomModel && (
                          <>
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                              model.speed === 'Muito Rápido' 
                                ? 'bg-green-50 text-green-600'
                                : model.speed === 'Rápido'
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'bg-gray-50 text-gray-600'
                            }`}>
                              {model.speed}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                              model.cost === 'Free'
                                ? 'bg-green-50 text-green-600'
                                : model.cost === 'Baixo' 
                                  ? 'bg-blue-50 text-blue-600'
                                  : model.cost === 'Médio'
                                    ? 'bg-yellow-50 text-yellow-600'
                                    : 'bg-red-50 text-red-600'
                            }`}>
                              {model.cost}
                            </span>
                          </>
                        )}
                        {isCustomModel && (
                          <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-xs font-medium">
                            Personalizado
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {model.strengths.slice(0, 3).map((strength, index) => (
                        <span 
                          key={index}
                          className="px-1.5 py-0.5 rounded text-xs"
                          style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.8)' }}
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-3 p-2 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <h3 className="font-semibold mb-1 text-xs" style={{ color: '#F9E1FF' }}>Dica Importante</h3>
            <p className="text-xs leading-relaxed mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Todos os modelos são acessados via OpenRouter API. Você pode adicionar qualquer modelo disponível no OpenRouter.
            </p>
            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Exemplo de caminhos: mistralai/mistral-medium-3.1, anthropic/claude-3-haiku, openai/gpt-3.5-turbo
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={onClose}
              className="btn btn-secondary btn-sm"
            >
              Cancelar
            </button>
            <button
              onClick={onClose}
              className="btn btn-primary btn-sm"
            >
              Confirmar Seleção
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelSelection;