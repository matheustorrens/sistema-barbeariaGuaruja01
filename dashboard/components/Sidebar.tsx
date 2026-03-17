import React from 'react';
import { BarChart2, Scissors, Users, Settings, Image, LogOut, ExternalLink, type LucideIcon } from 'lucide-react';

export type DashPage = 'metrics' | 'services' | 'team' | 'business' | 'gallery';

interface Props {
  current: DashPage;
  onNavigate: (p: DashPage) => void;
  onLogout: () => void;
}

const items: { id: DashPage; label: string; Icon: LucideIcon }[] = [
  { id: 'metrics',  label: 'Métricas',  Icon: BarChart2 },
  { id: 'services', label: 'Serviços',  Icon: Scissors  },
  { id: 'team',     label: 'Equipe',    Icon: Users     },
  { id: 'business', label: 'Negócio',   Icon: Settings  },
  { id: 'gallery',  label: 'Galeria',   Icon: Image     },
];

export const Sidebar: React.FC<Props> = ({ current, onNavigate, onLogout }) => (
  <aside className="w-16 md:w-56 bg-black min-h-screen flex flex-col py-6 shrink-0">
    {/* Logo desktop */}
    <div className="px-5 mb-8 hidden md:block">
      <p className="text-white font-bold text-base leading-5 tracking-wide">BARBEARIA</p>
      <p className="text-gray-500 text-xs mt-0.5">Dashboard Admin</p>
    </div>
    {/* Logo mobile */}
    <div className="px-3 mb-8 md:hidden flex justify-center">
      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-lg">✂️</div>
    </div>

    {/* Nav */}
    <nav className="flex-1 space-y-0.5 px-2">
      {items.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
            current === id
              ? 'bg-white text-black'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Icon size={17} />
          <span className="hidden md:block">{label}</span>
        </button>
      ))}
    </nav>

    {/* Bottom actions */}
    <div className="px-2 space-y-0.5 mt-4">
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all"
      >
        <ExternalLink size={17} />
        <span className="hidden md:block">Ver Site</span>
      </a>
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all"
      >
        <LogOut size={17} />
        <span className="hidden md:block">Sair</span>
      </button>
    </div>
  </aside>
);
