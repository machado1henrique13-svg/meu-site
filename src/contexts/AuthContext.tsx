import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'motorista' | 'passageiro' | 'admin';

interface User {
  name: string;
  initials: string;
  matricula: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, matricula?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: Record<UserRole, User> = {
  motorista: { name: 'Carlos Silva', initials: 'CS', matricula: 'VALE-00234', role: 'motorista' },
  passageiro: { name: 'Fernanda Lima', initials: 'FL', matricula: 'VALE-01567', role: 'passageiro' },
  admin: { name: 'Central de Gestão', initials: 'ADM', matricula: 'VALE-00001', role: 'admin' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole, matricula?: string) => {
    setUser({ ...DEMO_USERS[role], matricula: matricula || DEMO_USERS[role].matricula });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
