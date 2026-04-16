import React, { useState, ReactNode } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Menu, X, LogOut, Circle } from 'lucide-react';
import valeLogo from '@/assets/vale-logo-official.png';

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

interface AppLayoutProps {
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  tabTitles: Record<string, string>;
  children: ReactNode;
}

export default function AppLayout({ navItems, activeTab, onTabChange, tabTitles, children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const roleLabel: Record<UserRole, string> = {
    motorista: 'Motorista',
    passageiro: 'Passageiro',
    admin: 'Administrador',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-sidebar flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo + user */}
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-4">
            <img src={valeLogo} alt="Vale" className="h-8 w-auto brightness-0 invert" />
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-sidebar-foreground hover:text-primary-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg vale-green-gradient text-primary-foreground flex items-center justify-center text-xs font-bold">
              {user.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-accent-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60">{roleLabel[user.role]}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          <p className="text-[10px] font-bold text-sidebar-foreground/40 uppercase tracking-wider px-3 mb-2">Navegação</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeTab === item.id
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                  activeTab === item.id ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground' : 'bg-vale-orange text-primary-foreground'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sair do sistema
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border flex items-center px-5 gap-4 shrink-0 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground hover:text-primary transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-foreground text-base">{tabTitles[activeTab] || ''}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-vale-success bg-vale-success/10 px-2.5 py-1 rounded-full">
              <Circle className="w-2 h-2 fill-current animate-pulse-dot" /> Online
            </span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-primary-foreground ${
              user.role === 'admin' ? 'bg-vale-red' : user.role === 'passageiro' ? 'bg-vale-blue' : 'vale-green-gradient'
            }`}>
              {user.initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
