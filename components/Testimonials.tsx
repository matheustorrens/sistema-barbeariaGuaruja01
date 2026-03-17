import React from 'react';
import { Star, Quote } from 'lucide-react';
import { REVIEWS } from '../constants';

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-14 md:py-20 bg-deep relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-gold font-display tracking-widest">DEPOIMENTOS</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white mt-2">O Que Dizem Nossos Clientes</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {REVIEWS.map((review) => (
            <div 
              key={review.id}
              className="glass-panel p-5 sm:p-8 rounded-2xl max-w-sm w-full relative group"
            >
              <Quote className="absolute top-6 right-6 text-gold/20 w-10 h-10 group-hover:text-gold/40 transition-colors" />
              
              <div className="flex gap-1 mb-4 text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 italic leading-relaxed">"{review.text}"</p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center font-bold text-white text-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{review.name}</p>
                  <p className="text-gray-500 text-xs">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="https://www.google.com/search?q=Barbearia+Guarujá+01" 
            target="_blank" 
            rel="noreferrer"
            className="text-gold hover:underline underline-offset-4 text-sm font-medium"
          >
            Ver todas as 83 avaliações no Google →
          </a>
        </div>
      </div>
    </section>
  );
};