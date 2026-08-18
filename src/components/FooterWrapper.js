'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname() || '';

  const isHidden =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin');

  if (isHidden) return null;

  return <Footer />;
}
