import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const INITIAL_COUNT = 10;

export const Gallery = () => {
  const { gallery } = useData();
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? gallery : gallery.slice(0, INITIAL_COUNT);
  const hasMore  = gallery.length > INITIAL_COUNT;

  return (
    <section id="gallery" className="py-14 md:py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-gold font-display tracking-widest">PORTFÓLIO</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white mt-2">Nossos Trabalhos</h2>
        </div>

        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          <AnimatePresence initial={false}>
            {visible.map((img, index) => (
              <motion.div
                key={img.firestoreId ?? index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: showAll ? Math.min((index - INITIAL_COUNT) * 0.04, 0.4) : Math.min(index * 0.05, 0.5) }}
                className="break-inside-avoid overflow-hidden rounded-xl"
              >
                <img
                  src={img.url}
                  alt="Trabalho Barbearia"
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {hasMore && !showAll && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll(true)}
              className="flex items-center gap-2 border border-gold text-gold font-display font-bold uppercase tracking-widest px-8 py-3 rounded hover:bg-gold hover:text-deep transition-all duration-300"
            >
              Ver mais <ChevronDown size={18} />
            </button>
          </div>
        )}

        {showAll && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll(false)}
              className="flex items-center gap-2 border border-gold text-gold font-display font-bold uppercase tracking-widest px-8 py-3 rounded hover:bg-gold hover:text-deep transition-all duration-300"
            >
              Ver menos <ChevronUp size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};