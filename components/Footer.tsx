import React from 'react';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Footer = () => {
  const { businessInfo: BUSINESS_INFO } = useData();
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-10 pb-6 md:pt-16 md:pb-8">
      <div className="container mx-auto px-4">
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          
          {/* Brand */}
          <div className="text-center md:text-left">
            <h2 className="font-serif text-2xl text-white font-bold mb-4">BARBEARIA <span className="text-gold">GUARUJÁ 01</span></h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Excelência em cortes masculinos e cuidados pessoais. 
              Tradição e modernidade no Jardim Primavera.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <a href={BUSINESS_INFO.social.facebook} className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-pink-600 transition-all">
                <Instagram size={20} />
              </a>
              <a href={`https://wa.me/${BUSINESS_INFO.phone}`} className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition-all">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="text-center">
            <h3 className="text-white font-bold mb-6">Links Rápidos</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#home" className="hover:text-gold transition-colors">Início</a></li>
              <li><a href="#services" className="hover:text-gold transition-colors">Serviços</a></li>
              <li><a href="#gallery" className="hover:text-gold transition-colors">Galeria</a></li>
              <li><a href="#location" className="hover:text-gold transition-colors">Localização</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-right">
            <h3 className="text-white font-bold mb-6">Informações</h3>
            <div className="text-sm text-gray-500 space-y-2">
              <p>CNPJ: 59.185.423/0001-76</p>
              <p>Bruno Lima Pereira</p>
              <p>Guarujá - São Paulo</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-gray-600 text-xs">
            &copy; 2026 Barbearia Guarujá 01. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};