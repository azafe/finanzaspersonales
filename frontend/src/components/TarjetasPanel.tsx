import React from 'react';
import { CreditCard, FileUp, CheckCircle2, Circle } from 'lucide-react';

interface Tarjeta {
  id: string;
  nombre: string;
  color: string;
}

interface Resumen {
  id: string;
  tarjetaId: string;
  tarjeta: Tarjeta;
  montoPesos: number;
  montoUsd: number;
  fechaVencimiento?: string;
  paid: boolean;
  pdfUrl?: string;
}

interface Props {
  resumenes: Resumen[];
  onUploadPDF: (id: string) => void;
  onTogglePaid: (id: string) => void;
  onEdit: (resumen: Resumen) => void;
}

const TarjetasPanel: React.FC<Props> = ({ resumenes, onUploadPDF, onTogglePaid, onEdit }) => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border bg-card-hover/50">
        <h3 className="font-semibold text-info">Tarjetas de Crédito</h3>
      </div>
      <div className="divide-y divide-border">
        {resumenes.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm">No hay tarjetas configuradas</div>
        ) : (
          resumenes.map((resumen) => (
            <div key={resumen.id} className="p-4 flex flex-col gap-3 hover:bg-card-hover/30 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-6 rounded flex items-center justify-center text-white"
                    style={{ backgroundColor: resumen.tarjeta.color }}
                  >
                    <CreditCard size={14} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{resumen.tarjeta.nombre}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">Vence: {resumen.fechaVencimiento || 'S/D'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-sm">$ {resumen.montoPesos.toLocaleString()}</p>
                    {resumen.montoUsd > 0 && (
                      <p className="text-[10px] text-text-muted">USD {resumen.montoUsd.toLocaleString()}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => onTogglePaid(resumen.id)}
                    className={`transition-colors ${resumen.paid ? 'text-success' : 'text-text-muted'}`}
                  >
                    {resumen.paid ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onUploadPDF(resumen.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-card-hover border border-border rounded-lg text-xs font-medium hover:bg-border transition-colors"
                >
                  <FileUp size={14} />
                  <span>Subir PDF</span>
                </button>
                <button 
                  onClick={() => onEdit(resumen)}
                  className="px-4 py-2 bg-card-hover border border-border rounded-lg text-xs font-medium hover:bg-border transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TarjetasPanel;
