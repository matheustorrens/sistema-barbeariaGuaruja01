import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Coffee, Star } from 'lucide-react';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { incrementMetric } from '../firebase/db';

export const Hero = () => {
  const handleScrollToServices = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://lh3.googleusercontent.com/p/AF1QipPqKN7tQYj1xEZ8bBLaSiJo9Jy7qfUwpg0PUygv=w1600" 
          alt="Barbearia Guarujá 01 Interior" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-deep"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 z-10 relative mt-16 md:mt-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="flex items-center gap-1 bg-gold/20 backdrop-blur border border-gold/30 text-gold px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Star size={12} fill="currentColor" /> 4.8 (83 Avaliações)
              </span>
              <span className="flex items-center gap-1 bg-white/10 backdrop-blur border border-white/10 text-gray-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Coffee size={12} /> Café & Água Grátis
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
              A ARTE DO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-bronze">
                CORTE MASCULINO
              </span>
            </h1>

            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl border-l-4 border-gold pl-6">
              Tradição, qualidade e atendimento diferenciado no coração do Jardim Primavera.
              Seu visual renovado com excelência.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={generateWhatsAppLink("Olá! Gostaria de agendar um horário.")}
                target="_blank"
                rel="noreferrer"
                onClick={() => incrementMetric('whatsappClicks').catch(() => {})}
                className="group relative px-8 py-4 bg-gold text-deep font-bold font-display text-lg tracking-wider rounded overflow-hidden flex items-center justify-center gap-2 hover:bg-gold-light transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Calendar size={20} /> AGENDAR PELO WHATSAPP
                </span>
              </a>
              
              <a 
                href="#services"
                onClick={handleScrollToServices}
                className="px-8 py-4 border border-gold text-gold font-bold font-display text-lg tracking-wider rounded flex items-center justify-center hover:bg-gold/10 transition-all hover:-translate-y-1"
              >
                VER SERVIÇOS
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-10 right-10 hidden md:block animate-float">
        <div className="glass-panel p-4 rounded-xl max-w-xs">
          <p className="text-gold font-display text-2xl">4.8 ⭐</p>
          <p className="text-gray-400 text-sm">83 avaliações no Google</p>
        </div>
      </div>
    </section>
  );
};