'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavigationWrapper() {
  const pathname = usePathname() || '';
  
  const isHidden =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin');

  if (isHidden) return null;

  return <Navbar />;
}
