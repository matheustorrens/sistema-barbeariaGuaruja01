import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Testimonials } from './components/Testimonials';
import { Team } from './components/Team';
import { Gallery } from './components/Gallery';
import { HowToBook } from './components/HowToBook';
import { Location } from './components/Location';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { BookingModal } from './components/BookingModal';
import { useData } from './context/DataContext';
import { Service, TeamMember } from './types';

const App = () => {
  const { team, businessInfo, vacationMode } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleBookTeam = (_member: TeamMember) => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-deep text-white font-sans selection:bg-gold selection:text-deep">

      {/* Banner Modo Férias */}
      {vacationMode.active && (
        <div className="bg-amber-500 text-black text-sm font-semibold text-center py-2.5 px-4 sticky top-0 z-[60]">
          🏖️ {vacationMode.message || 'Estamos de férias!'}
          {vacationMode.from && vacationMode.to && (
            <span className="ml-2 font-normal opacity-80">
              ({new Date(vacationMode.from + 'T00:00:00').toLocaleDateString('pt-BR')} –{' '}
              {new Date(vacationMode.to + 'T00:00:00').toLocaleDateString('pt-BR')})
            </span>
          )}
        </div>
      )}

      <Header />
      <Hero />
      <Services onBook={handleBookService} />
      <HowToBook />
      <Testimonials />
      <Team onBook={handleBookTeam} />
      <Gallery />

      {/* CTA Final */}
      <section className="py-14 md:py-24 bg-gradient-to-b from-deep to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-6xl font-serif font-bold text-white mb-4 md:mb-6">Pronto para Renovar o Visual?</h2>
          <p className="text-base md:text-xl text-gray-400 mb-6 md:mb-10 max-w-2xl mx-auto">
            Agende agora e garanta seu horário com os melhores profissionais do Jardim Primavera.
          </p>
          <button
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-4 md:px-10 md:py-5 bg-gold text-deep font-bold text-base md:text-xl rounded-lg hover:bg-gold-light transition-all shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:-translate-y-1"
          >
            AGENDAR AGORA
          </button>
        </div>
      </section>

      <Location />
      <Footer />
      <FloatingWhatsApp />

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
        team={team}
      />
    </div>
  );
};

export default App;