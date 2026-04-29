import dayjs from 'dayjs';

const now = new Date();
const microseconds = Math.floor(now.getTime() * 1000) % 1000000;
const microStr = microseconds.toString().padStart(6, '0');

export function formatDate(
  day: string | number,
  format = 'YYYY-MM-DD HH:mm:ss'
) {
  return dayjs(day).format(format);
}
