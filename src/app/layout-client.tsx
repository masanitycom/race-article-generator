'use client';

import { useEffect } from 'react';
import { Header } from '../components/Header';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="app-container">
        <Header />
        <main className="page-content">
          {children}
        </main>
        <footer className="site-footer">
          <div className="footer-container">
            <p>&copy; {new Date().getFullYear()} DeepStride競馬AI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
