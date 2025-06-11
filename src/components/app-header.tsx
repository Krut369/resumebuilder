
import { Logo } from '@/components/icons/logo';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="py-6 px-4 md:px-8 border-b">
      <div className="container mx-auto">
        <Link href="/" aria-label="ResumePilot Home">
          <Logo />
        </Link>
      </div>
    </header>
  );
}
