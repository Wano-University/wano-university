import { useState } from 'react';
import { Card } from '../components/ui/card';
import { FieldSet, FieldGroup, Field, FieldLabel } from '../components/ui/field';
import { Combobox, ComboboxInput, ComboboxContent, ComboboxEmpty, ComboboxList, ComboboxItem } from '../components/ui/combobox';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';


export default function LoginPage(){


  return(

    <section id="create" className="py-24 max-w-7xl mx-auto px-6">
    <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mt-2">Register Account</h2>
      </div>

      <Card className="max-w-4xl mx-auto p-8 shadow-lg border-border hover:shadow-xl transition-all mt-16">
        <form onSubmit={registerUser} className="w-full">
        </form>

      </Card>
   

    </section>
  )
}
