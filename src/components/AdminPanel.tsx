import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { BarChart3, Route, Bus, Users, FileBarChart, MapPin, Wrench, ArrowUp, ArrowDown, Minus, Circle, AlertTriangle, CloudRain, Edit, Ban, Plus, Fuel, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const navItems = [
  { id: 'overview', label: 'Visão Geral', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'rotas', label: 'Rotas', icon: <Route className="w-4 h-4" /> },
  { id: 'frota', label: 'Frota', icon: <Bus className="w-4 h-4" /> },
  { id: 'motoristas', label: 'Motoristas', icon: <Users className="w-4 h-4" /> },
  { id: 'relatorios', label: 'Relatórios', icon: <FileBarChart className="w-4 h-4" /> },
];

const tabTitles: Record<string, string> = {
  overview: 'Visão Geral',
  rotas: 'Gerenciamento de Rotas',
  frota: 'Gerenciamento de Frota',
  motoristas: 'Motoristas',
  relatorios: 'Relatórios',
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AppLayout navItems={navItems} activeTab={activeTab} onTabChange={setActiveTab} tabTitles={tabTitles}>
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'rotas' && <RotasTab />}
      {activeTab === 'frota' && <FrotaTab />}
      {activeTab === 'motoristas' && <MotoristasTab />}
      {activeTab === 'relatorios' && <RelatoriosTab />}
    </AppLayout>
  );
}

function OverviewTab() {
  const kpis = [
    { icon: <Bus className="w-6 h-6" />, value: '3', label: 'Ônibus em Rota', trend: '100%', up: true, color: 'bg-vale-blue' },
    { icon: <Users className="w-6 h-6" />, value: '98', label: 'Passageiros Hoje', trend: '12%', up: true, color: 'bg-vale-success' },
    { icon: <Route className="w-6 h-6" />, value: '4', label: 'Rotas Ativas', trend: 'Estável', stable: true, color: 'bg-vale-orange' },
    { icon: <Wrench className="w-6 h-6" />, value: '1', label: 'Em Manutenção', trend: 'Atenção', down: true, color: 'bg-vale-red' },
  ];

  const routeStatuses = [
    { id: 'R001', name: 'Terminal → Gate 1', detail: 'PDM-1023 · Carlos Silva', status: 'Em rota' },
    { id: 'R002', name: 'Bacanga → Gate 2', detail: 'PDM-2045 · João Oliveira', status: 'Em rota' },
    { id: 'R003', name: 'Logística – Almoxarifado', detail: 'PDM-4012 · Rogério Costa', status: 'Em rota' },
    { id: 'R004', name: 'Itaqui → Gate 1', detail: 'PDM-3078 · Aguardando', status: 'Programado' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Painel de Controle – Ponta da Madeira</h2>
        <span className="text-xs text-muted-foreground flex items-center gap-1"><Circle className="w-2 h-2 fill-vale-success text-vale-success animate-pulse-dot" /> Atualizado agora</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="kpi-card">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${k.color} text-primary-foreground p-2.5 rounded-lg`}>{k.icon}</div>
              <div>
                <p className="text-2xl font-extrabold text-card-foreground">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.label}</p>
              </div>
            </div>
            <div className={`text-xs font-medium flex items-center gap-1 ${k.up ? 'text-vale-success' : k.down ? 'text-vale-red' : 'text-muted-foreground'}`}>
              {k.up ? <ArrowUp className="w-3 h-3" /> : k.down ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              {k.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground flex items-center gap-2"><MapPin className="w-4 h-4" /> Mapa da Frota</h3>
            <span className="flex items-center gap-1 text-xs text-vale-red font-medium"><Circle className="w-2 h-2 fill-current animate-pulse-dot" /> AO VIVO</span>
          </div>
          <div className="bg-muted rounded-xl h-64 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
            <div className="text-center z-10">
              <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Visualização da frota em tempo real</p>
            </div>
          </div>
          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Bus className="w-3 h-3 text-vale-blue" /> Ônibus</span>
            <span className="flex items-center gap-1"><Bus className="w-3 h-3 text-vale-orange" /> Caminhão</span>
            <span className="flex items-center gap-1"><Wrench className="w-3 h-3 text-vale-red" /> Manutenção</span>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-card-foreground mb-4">Status das Rotas</h3>
            <div className="space-y-3">
              {routeStatuses.map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-mono bg-secondary px-2 py-1 rounded text-secondary-foreground shrink-0">{r.id}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.detail}</p>
                  </div>
                  <span className={`status-pill shrink-0 ${r.status === 'Em rota' ? 'status-pill-progress' : 'status-pill-active'}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-card-foreground mb-4">Alertas Recentes</h3>
            <div className="space-y-3">
              {[
                { icon: <AlertTriangle className="w-4 h-4 text-vale-orange" />, text: 'Trânsito intenso – Av. dos Portugueses', time: '5 min' },
                { icon: <Wrench className="w-4 h-4 text-vale-red" />, text: 'PDM-5099 – Manutenção necessária', time: '1h' },
                { icon: <CloudRain className="w-4 h-4 text-vale-blue" />, text: 'Chuva prevista no trajeto R001', time: '12 min' },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-secondary/30 rounded-lg">
                  {a.icon}
                  <span className="text-xs text-card-foreground flex-1">{a.text}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RotasTab() {
  const routes = [
    { id: 'R001', name: 'Terminal → Porto Gate 1', tipo: 'Ônibus', origem: 'Terminal Central', destino: 'Gate 1', dist: '28 km', tempo: '45 min', motorista: 'Carlos Silva', status: 'Em rota' },
    { id: 'R002', name: 'Bacanga → Porto Gate 2', tipo: 'Ônibus', origem: 'Bacanga', destino: 'Gate 2', dist: '18 km', tempo: '30 min', motorista: 'João Oliveira', status: 'Em rota' },
    { id: 'R003', name: 'Logística – Almoxarifado', tipo: 'Caminhão', origem: 'Centro Logístico', destino: 'Depósito 3', dist: '12 km', tempo: '25 min', motorista: 'Rogério Costa', status: 'Em rota' },
    { id: 'R004', name: 'Itaqui → Porto Gate 1', tipo: 'Ônibus', origem: 'Itaqui', destino: 'Gate 1', dist: '8 km', tempo: '15 min', motorista: 'Ana Ferreira', status: 'Programado' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Gerenciamento de Rotas</h2>
        <button className="vale-green-gradient text-primary-foreground text-sm font-medium py-2 px-4 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Rota
        </button>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {['ID', 'Nome', 'Tipo', 'Origem', 'Destino', 'Dist.', 'Tempo', 'Motorista', 'Status', 'Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-card-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {routes.map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-card-foreground">{r.id}</td>
                  <td className="px-4 py-3 font-medium text-card-foreground">{r.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${r.tipo === 'Ônibus' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                      {r.tipo === 'Ônibus' ? <Bus className="w-3 h-3" /> : <Bus className="w-3 h-3" />} {r.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.origem}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.destino}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.dist}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.tempo}</td>
                  <td className="px-4 py-3 text-card-foreground">{r.motorista}</td>
                  <td className="px-4 py-3">
                    <span className={`status-pill ${r.status === 'Em rota' ? 'status-pill-progress' : 'status-pill-active'}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><Edit className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-vale-red"><Ban className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FrotaTab() {
  const fleet = [
    { id: 'PDM-1023', name: 'Mercedes-Benz O-500', driver: 'Carlos Silva', route: 'R001 – Terminal → Gate 1', fuel: '75%', km: '245k km', status: 'Em Rota', type: 'bus' },
    { id: 'PDM-2045', name: 'Volvo B380R', driver: 'João Oliveira', route: 'R002 – Bacanga → Gate 2', fuel: '60%', km: '310k km', status: 'Em Rota', type: 'bus' },
    { id: 'PDM-3078', name: 'Volkswagen 17.230', driver: 'Sem motorista', route: 'Aguardando alocação', fuel: '90%', km: '185k km', status: 'Disponível', type: 'bus' },
    { id: 'PDM-4012', name: 'Scania R450', driver: 'Rogério Costa', route: 'R003 – Logística', fuel: '45%', km: '520k km', status: 'Em Rota', type: 'truck' },
    { id: 'PDM-5099', name: 'Iveco Tector', driver: 'Sem motorista', route: 'Revisão preventiva', fuel: '30%', km: '430k km', status: 'Manutenção', type: 'maintenance' },
  ];

  const statusColors: Record<string, string> = {
    'Em Rota': 'status-pill-progress',
    'Disponível': 'status-pill-active',
    'Manutenção': 'status-pill-danger',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">Gerenciamento de Frota</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fleet.map((v, i) => (
          <div key={i} className={`bg-card rounded-xl border p-5 ${v.type === 'maintenance' ? 'border-vale-red/30' : 'border-border'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-sm font-bold text-card-foreground">{v.id}</span>
              <span className={`status-pill ${statusColors[v.status]}`}>{v.status}</span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-primary-foreground mb-3 ${v.type === 'maintenance' ? 'bg-vale-red' : v.type === 'truck' ? 'bg-vale-orange' : 'vale-green-gradient'}`}>
              {v.type === 'maintenance' ? <Wrench className="w-6 h-6" /> : <Bus className="w-6 h-6" />}
            </div>
            <p className="font-semibold text-card-foreground text-sm">{v.name}</p>
            <p className="text-xs text-muted-foreground mt-1"><Users className="w-3 h-3 inline mr-1" />{v.driver}</p>
            <p className="text-xs text-muted-foreground"><Route className="w-3 h-3 inline mr-1" />{v.route}</p>
            <div className="flex gap-3 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Fuel className="w-3 h-3" /> {v.fuel}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {v.km}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MotoristasTab() {
  const drivers = [
    { name: 'Carlos Eduardo Silva', initials: 'CS', matricula: 'VALE-00234', cnh: 'CNH D · PDM-1023', status: 'Em Rota' },
    { name: 'João Marcos Oliveira', initials: 'JO', matricula: 'VALE-00456', cnh: 'CNH D · PDM-2045', status: 'Em Rota' },
    { name: 'Rogério Santos Costa', initials: 'RC', matricula: 'VALE-00789', cnh: 'CNH E · PDM-4012', status: 'Em Rota' },
    { name: 'Ana Paula Ferreira', initials: 'AP', matricula: 'VALE-01023', cnh: 'CNH D · Disponível', status: 'Disponível' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">Motoristas</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {drivers.map((d, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full vale-green-gradient text-primary-foreground flex items-center justify-center font-bold text-sm">{d.initials}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-card-foreground">{d.name}</p>
              <p className="text-xs text-muted-foreground">{d.matricula}</p>
              <p className="text-xs text-muted-foreground">{d.cnh}</p>
            </div>
            <span className={`status-pill ${d.status === 'Em Rota' ? 'status-pill-progress' : 'status-pill-active'}`}>{d.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const CHART_COLORS = ['#00AF41', '#3B82F6', '#F59E0B', '#EF4444'];

function RelatoriosTab() {
  const passageirosData = [
    { name: 'R001', value: 42 },
    { name: 'R002', value: 28 },
    { name: 'R003', value: 0 },
    { name: 'R004', value: 28 },
  ];

  const weekData = [
    { name: 'Seg', rotas: 12 },
    { name: 'Ter', rotas: 14 },
    { name: 'Qua', rotas: 11 },
    { name: 'Qui', rotas: 13 },
    { name: 'Sex', rotas: 15 },
    { name: 'Sáb', rotas: 4 },
    { name: 'Dom', rotas: 2 },
  ];

  const flotaData = [
    { name: 'Em Rota', value: 3 },
    { name: 'Disponível', value: 1 },
    { name: 'Manutenção', value: 1 },
  ];

  const combustivelData = [
    { name: 'PDM-1023', litros: 120 },
    { name: 'PDM-2045', litros: 150 },
    { name: 'PDM-3078', litros: 40 },
    { name: 'PDM-4012', litros: 200 },
    { name: 'PDM-5099', litros: 80 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">Relatórios</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-card-foreground mb-4">Passageiros por Rota</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={passageirosData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#00AF41" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-card-foreground mb-4">Rotas por Dia da Semana</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="rotas" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-card-foreground mb-4">Status da Frota</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={flotaData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {flotaData.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-card-foreground mb-4">Consumo de Combustível (L)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={combustivelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="litros" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
