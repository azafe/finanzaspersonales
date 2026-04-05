import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, History, PlusCircle, TrendingUp, Settings } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { icon: <Home size={24} />, label: 'Inicio', path: '/' },
    { icon: <History size={24} />, label: 'Historial', path: '/historial' },
    { icon: <PlusCircle size={32} />, label: '', path: '/add', special: true },
    { icon: <TrendingUp size={24} />, label: 'Proyecciones', path: '/proyecciones' },
    { icon: <Settings size={24} />, label: 'Config', path: '/configuracion' },
  ];

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <main className="flex-1 pb-20 p-4 max-w-lg mx-auto w-full">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center ${
              location.pathname === item.path ? 'text-accent' : 'text-text-muted'
            } ${item.special ? '-mt-8 bg-accent text-white rounded-full p-2 shadow-lg' : ''}`}
          >
            {item.icon}
            <span className="text-[10px] mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
