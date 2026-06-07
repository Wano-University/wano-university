import React, { useState, useEffect } from 'react';

const MAPA_PERMISSOES = [
  { id: 'VER_EMENTA_COMPRAS', label: 'Ementa', roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'VER_PARKING', label: 'Parking', roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'RESERVAR_SALAS_LABORATORIOS', label: 'Reservar Salas', roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'RESERVAR_EQUIPAMENTOS', label: 'Reservar Equipamentos', roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'RESERVAR_BICICLETAS_TROTINETES', label: 'Reservar Bicicletas', roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'VER_DASHBOARD_TEMPERATURA', label: 'Dash: Temp', roles: ['STAFF', 'ADMIN'] },
  { id: 'VER_DASHBOARD_QUALIDADE_AR', label: 'Dash: Ar', roles: ['STAFF', 'ADMIN'] },
  { id: 'VER_DASHBOARD_CONSUMO_ENERGETICO', label: 'Dash: Energia', roles: ['STAFF', 'ADMIN'] },
  { id: 'VER_SUSTENTABILIDADE', label: 'Sustentabilidade', roles: ['STAFF', 'ADMIN'] },
  { id: 'GERIR_PARKING', label: 'Gestão Parking', roles: ['ADMIN'] },
  { id: 'GERIR_USERS', label: 'Gestão Users', roles: ['ADMIN'] },
  { id: 'GERIR_SALAS_LABORATORIOS', label: 'Gestão Salas/Labs', roles: ['ADMIN'] },
  { id: 'GERIR_EQUIPAMENTOS', label: 'Gestão Equipamentos', roles: ['ADMIN'] },
  { id: 'GERIR_BICICLETAS_TROTINETES', label: 'Gestão Bicicletas', roles: ['ADMIN'] },
  { id: 'GERIR_EMENTA', label: 'Gestão Ementa', roles: ['ADMIN'] },
  { id: 'GERIR_SENSORES', label: 'Gestão Sensores', roles: ['ADMIN'] }
];

export default function UserModel({ user, onClose, onSave }) {
  const [ativo, setAtivo] = useState(user?.isActive ?? true);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (user && Array.isArray(user.permissions)) {
      // Extrai as descrições da base de dados e compara com os IDs do mapa
      const userPermsFromDB = user.permissions.map(p => p.permission?.description);
      const perms = MAPA_PERMISSOES
        .filter(perm => userPermsFromDB.includes(perm.id))
        .map(perm => perm.id);
      setPermissions(perms);
    } else {
      setPermissions([]);
    }
  }, [user]);

  const userRole = user?.type?.toUpperCase() || 'STUDENT';
  const permissoesVisiveis = MAPA_PERMISSOES.filter(perm => perm.roles.includes(userRole));

  const handleTogglePermission = (id, isChecked) => {
    setPermissions(prev => isChecked ? [...prev, id] : prev.filter(p => p !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envia o array de strings (ex: ['GERIR_USERS', 'VER_PARKING']) para o backend
    onSave(user.id, { isActive: ativo, permissions: permissions });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-xl rounded-2xl shadow-xl flex flex-col max-h-[85vh] border border-border">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Gerir Utilizador: <span className="text-primary">{user?.name}</span>
          </h2>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
              <span className="text-sm font-bold uppercase text-foreground">Status da Conta</span>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${ativo ? 'bg-green-500/15 text-green-600' : 'bg-destructive/15 text-destructive'}`}>
                  {ativo ? "ATIVA" : "SUSPENSA"}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase mb-3 text-foreground">Permissões ({userRole})</h3>
              <div className="grid grid-cols-2 gap-4 p-4 border border-border rounded-xl max-h-64 overflow-y-auto bg-background">
                {permissoesVisiveis.map((perm) => (
                  <label key={perm.id} className="flex items-center gap-3 text-sm font-medium text-foreground cursor-pointer hover:opacity-80">
                    <input
                      type="checkbox"
                      checked={permissions.includes(perm.id)}
                      onChange={(e) => handleTogglePermission(perm.id, e.target.checked)}
                      className="h-4 w-4 rounded-full border-border text-primary focus:ring-primary cursor-pointer"
                    />
                    <span>{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-background border-t border-border flex justify-end gap-3 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-semibold border border-input hover:bg-muted text-foreground rounded-xl transition-all">Cancelar</button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-md transition-all">Gravar</button>
          </div>
        </form>
      </div>
    </div>
  );
}