import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className=" max-w-2xl mx-auto p-4 py-20">{children}</div>;
}
