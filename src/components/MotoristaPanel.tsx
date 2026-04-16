import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Home, Route, Bus, Bell, Radio, History, Sun, Road, Clock, Users, Fuel, MapPin, CheckCircle, Circle, Flag, AlertTriangle, CloudRain, ChevronRight, Star, ArrowUp, Save, Send } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Painel', icon: <Home className="w-4 h-4" /> },
  { id: 'rota', label: 'Minha Rota', icon: <Route className="w-4 h-4" /> },
  { id: 'veiculo', label: 'Meu Veículo', icon: <Bus className="w-4 h-4" /> },
  { id: 'alertas', label: 'Alertas', icon: <Bell className="w-4 h-4" />, badge: 2 },
  { id: 'comunidade', label: 'Rede Motoristas', icon: <Radio className="w-4 h-4" />, badge: 4 },
  { id: 'historico', label: 'Histórico', icon: <History className="w-4 h-4" /> },
];

const tabTitles: Record<string, string> = {
  dashboard: 'Painel do Motorista',
  rota: 'Navegação',
  veiculo: 'Meu Veículo',
  alertas: 'Central de Alertas',
  comunidade: 'Rede de Motoristas',
  historico: 'Histórico de Rotas',
};

export default function MotoristaPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AppLayout navItems={navItems} activeTab={activeTab} onTabChange={setActiveTab} tabTitles={tabTitles}>
      {activeTab === 'dashboard' && <DashboardTab onNavigate={setActiveTab} />}
      {activeTab === 'rota' && <RotaTab />}
      {activeTab === 'veiculo' && <VeiculoTab />}
      {activeTab === 'alertas' && <AlertasTab onNavigate={setActiveTab} />}
      {activeTab === 'comunidade' && <ComunidadeTab />}
      {activeTab === 'historico' && <HistoricoTab />}
    </AppLayout>
  );
}

function DashboardTab({ onNavigate }: { onNavigate: (t: string) => void }) {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="vale-green-gradient rounded-2xl p-6 text-primary-foreground flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">Bom dia, Carlos! <Sun className="w-5 h-5" /></h2>
          <p className="opacity-80 text-sm mt-1">Você tem 1 rota ativa hoje • Partida às 06:00</p>
        </div>
        <Bus className="w-12 h-12 opacity-30" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Road className="w-5 h-5" />, value: '28 km', label: 'Distância da rota', color: 'bg-vale-blue' },
          { icon: <Clock className="w-5 h-5" />, value: '45 min', label: 'Tempo estimado', color: 'bg-vale-success' },
          { icon: <Users className="w-5 h-5" />, value: '42/48', label: 'Passageiros', color: 'bg-vale-orange' },
          { icon: <Fuel className="w-5 h-5" />, value: '75%', label: 'Combustível', color: 'bg-vale-red' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`${s.color} text-primary-foreground p-2.5 rounded-lg`}>{s.icon}</div>
            <div>
              <p className="text-lg font-bold text-card-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Route + Alerts grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Route */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground flex items-center gap-2"><Route className="w-4 h-4" /> Rota Ativa</h3>
            <span className="status-pill status-pill-progress">Em Andamento</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-vale-blue mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm text-card-foreground">Terminal Central São Luís</p>
                <p className="text-xs text-muted-foreground">Partida: 06:00</p>
              </div>
            </div>
            <div className="ml-2 border-l-2 border-border pl-5 space-y-2">
              {[
                { name: 'Cohama', done: true },
                { name: 'Cohab Anil', done: true },
                { name: 'Turu', current: true },
                { name: 'São Cristóvão' },
                { name: 'Porto Industrial' },
              ].map((p, i) => (
                <div key={i} className={`flex items-center gap-2 text-sm ${p.done ? 'text-vale-success' : p.current ? 'text-vale-blue font-medium' : 'text-muted-foreground'}`}>
                  {p.done ? <CheckCircle className="w-3.5 h-3.5" /> : p.current ? <MapPin className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                  {p.name}
                  {p.current && <span className="text-xs bg-vale-blue text-primary-foreground px-1.5 py-0.5 rounded-full">Aqui</span>}
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3">
              <Flag className="w-4 h-4 text-vale-green mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm text-card-foreground">Porto Ponta da Madeira – Gate 1</p>
                <p className="text-xs text-muted-foreground">Chegada prevista: 06:45</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => onNavigate('rota')} className="flex-1 vale-green-gradient text-primary-foreground text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-1.5">
              <MapPin className="w-4 h-4" /> Ver Mapa
            </button>
            <button className="flex-1 bg-secondary text-secondary-foreground text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Reportar
            </button>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-card-foreground flex items-center gap-2 mb-4"><Bell className="w-4 h-4" /> Alertas do Sistema</h3>
          <div className="space-y-3">
            {[
              { icon: <AlertTriangle className="w-4 h-4" />, title: 'Trânsito intenso', desc: 'Av. dos Portugueses – atraso estimado de 10 min', time: 'Há 5 min', color: 'bg-amber-50 border-amber-200 text-amber-700' },
              { icon: <CloudRain className="w-4 h-4" />, title: 'Condição climática', desc: 'Chuva fraca prevista no trajeto', time: 'Há 12 min', color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { icon: <CheckCircle className="w-4 h-4" />, title: 'Revisão em dia', desc: 'Próxima revisão em 5.000 km', time: 'Atualizado', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
            ].map((a, i) => (
              <div key={i} className={`${a.color} border rounded-lg p-3 flex items-start gap-3`}>
                <div className="mt-0.5">{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{a.title}</p>
                  <p className="text-xs opacity-80">{a.desc}</p>
                  <p className="text-xs opacity-60 mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground flex items-center gap-2"><Radio className="w-4 h-4" /> Rede colaborativa</h3>
            <span className="status-pill status-pill-active">Sincronizado</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { value: '4', label: 'conectados' },
              { value: '2', label: 'alertas' },
              { value: 'agora', label: 'última atualiz.' },
            ].map((k, i) => (
              <div key={i} className="text-center">
                <p className="text-xl font-bold text-card-foreground">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mb-4">Compartilhe buracos, interdições e desvios com outros condutores.</p>
          <div className="flex gap-2">
            <button onClick={() => onNavigate('comunidade')} className="flex-1 vale-green-gradient text-primary-foreground text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-1.5">
              <Users className="w-4 h-4" /> Abrir rede
            </button>
            <button className="flex-1 bg-secondary text-secondary-foreground text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Avisar defeito
            </button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Defeitos compartilhados</h3>
            <span className="status-pill status-pill-progress">Ao vivo</span>
          </div>
          <div className="space-y-3">
            {[
              { location: 'Av. dos Portugueses, km 7', type: 'Buraco na pista', severity: 'Crítico', by: 'João O.' },
              { location: 'Portaria Norte', type: 'Obra ou bloqueio', severity: 'Atenção', by: 'Rogério C.' },
            ].map((d, i) => (
              <div key={i} className="bg-secondary/50 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm text-card-foreground">{d.type}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.severity === 'Crítico' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{d.severity}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{d.location}</p>
                <p className="text-xs text-muted-foreground">por {d.by}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RotaTab() {
  const [selectedRoute, setSelectedRoute] = useState('otima');
  const routes = [
    { id: 'otima', name: 'Rota Ótima', time: '45 min', dist: '28 km', traffic: 'Moderado', desc: 'Via Av. Litorânea · São Cristóvão · Porto Industrial', recommended: true },
    { id: 'alt1', name: 'Alternativa 1', time: '55 min', dist: '31 km', traffic: 'Livre', desc: 'Via BR-135 · Contorno Industrial · Portaria Norte' },
    { id: 'alt2', name: 'Alternativa 2', time: '65 min', dist: '35 km', traffic: 'Lento', desc: 'Via Centro · Av. dos Portugueses · Complexo Portuário' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-semibold text-card-foreground flex items-center gap-2"><MapPin className="w-4 h-4" /> Terminal Central → Porto Ponta da Madeira</h3>
          <div className="flex gap-2">
            {routes.map(r => (
              <button key={r.id} onClick={() => setSelectedRoute(r.id)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${selectedRoute === r.id ? 'vale-green-gradient text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {r.id === 'otima' ? <Star className="w-3 h-3 inline mr-1" /> : null}{r.name}
              </button>
            ))}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="bg-muted rounded-xl h-64 flex items-center justify-center mb-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          <div className="text-center z-10">
            <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Visualização do mapa</p>
          </div>
        </div>

        {/* Route options */}
        <div className="grid md:grid-cols-3 gap-3">
          {routes.map(r => (
            <button key={r.id} onClick={() => setSelectedRoute(r.id)} className={`text-left p-4 rounded-xl border-2 transition-all ${selectedRoute === r.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <div className="flex items-center gap-2 mb-2">
                {r.recommended && <Star className="w-4 h-4 text-primary" />}
                <span className="font-medium text-sm text-card-foreground">{r.name}</span>
                {r.recommended && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Recomendada</span>}
              </div>
              <div className="flex gap-3 text-xs text-muted-foreground mb-1">
                <span><Clock className="w-3 h-3 inline" /> {r.time}</span>
                <span><Road className="w-3 h-3 inline" /> {r.dist}</span>
              </div>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation instructions */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h4 className="font-semibold text-card-foreground flex items-center gap-2 mb-4"><ChevronRight className="w-4 h-4" /> Próximas Instruções</h4>
        <div className="space-y-3">
          {[
            { icon: <ArrowUp className="w-4 h-4" />, text: 'Siga em frente', detail: 'Av. Principal – 1,2 km', current: true },
            { icon: <ChevronRight className="w-4 h-4" />, text: 'Vire à direita', detail: 'Rua São Cristóvão – 800 m' },
            { icon: <ArrowUp className="w-4 h-4" />, text: 'Continue', detail: 'Porto Industrial – 3,5 km' },
            { icon: <Flag className="w-4 h-4" />, text: 'Destino: Gate 1', detail: 'Porto Ponta da Madeira' },
          ].map((inst, i) => (
            <div key={i} className={`flex items-center gap-4 p-3 rounded-lg ${inst.current ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/30'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${inst.current ? 'vale-green-gradient text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {inst.icon}
              </div>
              <div>
                <p className={`text-sm font-medium ${inst.current ? 'text-primary' : 'text-card-foreground'}`}>{inst.text}</p>
                <p className="text-xs text-muted-foreground">{inst.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VeiculoTab() {
  const [checklist, setChecklist] = useState([
    { label: 'Nível de óleo verificado', checked: true },
    { label: "Nível d'água verificado", checked: true },
    { label: 'Pneus calibrados', checked: true },
    { label: 'Faróis e lanternas', checked: false },
    { label: 'Limpadores de para-brisa', checked: false },
    { label: 'Extintor verificado', checked: true },
    { label: 'Triângulo de segurança', checked: false },
    { label: 'Portas e janelas', checked: true },
  ]);

  return (
    <div className="space-y-6">
      {/* Vehicle header */}
      <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl vale-green-gradient flex items-center justify-center text-primary-foreground">
          <Bus className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-card-foreground">Mercedes-Benz O-500</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono bg-secondary px-2 py-1 rounded text-secondary-foreground">PDM-1023</span>
            <span className="status-pill status-pill-progress">Em Rota</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { value: '245.000 km', label: 'Quilometragem' },
          { value: '75%', label: 'Combustível' },
          { value: '48', label: 'Capacidade' },
          { value: '10/03/2026', label: 'Última revisão' },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-lg font-bold text-card-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Checklist */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-card-foreground mb-4">Checklist Pré-Viagem</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {checklist.map((item, i) => (
            <label key={i} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => {
                  const updated = [...checklist];
                  updated[i] = { ...updated[i], checked: !updated[i].checked };
                  setChecklist(updated);
                }}
                className="w-4 h-4 rounded border-border text-primary accent-primary"
              />
              <span className={`text-sm ${item.checked ? 'text-card-foreground' : 'text-muted-foreground'}`}>{item.label}</span>
            </label>
          ))}
        </div>
        <button className="mt-4 vale-green-gradient text-primary-foreground text-sm font-medium py-2.5 px-5 rounded-lg flex items-center gap-2">
          <Save className="w-4 h-4" /> Salvar Checklist
        </button>
      </div>
    </div>
  );
}

function AlertasTab({ onNavigate }: { onNavigate: (t: string) => void }) {
  const [filter, setFilter] = useState('all');
  const alerts = [
    { type: 'warning', icon: <AlertTriangle className="w-5 h-5" />, title: 'Trânsito intenso na Av. dos Portugueses', desc: 'Atraso estimado de 10 minutos. Considere rota alternativa.', time: 'Há 5 minutos', badge: 'Aviso' },
    { type: 'info', icon: <CloudRain className="w-5 h-5" />, title: 'Previsão de chuva', desc: 'Chuva fraca prevista para as próximas 2 horas no trajeto.', time: 'Há 12 minutos', badge: 'Informativo' },
    { type: 'danger', icon: <AlertTriangle className="w-5 h-5" />, title: 'Obra na Portaria Norte', desc: 'Obras causando bloqueio parcial. Use Gate 2.', time: 'Há 30 minutos', badge: 'Crítico' },
    { type: 'info', icon: <CheckCircle className="w-5 h-5" />, title: 'Revisão veicular em dia', desc: 'Próxima revisão em 5.000 km.', time: 'Atualizado hoje', badge: 'OK' },
  ];

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);

  const badgeColors: Record<string, string> = {
    Aviso: 'bg-amber-100 text-amber-700',
    Informativo: 'bg-blue-100 text-blue-700',
    Crítico: 'bg-red-100 text-red-700',
    OK: 'bg-emerald-100 text-emerald-700',
  };

  const bgColors: Record<string, string> = {
    warning: 'border-amber-200 bg-amber-50',
    info: 'border-blue-200 bg-blue-50',
    danger: 'border-red-200 bg-red-50',
  };

  return (
    <div className="space-y-6">
      <div className="bg-vale-blue/10 border border-vale-blue/20 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-card-foreground text-sm">Rede de motoristas sincronizada</p>
          <p className="text-xs text-muted-foreground">4 motoristas conectados compartilhando condições da pista.</p>
        </div>
        <button onClick={() => onNavigate('comunidade')} className="bg-secondary text-secondary-foreground text-xs font-medium py-2 px-3 rounded-lg flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5" /> Ver comunidade
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'warning', label: 'Avisos' },
          { id: 'danger', label: 'Críticos' },
          { id: 'info', label: 'Informativos' },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${filter === f.id ? 'vale-green-gradient text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((a, i) => (
          <div key={i} className={`border rounded-xl p-4 flex items-start gap-4 ${bgColors[a.type] || 'border-border bg-card'}`}>
            <div className="mt-0.5">{a.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-card-foreground">{a.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
              <p className="text-xs text-muted-foreground mt-1">{a.time}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${badgeColors[a.badge] || ''}`}>{a.badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComunidadeTab() {
  const drivers = [
    { name: 'Carlos Silva', initials: 'CS', route: 'R001', status: 'Em rota' },
    { name: 'João Oliveira', initials: 'JO', route: 'R002', status: 'Em rota' },
    { name: 'Rogério Costa', initials: 'RC', route: 'R003', status: 'Em rota' },
    { name: 'Ana Ferreira', initials: 'AF', route: 'R004', status: 'Aguardando' },
  ];

  const feed = [
    { by: 'João O.', text: 'Buraco grande na Av. dos Portugueses km 7. Faixa da direita comprometida.', time: 'Há 2 min', severity: 'danger' },
    { by: 'Rogério C.', text: 'Obra na Portaria Norte. Recomendo usar Gate 2.', time: 'Há 15 min', severity: 'warning' },
  ];

  return (
    <div className="space-y-6">
      <div className="vale-green-gradient rounded-2xl p-6 text-primary-foreground flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2"><Users className="w-5 h-5" /> Rede de apoio entre motoristas</h2>
          <p className="text-sm opacity-80 mt-1">Alertas de pista em tempo real entre condutores.</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs bg-primary-foreground/20 px-3 py-1.5 rounded-full">
          <Circle className="w-2 h-2 fill-current animate-pulse-dot" /> Atualização contínua
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Motoristas online', value: '4' },
          { label: 'Alertas críticos', value: '2' },
          { label: 'Último envio', value: 'Há 2 min' },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold text-card-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Connected drivers */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2"><Users className="w-4 h-4" /> Motoristas conectados</h3>
          <div className="space-y-3">
            {drivers.map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <div className="w-9 h-9 rounded-full vale-green-gradient text-primary-foreground flex items-center justify-center text-xs font-bold">{d.initials}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">{d.name}</p>
                  <p className="text-xs text-muted-foreground">Rota {d.route}</p>
                </div>
                <span className="text-xs text-vale-success flex items-center gap-1"><Circle className="w-2 h-2 fill-current" /> {d.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Feed da estrada</h3>
          <div className="space-y-3">
            {feed.map((f, i) => (
              <div key={i} className={`p-3 rounded-lg border ${f.severity === 'danger' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm text-card-foreground">{f.by}</p>
                  <span className="text-xs text-muted-foreground">{f.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report form */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Notificar defeito na estrada</h3>
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Trecho afetado</label>
              <input type="text" placeholder="Ex: Av. dos Portugueses, km 7" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Tipo</label>
              <select className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Buraco na pista</option>
                <option>Obra ou bloqueio</option>
                <option>Pista molhada</option>
                <option>Veículo parado</option>
                <option>Trânsito intenso</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Severidade</label>
              <select className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Atenção</option>
                <option>Crítico</option>
                <option>Informativo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Impacto</label>
              <input type="text" placeholder="Ex: reduzir para 20 km/h" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Mensagem</label>
            <textarea rows={3} placeholder="Descreva o defeito..." className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="vale-green-gradient text-primary-foreground text-sm font-medium py-2.5 px-5 rounded-lg flex items-center gap-2">
              <Send className="w-4 h-4" /> Notificar motoristas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function HistoricoTab() {
  const history = [
    { date: '16/04/2026', route: 'Terminal → Porto Gate 1', saida: '06:00', chegada: '06:47', dist: '28 km', pax: 42, status: 'Em andamento', statusColor: 'status-pill-progress' },
    { date: '15/04/2026', route: 'Terminal → Porto Gate 1', saida: '06:00', chegada: '06:43', dist: '28 km', pax: 46, status: 'Concluída', statusColor: 'status-pill-active' },
    { date: '14/04/2026', route: 'Terminal → Porto Gate 1', saida: '06:02', chegada: '06:51', dist: '28 km', pax: 44, status: 'Concluída', statusColor: 'status-pill-active' },
    { date: '13/04/2026', route: 'Terminal → Porto Gate 1', saida: '06:00', chegada: '06:40', dist: '28 km', pax: 48, status: 'Concluída', statusColor: 'status-pill-active' },
    { date: '12/04/2026', route: 'Terminal → Porto Gate 1', saida: '06:05', chegada: '06:55', dist: '28 km', pax: 40, status: 'Concluída', statusColor: 'status-pill-active' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Data</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Rota</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Saída</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Chegada</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Dist.</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Passag.</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-card-foreground">{h.date}</td>
                  <td className="px-4 py-3 text-card-foreground font-medium">{h.route}</td>
                  <td className="px-4 py-3 text-muted-foreground">{h.saida}</td>
                  <td className="px-4 py-3 text-muted-foreground">{h.chegada}</td>
                  <td className="px-4 py-3 text-muted-foreground">{h.dist}</td>
                  <td className="px-4 py-3 text-muted-foreground">{h.pax}</td>
                  <td className="px-4 py-3"><span className={`status-pill ${h.statusColor}`}>{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
