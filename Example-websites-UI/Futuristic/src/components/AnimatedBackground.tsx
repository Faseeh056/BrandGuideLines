import { motion } from "motion/react";
import { RotatingSphere } from "./RotatingSphere";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
      
      {/* Large 3D Rotating Sphere with particles */}
      <RotatingSphere />
      
      {/* 3D Rotating Cube */}
      <motion.div
        className="absolute bottom-[10%] left-[10%] w-[450px] h-[450px]"
        style={{ perspective: "1500px" }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            rotateX: 360,
            rotateY: 360,
          }}
          transition={{
            rotateX: { duration: 20, repeat: Infinity, ease: "linear" },
            rotateY: { duration: 15, repeat: Infinity, ease: "linear" },
          }}
        >
          {/* Cube faces with visible borders and gradients */}
          <div className="absolute inset-0 border-[3px] border-purple-400/70 bg-gradient-to-br from-purple-500/25 to-transparent backdrop-blur-sm" style={{ transform: "translateZ(225px)" }} />
          <div className="absolute inset-0 border-[3px] border-purple-400/70 bg-gradient-to-br from-purple-500/25 to-transparent backdrop-blur-sm" style={{ transform: "rotateY(180deg) translateZ(225px)" }} />
          <div className="absolute inset-0 border-[3px] border-blue-400/70 bg-gradient-to-br from-blue-500/25 to-transparent backdrop-blur-sm" style={{ transform: "rotateY(90deg) translateZ(225px)" }} />
          <div className="absolute inset-0 border-[3px] border-blue-400/70 bg-gradient-to-br from-blue-500/25 to-transparent backdrop-blur-sm" style={{ transform: "rotateY(-90deg) translateZ(225px)" }} />
          <div className="absolute inset-0 border-[3px] border-cyan-400/70 bg-gradient-to-br from-cyan-500/25 to-transparent backdrop-blur-sm" style={{ transform: "rotateX(90deg) translateZ(225px)" }} />
          <div className="absolute inset-0 border-[3px] border-cyan-400/70 bg-gradient-to-br from-cyan-500/25 to-transparent backdrop-blur-sm" style={{ transform: "rotateX(-90deg) translateZ(225px)" }} />
        </motion.div>
      </motion.div>
      
      {/* Animated rotating circles */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl"
        animate={{
          rotate: -360,
          scale: [1, 1.3, 1],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      
      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
        animate={{
          rotate: 360,
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          rotate: { duration: 30, repeat: Infinity, ease: "linear" },
          x: { duration: 15, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 12, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      
      {/* Floating geometric shapes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-20 h-20 border border-blue-500/30"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5,
          }}
        />
      ))}
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(59, 130, 246) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(59, 130, 246) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
}