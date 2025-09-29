
import { getDictionary } from '@/lib/dictionaries';
import { AuthForm } from './auth-form';
import { AuthLayout } from '@/hooks/use-auth';

export default async function AuthPage() {
    const dict = await getDictionary();
    const t = dict.auth;

    return (
        <AuthLayout>
            <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
                <AuthForm t={t} />
            </div>
        </AuthLayout>
    );
}
