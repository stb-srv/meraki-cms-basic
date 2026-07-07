import type { Metadata } from 'next';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { SettingsProvider } from '@/components/providers/SettingsProvider';

export const metadata: Metadata = {
  title: 'Taverna Zeus - CMS',
  description: 'Content Management System für Taverna Zeus',
};

// Force dynamic rendering for all CMS pages to prevent SSR errors
// when Supabase environment variables are not available during build
export const dynamic = 'force-dynamic';

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SettingsProvider>
        {children}
      </SettingsProvider>
    </AuthProvider>
  );
}
