import { LoginForm } from '@/components/modules/auth/login-form';
import React from 'react';

const Page = () => {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Login</h2>
      <LoginForm />
    </div>
  );
};

export default Page;
