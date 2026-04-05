import React, { useEffect, useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import IngresosPanel from '../components/IngresosPanel';
import GastosFijosPanel from '../components/GastosFijosPanel';
import TarjetasPanel from '../components/TarjetasPanel';

const MonthPage: React.FC = () => {
  const { currentMonth, currentYear, nextMonth, prevMonth } = useFinanceStore();
  const { session } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/meses/${currentYear}/${currentMonth}`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error('Error fetching month data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [currentMonth, currentYear, session]);

  const handleTogglePaidGasto = async (id: string) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/gastos-fijos/${id}/toggle-paid`, {}, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteIngreso = async (id: string) => {
    if (!window.confirm('¿Eliminar ingreso?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/ingresos/${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteGasto = async (id: string) => {
    if (!window.confirm('¿Eliminar gasto fijo?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/gastos-fijos/${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading && !data) return <div className="flex justify-center items-center h-screen text-accent">Cargando...</div>;

  const totalIngresos = data?.ingresos.reduce((acc: number, curr: any) => acc + curr.monto, 0) || 0;
  const totalGastosFijos = data?.gastosFijos.reduce((acc: number, curr: any) => acc + curr.monto, 0) || 0;
  const totalTarjetas = data?.resumenes.reduce((acc: number, curr: any) => acc + curr.montoPesos, 0) || 0;
  const totalGastosExtra = data?.gastosExtra.reduce((acc: number, curr: any) => acc + curr.monto, 0) || 0;
  
  const totalEgresos = totalGastosFijos + totalTarjetas + totalGastosExtra;
  const saldo = totalIngresos - totalEgresos;

  // Simple Health Score Calculation
  const savingsRate = totalIngresos > 0 ? (saldo / totalIngresos) * 100 : 0;
  const healthScore = Math.min(100, Math.max(0, 
    (savingsRate >= 20 ? 40 : (savingsRate / 20) * 40) + 
    (totalTarjetas / totalIngresos <= 0.3 ? 30 : 0) + 
    (totalGastosFijos / totalIngresos <= 0.4 ? 30 : 0)
  ));

  return (
    <div className="space-y-6 pb-24">
      {/* Header / Month Nav */}
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
        <button onClick={prevMonth} className="p-2 hover:bg-card-hover rounded-full transition-colors text-text-muted hover:text-text">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">{data?.label || `${currentMonth}/${currentYear}`}</h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${data?.cerrado ? 'bg-text-muted' : 'bg-success animate-pulse'}`}></span>
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold">
              {data?.cerrado ? 'Cerrado' : 'En curso'}
            </span>
          </div>
        </div>
        <button onClick={nextMonth} className="p-2 hover:bg-card-hover rounded-full transition-colors text-text-muted hover:text-text">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Health Score & Main Balance */}
      <div className="bg-card p-6 rounded-2xl border border-border flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity size={80} />
        </div>
        <div className="relative z-10 text-center">
          <span className="text-xs text-text-muted uppercase tracking-widest mb-1 block">Saldo Disponible</span>
          <h2 className={`text-4xl font-black ${saldo >= 0 ? 'text-success' : 'text-danger'}`}>
            $ {saldo.toLocaleString()}
          </h2>
          <div className="mt-4 flex items-center gap-2 bg-background/50 px-4 py-1.5 rounded-full border border-border">
            <span className="text-[10px] text-text-muted uppercase font-bold">Health Score:</span>
            <span className={`text-sm font-black ${healthScore >= 70 ? 'text-success' : healthScore >= 50 ? 'text-accent' : 'text-danger'}`}>
              {Math.round(healthScore)}/100
            </span>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard title="Total Ingresos" value={totalIngresos} color="text-success" />
        <MetricCard title="Total Tarjetas" value={totalTarjetas} color="text-info" />
      </div>

      {/* Panels */}
      <IngresosPanel 
        ingresos={data?.ingresos || []} 
        onAdd={() => {}} 
        onEdit={() => {}} 
        onDelete={handleDeleteIngreso} 
      />

      <GastosFijosPanel 
        gastos={data?.gastosFijos || []} 
        onAdd={() => {}} 
        onEdit={() => {}} 
        onDelete={handleDeleteGasto}
        onTogglePaid={handleTogglePaidGasto}
      />

      <TarjetasPanel 
        resumenes={data?.resumenes || []} 
        onUploadPDF={() => {}} 
        onTogglePaid={() => {}} 
        onEdit={() => {}} 
      />
    </div>
  );
};

const MetricCard: React.FC<{ title: string, value: number, color: string }> = ({ title, value, color }) => (
  <div className="bg-card p-4 rounded-xl border border-border">
    <span className="text-[10px] text-text-muted uppercase tracking-widest mb-1 block font-bold">{title}</span>
    <span className={`text-lg font-bold ${color}`}>$ {value.toLocaleString()}</span>
  </div>
);

export default MonthPage;
