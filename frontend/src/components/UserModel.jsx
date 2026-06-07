import React, { useState, useEffect } from 'react';

const MAPA_PERMISSOES = [
  { id: 'VER_EMENTA_COMPRAS',            label: 'Ementa',                roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'VER_PARKING',                   label: 'Parking',               roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'VER_SALAS_LABORATORIOS',        label: 'Ver Salas',             roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'VER_EQUIPAMENTOS',              label: 'Ver Equipamentos',      roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'VER_BICICLETAS_TROTINETES',     label: 'Ver Bicicletas',        roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'VER_DASHBOARD',                 label: 'Dashboards',            roles: ['STAFF', 'ADMIN'] },
  { id: 'GERIR_USERS',                   label: 'Gestão Users',          roles: ['ADMIN'] },
  { id: 'GERIR_EQUIPAMENTOS',            label: 'Gestão Equipamentos',   roles: ['ADMIN'] },
  { id: 'GERIR_BICICLETAS_TROTINETES',   label: 'Gestão Bicicletas',     roles: ['ADMIN'] },
  { id: 'GERIR_EMENTA',                  label: 'Gestão Ementa',         roles: ['ADMIN', 'STAFF'] },
  { id: 'GERIR_SENSORES',                label: 'Gestão Sensores',       roles: ['ADMIN'] }
];

export default function UserModel({ user, onClose, onSave }) {
  const [ativo, setAtivo] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (user) {
      const statusAtivo = user.isActive ?? user.ativo ?? true;
      setAtivo(!!statusAtivo);

      if (Array.isArray(user.permissions)) {
        const userPermsFromDB = user.permissions.map(p => {
          if (!p) return null;
          if (typeof p === 'string') return p;
          return p.permission?.description || p.description;
        }).filter(Boolean);

        // Se o utilizador tiver qualquer uma das 3 permissões antigas de dashboard,
        // consideramos que tem VER_DASHBOARD (compatibilidade com dados antigos na BD)
        const DASHBOARD_ANTIGAS = [
          'VER_DASHBOARD_TEMPERATURA',
          'VER_DASHBOARD_QUALIDADE_AR',
          'VER_DASHBOARD_CONSUMO_ENERGETICO'
        ];
        const temDashboardAntiga = userPermsFromDB.some(p => DASHBOARD_ANTIGAS.includes(p));

        const activePerms = MAPA_PERMISSOES
          .filter(perm => userPermsFromDB.includes(perm.id))
          .map(perm => perm.id);

        if (temDashboardAntiga && !activePerms.includes('VER_DASHBOARD')) {
          activePerms.push('VER_DASHBOARD');
        }

        setSelectedPermissions(activePerms);
      }
    }
  }, [user]);

  const userRole = user?.type?.toUpperCase() || 'STUDENT';
  const permissoesVisiveis = MAPA_PERMISSOES.filter(perm => perm.roles.includes(userRole));

  const handleToggle = (id, isChecked) => {
    if (isChecked) {
      setSelectedPermissions(prev => [...prev, id]);
    } else {
      setSelectedPermissions(prev => prev.filter(p => p !== id));
    }
  };

  const executarSalvar = () => {
    const userId = user?.id || user?._id;
    if (!userId) return;

    if (typeof onSave === 'function') {
      const payloadParaOPai = {
        ativo: ativo,
        isActive: ativo,
        novasPermissoes: selectedPermissions,
        permissions: selectedPermissions
      };

      console.log("A enviar dados para o Pai -> ID:", userId, "Dados:", payloadParaOPai);
      onSave(userId, payloadParaOPai);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] border border-border">

        {/* Header */}
        <div className="p-5 border-b border-border flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Gerir Utilizador: <span className="text-primary">{user?.name || 'Utilizador'}</span>
          </h2>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl cursor-pointer">✕</button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 overflow-y-auto space-y-6 flex-1">

            {/* Status da Conta */}
            <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border shrink-0">
              <span className="text-sm font-bold uppercase text-foreground">Status da Conta</span>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${ativo ? 'bg-green-500/15 text-green-600' : 'bg-destructive/15 text-destructive'}`}>
                  {ativo ? "ATIVA" : "SUSPENSA"}
                </span>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>

            {/* Lista de Permissões */}
            <div className="flex flex-col">
              <h3 className="text-sm font-bold uppercase mb-3 text-foreground">Permissões de Acesso ({userRole})</h3>

              <div className="flex flex-col gap-3 p-4 border border-border rounded-xl bg-background overflow-y-auto max-h-[40vh]">
                {permissoesVisiveis.map((perm) => {
                  const isChecked = selectedPermissions.includes(perm.id);

                  return (
                    <div
                      key={perm.id}
                      onClick={() => handleToggle(perm.id, !isChecked)}
                      className={`flex items-center justify-between p-4 w-full h-14 rounded-xl border transition-all cursor-pointer select-none shrink-0 ${
                        isChecked
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "bg-muted/10 border-border/60 hover:border-border hover:bg-muted/20"
                      }`}
                    >
                      <span className={`text-sm font-semibold transition-colors ${isChecked ? "text-primary" : "text-foreground"}`}>
                        {perm.label}
                      </span>

                      <div className="relative w-11 h-6 pointer-events-none">
                        <input type="checkbox" checked={isChecked} readOnly className="sr-only peer" />
                        <div className={`absolute inset-0 rounded-full transition-colors ${isChecked ? "bg-primary" : "bg-muted"}`}></div>
                        <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform duration-200 shadow-sm ${isChecked ? "translate-x-5" : "translate-x-0"}`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 bg-background border-t border-border flex justify-end gap-3 rounded-b-2xl shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-semibold border border-input hover:bg-muted text-foreground rounded-xl transition-all cursor-pointer">Cancelar</button>
            <button
              type="button"
              onClick={executarSalvar}
              className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Gravar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}