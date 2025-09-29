
'use server';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { z } from 'zod';
import { headers } from 'next/headers';

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

export type AuthState = {
  success?: boolean;
  error?: string;
  isGoogleRedirect?: boolean;
  isPhoneStep?: boolean;
};

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export async function signUpWithEmail(prevState: AuthState, formData: FormData): Promise<AuthState> {
    const rawFormData = Object.fromEntries(formData);
    try {
        const { email, password } = emailSchema.parse(rawFormData);
        await createUserWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (error: any) {
        return { error: error.code || 'auth/default' };
    }
}

export async function signInWithEmail(prevState: AuthState, formData: FormData): Promise<AuthState> {
    const rawFormData = Object.fromEntries(formData);
    try {
        const { email, password } = emailSchema.parse(rawFormData);
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (error: any) {
        return { error: error.code || 'auth/default' };
    }
}

export async function signInWithGoogle(): Promise<AuthState> {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
    // This will trigger a redirect and the flow will continue on the client after redirect.
    return { isGoogleRedirect: true };
  } catch (error: any) {
    return { error: error.code || 'auth/default' };
  }
}

export async function sendVerificationCode(prevState: any, formData: FormData): Promise<AuthState>{
    const rawFormData = Object.fromEntries(formData);
    try {
        const { phone } = phoneSchema.parse(rawFormData);
        // Due to RecaptchaVerifier requiring a DOM element, the actual signInWithPhoneNumber
        // needs to be triggered from the client. This server action's role is to validate
        // the form and signal the client to proceed with the phone auth.
        return { isPhoneStep: true, success: true };
  } catch (error: any)    {
    return { error: error.code || 'auth/default' };
  }
}

export async function verifyPhoneNumber(prevState: any, formData: FormData): Promise<AuthState>{
     const rawFormData = Object.fromEntries(formData);
    try {
        const { verificationCode } = codeSchema.parse(rawFormData);
        // The `confirmationResult` is not available on the server.
        // This verification must happen on the client side where `window.confirmationResult` is stored.
        return { isPhoneStep: false, success: true };

    } catch (error: any) {
        return { error: error.code || 'auth/default' };
    }
}
