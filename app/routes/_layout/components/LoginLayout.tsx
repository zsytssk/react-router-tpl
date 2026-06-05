import { ReactElement } from 'react';

import { Footer } from './footer';
import Header from './header';

export default function LoginLayout({ children }: { children?: ReactElement }) {
  return (
    <div className="relative flex h-screen flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
