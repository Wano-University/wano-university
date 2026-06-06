import React from 'react';
import AdminUsers from './AdminUsers';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="border-b border-border bg-card p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-lg font-bold text-primary tracking-wider">WANO UNIVERSITY — ADMIN PANEL</span>
          <span className="text-xs bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full font-semibold">Ambiente de Controlo</span>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6">
        <AdminUsers />
      </main>
    </div>
  );
}