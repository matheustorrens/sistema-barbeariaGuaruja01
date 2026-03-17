import React, { useState, useEffect } from 'react';
import { Menu, X, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOpenStatus } from '../utils/checkOpenHours';
import { useData } from '../context/DataContext';

export const Header = () => {
  const { businessInfo } = useData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Recalculate status when currentTime changes
  const openStatus = getOpenStatus(businessInfo.hours.weekdays, businessInfo.hours.sunday);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Update time every minute to refresh open status
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Serviços', href: '#services' },
    { name: 'Equipe', href: '#team' },
    { name: 'Depoimentos', href: '#testimonials' },
    { name: 'Contato', href: '#location' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const elementId = href.replace('#', '');
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-deep/90 backdrop-blur-md shadow-lg border-b border-gold/10 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, '#home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-gold to-bronze rounded-full flex items-center justify-center text-deep group-hover:scale-110 transition-transform">
            <Scissors size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl text-white leading-none tracking-wide">BARBEARIA<br/><span className="text-gold">GUARUJÁ 01</span></h1>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-gray-300 hover:text-gold transition-colors font-medium text-sm tracking-widest uppercase"
            >
              {link.name}
            </a>
          ))}
          <div className={`flex items-center gap-2 text-xs font-bold border px-3 py-1 rounded-full ${openStatus.color} border-white/10 bg-white/5`}>
            <span className={`w-2 h-2 rounded-full ${openStatus.status === 'open' ? 'bg-green-500 animate-pulse' : openStatus.status === 'soon' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
            {openStatus.text}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-gold"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-deep/95 backdrop-blur-xl border-b border-gold/20 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-white hover:text-gold text-lg font-medium"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                </a>
              ))}
              <div className={`flex items-center gap-2 mt-4 text-sm font-bold ${openStatus.color}`}>
                <span className={`w-2 h-2 rounded-full ${openStatus.status === 'open' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {openStatus.text}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};