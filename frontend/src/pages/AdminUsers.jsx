import React, { useState, useEffect } from 'react';
import UserModel from '../components/UserModel';
import { getAllUsers, updateUserPermissions } from "../lib/users";

export default function AdminUsers() {
  const [utilizadores, setUtilizadores] = useState([]);
  const [utilizadorSelecionado, setUtilizadorSelecionado] = useState(null);
  const [erro, setErro] = useState(null);

  const carregarUtilizadores = () => {
    getAllUsers()
      .then(data => {
        // Proteção caso a API não devolva um array puro
        setUtilizadores(Array.isArray(data) ? data : []);
        setErro(null);
      })
      .catch(err => {
        console.error("Erro ao carregar:", err);
        setErro(err.message);
        setUtilizadores([]);
      });
  };

  useEffect(() => {
    carregarUtilizadores();
  }, []); // O array vazio garante que só roda uma vez ao abrir a página

  const handleSalvarAlteracoes = (id, dadosAtualizados) => {
    updateUserPermissions(id, dadosAtualizados.ativo, dadosAtualizados.novasPermissoes)
      .then(() => {
        carregarUtilizadores();
        setUtilizadorSelecionado(null);
      })
      .catch(err => alert(err.message));
  };

  return (
    <div className="container mx-auto p-8 max-w-7xl font-sans">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Account & Privilege Management</h1>
        <p className="text-muted-foreground mt-1">Manage user access levels, active sessions, and system permissions.</p>
      </div>
      
      {erro && (
        <div className="p-4 mb-4 text-sm bg-destructive/15 text-destructive rounded-lg border border-destructive/20">
          <span className="font-semibold">Erro de Ligação:</span> {erro}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="p-4 font-semibold text-foreground">Name</th>
              <th className="p-4 font-semibold text-foreground">Email</th>
              <th className="p-4 font-semibold text-foreground">Role</th>
              <th className="p-4 font-semibold text-foreground">Status</th>
              <th className="p-4 font-semibold text-foreground text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {utilizadores.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              utilizadores.map(user => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium text-foreground">{user.name}</td>
                  <td className="p-4 text-muted-foreground">{user.email}</td>
                  <td className="p-4 text-foreground">
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                      {user.type}
                    </code>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      user.isActive 
                        ? 'bg-green-500/15 text-green-600' 
                        : 'bg-destructive/15 text-destructive'
                    }`}>
                      {user.isActive ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setUtilizadorSelecionado(user)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 font-medium rounded-lg shadow-sm text-xs"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {utilizadorSelecionado && (
        <UserModel 
          user={utilizadorSelecionado} 
          onClose={() => setUtilizadorSelecionado(null)} 
          onSave={handleSalvarAlteracoes}
        />
      )}
    </div>
  );
}