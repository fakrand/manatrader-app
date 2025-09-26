"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Locale, i18n } from '@/i18n-config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: () => {},
});

const protectedRoutes = ['/profile', '/create-listing'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      const lang = (pathname.split('/')[1] || i18n.defaultLocale) as Locale;
      const currentRoute = pathname.substring(pathname.indexOf('/', 1));

      if (!user && protectedRoutes.some(route => currentRoute.startsWith(route))) {
        router.push(`/${lang}/auth`);
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    const lang = (pathname.split('/')[1] || i18n.defaultLocale) as Locale;
    router.push(`/${lang}`);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const lang = (pathname.split('/')[1] || i18n.defaultLocale) as Locale;

  useEffect(() => {
    if (!loading && user) {
      router.push(`/${lang}/profile`);
    }
  }, [user, loading, router, lang]);

  if (loading || user) {
    // You can show a loading spinner here
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  return <>{children}</>;
}
