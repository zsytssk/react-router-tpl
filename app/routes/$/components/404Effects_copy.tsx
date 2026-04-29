import { ReactElement, useEffect, useRef } from 'react';

export default function Cool404({ children }: { children?: ReactElement }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * 2;
    canvas.height = H * 2;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(2, 2);

    // 粒子数组
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
    }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
      });
    }

    let t = 0;

    const animate = () => {
      t += 0.02;
      ctx.clearRect(0, 0, W, H);

      // 背景渐变
      const gradient = ctx.createLinearGradient(0, 0, W, H);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);

      // 绘制数字 404
      const drawDigit = (
        char: string,
        x: number,
        y: number,
        bounce: number,
        color: string
      ) => {
        ctx.save();
        ctx.translate(x, y - Math.sin(t * 3 + bounce) * 30); // 弹跳
        ctx.rotate(Math.sin(t * 2 + bounce) * 0.2); // 摇晃
        ctx.fillStyle = color;
        ctx.font = 'bold 160px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(char, 0, 0);
        ctx.restore();
      };

      drawDigit('4', W / 4, H / 2, 0, '#22d3ee');
      drawDigit('0', W / 2, H / 2, 1, '#facc15');
      drawDigit('4', (W * 3) / 4, H / 2, 2, '#22d3ee');

      // 绘制粒子
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // 小人跳跃效果
      const manX = W / 2;
      const manY = H / 2 + 150;
      const jump = Math.abs(Math.sin(t * 5)) * 40;

      ctx.save();
      ctx.translate(manX, manY - jump);
      ctx.fillStyle = '#f43f5e';
      // 身体
      ctx.fillRect(-10, 0, 20, 50);
      // 头
      ctx.beginPath();
      ctx.arc(0, -15, 15, 0, Math.PI * 2);
      ctx.fill();
      // 手
      ctx.fillRect(-25, 10, 15, 5);
      ctx.fillRect(10, 10, 15, 5);
      // 脚
      ctx.fillRect(-15, 50, 10, 5);
      ctx.fillRect(5, 50, 10, 5);
      ctx.restore();

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="bg-slate-900 flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="absolute top-0 left-0" />
      <div className="mt-10 relative z-10 text-white text-center">
        <h1 className="text-4xl font-bold">页面不存在 (404)</h1>
        <p className="text-base mt-2">抱歉，你访问的页面找不到了</p>
        {children}
      </div>
    </div>
  );
}
