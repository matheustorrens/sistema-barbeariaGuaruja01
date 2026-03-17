import React from 'react';
import { MessageCircle, CalendarClock, CheckCircle } from 'lucide-react';

export const HowToBook = () => {
  return (
    <section className="py-14 md:py-20 bg-deep">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-gold font-display tracking-widest">PASSO A PASSO</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white mt-2">Como Agendar</h2>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold/30 to-transparent -translate-y-1/2 border-t-2 border-dotted border-gold/30"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-surface border border-gold/20 rounded-full flex items-center justify-center mb-6 group-hover:border-gold group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <MessageCircle size={32} className="text-gold" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Entre em Contato</h3>
              <p className="text-gray-400 text-sm px-6">Clique no botão do WhatsApp e fale diretamente conosco.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-surface border border-gold/20 rounded-full flex items-center justify-center mb-6 group-hover:border-gold group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <CalendarClock size={32} className="text-gold" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. Escolha o Horário</h3>
              <p className="text-gray-400 text-sm px-6">Verifique a disponibilidade e escolha o melhor momento para você.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-surface border border-gold/20 rounded-full flex items-center justify-center mb-6 group-hover:border-gold group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <CheckCircle size={32} className="text-gold" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. Confirmação</h3>
              <p className="text-gray-400 text-sm px-6">Receba a confirmação instantânea e venha renovar seu visual.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};