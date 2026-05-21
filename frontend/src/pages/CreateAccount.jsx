import { useState } from 'react';
import { Card } from '../components/ui/card';
import { FieldSet, FieldGroup, Field, FieldLabel } from '../components/ui/field';
import { Combobox, ComboboxInput, ComboboxContent, ComboboxEmpty, ComboboxList, ComboboxItem } from '../components/ui/combobox';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const types = ["Admin", "Student", "Professor", "Staff"];

export default function CreateAccount() {
  const [status, setStatus] = useState('idle');

  const registerUser = (e) => {
    e.preventDefault();
  };

  return (
    <section id="create" className="py-24 max-w-7xl mx-auto px-6">

      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mt-2">Register Account</h2>
      </div>

      <Card className="max-w-4xl mx-auto p-8 shadow-lg border-border hover:shadow-xl transition-all mt-16">
        <form onSubmit={registerUser} className="w-full">

          <FieldSet className="w-full space-y-6">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <Field className="col-span-2">
                <FieldLabel htmlFor="type">Account Type:</FieldLabel>
                <Combobox items={types}>
                  <ComboboxInput
                    id="type"
                    name="type"
                    placeholder="Select account type..."
                    required className="bg-white"
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList className="bg-white">
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>

              <Field>
                <FieldLabel htmlFor="name">Name:</FieldLabel>
                <Input name="name" id="name" placeholder="Name" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="surname">Surname:</FieldLabel>
                <Input name="surname" id="surname" placeholder="Surname" required />
              </Field>

              <Field className="col-span-2">
                <FieldLabel htmlFor="address">Address:</FieldLabel>
                <Input name="address" id="address" placeholder="Address" required />
              </Field>

              <Field className="col-span-2">
                <FieldLabel htmlFor="nif">NIF:</FieldLabel>
                <Input name="nif" id="nif" placeholder="NIF" required minLength={9} maxLength={9} />
              </Field>

              <Field className="col-span-2">
                <FieldLabel htmlFor="email">Email:</FieldLabel>
                <Input name="email" id="email" placeholder="Email" type="email" required />
              </Field>

              <Field className="col-span-2">
                <FieldLabel htmlFor="login">Login:</FieldLabel>
                <Input name="login" id="login" placeholder="Login" type="login" required />
              </Field>

              <Field className="col-span-2">
                <FieldLabel htmlFor="password">Password:</FieldLabel>
                <Input name="password" id="password" placeholder="Password" type="password" required />
              </Field>

            </FieldGroup>
          </FieldSet>

          <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
            <Button type="reset" className="mt-4 cursor-pointer bg-purple-900 text-white">
              Clear
            </Button>
            <Button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className={`mt-4 cursor-pointer transition-all ${status === 'success' ? 'bg-purple-800 text-white' :
                status === 'error' ? 'bg-red-800 text-white' : ''
                }`}
            >
              {status === 'loading' && 'Registering...'}
              {status === 'success' && 'Account Registered ✓'}
              {status === 'error' && 'Error. Try Again.'}
              {status === 'idle' && 'Register'}
            </Button>
          </div>

        </form>
      </Card>
    </section>
  );
}
