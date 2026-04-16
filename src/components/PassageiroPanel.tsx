import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Home, Bus, MapPin, Calendar, Flag, Clock, Users, Route, Star, Circle, CheckCircle } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Início', icon: <Home className="w-4 h-4" /> },
  { id: 'minha-rota', label: 'Minha Rota', icon: <Bus className="w-4 h-4" /> },
  { id: 'rastrear', label: 'Rastrear Ônibus', icon: <MapPin className="w-4 h-4" /> },
  { id: 'horarios', label: 'Horários', icon: <Calendar className="w-4 h-4" /> },
];

const tabTitles: Record<string, string> = {
  dashboard: 'Início',
  'minha-rota': 'Minha Rota',
  rastrear: 'Rastrear Ônibus',
  horarios: 'Grade de Horários',
};

export default function PassageiroPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AppLayout navItems={navItems} activeTab={activeTab} onTabChange={setActiveTab} tabTitles={tabTitles}>
      {activeTab === 'dashboard' && <DashboardTab onNavigate={setActiveTab} />}
      {activeTab === 'minha-rota' && <MinhaRotaTab />}
      {activeTab === 'rastrear' && <RastrearTab />}
      {activeTab === 'horarios' && <HorariosTab />}
    </AppLayout>
  );
}

function DashboardTab({ onNavigate }: { onNavigate: (t: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-vale-blue rounded-2xl p-6 text-primary-foreground flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Olá, Fernanda!</h2>
          <p className="opacity-80 text-sm mt-1">Seu ônibus está a caminho · Chegada em ~12 min</p>
        </div>
        <Bus className="w-12 h-12 opacity-30" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My route */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-4">
            <Route className="w-5 h-5 text-vale-blue" />
            <div>
              <h3 className="font-semibold text-card-foreground">Sua Rota de Hoje</h3>
              <p className="text-xs text-muted-foreground">Rota R001 – Turno Manhã</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-vale-blue mt-0.5" />
              <div>
                <p className="font-medium text-sm text-card-foreground">Ponto de embarque</p>
                <p className="text-xs text-muted-foreground">Cohama – Parada 3</p>
                <span className="text-xs bg-vale-blue/10 text-vale-blue px-2 py-0.5 rounded-full font-medium">06:15</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Flag className="w-4 h-4 text-vale-green mt-0.5" />
              <div>
                <p className="font-medium text-sm text-card-foreground">Destino</p>
                <p className="text-xs text-muted-foreground">Porto Ponta da Madeira – Gate 1</p>
                <span className="text-xs bg-vale-green/10 text-vale-green px-2 py-0.5 rounded-full font-medium">06:45</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bus tracker card */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-4">
            <Bus className="w-5 h-5 text-vale-blue" />
            <div>
              <h3 className="font-semibold text-card-foreground">Ônibus PDM-1023</h3>
              <span className="status-pill status-pill-progress">Em rota</span>
            </div>
          </div>
          <div className="text-center py-4">
            <p className="text-5xl font-extrabold text-vale-blue">12</p>
            <p className="text-sm text-muted-foreground mt-1">minutos para o seu ponto</p>
          </div>
          {/* Progress stops */}
          <div className="flex items-center justify-between text-xs mb-2">
            {['Terminal', 'Cohama', 'Turu', 'S. Cristóvão', 'Porto'].map((s, i) => (
              <span key={i} className={`${i < 2 ? 'text-vale-success font-medium' : i === 2 ? 'text-vale-blue font-bold' : 'text-muted-foreground'}`}>{s}</span>
            ))}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-vale-blue h-2 rounded-full" style={{ width: '45%' }} />
          </div>
          <button onClick={() => onNavigate('rastrear')} className="mt-4 w-full bg-vale-blue text-primary-foreground text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4" /> Ver no Mapa
          </button>
        </div>
      </div>

      {/* Next departures */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-card-foreground flex items-center gap-2 mb-4"><Calendar className="w-4 h-4" /> Próximas Partidas</h3>
        <div className="space-y-3">
          {[
            { time: '06:00', label: 'Em rota agora', detail: 'PDM-1023 · 42/48 passageiros', status: 'No horário', current: true },
            { time: '12:00', label: 'Turno da tarde', detail: 'PDM-2045 · 0/52 passageiros', status: 'Programado' },
            { time: '18:00', label: 'Turno da noite', detail: 'PDM-3078 · 0/28 passageiros', status: 'Programado' },
          ].map((d, i) => (
            <div key={i} className={`flex items-center gap-4 p-3 rounded-lg ${d.current ? 'bg-vale-blue/5 border border-vale-blue/20' : 'bg-secondary/30'}`}>
              <span className={`text-lg font-bold ${d.current ? 'text-vale-blue' : 'text-muted-foreground'}`}>{d.time}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">{d.label}</p>
                <p className="text-xs text-muted-foreground">{d.detail}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${d.current ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{d.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MinhaRotaTab() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-card-foreground mb-4">Buscar Rota</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Ponto de Embarque</label>
            <select className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm">
              <option>Cohama – Parada 3</option>
              <option>Cohab Anil – Terminal</option>
              <option>Turu – Praça Central</option>
              <option>Vila Embratel – Parada 7</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Destino</label>
            <select className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm">
              <option>Porto – Gate 1</option>
              <option>Porto – Gate 2</option>
              <option>Almoxarifado Central</option>
              <option>Setor de TI</option>
            </select>
          </div>
        </div>
        <button className="vale-green-gradient text-primary-foreground text-sm font-medium py-2.5 px-5 rounded-lg">Buscar Rota</button>
      </div>

      {/* Result */}
      <div className="bg-card rounded-xl border-2 border-primary p-5">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-primary" />
          <span className="font-semibold text-card-foreground">Melhor opção para você</span>
          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Recomendada</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: 'Ônibus', value: 'Linha R001 – PDM-1023' },
            { label: 'Horário', value: '06:00 (próximo: 12:00)' },
            { label: 'Embarque', value: 'Cohama – Parada 3' },
            { label: 'Chegada', value: '~45 minutos' },
            { label: 'Disponível', value: '6 vagas livres' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{r.label}:</span>
              <span className="text-sm font-medium text-card-foreground">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RastrearTab() {
  const stops = [
    { name: 'Terminal Central', time: '06:00', done: true },
    { name: 'Cohama', time: '06:12', done: true },
    { name: 'Turu', time: '~06:22', current: true },
    { name: 'S. Cristóvão', time: '~06:32' },
    { name: 'Porto Industrial', time: '~06:40' },
    { name: 'Gate 1', time: '~06:45', dest: true },
  ];

  return (
    <div className="space-y-6">
      {/* Map placeholder */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="bg-muted h-64 flex items-center justify-center relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          <div className="text-center z-10">
            <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Rastreamento em tempo real</p>
          </div>
          {/* Overlay info */}
          <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <Bus className="w-5 h-5 text-vale-blue" />
              <div>
                <p className="font-semibold text-sm text-card-foreground">PDM-1023 · Linha R001</p>
              </div>
              <span className="ml-auto flex items-center gap-1 text-xs font-medium text-vale-red"><Circle className="w-2 h-2 fill-current animate-pulse-dot" /> AO VIVO</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-card-foreground">42 km/h</p>
                <p className="text-xs text-muted-foreground">Velocidade</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-card-foreground">Turu</p>
                <p className="text-xs text-muted-foreground">Posição</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-vale-blue">~12 min</p>
                <p className="text-xs text-muted-foreground">Chegada</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stops */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h4 className="font-semibold text-card-foreground flex items-center gap-2 mb-4"><Route className="w-4 h-4" /> Paradas da Linha R001</h4>
        <div className="flex items-start justify-between overflow-x-auto gap-1">
          {stops.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center min-w-[70px]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                  s.done ? 'bg-vale-success text-primary-foreground' :
                  s.current ? 'bg-vale-blue text-primary-foreground' :
                  s.dest ? 'bg-vale-green text-primary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {s.done ? <CheckCircle className="w-4 h-4" /> : s.current ? <Bus className="w-4 h-4" /> : s.dest ? <Flag className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                </div>
                <p className={`text-xs mt-1.5 text-center ${s.current ? 'font-bold text-vale-blue' : 'text-card-foreground'}`}>{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.time}</p>
              </div>
              {i < stops.length - 1 && (
                <div className={`flex-1 h-0.5 mt-4 rounded ${s.done ? 'bg-vale-success' : 'bg-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function HorariosTab() {
  const [turno, setTurno] = useState('manha');

  const schedules: Record<string, { id: string; origem: string; partida: string; chegada: string; bus: string; vagas: string; status: string; mine?: boolean }[]> = {
    manha: [
      { id: 'R001 ★', origem: 'Terminal Central', partida: '06:00', chegada: '06:45', bus: 'PDM-1023', vagas: '6 vagas', status: 'Em rota', mine: true },
      { id: 'R002', origem: 'Bacanga', partida: '06:30', chegada: '07:00', bus: 'PDM-2045', vagas: '18 vagas', status: 'Em rota' },
      { id: 'R004', origem: 'Itaqui', partida: '07:00', chegada: '07:15', bus: 'PDM-3078', vagas: '28 vagas', status: 'Programado' },
    ],
    tarde: [
      { id: 'R001', origem: 'Terminal Central', partida: '14:00', chegada: '14:45', bus: 'PDM-1023', vagas: '48 vagas', status: 'Programado' },
      { id: 'R002', origem: 'Bacanga', partida: '14:30', chegada: '15:00', bus: 'PDM-2045', vagas: '52 vagas', status: 'Programado' },
    ],
    noite: [
      { id: 'R001', origem: 'Porto Gate 1', partida: '22:00', chegada: '22:45', bus: 'PDM-1023', vagas: '48 vagas', status: 'Programado' },
      { id: 'R002', origem: 'Porto Gate 2', partida: '22:30', chegada: '23:00', bus: 'PDM-2045', vagas: '52 vagas', status: 'Programado' },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {[
          { id: 'manha', label: 'Manhã' },
          { id: 'tarde', label: 'Tarde' },
          { id: 'noite', label: 'Noite' },
        ].map(t => (
          <button key={t.id} onClick={() => setTurno(t.id)} className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${turno === t.id ? 'vale-green-gradient text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Linha</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Origem</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Partida</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Chegada</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Ônibus</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Vagas</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {schedules[turno]?.map((s, i) => (
                <tr key={i} className={`border-b border-border last:border-0 hover:bg-secondary/30 transition-colors ${s.mine ? 'bg-primary/5' : ''}`}>
                  <td className="px-4 py-3 font-bold text-card-foreground">{s.id}</td>
                  <td className="px-4 py-3 text-card-foreground">{s.origem}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.partida}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.chegada}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.bus}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.vagas}</td>
                  <td className="px-4 py-3">
                    <span className={`status-pill ${s.status === 'Em rota' ? 'status-pill-progress' : 'status-pill-active'}`}>{s.status}</span>
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
