import React, { useState } from 'react';
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
  const [isVisible, setIsVisible] = React.useState(false);
  const [newModel, setNewModel] = React.useState({
    name: '',
    description: '',
    openrouterPath: ''
  });

  // Animation effect
  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleModelSelect = (modelId: string) => {
    onSelectModel(modelId);
    handleClose();
  };

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
      onSelectModel('qwen/qwen3-235b-a22b:free');
    }
  };

  const models = [
    {
      id: 'qwen/qwen3-235b-a22b:free',
      name: 'Qwen 3 235B',
      tags: ['Gratuito', 'Rápido', 'Recomendado'],
      recommended: true
    },
    {
      id: 'deepseek-r1',
      name: 'DeepSeek R1',
      tags: ['Gratuito', 'Criativo'],
      recommended: false
    },
    {
      id: 'claude-sonnet',
      name: 'Claude Sonnet 4',
      tags: ['Premium', 'Criativo'],
      recommended: false
    },
    {
      id: 'gpt-4',
      name: 'GPT-4.1',
      tags: ['Premium', 'Versátil'],
      recommended: false
    },
    {
      id: 'llama',
      name: 'Llama 4 Maverick',
      tags: ['Open Source', 'Rápido'],
      recommended: false
    },
    {
      id: 'grok',
      name: 'Grok 4',
      tags: ['Premium', 'Humor'],
      recommended: false
    },
    {
      id: 'deepseek',
      name: 'DeepSeek Chat V3',
      tags: ['Gratuito', 'Versátil'],
      recommended: false
    },
    {
      id: 'gemini',
      name: 'Gemini 2.5 Flash',
      tags: ['Rápido', 'Google'],
      recommended: false
    }
  ];
  
  const allModels = [...models, ...customModels.map(cm => ({
    id: cm.id,
    name: cm.name,
    tags: ['Personalizado'],
    recommended: false,
    isCustom: true
  }))];

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={handleClose}
    >
      <div 
        className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl transition-all duration-200 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          background: 'rgba(46, 48, 61, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold" style={{ color: '#ffffff' }}>
              Selecionar Modelo IA
            </h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-white/10"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Models List */}
        <div className="p-4">
          <div className="space-y-2">
            {allModels.map(model => {
              const isSelected = selectedModel === model.id;
              const isCustomModel = 'isCustom' in model && model.isCustom;
              
              return (
                <div
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className={`relative p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20' 
                      : 'hover:bg-white/5'
                  }`}
                  style={{
                    border: isSelected ? '1px solid #958AF6' : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-sm" style={{ color: '#ffffff' }}>
                          {model.name}
                        </h3>
                        {model.recommended && (
                          <span 
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: '#F9E1FF', color: '#2E303D' }}
                          >
                            Recomendado
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {model.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-0.5 rounded-md text-xs font-medium"
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: 'rgba(255, 255, 255, 0.8)'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isCustomModel && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCustomModel(model.id);
                          }}
                          className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                      
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected 
                          ? 'border-purple-400 bg-gradient-to-r from-purple-500 to-blue-500' 
                          : 'border-white/30'
                      }`}>
                        {isSelected && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Custom Model Button */}
          <div className="mt-4">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full p-3 rounded-xl border border-dashed transition-all duration-200 hover:bg-white/5"
              style={{ 
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'rgba(255, 255, 255, 0.7)'
              }}
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Adicionar Modelo Personalizado
            </button>
          </div>

          {/* Add Custom Model Form */}
          {showAddForm && (
            <div className="mt-4 p-3 rounded-xl" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#ffffff' }}>
                Novo Modelo Personalizado
              </h3>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={newModel.name}
                  onChange={(e) => setNewModel({...newModel, name: e.target.value})}
                  placeholder="Nome do modelo"
                  className="w-full px-3 py-2 text-sm rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff'
                  }}
                />
                
                <input
                  type="text"
                  value={newModel.openrouterPath}
                  onChange={(e) => setNewModel({...newModel, openrouterPath: e.target.value})}
                  placeholder="Caminho OpenRouter (ex: mistralai/mistral-medium)"
                  className="w-full px-3 py-2 text-sm rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff'
                  }}
                />
              </div>
              
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={addCustomModel}
                  disabled={!newModel.name || !newModel.openrouterPath}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: 'rgba(249, 225, 255, 0.3)',
                    color: '#F9E1FF'
                  }}
                >
                  Adicionar
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Todos os modelos são acessados via OpenRouter API. Configure sua chave API nas configurações.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelSelection;