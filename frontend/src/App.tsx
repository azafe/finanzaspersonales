import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MonthPage from './pages/MonthPage';
import { supabase } from './api/supabase';
import { useAuthStore } from './store/useAuthStore';

const App: React.FC = () => {
  const { setUser, setSession, session } = useAuthStore();

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

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-accent mb-8">ZafeFin</h1>
        <button
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
          className="bg-card border border-border p-4 rounded-xl flex items-center gap-4 hover:bg-card-hover transition-colors"
        >
          <span>Iniciar sesión con Google</span>
        </button>
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
};

export default App;
