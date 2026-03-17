import { BUSINESS_INFO } from '../constants';

interface BookingDetails {
  service: string;
  price: number;
  addOns: string[];
  professional: string;
  date: string;
  time: string;
  clientName: string;
  notes: string;
}

export const generateWhatsAppLink = (text: string, phone?: string) => {
  const number = phone || BUSINESS_INFO.phone;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};

export const generateBookingMessage = (details: BookingDetails): string => {
  const addOnsText = details.addOns.length > 0 ? details.addOns.join(', ') : 'Nenhum';
  const totalPrice = details.price + (details.addOns.length * 15); // Simplified calculation

  return `Olá Barbearia Guarujá 01! 💈

Gostaria de agendar um horário:

📋 *SERVIÇO:*
${details.service} - R$ ${details.price.toFixed(2)}

➕ *ADICIONAIS:*
${addOnsText}

👤 *PROFISSIONAL:*
${details.professional}

📅 *DATA:*
${details.date}

🕐 *HORÁRIO:*
${details.time}

👨 *MEU NOME:*
${details.clientName}

 *OBS:*
${details.notes || 'Nenhuma'}

Aguardo retorno! 🙏`;
};