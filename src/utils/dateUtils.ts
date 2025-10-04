export const formatDate = (date: string): string => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  const year = d.getFullYear();
  
  return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
};

export const formatReadingTime = (minutes: number): string => {
  return `${minutes} min`;
};
