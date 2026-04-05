import React from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Ingreso {
  id: string;
  label: string;
  monto: number;
  fechaCobro?: string;
  notas?: string;
}

interface Props {
  ingresos: Ingreso[];
  onAdd: () => void;
  onEdit: (ingreso: Ingreso) => void;
  onDelete: (id: string) => void;
}

const IngresosPanel: React.FC<Props> = ({ ingresos, onAdd, onEdit, onDelete }) => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center bg-card-hover/50">
        <h3 className="font-semibold text-success">Ingresos</h3>
        <button 
          onClick={onAdd}
          className="p-1 hover:bg-success/10 text-success rounded-full transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="divide-y divide-border">
        {ingresos.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm">No hay ingresos registrados</div>
        ) : (
          ingresos.map((ingreso) => (
            <div key={ingreso.id} className="p-4 flex justify-between items-center hover:bg-card-hover/30 transition-colors">
              <div>
                <p className="font-medium text-sm">{ingreso.label}</p>
                {ingreso.fechaCobro && (
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">Cobro: {ingreso.fechaCobro}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-success text-sm">$ {ingreso.monto.toLocaleString()}</span>
                <div className="flex gap-1">
                  <button onClick={() => onEdit(ingreso)} className="p-1.5 text-text-muted hover:text-accent transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => onDelete(ingreso.id)} className="p-1.5 text-text-muted hover:text-danger transition-colors">
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

export default IngresosPanel;
