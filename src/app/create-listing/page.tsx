import { redirect } from 'next/navigation';
import { i18n } from '@/i18n-config';

export default function CreateListingPage() {
  redirect(`/${i18n.defaultLocale}/create-listing`);
}
