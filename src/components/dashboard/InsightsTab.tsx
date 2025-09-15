import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Eye,
  Heart,
  MessageCircle,
  Share,
  Users,
  Clock,
  Target,
  Zap,
  Calendar,
  ThumbsUp,
  PlayCircle,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
  Globe,
  Smartphone,
  Monitor,
  Youtube,
  Instagram,
  Hash,
  Image,
  Video
} from 'lucide-react';

interface InsightsTabProps {
  language: 'pt' | 'en';
}

interface PerformanceMetric {
  label: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
}

interface ContentAnalysis {
  title: string;
  views: number;
  engagement: number;
  duration: string;
  publishedAt: string;
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

const InsightsTab: React.FC<InsightsTabProps> = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'youtube' | 'instagram'>('all');

  const performanceMetrics: PerformanceMetric[] = [
    {
      label: 'Visualizações',
      current: 127500,
      previous: 98200,
      change: 29.8,
      trend: 'up',
      icon: Eye,
      color: 'blue'
    },
    {
      label: 'Taxa de Engajamento',
      current: 8.4,
      previous: 6.2,
      change: 35.5,
      trend: 'up',
      icon: Heart,
      color: 'red'
    },
    {
      label: 'Tempo Médio Assistido',
      current: 4.2,
      previous: 3.8,
      change: 10.5,
      trend: 'up',
      icon: Clock,
      color: 'green'
    },
    {
      label: 'Taxa de Cliques (CTR)',
      current: 12.3,
      previous: 14.1,
      change: -12.8,
      trend: 'down',
      icon: Target,
      color: 'orange'
    },
    {
      label: 'Novos Seguidores',
      current: 2840,
      previous: 1950,
      change: 45.6,
      trend: 'up',
      icon: Users,
      color: 'purple'
    },
    {
      label: 'Compartilhamentos',
      current: 1250,
      previous: 890,
      change: 40.4,
      trend: 'up',
      icon: Share,
      color: 'indigo'
    }
  ];

  const topContent: ContentAnalysis[] = [
    {
      title: "Como Criar Conteúdo Viral em 2025",
      views: 45200,
      engagement: 12.8,
      duration: "8:42",
      publishedAt: "2025-01-10",
      performance: 'excellent',
      thumbnail: 'https://i.ibb.co/xKH0Lsmd/Screenshot-at-Jul-22-18-13-33.png'
    },
    {
      title: "5 Erros que Todo Criador Comete",
      views: 32100,
      engagement: 9.4,
      duration: "12:15",
      publishedAt: "2025-01-08",
      performance: 'good',
      thumbnail: 'https://i.ibb.co/70vR7qg/Screenshot-at-Jul-22-18-13-19.png'
    },
    {
      title: "Minha Setup de Gravação Completa",
      views: 28900,
      engagement: 11.2,
      duration: "15:30",
      publishedAt: "2025-01-05",
      performance: 'good',
      thumbnail: 'https://i.ibb.co/WNs3tBdJ/Screenshot-at-Jul-22-18-13-07.png'
    },
    {
      title: "Respondendo Comentários dos Inscritos",
      views: 18500,
      engagement: 6.8,
      duration: "22:18",
      publishedAt: "2025-01-03",
      performance: 'average',
      thumbnail: 'https://i.ibb.co/P0jhwvW/Screenshot-at-Jul-22-18-12-50.png'
    }
  ];

  const aiInsights = [
    {
      id: 1,
      title: 'Melhor Horário para Publicar',
      description: 'Seus seguidores estão 73% mais ativos às terças e quintas, 19h-21h',
      metric: '+73% mais engajamento',
      type: "timing",
      confidence: 94,
      icon: Clock,
      color: 'blue',
      actionable: true,
      impact: 'high'
    },
    {
      id: 2,
      title: 'Duração Ideal de Vídeo',
      description: 'Vídeos de 8-12 minutos têm 45% mais retenção que vídeos longos',
      metric: '68% retenção média',
      type: "performance",
      confidence: 87,
      icon: Target,
      color: 'purple',
      actionable: true,
      impact: 'high'
    },
    {
      id: 3,
      title: 'Tópicos em Alta',
      description: 'Conteúdo sobre "IA e Criatividade" tem 280% mais alcance este mês',
      metric: '+280% alcance',
      type: "trending",
      confidence: 91,
      icon: TrendingUp,
      color: 'green',
      actionable: true,
      impact: 'high'
    },
    {
      id: 4,
      title: 'Oportunidade de Shorts',
      description: 'Seus Shorts têm 5x mais visualizações mas você publica apenas 20% do conteúdo neste formato',
      metric: '500% potencial',
      type: 'opportunity',
      confidence: 96,
      icon: Zap,
      color: 'orange',
      actionable: true,
      impact: 'very-high'
    }
  ];

  const optimizations = [
    {
      title: 'Teste A/B de Thumbnail',
      description: 'Teste 3 versões de thumbnail com cores mais vibrantes e texto maior',
      impact: 'CTR +45%',
      difficulty: 'Fácil',
      timeToImplement: '30 min',
      category: 'visual',
      icon: Image,
      priority: 'high'
    },
    {
      title: 'Gancho nos Primeiros 15s',
      description: 'Mova o gancho principal para os primeiros 15 segundos para reduzir abandono',
      impact: 'Retenção +32%',
      difficulty: 'Médio',
      timeToImplement: '1 hora',
      category: 'content',
      icon: PlayCircle,
      priority: 'high'
    },
    {
      title: 'Hashtags Estratégicas',
      description: 'Use 12-15 hashtags: 3 populares, 6 médias, 6 nicho específico',
      impact: 'Descoberta +28%',
      difficulty: 'Fácil',
      timeToImplement: '15 min',
      category: 'seo',
      icon: Hash,
      priority: 'medium'
    },
    {
      title: 'Colaborações Estratégicas',
      description: 'Colabore com 3 criadores similares (50k-200k seguidores) no seu nicho',
      impact: 'Crescimento +120%',
      difficulty: 'Difícil',
      timeToImplement: '2 semanas',
      category: 'growth',
      icon: Users,
      priority: 'high'
    }
  ];

  const getMetricIcon = (trend: string) => {
    switch (trend) {
      case 'up': return ArrowUp;
      case 'down': return ArrowDown;
      default: return Minus;
    }
  };

  const getMetricColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-50 text-green-700 border-green-200';
      case 'good': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'average': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'poor': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'very-high': return 'bg-red-50 text-red-700 border-red-200';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-section pt-8">
      {/* Header */}
      <div className="space-content">
        <div className="flex items-center space-x-3 mb-4 bg-white border border-gray-200 rounded-lg p-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">
              Insights Preditivos IA
            </h1>
            <p className="text-gray-600">
              Analytics inteligentes para otimizar seu conteúdo
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              Período:
            </span>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="input text-sm"
            >
              <option value="7d">7 dias</option>
              <option value="30d">30 dias</option>
              <option value="90d">90 dias</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              Plataforma:
            </span>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as any)}
              className="input text-sm"
            >
              <option value="all">Todas</option>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Atualizado há 5 min</span>
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {performanceMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const TrendIcon = getMetricIcon(metric.trend);
          
          return (
            <div key={index} className="card card-padding card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-${metric.color}-50 rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 ${
                    metric.color === 'blue' ? 'text-gray-600' : `text-${metric.color}-600`
                  }`} />
                </div>
                <div className={`flex items-center space-x-1 ${getMetricColor(metric.trend)}`}>
                  <TrendIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.label}</h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-bold text-gray-900">
                  {metric.label.includes('Rate') || metric.label.includes('Taxa') || metric.label.includes('Tempo') 
                    ? `${metric.current}${metric.label.includes('Tempo') ? 'min' : '%'}`
                    : metric.current.toLocaleString()
                  }
                </span>
                <span className="text-sm text-gray-500">
                  vs {metric.previous.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Insights Inteligentes
          </h2>
          
          <div className="space-items">
            {aiInsights.map(insight => {
              const IconComponent = insight.icon;
              const colorClasses = {
                blue: 'from-gray-500 to-gray-600 text-gray-600 bg-gray-50',
                green: 'from-green-500 to-green-600 text-green-600 bg-green-50',
                purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50',
                orange: 'from-orange-500 to-orange-600 text-orange-600 bg-orange-50'
              };
              const [gradientColors, textColor, bgColor] = colorClasses[insight.color as keyof typeof colorClasses].split(' ');
              
              return (
                <div key={insight.id} className="card card-padding card-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-10 h-10 bg-gradient-to-r ${gradientColors} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-base font-semibold text-gray-900">{insight.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                            {insight.impact === 'very-high' ? 'Muito Alto' :
                             insight.impact === 'high' ? 'Alto' :
                             'Médio'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{insight.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className={`text-lg font-bold ${textColor}`}>
                            {insight.metric}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 ${bgColor} rounded-full text-xs font-medium ${textColor}`}>
                              {insight.confidence}% confiança
                            </span>
                            {insight.actionable && (
                              <button className="btn btn-sm bg-gray-50 text-gray-600 hover:bg-gray-100">
                                Aplicar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Content Performance Analysis */}
          <h2 className="text-xl font-bold text-gray-900 mb-4 mt-6">
            Análise de Conteúdo
          </h2>
          
          <div className="space-items">
            {topContent.map((content, index) => (
              <div key={index} className="card card-padding card-hover">
                <div className="flex items-center space-x-3">
                  <img 
                    src={content.thumbnail} 
                    alt={content.title}
                    className="w-20 h-12 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{content.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPerformanceColor(content.performance)}`}>
                        {content.performance === 'excellent' ? 'Excelente' :
                         content.performance === 'good' ? 'Bom' :
                         'Médio'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{content.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{content.engagement}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{content.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(content.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Suggestions Sidebar */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="card card-padding sticky top-8">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Otimizações Sugeridas
            </h2>
            
            <div className="space-items">
              {optimizations.map((optimization, index) => {
                const IconComponent = optimization.icon;
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all">
                    <div className="flex items-start space-x-2 mb-2">
                      <div className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-3 h-3 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{optimization.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(optimization.priority)}`}>
                            {optimization.priority === 'high' ? 'Alta' : 'Média'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{optimization.description}</p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-green-600 font-medium">{optimization.impact}</span>
                          </div>
                          <span className="text-gray-500">{optimization.timeToImplement}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full px-3 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors">
                      Implementar
                    </button>
                  </div>
                );
              })}
            </div>
            
            {/* Quick Stats */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                Resumo Semanal
              </h3>
              
              <div className="space-tight">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Potencial de Crescimento</span>
                  <div className="flex items-center space-x-1 text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span className="font-semibold">+156%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Otimizações Pendentes</span>
                  <span className="font-semibold text-orange-600">4</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Impacto Estimado</span>
                  <span className="font-semibold text-gray-900">+89%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsTab;