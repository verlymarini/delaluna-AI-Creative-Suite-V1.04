import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Clock,
  Youtube,
  Instagram,
  Edit3,
  Trash2,
  CheckCircle,
  Sparkles,
  FileText
} from 'lucide-react';
import { type GeneratedIdea, type GeneratedScript } from '../../lib/ai';

interface Post {
  id: number;
  title: string;
  platform: 'youtube' | 'instagram';
  date: string;
  time: string;
  status: 'scheduled' | 'published' | 'draft';
  type: string;
  source?: 'idea' | 'script' | 'manual';
  sourceData?: any;
}

interface PlannerTabProps {
  language: 'pt' | 'en';
  prefilledPost?: { idea?: GeneratedIdea; script?: GeneratedScript } | null;
}

const PlannerTab: React.FC<PlannerTabProps> = ({ prefilledPost }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    platform: 'instagram' as 'youtube' | 'instagram',
    date: '',
    time: '',
    type: '',
    source: 'manual' as 'idea' | 'script' | 'manual',
    sourceData: null as any
  });

  React.useEffect(() => {
    if (prefilledPost) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (prefilledPost.idea) {
        setNewPost({
          title: prefilledPost.idea.title,
          platform: 'instagram',
          date: tomorrow.toISOString().split('T')[0],
          time: '14:00',
          type: 'Conteúdo de Ideia IA',
          source: 'idea',
          sourceData: prefilledPost.idea
        });
      } else if (prefilledPost.script) {
        setNewPost({
          title: prefilledPost.script.title,
          platform: 'instagram',
          date: tomorrow.toISOString().split('T')[0],
          time: '14:00',
          type: 'Conteúdo com Roteiro',
          source: 'script',
          sourceData: prefilledPost.script
        });
      }
      setShowModal(true);
    }
  }, [prefilledPost]);

  const addPost = () => {
    if (newPost.title && newPost.date && newPost.time) {
      const post: Post = {
        id: Date.now(),
        ...newPost,
        status: 'scheduled'
      };
      setPosts([...posts, post]);
      setNewPost({ 
        title: '', 
        platform: 'instagram', 
        date: '', 
        time: '', 
        type: '', 
        source: 'manual',
        sourceData: null 
      });
      setShowModal(false);
    }
  };

  const deletePost = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const getStatusColor = (status: Post['status']) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-50';
      case 'published': return 'text-green-600 bg-green-50';
      case 'draft': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPlatformIcon = (platform: Post['platform']) => {
    return platform === 'youtube' ? Youtube : Instagram;
  };
  
  const getSourceIcon = (source?: Post['source']) => {
    switch (source) {
      case 'idea': return Sparkles;
      case 'script': return FileText;
      default: return Calendar;
    }
  };
  
  const getSourceColor = (source?: Post['source']) => {
    switch (source) {
      case 'idea': return 'text-purple-600 bg-purple-50';
      case 'script': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-section pt-8">
      {/* Header */}
      <div className="space-content">
        <div className="flex items-center space-x-3 mb-4 bg-white border border-gray-200 rounded-lg p-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-black">
              Planejador de Conteúdo
            </h1>
            <p className="text-gray-600">
              Organize e agende seu conteúdo
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Post
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="card card-padding">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Calendário</h2>
            
            <div className="space-content">
              <div className="text-center">
                <h3 className="text-base font-semibold text-gray-900">
                  Janeiro 2025
                </h3>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
                  <div key={day} className="p-2 font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                  const hasPost = posts.some(post => 
                    new Date(post.date).getDate() === day
                  );
                  
                  return (
                    <div
                      key={day}
                      className={`p-2 cursor-pointer rounded-lg transition-colors text-sm ${
                        day === 15 
                          ? 'bg-black text-white' 
                          : hasPost 
                            ? 'bg-gray-50 text-gray-600 font-medium' 
                            : 'hover:bg-gray-50'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Este Mês</h3>
              <div className="space-tight">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Posts Agendados</span>
                  <span className="font-medium text-gray-900">
                    {posts.filter(p => p.status === 'scheduled').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rascunhos</span>
                  <span className="font-medium text-gray-600">
                    {posts.filter(p => p.status === 'draft').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Publicados</span>
                  <span className="font-medium text-green-600">
                    {posts.filter(p => p.status === 'published').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Posts Timeline */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <div className="card">
            <div className="card-padding border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Timeline de Posts</h2>
            </div>
            
            <div className="card-padding">
              {posts.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Nenhum post agendado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Comece criando seu primeiro post
                  </p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary"
                  >
                    Criar Post
                  </button>
                </div>
              ) : (
                <div className="space-items">
                  {posts
                    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
                    .map(post => {
                      const PlatformIcon = getPlatformIcon(post.platform);
                      const SourceIcon = getSourceIcon(post.source);
                      
                      return (
                        <div key={post.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <div className={`p-2 rounded-lg ${
                                post.platform === 'youtube' ? 'bg-red-50' : 'bg-pink-50'
                              }`}>
                                <PlatformIcon className={`w-4 h-4 ${
                                  post.platform === 'youtube' ? 'text-red-600' : 'text-pink-600'
                                }`} />
                              </div>
                              
                              <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gray-900">{post.title}</h3>
                                <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                                  {post.source && post.source !== 'manual' && (
                                    <div className={`p-1 rounded ${getSourceColor(post.source)}`}>
                                      <SourceIcon className="w-3 h-3" />
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{post.time}</span>
                                  </div>
                                  <span>{post.type}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                                {post.status === 'scheduled' && 'Agendado'}
                                {post.status === 'published' && 'Publicado'}
                                {post.status === 'draft' && 'Rascunho'}
                              </span>
                              
                              <div className="flex space-x-1">
                                <button className="btn btn-ghost btn-sm">
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button 
                                  onClick={() => deletePost(post.id)}
                                  className="btn btn-ghost btn-sm text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Post Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-2 mb-4">
              {newPost.source !== 'manual' && (
                <div className={`p-2 rounded-lg bg-gray-50`}>
                  {React.createElement(getSourceIcon(newPost.source), { className: "w-4 h-4" })}
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900">
                {newPost.source === 'idea' ? 'Agendar da Ideia' : 
                 newPost.source === 'script' ? 'Agendar do Roteiro' : 
                 'Novo Post'}
              </h2>
            </div>
            
            {newPost.sourceData && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Conteúdo fonte:</p>
                <p className="text-sm font-medium text-gray-900">{newPost.sourceData.title || newPost.sourceData.description}</p>
              </div>
            )}
            
            <div className="space-content">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma</label>
                <select
                  value={newPost.platform}
                  onChange={(e) => setNewPost({...newPost, platform: e.target.value as any})}
                  className="input"
                >
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                  <input
                    type="date"
                    value={newPost.date}
                    onChange={(e) => setNewPost({...newPost, date: e.target.value})}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário</label>
                  <input
                    type="time"
                    value={newPost.time}
                    onChange={(e) => setNewPost({...newPost, time: e.target.value})}
                    className="input"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Conteúdo</label>
                <input
                  type="text"
                  value={newPost.type}
                  onChange={(e) => setNewPost({...newPost, type: e.target.value})}
                  placeholder="Ex: Vídeo longo, Reel, Tutorial..."
                  className="input"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewPost({ 
                    title: '', 
                    platform: 'instagram', 
                    date: '', 
                    time: '', 
                    type: '', 
                    source: 'manual',
                    sourceData: null 
                  });
                }}
                className="btn btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={addPost}
                className="btn btn-primary flex-1"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlannerTab;