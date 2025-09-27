
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/i18n-config';
import { AuthForm } from './auth-form';
import { AuthLayout } from '@/hooks/use-auth';

export default async function AuthPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dict = await getDictionary(lang);
    const t = dict.auth;

    return (
        <AuthLayout>
            <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
                <AuthForm t={t} lang={lang} />
            </div>
        </AuthLayout>
    );
}
