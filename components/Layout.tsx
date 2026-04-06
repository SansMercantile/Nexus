import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <header>
        {/* Add header content */}
      </header>
      <main>{children}</main>
      <footer>
        {/* Add footer content */}
      </footer>
    </div>
  );
}