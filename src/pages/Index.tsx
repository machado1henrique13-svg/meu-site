import { useAuth } from '@/contexts/AuthContext';
import LoginScreen from '@/components/LoginScreen';
import MotoristaPanel from '@/components/MotoristaPanel';
import PassageiroPanel from '@/components/PassageiroPanel';
import AdminPanel from '@/components/AdminPanel';

export default function Index() {
  const { user } = useAuth();

  if (!user) return <LoginScreen />;

  switch (user.role) {
    case 'motorista': return <MotoristaPanel />;
    case 'passageiro': return <PassageiroPanel />;
    case 'admin': return <AdminPanel />;
    default: return <LoginScreen />;
  }
}
