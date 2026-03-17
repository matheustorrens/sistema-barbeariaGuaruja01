import React from 'react';
import { TeamMember } from '../types';
import { useData } from '../context/DataContext';

interface Props {
  onBook: (member: TeamMember) => void;
}

export const Team: React.FC<Props> = ({ onBook }) => {
  const { team: TEAM } = useData();
  return (
    <section id="team" className="py-14 md:py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-gold font-display tracking-widest">NOSSO TIME</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white mt-2">Mestres da Navalha</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {TEAM.map((member) => (
            <div key={member.id} className="text-center group w-full max-w-[200px] md:w-64">
              <div className="relative w-36 h-36 md:w-48 md:h-48 mx-auto mb-4 md:mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-gold/30 group-hover:scale-110 transition-transform duration-500"></div>
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full rounded-full object-cover border-4 border-surface relative z-10 grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className={`absolute bottom-2 right-2 z-20 w-4 h-4 rounded-full border-2 border-surface ${member.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
              <p className="text-gold text-sm font-medium mb-1">{member.role}</p>
              <p className="text-gray-500 text-xs mb-4">{member.experience}</p>
              
              <button 
                className="text-white text-sm font-bold border-b border-transparent hover:border-gold transition-colors pb-1"
                onClick={() => onBook(member)}
              >
                AGENDAR COM ELE
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};