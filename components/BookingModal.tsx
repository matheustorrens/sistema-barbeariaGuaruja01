import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Service, TeamMember } from '../types';
import { generateBookingMessage, generateWhatsAppLink } from '../utils/whatsapp';
import { incrementMetric } from '../firebase/db';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  team: TeamMember[];
}

export const BookingModal: React.FC<Props> = ({ isOpen, onClose, service, team }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    addOns: [] as string[],
    professional: 'Qualquer disponível',
    date: '',
    time: '',
    clientName: '',
    notes: ''
  });

  if (!isOpen || !service) return null;

  const toggleAddOn = (addon: string) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addon) 
        ? prev.addOns.filter(a => a !== addon)
        : [...prev.addOns, addon]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    incrementMetric(`service_${service.id}`).catch(() => {});
    const message = generateBookingMessage({
      service: service.name,
      price: service.price,
      ...formData
    });
    window.open(generateWhatsAppLink(message), '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-surface border border-gold/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 bg-deep border-b border-gold/10 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-serif text-white">Agendar Horário</h3>
              <p className="text-gold text-sm">{service.name} - R$ {service.price.toFixed(2)}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Adicionais */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Adicionais</label>
                <div className="flex flex-wrap gap-2">
                  {['Sobrancelha (+R$15)', 'Barba (+R$35)', 'Hidratação (+R$25)'].map(addon => (
                    <button
                      key={addon}
                      type="button"
                      onClick={() => toggleAddOn(addon)}
                      className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                        formData.addOns.includes(addon)
                          ? 'bg-gold text-deep border-gold font-bold'
                          : 'bg-transparent text-gray-300 border-gray-700 hover:border-gold/50'
                      }`}
                    >
                      {addon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profissional */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Profissional</label>
                <select 
                  className="w-full bg-deep border border-gray-700 rounded-lg p-3 text-white focus:border-gold outline-none"
                  value={formData.professional}
                  onChange={(e) => setFormData({...formData, professional: e.target.value})}
                >
                  <option value="Qualquer disponível">Qualquer disponível</option>
                  {team.map(member => (
                    <option key={member.id} value={member.name}>{member.name}</option>
                  ))}
                </select>
              </div>

              {/* Data e Hora */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Data Preferida</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-deep border border-gray-700 rounded-lg p-3 text-white focus:border-gold outline-none [color-scheme:dark]"
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Hora Preferida</label>
                  <select 
                     className="w-full bg-deep border border-gray-700 rounded-lg p-3 text-white focus:border-gold outline-none"
                     onChange={(e) => setFormData({...formData, time: e.target.value})}
                     required
                  >
                    <option value="">Selecione</option>
                    <option value="09:30">09:30</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                  </select>
                </div>
              </div>

              {/* Dados Pessoais */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Seu Nome</label>
                  <input 
                    type="text"
                    required
                    placeholder="Como gostaria de ser chamado"
                    className="w-full bg-deep border border-gray-700 rounded-lg p-3 text-white focus:border-gold outline-none"
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                CONFIRMAR NO WHATSAPP
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};