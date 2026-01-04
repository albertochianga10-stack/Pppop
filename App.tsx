
import React, { useState, useEffect, useCallback } from 'react';
import { fetchImportTrends } from './services/geminiService';
import { AnalyticsState, Platform, ProductTrend } from './types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  ShoppingBag, 
  TrendingUp, 
  Globe, 
  RefreshCw, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Package,
  Activity,
  DollarSign,
  ArrowUpRight
} from 'lucide-react';

const COLORS = ['#d4a373', '#faedcd', '#e9edc6', '#ccd5ae'];

const App: React.FC = () => {
  const [state, setState] = useState<AnalyticsState>({
    loading: true,
    error: null,
    insight: null,
    sources: []
  });

  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      let location = undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => 
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
        );
        location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch (e) {
        console.warn("Geolocation denied or timed out");
      }

      const { insight, sources } = await fetchImportTrends(location);
      setState({
        loading: false,
        error: null,
        insight,
        sources
      });
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Falha ao carregar dados em tempo real. Por favor, tente novamente." 
      }));
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const getPlatformCount = (platform: Platform) => {
    return state.insight?.trends.filter(t => t.platform === platform).length || 0;
  };

  const chartData = [
    { name: 'AliExpress', value: getPlatformCount(Platform.ALIEXPRESS) },
    { name: 'Shein', value: getPlatformCount(Platform.SHEIN) },
    { name: 'Alibaba', value: getPlatformCount(Platform.ALIBABA) },
  ];

  const categoryData = state.insight?.trends.reduce((acc: any[], trend) => {
    const existing = acc.find(a => a.name === trend.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: trend.category, value: 1 });
    }
    return acc;
  }, []) || [];

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/10 px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#d4a373] to-[#faedcd] rounded-lg flex items-center justify-center shadow-lg">
              <Package className="text-black" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter text-white">APPLEMAR</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4a373] font-medium text-nowrap">Angola Market Analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-white/50">Dashboard de Revenda</span>
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Preços Locais Ativos
              </span>
            </div>
            <button 
              onClick={loadData}
              disabled={state.loading}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full transition-all text-sm font-medium border border-white/10 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${state.loading ? 'animate-spin' : ''}`} />
              Sincronizar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-8">
        {state.error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle className="shrink-0" />
            <p className="text-sm font-medium">{state.error}</p>
          </div>
        )}

        {/* Hero Section */}
        {state.insight && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {state.insight.title}
                </h2>
                <p className="text-white/60 leading-relaxed max-w-2xl mb-6">
                  {state.insight.summary}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                    <span className="block text-xs text-white/40 mb-1">Items Analisados</span>
                    <span className="text-xl font-bold">{state.insight.trends.length}</span>
                  </div>
                  <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                    <span className="block text-xs text-white/40 mb-1">Margem de Revenda Média</span>
                    <span className="text-xl font-bold text-emerald-400">Alta</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4a373] opacity-[0.05] blur-[100px] -mr-32 -mt-32"></div>
            </div>

            <div className="glass-card rounded-3xl p-6 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                <DollarSign className="text-emerald-400" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Análise de Lucratividade</h3>
              <p className="text-xs text-white/40 px-6">
                Comparamos preços de origem com os valores praticados no mercado informal e digital em Luanda.
              </p>
            </div>
          </div>
        )}

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-white/60">
                <Globe size={18} />
                Origem das Importações
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} />
                  <YAxis stroke="#666" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#d4a373' }}
                  />
                  <Bar dataKey="value" fill="#d4a373" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-white/60">
                <ShoppingBag size={18} />
                Categorias com Maior Giro
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Trend Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ArrowUpRight className="text-[#d4a373]" size={24} />
              Oportunidades de Revenda em Angola
            </h3>
            <span className="text-xs font-mono text-white/30 uppercase tracking-widest">Preços Estimados Kz</span>
          </div>

          {state.loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-white/5 animate-pulse rounded-3xl border border-white/5"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {state.insight?.trends.map((trend) => (
                <div key={trend.id} className="group glass-card rounded-3xl p-5 hover:bg-white/[0.06] transition-all border border-white/5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 bg-[#d4a373]/20 text-[#d4a373] text-[10px] font-bold rounded-md uppercase">
                      {trend.platform}
                    </span>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-[#d4a373]">
                        <TrendingUp size={14} />
                        <span className="text-xs font-bold">{trend.popularityScore}%</span>
                      </div>
                      <span className="text-[9px] text-white/30 uppercase">Popularidade</span>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-[#d4a373] transition-colors">{trend.name}</h4>
                  <p className="text-xs text-white/50 mb-4 line-clamp-3 flex-grow">{trend.description}</p>
                  
                  <div className="space-y-4 mt-auto">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                      <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-wider">
                        <span>Importação</span>
                        <span>Revenda Estimada</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-medium text-white/70">{trend.estimatedPriceKz}</span>
                        <span className="text-sm font-bold text-emerald-400">{trend.estimatedResalePriceKz}</span>
                      </div>
                      <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[10px] text-white/30 uppercase">Lucro Bruto</span>
                        <span className="text-xs font-bold text-white bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">
                          +{trend.potentialProfitKz}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {trend.tags.slice(0, 1).map(tag => (
                          <span key={tag} className="text-[9px] px-2 py-0.5 bg-white/5 rounded-full border border-white/10 text-white/40">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <button className="p-2 bg-white/5 rounded-full hover:bg-[#d4a373]/20 transition-colors">
                        <ChevronRight size={16} className="text-white/40 group-hover:text-[#d4a373]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sources & Transparency */}
        {!state.loading && state.sources.length > 0 && (
          <div className="glass-card rounded-3xl p-6 border-l-4 border-[#d4a373]">
            <h4 className="text-sm font-bold text-white/40 mb-4 flex items-center gap-2 uppercase tracking-widest">
              Fontes de Preços e Dados
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.sources.map((source, idx) => (
                source.web && (
                  <a 
                    key={idx} 
                    href={source.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/10 group"
                  >
                    <ExternalLink size={14} className="text-white/30 group-hover:text-[#d4a373]" />
                    <span className="text-xs text-white/60 truncate font-medium">{source.web.title}</span>
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 py-8 border-t border-white/5 px-6 text-center">
        <p className="text-white/20 text-xs font-medium tracking-widest uppercase mb-2">© 2025 APPLEMAR | INTELIGÊNCIA DE MERCADO</p>
        <p className="text-white/10 text-[10px]">Os preços de revenda são estimativas baseadas em tendências de mercado informal e digital em Angola.</p>
      </footer>
    </div>
  );
};

export default App;
