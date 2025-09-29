
"use client";

import { useState, useEffect, useRef, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { useFormStatus } from 'react-dom';
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
import {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    sendVerificationCode,
    verifyPhoneNumber,
    AuthState,
} from './actions';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';

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
  verificationCode: z.string().length(6),
});


const emailDomains = ['gmail.com', 'outlook.com', 'yahoo.com'];

function SubmitButton({ text, formAction }: { text: string, formAction?: (payload: FormData) => void }) {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending} formAction={formAction} className="w-full">{text}</Button>
}

function GoogleButton({ text, formAction }: { text: string, formAction?: (payload: FormData) => void }) {
    const { pending } = useFormStatus();
    return <Button type="submit" variant="outline" className="w-full" disabled={pending} formAction={formAction}>{text}</Button>
}


export function AuthForm({ t, lang }: AuthFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [tab, setTab] = useState<'email' | 'phone'>('email');
    const [phoneStep, setPhoneStep] = useState<'phone' | 'code'>('phone');
    
    // --- Centralized Action State ---
    const [formState, formAction] = useActionState<AuthState | undefined, FormData>(
        async (previousState, formData) => {
            const action = formData.get('action') as string;
            if (action === 'google') return signInWithGoogle(previousState, formData);
            if (action === 'sendCode') return sendVerificationCode(previousState, formData);
            if (action === 'verifyCode') return verifyPhoneNumber(previousState, formData);
            // Default to email actions if not specified
            return signInWithEmail(previousState, formData);
        },
        undefined
    );

    // --- Refs ---
    const recaptchaContainerRef = useRef<HTMLDivElement>(null);
    const suggestionsRef = useRef<HTMLUListElement>(null);

    // --- Forms ---
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
        defaultValues: { verificationCode: '' },
    });

    const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    
    // --- Centralized Auth Result Handling ---
    useEffect(() => {
        if (!formState) return;

        if (formState.error) {
            const errorMessageKey = formState.error as keyof Dictionary['auth']['errors'];
            toast({
                variant: 'destructive',
                title: t.error,
                description: t.errors[errorMessageKey] || t.errors['auth/default'],
            });
        } else if (formState.success) {
            router.push(`/${lang}/profile`);
        } else if (formState.isGoogleRedirect) {
            // Redirect is handled by Firebase, nothing to do here
        } else if (formState.isPhoneStep) {
            handleSendVerificationCode();
        }

    }, [formState, lang, router, t, toast]);


    const handleSendVerificationCode = async () => {
        try {
            const phoneNumber = `+51${phoneForm.getValues('phone')}`;
            const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
            });
            window.confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
            setPhoneStep('code');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: t.error,
                description: t.errors[error.code as keyof typeof t.errors] || t.errors['auth/default']
            });
        }
    };
    
    const handleVerifyCode = async () => {
        try {
            const code = codeForm.getValues('verificationCode');
            if (window.confirmationResult) {
                await window.confirmationResult.confirm(code);
                router.push(`/${lang}/profile`);
            }
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: t.error,
                description: t.errors[error.code as keyof typeof t.errors] || t.errors['auth/default']
            });
        }
    }


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

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">{t.title}</CardTitle>
                <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={tab} onValueChange={(value) => setTab(value as 'email' | 'phone')}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="email">{t.emailTab}</TabsTrigger>
                        <TabsTrigger value="phone">{t.phoneTab}</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="email">
                        <Form {...emailForm}>
                            <form action={formAction} className="space-y-4 pt-4">
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
                                     <SubmitButton text={t.login} formAction={signInWithEmail} />
                                     <Button type="submit" formAction={signUpWithEmail} variant="secondary" className="w-full">{t.signup}</Button>
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
                        <form action={formAction}>
                           <input type="hidden" name="action" value="google" />
                           <GoogleButton text={t.google}/>
                        </form>
                    </TabsContent>

                    <TabsContent value="phone">
                        {phoneStep === 'phone' ? (
                            <Form {...phoneForm}>
                                <form action={formAction} className="space-y-4 pt-4">
                                     <input type="hidden" name="action" value="sendCode" />
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
                                    <SubmitButton text={t.sendCode} />
                                </form>
                            </Form>
                        ) : (
                            <Form {...codeForm}>
                                <form onSubmit={codeForm.handleSubmit(handleVerifyCode)} className="space-y-4 pt-4">
                                    <FormField
                                    control={codeForm.control}
                                    name="verificationCode"
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
                                    <Button type="submit" className="w-full">{t.verifyCode}</Button>
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
