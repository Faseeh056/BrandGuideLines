import { motion } from "motion/react";

export function RotatingCube() {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      <motion.div
        className="relative w-[400px] h-[400px]"
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
          {/* Front face */}
          <motion.div
            className="absolute inset-0 border-[3px] border-blue-400/70 bg-gradient-to-br from-blue-500/30 to-purple-500/20 backdrop-blur-sm flex items-center justify-center"
            style={{ transform: "translateZ(200px)" }}
            whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.4)" }}
          >
            <div className="w-32 h-32 border-2 border-blue-300/50 rounded-lg" />
          </motion.div>

          {/* Back face */}
          <motion.div
            className="absolute inset-0 border-[3px] border-purple-400/70 bg-gradient-to-br from-purple-500/30 to-blue-500/20 backdrop-blur-sm flex items-center justify-center"
            style={{ transform: "rotateY(180deg) translateZ(200px)" }}
          >
            <div className="w-32 h-32 border-2 border-purple-300/50 rounded-lg" />
          </motion.div>

          {/* Right face */}
          <motion.div
            className="absolute inset-0 border-[3px] border-cyan-400/70 bg-gradient-to-br from-cyan-500/30 to-blue-500/20 backdrop-blur-sm flex items-center justify-center"
            style={{ transform: "rotateY(90deg) translateZ(200px)" }}
          >
            <div className="w-32 h-32 border-2 border-cyan-300/50 rounded-lg" />
          </motion.div>

          {/* Left face */}
          <motion.div
            className="absolute inset-0 border-[3px] border-blue-400/70 bg-gradient-to-br from-blue-500/30 to-cyan-500/20 backdrop-blur-sm flex items-center justify-center"
            style={{ transform: "rotateY(-90deg) translateZ(200px)" }}
          >
            <div className="w-32 h-32 border-2 border-blue-300/50 rounded-lg" />
          </motion.div>

          {/* Top face */}
          <motion.div
            className="absolute inset-0 border-[3px] border-purple-400/70 bg-gradient-to-br from-purple-500/30 to-pink-500/20 backdrop-blur-sm flex items-center justify-center"
            style={{ transform: "rotateX(90deg) translateZ(200px)" }}
          >
            <div className="w-32 h-32 border-2 border-purple-300/50 rounded-lg" />
          </motion.div>

          {/* Bottom face */}
          <motion.div
            className="absolute inset-0 border-[3px] border-cyan-400/70 bg-gradient-to-br from-cyan-500/30 to-purple-500/20 backdrop-blur-sm flex items-center justify-center"
            style={{ transform: "rotateX(-90deg) translateZ(200px)" }}
          >
            <div className="w-32 h-32 border-2 border-cyan-300/50 rounded-lg" />
          </motion.div>

          {/* Inner cube for more depth */}
          <motion.div
            className="absolute inset-[25%]"
            style={{ transformStyle: "preserve-3d" }}
            animate={{
              rotateX: -360,
              rotateY: -360,
            }}
            transition={{
              rotateX: { duration: 15, repeat: Infinity, ease: "linear" },
              rotateY: { duration: 12, repeat: Infinity, ease: "linear" },
            }}
          >
            <div className="absolute inset-0 border-2 border-blue-300/40" style={{ transform: "translateZ(100px)" }} />
            <div className="absolute inset-0 border-2 border-purple-300/40" style={{ transform: "rotateY(180deg) translateZ(100px)" }} />
            <div className="absolute inset-0 border-2 border-cyan-300/40" style={{ transform: "rotateY(90deg) translateZ(100px)" }} />
            <div className="absolute inset-0 border-2 border-blue-300/40" style={{ transform: "rotateY(-90deg) translateZ(100px)" }} />
            <div className="absolute inset-0 border-2 border-purple-300/40" style={{ transform: "rotateX(90deg) translateZ(100px)" }} />
            <div className="absolute inset-0 border-2 border-cyan-300/40" style={{ transform: "rotateX(-90deg) translateZ(100px)" }} />
          </motion.div>
        </motion.div>

        {/* Glowing orbs around the cube */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-blue-400 rounded-full"
            style={{
              left: "50%",
              top: "50%",
            }}
            animate={{
              x: [0, Math.cos(i * Math.PI / 4) * 250, 0],
              y: [0, Math.sin(i * Math.PI / 4) * 250, 0],
              opacity: [0.3, 0.8, 0.3],
              boxShadow: [
                "0 0 10px rgba(59, 130, 246, 0.5)",
                "0 0 30px rgba(147, 51, 234, 1)",
                "0 0 10px rgba(59, 130, 246, 0.5)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
