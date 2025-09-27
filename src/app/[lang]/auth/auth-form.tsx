
"use client";

import { useState, useEffect, useRef, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Locale } from '@/i18n-config';
import { cn } from '@/lib/utils';
import { Dictionary } from '@/lib/definitions';
import { signUpWithEmail, signInWithEmail, signInWithGoogle, sendVerificationCode, verifyPhoneNumber } from './actions';
import { ConfirmationResult } from 'firebase/auth';

type AuthFormProps = {
  t: Dictionary['auth'];
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
    confirmationResult?: ConfirmationResult;
  }
}

const emailDomains = ['gmail.com', 'outlook.com', 'yahoo.com'];

export function AuthForm({ t, lang }: AuthFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  
  const [phoneStep, setPhoneStep] = useState<'phone' | 'code'>('phone');
  
  const [signUpState, signUpAction, isSigningUp] = useActionState(signUpWithEmail, undefined);
  const [signInState, signInAction, isSigningIn] = useActionState(signInWithEmail, undefined);
  const [googleSignInState, googleSignInAction, isSigningInWithGoogle] = useActionState(signInWithGoogle, undefined);
  const [phoneState, phoneAction, isSendingCode] = useActionState(sendVerificationCode, undefined);
  const [codeState, codeAction, isVerifyingCode] = useActionState(verifyPhoneNumber, undefined);


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

  const handleAuthResult = (state: { error?: string; success?: boolean } | undefined, redirect: boolean = true) => {
    if (state?.error) {
      const errorMessageKey = state.error as keyof Dictionary['auth']['errors'];
      toast({ 
        variant: 'destructive', 
        title: t.error, 
        description: t.errors[errorMessageKey] || t.errors['auth/default'] 
      });
    }
    if (state?.success && redirect) {
      router.push(`/${lang}/profile`);
    }
  };

  useEffect(() => {
    handleAuthResult(signUpState);
  }, [signUpState]);

  useEffect(() => {
    handleAuthResult(signInState);
  }, [signInState]);

  useEffect(() => {
    handleAuthResult(googleSignInState, false); // Google redirect is handled by Firebase
  }, [googleSignInState]);
  
  useEffect(() => {
     if(phoneState?.success) {
        setPhoneStep('code');
     }
     if(phoneState?.error) {
        handleAuthResult(phoneState);
     }
  }, [phoneState]);

   useEffect(() => {
     if(codeState?.success) {
        router.push(`/${lang}/profile`);
     }
     if(codeState?.error) {
        handleAuthResult(codeState);
     }
  }, [codeState]);
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    emailForm.setValue('email', value);

    if (value.includes('@')) {
      const atIndex = value.indexOf('@');
      const username = value.substring(0, atIndex);
      const domainPart = value.substring(atIndex + 1);
      
      const filteredDomains = emailDomains.filter(domain => domain.startsWith(domainPart));

      if (filteredDomains.length > 0 && domainPart.length < filteredDomains[0].length) {
         setEmailSuggestions(filteredDomains.map(domain => `${username}@${domain}`));
      } else {
         setEmailSuggestions([]);
      }

    } else {
      setEmailSuggestions([]);
    }
    setActiveSuggestion(-1);
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (emailSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestion(prev => (prev < emailSuggestions.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestion(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter' && activeSuggestion > -1) {
        e.preventDefault();
        handleSuggestionClick(emailSuggestions[activeSuggestion]);
      } else if (e.key === 'Escape') {
        setEmailSuggestions([]);
      }
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    emailForm.setValue('email', suggestion);
    setEmailSuggestions([]);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setEmailSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [suggestionsRef]);

  const isSubmitting = isSigningIn || isSigningUp || isSigningInWithGoogle || isSendingCode || isVerifyingCode;

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
              <form className="space-y-4 pt-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.emailLabel}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="name@example.com" 
                            {...field} 
                            onChange={handleEmailChange}
                            onKeyDown={handleEmailKeyDown}
                            autoComplete="off"
                          />
                          {emailSuggestions.length > 0 && (
                            <ul ref={suggestionsRef} className="absolute z-10 w-full bg-card border border-border rounded-md mt-1 shadow-lg">
                              {emailSuggestions.map((suggestion, index) => (
                                <li
                                  key={suggestion}
                                  className={cn(
                                    "px-3 py-2 cursor-pointer hover:bg-muted",
                                    index === activeSuggestion && "bg-muted"
                                  )}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
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
                  <Button 
                    onClick={() => emailForm.handleSubmit((data) => signInAction(data))()} 
                    disabled={isSubmitting} 
                    className="w-full"
                  >
                    {t.login}
                  </Button>
                  <Button 
                    onClick={() => emailForm.handleSubmit((data) => signUpAction(data))()}
                    disabled={isSubmitting} 
                    variant="secondary" 
                    className="w-full"
                  >
                    {t.signup}
                  </Button>
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
             <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => googleSignInAction()}
                disabled={isSubmitting}
              >
                {t.google}
            </Button>
          </TabsContent>

          <TabsContent value="phone">
            {phoneStep === 'phone' ? (
                <Form {...phoneForm}>
                    <form onSubmit={phoneForm.handleSubmit((data) => phoneAction({phone: `+51${data.phone}`}))} className="space-y-4 pt-4">
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
                    <form onSubmit={codeForm.handleSubmit(data => codeAction({verificationCode: data.code}))} className="space-y-4 pt-4">
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
        <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
      </CardContent>
    </Card>
  );
}
