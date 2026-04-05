import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './api/supabase';
import { useAuthStore } from './store/useAuthStore';
import Layout from './components/Layout';
import MonthPage from './pages/MonthPage';

function App() {
  const { session, setSession, setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setUser]);

  const handleAuth = async (type: 'login' | 'signup') => {
    setLoading(true);
    setError(null);
    try {
      const { error } = type === 'login' 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;
      if (type === 'signup') alert('¡Revisa tu email para confirmar el registro!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-xl">
          <h1 className="text-4xl font-bold text-accent mb-8 text-center">ZafeFin</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-danger text-sm">{error}</p>}

            <button
              onClick={() => handleAuth('login')}
              disabled={loading}
              className="w-full bg-accent text-background font-bold p-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>

            <button
              onClick={() => handleAuth('signup')}
              disabled={loading}
              className="w-full text-sm text-text-muted hover:text-text transition-colors"
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/mes/actual" />} />
          <Route path="/mes/actual" element={<MonthPage />} />
          <Route path="/historial" element={<div>Historial (Próximamente)</div>} />
          <Route path="/proyecciones" element={<div>Proyecciones (Próximamente)</div>} />
          <Route path="/configuracion" element={<div>Configuración (Próximamente)</div>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
