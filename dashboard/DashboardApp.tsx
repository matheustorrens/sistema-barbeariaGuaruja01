import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Sidebar, DashPage } from './components/Sidebar';
import { ServicesPage  } from './pages/ServicesPage';
import { TeamPage      } from './pages/TeamPage';
import { BusinessPage  } from './pages/BusinessPage';
import { GalleryPage   } from './pages/GalleryPage';
import { MetricsPage   } from './pages/MetricsPage';

export const DashboardApp: React.FC = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed]           = useState(false);
  const [page, setPage]               = useState<DashPage>('metrics');
  const navigate = useNavigate();

  useEffect(() => {
    return onAuthStateChanged(auth, user => {
      setAuthed(!!user);
      setAuthChecked(true);
      if (!user) navigate('/dashboard/login', { replace: true });
    });
  }, [navigate]);

  if (!authChecked) {
    return (
      <div
        className="min-h-screen bg-white flex items-center justify-center"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) return null;

  const pages: Record<DashPage, React.ReactNode> = {
    metrics:  <MetricsPage  />,
    services: <ServicesPage />,
    team:     <TeamPage     />,
    business: <BusinessPage />,
    gallery:  <GalleryPage  />,
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <Sidebar
        current={page}
        onNavigate={setPage}
        onLogout={() => signOut(auth).then(() => navigate('/'))}
      />
      <main className="flex-1 p-5 md:p-8 overflow-auto min-h-screen pt-[76px] md:pt-8 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto">
          {pages[page]}
        </div>
      </main>
    </div>
  );
};
