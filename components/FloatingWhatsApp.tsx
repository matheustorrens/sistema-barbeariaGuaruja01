import React from 'react';
import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { useData } from '../context/DataContext';
import { incrementMetric } from '../firebase/db';

export const FloatingWhatsApp = () => {
  const { businessInfo } = useData();

  const handleClick = () => {
    incrementMetric('whatsappClicks').catch(() => {});
  };

  return (
    <a
      href={generateWhatsAppLink('Olá! Gostaria de fazer um agendamento.', businessInfo.phone)}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 group"
    >
      <span className="bg-white text-deep px-4 py-2 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 hidden md:block">
        Agende Agora!
      </span>
      <div className="bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform animate-bounce">
        <MessageCircle size={32} color="white" fill="white" />
      </div>
    </a>
  );
};