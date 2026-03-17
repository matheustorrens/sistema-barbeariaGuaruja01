import React from 'react';
import { motion } from 'framer-motion';
import { Service } from '../types';
import { Scissors, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';

interface Props {
  onBook: (service: Service) => void;
}

export const Services: React.FC<Props> = ({ onBook }) => {
  const { services: SERVICES } = useData();
  return (
    <section id="services" className="py-14 md:py-20 bg-deep relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-gold font-display tracking-widest text-lg">NOSSOS SERVIÇOS</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white mt-2">Escolha seu Estilo</h2>
          <div className="w-24 h-1 bg-gold mx-auto mt-6"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`glass-panel p-6 rounded-xl group hover:-translate-y-2 transition-transform duration-300 relative ${service.popular ? 'border-gold/50' : 'border-white/5'}`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-deep text-xs font-bold px-3 py-1 rounded-full">
                  MAIS PROCURADO
                </div>
              )}
              
              <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mb-4 text-gold group-hover:bg-gold group-hover:text-deep transition-colors">
                <Scissors size={24} />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
              <p className="text-gray-400 text-sm mb-4 min-h-[40px]">{service.description}</p>
              
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                <Clock size={14} /> {service.duration}
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="font-display text-3xl text-gold">R$ {service.price.toFixed(2)}</span>
                <button 
                  onClick={() => onBook(service)}
                  className="bg-transparent border border-gold text-gold hover:bg-gold hover:text-deep px-4 py-2 rounded text-sm font-bold transition-all uppercase tracking-wider"
                >
                  Agendar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};