import { ReactElement } from 'react';
import { Footer } from './footer';
import Header from './header';

export default function LoginLayout({ children }: { children?: ReactElement }) {
  return (
    <div className="h-screen flex flex-col relative">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
