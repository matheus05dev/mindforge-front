'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Lock, Mail, Github, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '@/components/ui/logo';

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
  password: z.string().min(1, { message: 'Senha é obrigatória.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/authenticate', values);
      const { token } = response.data;
      
      const user = { email: values.email }; 
      setAuth(token, user);
      
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
        console.error(error);
      toast.error('Falha no login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
  };

  return (
    <Card className="border-zinc-200/90 dark:border-zinc-800/50 shadow-2xl shadow-primary/10 dark:shadow-primary/20 bg-white dark:bg-zinc-950/90 backdrop-blur-xl">
      <CardHeader className="space-y-4 text-center items-center pb-2">
        <Logo width={64} height={64} showText={true} />
        <CardDescription>
          Entre para continuar sua jornada de aprendizado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full border-input bg-background hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all font-medium" 
          onClick={handleGithubLogin}
        >
          <Github className="mr-2 h-4 w-4" />
          Entrar com GitHub
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="seu@email.com" className="pl-10 h-11" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="******" 
                        className="pl-10 pr-10 h-11" 
                        {...field} 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                       {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full h-11 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 transition-all duration-300 text-white font-semibold shadow-lg shadow-blue-500/20 mt-2" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground border-t border-border/40 pt-6">
        <div>
          Não tem uma conta?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors">
            Cadastre-se
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
