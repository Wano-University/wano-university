import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from "lucide-react";
import UserModel from '../components/UserModel';
import EditUser from '../components/EditUser';
import { getAllUsers, updateUserPermissions, updateUserData } from "../lib/users";
import { useTranslation } from "react-i18next";

export default function AdminUsers() {
  console.log("--- AdminUsers carregado ---");
  const [utilizadores, setUtilizadores] = useState([]);
  const [utilizadorSelecionado, setUtilizadorSelecionado] = useState(null); // Para Permissões
  const [userParaEditar, setUserParaEditar] = useState(null); // Para Dados Pessoais
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  

  const carregarUtilizadores = () => {
    getAllUsers()
      .then(data => {
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
  }, []);

  const handleSalvarPermissoes = (id, dadosAtualizados) => {
    updateUserPermissions(id, dadosAtualizados.ativo, dadosAtualizados.novasPermissoes)
      .then(() => {
        carregarUtilizadores();
        setUtilizadorSelecionado(null);
      })
      .catch(err => alert(err.message));
  };

  const handleSalvarEdicao = (id, dados) => {
    updateUserData(id, dados)
      .then(() => {
        carregarUtilizadores();
        setUserParaEditar(null);
      })
      .catch(err => alert(err.message));
  };

  return (
    <div className="container mx-auto p-8 max-w-7xl font-sans">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('AdminUTitle')}</h1>
          <p className="text-muted-foreground mt-1">{t('AdminUDesc')}</p>
        </div>
        
        <button 
          onClick={() => navigate('/createacc')}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 font-medium rounded-lg shadow-sm text-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t('AdminUCreate')}
        </button>
      </div>
      
      {erro && (
        <div className="p-4 mb-4 text-sm bg-destructive/15 text-destructive rounded-lg border border-destructive/20">
          <span className="font-semibold">{t('AdminUErr')}:</span> {erro}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="p-4 font-semibold text-foreground">{t('AdminUName')}</th>
              <th className="p-4 font-semibold text-foreground">{t('AdminUEmail')}</th>
              <th className="p-4 font-semibold text-foreground">{t('AdminURole')}</th>
              <th className="p-4 font-semibold text-foreground">{t('AdminUStatus')}</th>
              <th className="p-4 font-semibold text-foreground text-right">{t('AdminUAction')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {utilizadores.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-muted-foreground">{t('AdminUNoU')}</td>
              </tr>
            ) : (
              utilizadores.map(user => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium text-foreground">{user.name}</td>
                  <td className="p-4 text-muted-foreground">{user.email}</td>
                  <td className="p-4 text-foreground">
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{user.type}</code>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.isActive ? 'bg-green-500/15 text-green-600' : 'bg-destructive/15 text-destructive'}`}>
                      {user.isActive ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="p-4 text-right flex gap-2 justify-end">
                    <button 
                      onClick={() => setUtilizadorSelecionado(user)}
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1 rounded-lg text-xs transition-all"
                    >
                      {t('AdminUPerms')}
                    </button>
                    <button 
                      onClick={() => setUserParaEditar(user)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded-lg text-xs transition-all"
                    >
                      {t('AdminUEdit')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modais */}
      {utilizadorSelecionado && (
        <UserModel 
          user={utilizadorSelecionado} 
          onClose={() => setUtilizadorSelecionado(null)} 
          onSave={handleSalvarPermissoes}
        />
      )}
      {userParaEditar && (
        <EditUser
          user={userParaEditar} 
          onClose={() => setUserParaEditar(null)} 
          onSave={handleSalvarEdicao}
        />
      )}
    </div>
  );
}