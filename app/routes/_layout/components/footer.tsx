import { useEffect, useState } from 'react';

export function Footer() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const dateStr = `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())}`;

  return (
    <footer className="relative z-10 w-full h-8 px-6 bg-black/60 flex justify-between items-center border-t border-tech-primary/20 backdrop-blur-sm"></footer>
  );
}
