import { ReactElement, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

const CANVAS_W = 1100;
const CANVAS_H = 500;

export default function Effect404({ children }: { children?: ReactElement }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(undefined);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    canvas.style.width = `${CANVAS_W}px`;
    canvas.style.height = `${CANVAS_H}px`;
    ctx.scale(dpr, dpr);

    // 绘制故障文字（带偏移和重影）
    const drawGlitchText = (
      text: string,
      x: number,
      y: number,
      baseColor: string,
      t: number
    ) => {
      ctx.save();
      ctx.font = 'bold 140px "PingFang SC", "Microsoft YaHei", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 主文字
      ctx.fillStyle = baseColor;
      ctx.shadowColor = 'rgba(0,255,255,0.8)';
      ctx.shadowBlur = 20;
      ctx.fillText(text, x, y);

      // 红色偏移故障
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = 'rgba(255,50,50,0.5)';
      ctx.fillText(text, x - 6 + Math.sin(t * 10) * 2, y - 4);

      // 蓝色偏移故障
      ctx.fillStyle = 'rgba(50,150,255,0.5)';
      ctx.fillText(text, x + 4 + Math.cos(t * 12) * 2, y + 3);

      ctx.restore();
    };

    // 绘制粒子系统（围绕中心流动）
    const drawParticles = (t: number) => {
      const particleCount = 60;
      const centerX = CANVAS_W / 2;
      const centerY = CANVAS_H / 2;

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + t * 0.2;
        const radius = 180 + Math.sin(i * 0.5 + t * 2) * 30;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const size = 3 + Math.sin(i + t * 3) * 1.5;
        const alpha = 0.3 + 0.5 * Math.sin(i * 2 + t * 2);

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 255, ${alpha})`;
        ctx.fill();

        // 粒子连线（较近的粒子之间画线）
        for (let j = i + 1; j < particleCount; j++) {
          const angle2 = (j / particleCount) * Math.PI * 2 + t * 0.2;
          const radius2 = 180 + Math.sin(j * 0.5 + t * 2) * 30;
          const x2 = centerX + Math.cos(angle2) * radius2;
          const y2 = centerY + Math.sin(angle2) * radius2;

          const dist = Math.hypot(x - x2, y - y2);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(0, 180, 255, ${0.1 * (1 - dist / 80)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    // 绘制扫描线
    const drawScanLine = (t: number) => {
      const scanY = (Math.sin(t * 0.8) * 0.5 + 0.5) * CANVAS_H;
      const gradient = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      gradient.addColorStop(0, 'rgba(0,255,255,0)');
      gradient.addColorStop(0.5, 'rgba(0,255,255,0.15)');
      gradient.addColorStop(1, 'rgba(0,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 40, CANVAS_W, 80);
    };

    // 绘制网格背景
    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(0,200,255,0.12)';
      ctx.lineWidth = 0.5;
      const step = 30;
      for (let i = 0; i < CANVAS_W; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_H);
        ctx.stroke();
      }
      for (let i = 0; i < CANVAS_H; i += step) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_W, i);
        ctx.stroke();
      }
    };

    // 绘制数字雨效果（少量）
    const drawDigitalRain = (t: number) => {
      ctx.font = '14px monospace';
      ctx.fillStyle = 'rgba(0,255,255,0.3)';
      for (let i = 0; i < 20; i++) {
        const x = (i * 55 + t * 20) % CANVAS_W;
        const y = (Math.sin(i + t) * 30 + t * 40) % CANVAS_H;
        ctx.fillText(Math.floor(Math.random() * 10).toString(), x, y);
      }
    };

    // 动画循环
    const animate = () => {
      tRef.current += 0.016;
      const t = tRef.current;

      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // 绘制背景网格
      drawGrid();

      // 扫描线
      drawScanLine(t);

      // 数字雨
      drawDigitalRain(t);

      // 粒子系统
      drawParticles(t);

      // 主故障文字
      drawGlitchText('404', CANVAS_W / 2, CANVAS_H / 2 - 20, '#00e0ff', t);

      // 副标题
      ctx.font = '24px "PingFang SC", "Microsoft YaHei", monospace';
      ctx.fillStyle = 'rgba(200,220,255,0.8)';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 10;
      ctx.fillText('PAGE NOT FOUND', CANVAS_W / 2, CANVAS_H / 2 + 60);
      ctx.shadowBlur = 0;

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full flex flex-col items-center"
    >
      {/* 头部状态指示器 */}
      <div className="flex items-center justify-between w-full mb-4 px-1"></div>

      {/* Canvas 动画区域 */}
      <div
        style={{
          borderRadius: '16px',
          border: '1px solid rgba(34,211,238,0.2)',
          margin: '0 auto',
          width: CANVAS_W,
          maxWidth: '80%',
        }}
        className="flex justify-center overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width: CANVAS_W,
            height: CANVAS_H,
          }}
        />
      </div>

      {/* 底部故障提示 */}
      <div className="flex flex-col items-center justify-center gap-4 mt-4 px-6 py-3 rounded-xl ">
        {children}
      </div>
    </motion.div>
  );
}
