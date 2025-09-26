"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Locale } from '@/i18n-config';

type AuthFormProps = {
  t: any;
  lang: Locale;
};

const emailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const phoneSchema = z.object({
  phone: z.string().min(9),
});

const codeSchema = z.object({
  code: z.string().length(6),
});

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier,
        confirmationResult?: ConfirmationResult
    }
}

export function AuthForm({ t, lang }: AuthFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneStep, setPhoneStep] = useState<'phone' | 'code'>('phone');
  
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '', password: '' },
  });

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  const codeForm = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: '' },
  });

  const handleAuth = async (action: 'signup' | 'login', data: z.infer<typeof emailSchema>) => {
    setIsSubmitting(true);
    try {
      if (action === 'signup') {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      }
      router.push(`/${lang}/profile`);
    } catch (error: any) {
      toast({ variant: 'destructive', title: t.error, description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push(`/${lang}/profile`);
    } catch (error: any) {
      toast({ variant: 'destructive', title: t.error, description: error.message });
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
    return window.recaptchaVerifier;
  }

  const onPhoneSignInSubmit = async (data: z.infer<typeof phoneSchema>) => {
    setIsSubmitting(true);
    const verifier = setupRecaptcha();
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, `+51${data.phone}`, verifier);
      window.confirmationResult = confirmationResult;
      setPhoneStep('code');
    } catch(error: any) {
       toast({ variant: 'destructive', title: t.error, description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  }

  const onCodeSubmit = async (data: z.infer<typeof codeSchema>) => {
      setIsSubmitting(true);
      try {
        await window.confirmationResult?.confirm(data.code);
        router.push(`/${lang}/profile`);
      } catch (error: any) {
         toast({ variant: 'destructive', title: t.error, description: error.message });
      } finally {
          setIsSubmitting(false);
      }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">{t.emailTab}</TabsTrigger>
            <TabsTrigger value="phone">{t.phoneTab}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <Form {...emailForm}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4 pt-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.emailLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={emailForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.passwordLabel}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button onClick={emailForm.handleSubmit((d) => handleAuth('login', d))} disabled={isSubmitting} className="w-full">{t.login}</Button>
                  <Button onClick={emailForm.handleSubmit((d) => handleAuth('signup', d))} disabled={isSubmitting} variant="secondary" className="w-full">{t.signup}</Button>
                </div>
              </form>
            </Form>
             <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t.orContinueWith}
                </span>
              </div>
            </div>
             <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                {t.google}
            </Button>
          </TabsContent>

          <TabsContent value="phone">
            {phoneStep === 'phone' ? (
                <Form {...phoneForm}>
                    <form onSubmit={phoneForm.handleSubmit(onPhoneSignInSubmit)} className="space-y-4 pt-4">
                        <FormField
                        control={phoneForm.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t.phoneLabel}</FormLabel>
                            <FormControl>
                                <div className='flex items-center gap-2'>
                                    <span className='p-2 rounded-md border bg-muted'>+51</span>
                                    <Input placeholder="987 654 321" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isSubmitting} className="w-full">{t.sendCode}</Button>
                    </form>
                </Form>
            ) : (
                <Form {...codeForm}>
                    <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4 pt-4">
                        <FormField
                        control={codeForm.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t.codeLabel}</FormLabel>
                            <FormControl>
                                <Input placeholder="123456" {...field} />
                            </FormControl>
                             <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isSubmitting} className="w-full">{t.verifyCode}</Button>
                    </form>
                </Form>
            )}
          </TabsContent>
        </Tabs>
        <div id="recapt