import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { FieldSet, FieldGroup, Field, FieldLabel } from '../components/ui/field';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function EditUserModal({ user, onClose, onSave }) {
  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useState({
  name: user?.name || '',
  email: user?.email || '',
  address: user?.address || '',
  nif: user?.nif || '',
  login: user?.login || user?.username || '' // Experimenta usar o nome que o backend espera
});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await onSave(user.id, formData);
      setStatus('success');
      setTimeout(onClose, 800);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      {/* Alterado bg-white para bg-card (que muda conforme o tema) */}
      <Card className="w-full max-w-2xl p-8 shadow-xl border-border bg-card">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Edit User: {user.name}</h2>
        
        <form onSubmit={handleSubmit} className="w-full">
          <FieldSet className="w-full space-y-6">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <Field className="col-span-2">
                <FieldLabel className="text-foreground">Full Name:</FieldLabel>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </Field>

              <Field className="col-span-2">
                <FieldLabel className="text-foreground">Email:</FieldLabel>
                <Input name="email" value={formData.email} onChange={handleChange} type="email" required />
              </Field>

              <Field>
                <FieldLabel className="text-foreground">Address:</FieldLabel>
                <Input name="address" value={formData.address} onChange={handleChange} required />
              </Field>

              <Field>
                <FieldLabel className="text-foreground">NIF:</FieldLabel>
                <Input name="nif" value={formData.nif} onChange={handleChange} required minLength={9} maxLength={9} />
              </Field>

              <Field className="col-span-2">
                <FieldLabel className="text-foreground">Login (Username):</FieldLabel>
                <Input name="login" value={formData.login} onChange={handleChange} required />
              </Field>

            </FieldGroup>
          </FieldSet>

          <div className="flex items-center justify-end gap-2 mt-8">
            <Button type="button" onClick={onClose} variant="outline" className="cursor-pointer">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={status === 'loading'}
              className="cursor-pointer transition-all"
            >
              {status === 'loading' && 'Saving...'}
              {status === 'success' && 'Saved ✓'}
              {status === 'error' && 'Error. Try Again.'}
              {status === 'idle' && 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}