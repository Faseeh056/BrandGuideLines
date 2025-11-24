import { motion } from "motion/react";

export function FuturisticCube() {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      <motion.div
        className="relative w-[450px] h-[450px]"
        style={{ perspective: "1500px" }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            rotateX: [20, 25, 20],
            rotateY: [0, 360],
          }}
          transition={{
            rotateX: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
          }}
        >
          {/* Glass Cube Faces */}
          {/* Front */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm border border-cyan-400/40"
            style={{ 
              transform: "translateZ(225px)",
              boxShadow: "inset 0 0 60px rgba(6, 182, 212, 0.2), 0 0 40px rgba(6, 182, 212, 0.1)"
            }}
          >
            {/* Inner panel */}
            <div className="absolute inset-[20%] border border-cyan-300/30 rounded-sm bg-blue-400/5">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full blur-sm" />
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-500/10 backdrop-blur-sm border border-cyan-400/40"
            style={{ 
              transform: "rotateY(180deg) translateZ(225px)",
              boxShadow: "inset 0 0 60px rgba(6, 182, 212, 0.2)"
            }}
          >
            <div className="absolute inset-[25%] border border-cyan-300/30 rounded-sm bg-blue-400/5" />
          </div>

          {/* Right */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 backdrop-blur-sm border border-cyan-400/40"
            style={{ 
              transform: "rotateY(90deg) translateZ(225px)",
              boxShadow: "inset 0 0 60px rgba(6, 182, 212, 0.2)"
            }}
          >
            <div className="absolute inset-[30%] border border-cyan-300/30 rounded-sm bg-blue-400/5">
              <div className="absolute bottom-4 right-4 w-3 h-3 bg-cyan-400 rounded-full blur-sm" />
            </div>
          </div>

          {/* Left */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-500/10 backdrop-blur-sm border border-cyan-400/40"
            style={{ 
              transform: "rotateY(-90deg) translateZ(225px)",
              boxShadow: "inset 0 0 60px rgba(6, 182, 212, 0.2)"
            }}
          >
            <div className="absolute inset-[30%] border border-cyan-300/30 rounded-sm bg-blue-400/5" />
          </div>

          {/* Top */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-cyan-400/15 to-blue-500/15 backdrop-blur-sm border border-cyan-400/40"
            style={{ 
              transform: "rotateX(90deg) translateZ(225px)",
              boxShadow: "inset 0 0 60px rgba(6, 182, 212, 0.2)"
            }}
          >
            <div className="absolute inset-[35%] border border-cyan-300/30 rounded-sm bg-blue-400/5">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full blur-sm" />
            </div>
          </div>

          {/* Bottom */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-cyan-400/15 backdrop-blur-sm border border-cyan-400/40"
            style={{ 
              transform: "rotateX(-90deg) translateZ(225px)",
              boxShadow: "inset 0 0 60px rgba(6, 182, 212, 0.2)"
            }}
          >
            <div className="absolute inset-[35%] border border-cyan-300/30 rounded-sm bg-blue-400/5" />
          </div>

          {/* Floating particles inside the cube */}
          {[...Array(12)].map((_, i) => {
            const x = (Math.random() - 0.5) * 300;
            const y = (Math.random() - 0.5) * 300;
            const z = (Math.random() - 0.5) * 300;
            
            return (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-cyan-400 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                  boxShadow: "0 0 10px rgba(6, 182, 212, 0.8)",
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </motion.div>

        {/* Outer glow effect */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orbiting rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
            animate={{
              rotateZ: 360,
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div
              className="absolute inset-[-10%] border border-cyan-400/20 rounded-full"
              style={{
                transform: `rotateX(${60 + i * 30}deg)`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
