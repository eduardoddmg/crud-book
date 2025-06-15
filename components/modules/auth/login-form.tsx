'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

// 1. Defina seu esquema de formulário com Zod.
const FormSchema = z.object({
  email: z.string().email({
    message: 'Por favor, insira um endereço de e-mail válido.',
  }),
  password: z.string().min(1, {
    // Apenas verifica se não está vazio
    message: 'A senha é obrigatória.',
  }),
});

export function LoginForm() {
  // 2. Defina seu formulário com React Hook Form.
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 3. Defina um manipulador de envio.
  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Faça o que quiser com os dados do formulário.
    // Exemplo: autenticar o usuário.
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
        {/* Campo Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seuemail@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Campo Senha */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Sua senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Entrar
        </Button>
        <p className="text-md text-muted-foreground font-bold">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-blue-500 hover:underline">
            Registre-se
          </Link>
        </p>
      </form>
    </Form>
  );
}
