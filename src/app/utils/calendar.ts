const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Augosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Deciembre',
];

const WEEK_DAYS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

export const getMonthNameByNumber = (monthNumber: number): string =>
  MONTH_NAMES[monthNumber] || '';

export const getNameOfWeek = (
  year: number,
  month: number,
  day: number
): string => {
  const date = new Date(year, month - 1, day);
  return WEEK_DAYS[date.getDay()];
};

export const getDayOfWeek = (
  year: number,
  month: number,
  day: number
): number => {
  const date = new Date(year, month - 1, day);
  return date.getDay() !== 0 ? date.getDay() : 7;
};
