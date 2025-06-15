import { RegisterForm } from '@/components/modules/auth/register-form';
import React from 'react';

const Page = () => {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Crie a sua conta</h2>
      <RegisterForm />
    </div>
  );
};

export default Page;
