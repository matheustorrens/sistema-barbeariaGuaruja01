import React from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';

export const Gallery = () => {
  const { gallery } = useData();
  return (
    <section id="gallery" className="py-14 md:py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-gold font-display tracking-widest">PORTFÓLIO</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white mt-2">Nossos Trabalhos</h2>
        </div>

        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {gallery.map((img, index) => (
            <motion.div
              key={img.firestoreId ?? index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index * 0.05, 0.5) }}
              className="break-inside-avoid relative group overflow-hidden rounded-xl"
            >
              <img
                src={img.url}
                alt="Trabalho Barbearia"
                className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-gold font-bold uppercase tracking-widest border border-gold px-4 py-2">Ver Resultado</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};