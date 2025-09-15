import React, { useState } from 'react';
import { X, Key, Eye, EyeOff, Plus, Trash2, CheckCircle, Image } from 'lucide-react';

interface ApiKeyManagementProps {
  onClose: () => void;
}

interface ApiKey {
  id: number;
  name: string;
  key: string;
  displayKey: string;
  masked: boolean;
  status: 'active' | 'inactive';
  lastUsed: string;
  usage: string;
  type: 'openrouter' | 'freepik';
}

const ApiKeyManagement: React.FC<ApiKeyManagementProps> = ({ onClose }) => {
  const [openRouterKeys, setOpenRouterKeys] = useState<ApiKey[]>([
    // Keys will be loaded from localStorage
  ]);
  
  const [freepikKeys, setFreepikKeys] = useState<ApiKey[]>([
    // Keys will be loaded from localStorage
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [keyType, setKeyType] = useState<'openrouter' | 'freepik'>('openrouter');
  const [newKey, setNewKey] = useState({ name: '', key: '' });

  // Load OpenRouter keys from localStorage on component mount
  React.useEffect(() => {
    const savedKeys = localStorage.getItem('delaluna_api_keys');
    if (savedKeys) {
      try {
        setOpenRouterKeys(JSON.parse(savedKeys));
      } catch (error) {
        console.error('Error loading OpenRouter API keys:', error);
      }
    }
  }, []);

  // Load Freepik keys from localStorage on component mount
  React.useEffect(() => {
    const savedKeys = localStorage.getItem('delaluna_freepik_keys');
    if (savedKeys) {
      try {
        setFreepikKeys(JSON.parse(savedKeys));
      } catch (error) {
        console.error('Error loading Freepik API keys:', error);
      }
    }
  }, []);

  // Save OpenRouter keys to localStorage whenever keys change
  React.useEffect(() => {
    if (openRouterKeys.length > 0) {
      localStorage.setItem('delaluna_api_keys', JSON.stringify(openRouterKeys));
    } else {
      localStorage.removeItem('delaluna_api_keys');
    }
  }, [openRouterKeys]);

  // Save Freepik keys to localStorage whenever keys change
  React.useEffect(() => {
    if (freepikKeys.length > 0) {
      localStorage.setItem('delaluna_freepik_keys', JSON.stringify(freepikKeys));
    } else {
      localStorage.removeItem('delaluna_freepik_keys');
    }
  }, [freepikKeys]);

  const toggleKeyVisibility = (id: number, type: 'openrouter' | 'freepik') => {
    if (type === 'openrouter') {
      setOpenRouterKeys(openRouterKeys.map(key => 
        key.id === id ? { ...key, masked: !key.masked } : key
      ));
    } else {
      setFreepikKeys(freepikKeys.map(key => 
        key.id === id ? { ...key, masked: !key.masked } : key
      ));
    }
  };

  const addApiKey = () => {
    if (newKey.name && newKey.key) {
      const currentKeys = keyType === 'openrouter' ? openRouterKeys : freepikKeys;
      const isFirstKey = currentKeys.length === 0;
      
      const key: ApiKey = {
        id: Date.now(),
        name: newKey.name,
        key: newKey.key, // Store full key
        displayKey: newKey.key.substring(0, 12) + '...', // For display
        masked: true,
        status: isFirstKey ? 'active' as const : 'inactive' as const,
        lastUsed: new Date().toISOString().split('T')[0],
        usage: '0 tokens hoje',
        type: keyType
      };
      
      if (keyType === 'openrouter') {
        setOpenRouterKeys([...openRouterKeys, key]);
      } else {
        setFreepikKeys([...freepikKeys, key]);
      }
      
      setNewKey({ name: '', key: '' });
      setShowAddForm(false);
    }
  };

  const removeKey = (id: number, type: 'openrouter' | 'freepik') => {
    if (type === 'openrouter') {
      const updatedKeys = openRouterKeys.filter(key => key.id !== id);
      
      // If we removed the active key and there are other keys, make the first one active
      if (updatedKeys.length > 0) {
        const removedKey = openRouterKeys.find(key => key.id === id);
        if (removedKey?.status === 'active') {
          updatedKeys[0].status = 'active';
        }
      }
      
      setOpenRouterKeys(updatedKeys);
    } else {
      const updatedKeys = freepikKeys.filter(key => key.id !== id);
      
      // If we removed the active key and there are other keys, make the first one active
      if (updatedKeys.length > 0) {
        const removedKey = freepikKeys.find(key => key.id === id);
        if (removedKey?.status === 'active') {
          updatedKeys[0].status = 'active';
        }
      }
      
      setFreepikKeys(updatedKeys);
    }
  };

  const setActiveKey = (id: number, type: 'openrouter' | 'freepik') => {
    if (type === 'openrouter') {
      setOpenRouterKeys(openRouterKeys.map(key => ({
        ...key,
        status: key.id === id ? 'active' as const : 'inactive' as const
      })));
    } else {
      setFreepikKeys(freepikKeys.map(key => ({
        ...key,
        status: key.id === id ? 'active' as const : 'inactive' as const
      })));
    }
  };

  const getKeyTypeInfo = (type: 'openrouter' | 'freepik') => {
    if (type === 'openrouter') {
      return {
        title: 'OpenRouter',
        description: 'Configure suas chaves do OpenRouter para usar os modelos de IA',
        icon: Key,
        placeholder: 'sk-or-v1-...',
        instructions: [
          '1. Crie uma conta no OpenRouter.ai',
          '2. Vá para a seção "API Keys" no seu painel',
          '3. Clique em "Create Key" para gerar uma nova chave',
          '4. Cole a chave aqui para começar a usar'
        ]
      };
    } else {
      return {
        title: 'Freepik',
        description: 'Configure suas chaves do Freepik para gerar imagens com IA',
        icon: Image,
        placeholder: 'fpk_...',
        instructions: [
          '1. Crie uma conta no Freepik.com',
          '2. Vá para a seção "API" no seu painel',
          '3. Clique em "Generate API Key" para criar uma nova chave',
          '4. Cole a chave aqui para gerar imagens'
        ]
      };
    }
  };

  const currentKeys = keyType === 'openrouter' ? openRouterKeys : freepikKeys;
  const keyInfo = getKeyTypeInfo(keyType);
  const IconComponent = keyInfo.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" style={{
        background: 'rgba(46, 48, 61, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold" style={{ color: '#ffffff' }}>Gerenciar Chaves API</h2>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm mt-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Configure suas chaves API para usar IA e gerar imagens
          </p>
        </div>

        <div className="p-4">
          {/* API Type Selector */}
          <div className="mb-6">
            <div className="flex space-x-1 p-1 rounded-lg" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <button
                onClick={() => setKeyType('openrouter')}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  keyType === 'openrouter'
                    ? 'text-white shadow-sm'
                    : 'hover:text-white'
                }`}
                style={{
                  background: keyType === 'openrouter' 
                    ? 'linear-gradient(135deg, #958AF6, #8ABCE5)' 
                    : 'transparent',
                  color: keyType === 'openrouter' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'
                }}
              >
                <Key className="w-4 h-4" />
                <span>OpenRouter (IA)</span>
              </button>
              <button
                onClick={() => setKeyType('freepik')}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  keyType === 'freepik'
                    ? 'text-white shadow-sm'
                    : 'hover:text-white'
                }`}
                style={{
                  background: keyType === 'freepik' 
                    ? 'linear-gradient(135deg, #958AF6, #8ABCE5)' 
                    : 'transparent',
                  color: keyType === 'freepik' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'
                }}
              >
                <Image className="w-4 h-4" />
                <span>Freepik (Imagens)</span>
              </button>
            </div>
          </div>

          {/* API Info */}
          <div className="rounded-lg p-3 mb-4" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div className="flex items-center space-x-2 mb-2">
              <IconComponent className="w-4 h-4" style={{ color: '#F9E1FF' }} />
              <h3 className="font-semibold text-sm" style={{ color: '#ffffff' }}>Como obter sua chave {keyInfo.title}</h3>
            </div>
            <div className="text-sm space-y-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {keyInfo.instructions.map((instruction, index) => (
                <p key={index}>{instruction}</p>
              ))}
            </div>
          </div>

          {/* Add API Key Button */}
          {!showAddForm && (
            <div className="mb-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Chave {keyInfo.title}
              </button>
            </div>
          )}

          {/* Add Key Form */}
          {showAddForm && (
            <div className="rounded-lg p-4 mb-4" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div className="flex items-center space-x-2 mb-3">
                <IconComponent className="w-4 h-4" style={{ color: '#F9E1FF' }} />
                <h3 className="text-base font-semibold" style={{ color: '#ffffff' }}>Nova Chave {keyInfo.title}</h3>
              </div>
              
              <div className="space-content">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Nome da Chave
                  </label>
                  <input
                    type="text"
                    value={newKey.name}
                    onChange={(e) => setNewKey({...newKey, name: e.target.value})}
                    placeholder={`Ex: Chave ${keyInfo.title} Principal`}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Chave API {keyInfo.title}
                  </label>
                  <input
                    type="password"
                    value={newKey.key}
                    onChange={(e) => setNewKey({...newKey, key: e.target.value})}
                    placeholder={keyInfo.placeholder}
                    className="input"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={addApiKey}
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

          {/* API Keys List */}
          <div className="space-content">
            <h3 className="text-base font-semibold" style={{ color: '#ffffff' }}>Suas Chaves {keyInfo.title}</h3>
            
            {currentKeys.length === 0 ? (
              <div className="text-center py-6">
                <IconComponent className="w-10 h-10 mx-auto mb-3" style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                <h3 className="text-base font-semibold mb-2" style={{ color: '#ffffff' }}>
                  Nenhuma chave {keyInfo.title.toLowerCase()} configurada
                </h3>
                <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Adicione uma chave para {keyType === 'openrouter' ? 'acessar os modelos de IA' : 'gerar imagens'}
                </p>
              </div>
            ) : (
              <div className="space-items">
                {currentKeys.map(key => (
                  <div key={key.id} className="card card-padding">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-sm" style={{ color: '#ffffff' }}>{key.name}</h4>
                          {key.status === 'active' && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3" style={{ color: '#9DE699' }} />
                              <span className="text-xs font-medium" style={{ color: '#9DE699' }}>Ativa</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                              {key.masked ? key.displayKey : key.key}
                            </span>
                            <button
                              onClick={() => toggleKeyVisibility(key.id, keyType)}
                              className="btn btn-ghost btn-sm"
                            >
                              {key.masked ? (
                                <Eye className="w-3 h-3" />
                              ) : (
                                <EyeOff className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-2 text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          <span>Último uso: {key.lastUsed}</span>
                          <span>{key.usage}</span>
                          {key.status === 'inactive' && (
                            <button
                              onClick={() => setActiveKey(key.id, keyType)}
                              className="font-medium hover:underline"
                              style={{ color: '#8ABCE5' }}
                            >
                              Ativar
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-1">
                        <button
                          onClick={() => removeKey(key.id, keyType)}
                          className="btn btn-ghost btn-sm text-red-500 hover:text-red-600"
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

          {/* Security Notice */}
          <div className="mt-6 p-3 rounded-lg" style={{
            background: 'rgba(252, 235, 0, 0.1)',
            border: '1px solid rgba(252, 235, 0, 0.2)'
          }}>
            <h3 className="font-semibold mb-1 text-sm" style={{ color: '#FCEB00' }}>Segurança</h3>
            <p className="text-xs" style={{ color: 'rgba(252, 235, 0, 0.8)' }}>
              Suas chaves API são armazenadas localmente no seu navegador e nunca são enviadas para nossos servidores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManagement;