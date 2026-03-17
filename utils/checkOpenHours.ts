const parseTime = (t: string): number => {
  const [h, m] = t.split(':').map(Number);
  return h + m / 60;
};

const parseRange = (range: string): [number, number] | null => {
  const parts = range.split('-').map(s => s.trim());
  if (parts.length !== 2) return null;
  try { return [parseTime(parts[0]), parseTime(parts[1])]; }
  catch { return null; }
};

export const getOpenStatus = (
  weekdayHours = '09:30 - 20:30',
  sundayHours  = 'Fechado',
): { status: 'open' | 'closed' | 'soon'; text: string; color: string } => {
  const now     = new Date();
  const day     = now.getDay();
  const current = now.getHours() + now.getMinutes() / 60;

  const hoursStr = day === 0 ? sundayHours : weekdayHours;

  if (!hoursStr || hoursStr.toLowerCase() === 'fechado') {
    return { status: 'closed', text: 'FECHADO', color: 'text-red-500' };
  }

  const range = parseRange(hoursStr);
  if (!range) return { status: 'closed', text: 'FECHADO', color: 'text-red-500' };

  const [openTime, closeTime] = range;

  if (current >= openTime && current < closeTime) {
    return { status: 'open', text: 'ABERTO AGORA', color: 'text-green-500' };
  }
  if (current >= openTime - 0.5 && current < openTime) {
    const openStr = hoursStr.split('-')[0].trim();
    return { status: 'soon', text: `ABRE EM BREVE (${openStr})`, color: 'text-yellow-500' };
  }
  return { status: 'closed', text: 'FECHADO', color: 'text-red-500' };
};
