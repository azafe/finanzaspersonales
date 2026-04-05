import React from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Edit2 } from 'lucide-react';

interface GastoFijo {
  id: string;
  servicio: string;
  categoria: string;
  monto: number;
  paid: boolean;
  notas?: string;
}

interface Props {
  gastos: GastoFijo[];
  onAdd: () => void;
  onEdit: (gasto: GastoFijo) => void;
  onDelete: (id: string) => void;
  onTogglePaid: (id: string) => void;
}

const GastosFijosPanel: React.FC<Props> = ({ gastos, onAdd, onEdit, onDelete, onTogglePaid }) => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center bg-card-hover/50">
        <h3 className="font-semibold text-danger">Gastos Fijos</h3>
        <button 
          onClick={onAdd}
          className="p-1 hover:bg-danger/10 text-danger rounded-full transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="divide-y divide-border">
        {gastos.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm">No hay gastos fijos registrados</div>
        ) : (
          gastos.map((gasto) => (
            <div key={gasto.id} className="p-4 flex justify-between items-center hover:bg-card-hover/30 transition-colors">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onTogglePaid(gasto.id)}
                  className={`transition-colors ${gasto.paid ? 'text-success' : 'text-text-muted'}`}
                >
                  {gasto.paid ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </button>
                <div>
                  <p className={`font-medium text-sm ${gasto.paid ? 'line-through text-text-muted' : ''}`}>
                    {gasto.servicio}
                  </p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">{gasto.categoria}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-bold text-sm ${gasto.paid ? 'text-text-muted' : 'text-danger'}`}>
                  $ {gasto.monto.toLocaleString()}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => onEdit(gasto)} className="p-1.5 text-text-muted hover:text-accent transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => onDelete(gasto.id)} className="p-1.5 text-text-muted hover:text-danger transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GastosFijosPanel;
