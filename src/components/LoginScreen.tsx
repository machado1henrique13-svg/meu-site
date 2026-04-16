import React, { useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Shield, User, Bus, LogIn, Lock, IdCard } from 'lucide-react';
import valeLogo from '@/assets/vale-logo-official.png';
import loginBg from '@/assets/login-bg.jpg';

const profiles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
  { role: 'motorista', label: 'Motorista', icon: <Bus className="w-5 h-5" />, desc: 'Condutor de veículos' },
  { role: 'passageiro', label: 'Passageiro', icon: <User className="w-5 h-5" />, desc: 'Colaborador' },
  { role: 'admin', label: 'Administrador', icon: <Shield className="w-5 h-5" />, desc: 'Gestão e controle' },
];

export default function LoginScreen() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('motorista');
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (senha === '1234' || senha.length >= 1) {
      login(selectedRole, matricula || undefined);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Background image */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <img src={loginBg} alt="Porto Ponta da Madeira" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-vale-dark/90 via-vale-dark/70 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <img src={valeLogo} alt="Vale" className="w-36 h-auto drop-shadow-lg" />
          <div className="max-w-lg">
            <h1 className="text-4xl font-extrabold text-primary-foreground leading-tight mb-4">
              Sistema de Gestão<br />de Rotas
            </h1>
            <p className="text-lg text-primary-foreground/70 leading-relaxed">
              Unidade Ponta da Madeira – Plataforma integrada de gestão de transporte, 
              monitoramento de frotas e otimização de rotas em tempo real.
            </p>
            <div className="flex gap-8 mt-8">
              {[
                { value: '4', label: 'Rotas ativas' },
                { value: '98', label: 'Passageiros hoje' },
                { value: '5', label: 'Veículos monitorados' },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-3xl font-extrabold text-primary">{s.value}</p>
                  <p className="text-xs text-primary-foreground/50 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-primary-foreground/30">© 2026 Vale S.A. – Todos os direitos reservados</p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center bg-background p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src={valeLogo} alt="Vale" className="w-20 h-auto" />
            <div>
              <h1 className="text-lg font-bold text-foreground">Sistema de Rotas</h1>
              <p className="text-xs text-muted-foreground">Unidade Ponta da Madeira</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Acesso ao Sistema</h2>
            <p className="text-muted-foreground text-sm mt-1">Selecione seu perfil para continuar</p>
          </div>

          {/* Profile selector */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {profiles.map(({ role, label, icon, desc }) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === role
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-muted-foreground/30 hover:bg-secondary/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  selectedRole === role ? 'vale-green-gradient text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {icon}
                </div>
                <span className={`text-sm font-semibold ${selectedRole === role ? 'text-primary' : 'text-foreground'}`}>{label}</span>
                <span className="text-[10px] text-muted-foreground leading-tight">{desc}</span>
                {selectedRole === role && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-2">
                <IdCard className="w-4 h-4 text-muted-foreground" /> Matrícula
              </label>
              <input
                type="text"
                placeholder="Ex: VALE-00234"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-2">
                <Lock className="w-4 h-4 text-muted-foreground" /> Senha
              </label>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            
            <button
              type="submit"
              className="w-full vale-green-gradient text-primary-foreground font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              <LogIn className="w-4 h-4" /> Entrar no Sistema
            </button>
          </form>

          <p className="text-xs text-muted-foreground mt-4 text-center">Demo: qualquer matrícula + senha "1234"</p>

          {/* Quick access */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Acesso rápido</p>
            <div className="grid grid-cols-3 gap-2">
              {profiles.map(({ role, label, icon }) => (
                <button
                  key={role}
                  onClick={() => login(role)}
                  className="flex items-center justify-center gap-1.5 text-xs font-medium py-2.5 px-3 rounded-lg border border-border bg-card text-card-foreground hover:bg-secondary hover:border-primary/30 transition-all"
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
