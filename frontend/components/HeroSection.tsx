"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* Animated mesh gradient background — gives the "video background" feel
   without needing actual footage. Uses layered radial gradients that drift. */
function AnimatedMeshBG() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0,
      h = 0;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth * 2;
      h = canvas.height = canvas.offsetHeight * 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const orbs = [
      { x: 0.2, y: 0.3, r: 0.45, color: [31, 75, 76], speed: 0.0003 },
      { x: 0.7, y: 0.6, r: 0.5, color: [201, 135, 58], speed: 0.0004 },
      { x: 0.5, y: 0.2, r: 0.4, color: [20, 60, 62], speed: 0.00035 },
      { x: 0.8, y: 0.3, r: 0.35, color: [92, 133, 88], speed: 0.00025 },
    ];

    const draw = (t: number) => {
      ctx.fillStyle = "#0f2e2f";
      ctx.fillRect(0, 0, w, h);

      for (const orb of orbs) {
        const ox = (orb.x + Math.sin(t * orb.speed) * 0.15) * w;
        const oy = (orb.y + Math.cos(t * orb.speed * 1.3) * 0.1) * h;
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r * w);
        grad.addColorStop(0, `rgba(${orb.color.join(",")}, 0.4)`);
        grad.addColorStop(1, `rgba(${orb.color.join(",")}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.85 }}
    />
  );
}

/* Floating particles for depth */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/20"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [null, `${-20 + Math.random() * 120}%`],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 12,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <AnimatedMeshBG />
      <FloatingParticles />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0f2e2f]/80" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-[#5C8558] animate-pulse" />
            AI-Powered Denial Prevention
          </span>
        </motion.div>

        <motion.h1
          className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Stop Claim Denials
          <br />
          <span className="text-[#C9873A]">Before They Happen</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Prevo analyzes your clinical documentation in real-time, catches coding
          errors, and ensures every claim is optimized — so small clinics stop
          losing revenue to preventable denials.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <a
            href="#demo"
            className="px-8 py-4 rounded-full bg-[#C9873A] text-white font-semibold text-base hover:bg-[#b5772e] transition-all shadow-xl shadow-[#C9873A]/20 hover:shadow-2xl hover:shadow-[#C9873A]/30 hover:scale-[1.02]"
          >
            Try the Analyzer
          </a>
          <a
            href="#how-it-works"
            className="px-8 py-4 rounded-full border border-white/20 text-white font-medium text-base hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <p className="text-white/40 text-xs uppercase tracking-widest">
            Built for independent clinics
          </p>
          <div className="flex items-center gap-6 text-white/30">
            <span className="text-sm font-medium">HIPAA Compliant</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-sm font-medium">SOC 2</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-sm font-medium">256-bit Encryption</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-white/50"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
