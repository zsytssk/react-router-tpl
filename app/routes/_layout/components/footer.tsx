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
    <footer className="border-tech-primary/20 relative z-10 flex h-8 w-full items-center justify-between border-t bg-black/60 px-6 backdrop-blur-sm"></footer>
  );
}
