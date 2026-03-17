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
  <>
    {/* ── Desktop sidebar ──────────────────────────────────────────── */}
    <aside className="hidden md:flex w-56 bg-black min-h-screen flex-col py-6 shrink-0">
      <div className="px-5 mb-8">
        <p className="text-white font-bold text-base leading-5 tracking-wide">BARBEARIA</p>
        <p className="text-gray-500 text-xs mt-0.5">Dashboard Admin</p>
      </div>

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
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="px-2 space-y-0.5 mt-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <ExternalLink size={17} />
          <span>Ver Site</span>
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <LogOut size={17} />
          <span>Sair</span>
        </button>
      </div>
    </aside>

    {/* ── Mobile top bar ────────────────────────────────────────────── */}
    <header className="fixed top-0 left-0 right-0 z-50 flex md:hidden items-center justify-between px-4 h-14 bg-black border-b border-white/10">
      <p className="text-white font-bold text-sm tracking-wide">✂️ BARBEARIA</p>
      <div className="flex items-center gap-1">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Ver Site"
        >
          <ExternalLink size={18} />
        </a>
        <button
          onClick={onLogout}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Sair"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>

    {/* ── Mobile bottom nav ─────────────────────────────────────────── */}
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-black border-t border-white/10">
      {items.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
            current === id ? 'text-white' : 'text-gray-500'
          }`}
        >
          <Icon size={20} />
          <span className="text-[10px] font-medium leading-none">{label}</span>
        </button>
      ))}
    </nav>
  </>
);
