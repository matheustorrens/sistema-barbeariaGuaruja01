import React from 'react';
import { MapPin, Clock, Phone, CreditCard } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Location = () => {
  const { businessInfo: BUSINESS_INFO } = useData();
  return (
    <section id="location" className="py-14 md:py-20 bg-deep border-t border-white/5">
      <div className="container mx-auto px-4">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Info */}
          <div className="space-y-8">
            <div>
              <span className="text-gold font-display tracking-widest">CONTATO</span>
              <h2 className="text-3xl md:text-4xl font-serif text-white mt-2 mb-4 md:mb-6">Onde Estamos</h2>
              <p className="text-gray-400 leading-relaxed">
                Localizados no Jardim Primavera, oferecemos um ambiente climatizado,
                café fresco e o melhor atendimento da região.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-gold shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Endereço</h4>
                  <p className="text-gray-400 text-sm">{BUSINESS_INFO.address}</p>
                  <p className="text-gray-500 text-xs mt-1">CEP: 11432-240</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-gold shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Horário de Funcionamento</h4>
                  <p className="text-gray-400 text-sm">Seg - Sáb: {BUSINESS_INFO.hours.weekdays}</p>
                  <p className="text-red-400 text-sm">Dom: {BUSINESS_INFO.hours.sunday}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-gold shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Contato</h4>
                  <p className="text-gray-400 text-sm">{BUSINESS_INFO.phoneDisplay}</p>
                  <p className="text-gray-400 text-sm">barbeariaguaruja01@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-gold shrink-0">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Pagamento</h4>
                  <p className="text-gray-400 text-sm">Dinheiro, PIX, Débito e Crédito</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-[400px] lg:h-auto rounded-2xl overflow-hidden shadow-2xl border border-gold/20 relative group">
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3646.257088924376!2d-46.259200000000004!3d-23.9953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94d1f56860368297%3A0xb3049386c4f3484f!2sAlameda%20das%20Margaridas%2C%20243%20-%20Jardim%20Primavera%2C%20Guaruj%C3%A1%20-%20SP%2C%2011432-240!5e0!3m2!1spt-BR!2sbr!4v1716380000000!5m2!1spt-BR!2sbr" 
               width="100%" 
               height="100%" 
               style={{border:0}} 
               allowFullScreen 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               className="grayscale group-hover:grayscale-0 transition-all duration-700"
             ></iframe>
             <a 
               href={BUSINESS_INFO.mapLink}
               target="_blank"
               rel="noreferrer"
               className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-deep px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-gold transition-colors"
             >
               Abrir no Google Maps
             </a>
          </div>
        </div>
      </div>
    </section>
  );
};