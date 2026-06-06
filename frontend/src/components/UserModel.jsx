import React, { useState, useEffect } from 'react';

// O teu array original e perfeito de mapeamento
const MAPA_PERMISSOES = [
  { id: 'VER_EMENTA_COMPRAS', label: 'Ementa', roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'RESERVAR_SALAS_LABORATORIOS', label: 'Reservar Salas', roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'RESERVAR_EQUIPAMENTOS', label: 'Reservar Equipamentos', roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'RESERVAR_BICICLETAS_TROTINETES', label: 'Reservar Bicicletas', roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] },
  { id: 'VER_DASHBOARD_TEMPERATURA', label: 'Dash: Temp', roles: ['STAFF', 'ADMIN'] },
  { id: 'VER_DASHBOARD_QUALIDADE_AR', label: 'Dash: Ar', roles: ['STAFF', 'ADMIN'] },
  { id: 'VER_DASHBOARD_CONSUMO_ENERGETICO', label: 'Dash: Energia', roles: ['STAFF', 'ADMIN'] },
  { id: 'VER_SUSTENTABILIDADE', label: 'Sustentabilidade', roles: ['STAFF', 'ADMIN'] },
  { id: 'GERIR_USERS', label: 'Gestão Users', roles: ['ADMIN'] },
  { id: 'GERIR_SALAS_LABORATORIOS', label: 'Gestão Salas/Labs', roles: ['ADMIN'] },
  { id: 'GERIR_EQUIPAMENTOS', label: 'Gestão Equipamentos', roles: ['ADMIN'] },
  { id: 'GERIR_BICICLETAS_TROTINETES', label: 'Gestão Equipamentos', roles: ['ADMIN'] },
  { id: 'GERIR_EMENTA', label: 'Gestão Ementa', roles: ['ADMIN'] },
  { id: 'GERIR_SENSORES', label: 'Gestão Sensores', roles: ['ADMIN'] }
];

export default function UserModel({ user, onClose, onSave }) {
  const [ativo, setAtivo] = useState(true);
  const [permissions, setPermissions] = useState([]);

  // 🔴 CORREÇÃO 1: Usar 'user?.id' nas dependências impede que os re-renders da página principal 
  // façam reset forçado ao teu array local enquanto estás a clicar nas caixas.
  useEffect(() => {
    if (user) {
      setAtivo(user.isActive ?? true);
      setPermissions(Array.isArray(user.permissions) ? user.permissions : []);
    }
  }, [user?.id]); 

  const userRole = user?.type?.toUpperCase() || 'STUDENT';
  const permissoesVisiveis = MAPA_PERMISSOES.filter(perm => perm.roles.includes(userRole));

  // 🔴 CORREÇÃO 2: Lógica imutável baseada no estado anterior (prev) para garantir
  // que o React detete a mudança na memória e redesenhe a checkbox no mesmo milissegundo.
  const handleTogglePermission = (permissionId, isChecked) => {
    setPermissions((prev) => {
      if (isChecked) {
        return [...prev, permissionId];
      } else {
        return prev.filter(id => id !== permissionId);
      }
    });
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  
  // Enviamos os dados mapeados das duas formas para dar com qualquer backend
  onSave(user.id, {
    ativo: ativo,
    isActive: ativo,
    permissions: permissions,
    novasPermissoes: permissions
  });
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl flex flex-col max-h-[85vh] text-[#000066]">
        
        {/* Cabeçalho */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight">
            Gerir Utilizador: <span className="text-primary font-medium">{user?.name}</span>
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-semibold transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Status da Conta */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-sm font-bold tracking-wide uppercase">Status da Conta</span>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  ativo ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {ativo ? "ATIVA" : "SUSPENSA"}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={ativo}
                    onChange={(e) => setAtivo(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
                </label>
              </div>
            </div>

            {/* Secção de Permissões Filtradas */}
            <div>
              <h3 className="text-sm font-bold tracking-wider uppercase mb-3">
                Permissões Autorizadas ({userRole})
              </h3>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-4 border border-gray-200 rounded-xl max-h-64 overflow-y-auto bg-gray-50/50">
                {permissoesVisiveis.map((perm) => {
                  const isChecked = permissions.includes(perm.id);

                  return (
                    <label key={perm.id} className="flex items-center gap-3 text-sm font-medium text-blue-950 cursor-pointer hover:opacity-80 select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        // 🔴 Executa a função otimizada passando o ID e o estado booleano do evento
                        onChange={(e) => handleTogglePermission(perm.id, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900 cursor-pointer"
                      />
                      <span>{perm.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Botões do Rodapé */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold border border-gray-300 bg-white hover:bg-gray-100 text-blue-950 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-blue-900 text-white hover:bg-blue-950 rounded-xl shadow-md transition-all"
            >
              Gravar Definições
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}