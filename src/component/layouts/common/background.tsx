
const MeshBackground = () => (
  <div className="fixed inset-0 z-0 bg-slate-50 overflow-hidden">
    <div className="absolute inset-0">
        
      {/* Group A: Fades IN while Group B fades OUT */}
      <div className="absolute w-40 sm:w-60 md:w-150 h-40 sm:h-60 md:h-150 bg-sky-300 rounded-full -top-20 -left-20 blur-[100px] animate-star-slow animate-twinkle-a"></div>
      
      <div className="absolute w-24 sm:w-40 md:w-100 h-24 sm:h-40 md:h-100 bg-indigo-300 rounded-full top-1/4 left-1/3 blur-[100px] animate-star-fast animate-twinkle-a"></div>

      <div className="absolute w-48 sm:w-72 md:w-187.5 h-48 sm:h-72 md:h-187.5 bg-amber-200 rounded-full -bottom-40 left-0 blur-[130px] animate-star-slow animate-twinkle-a"></div>

      <div className="absolute w-32 sm:w-52 md:w-137.5 h-32 sm:h-52 md:h-137.5 bg-blue-300 rounded-full -top-32 left-1/2 -translate-x-1/2 blur-[110px] animate-star-medium animate-twinkle-a"></div>

      {/* Group B: Fades OUT while Group A fades IN */}
      <div className="absolute w-32 sm:w-48 md:w-125 h-32 sm:h-48 md:h-125 bg-rose-300 rounded-full top-0 right-10 blur-[120px] animate-star-medium animate-twinkle-b"></div>
      
      <div className="absolute w-40 sm:w-64 md:w-162.5 h-40 sm:h-64 md:h-162.5 bg-emerald-200 rounded-full top-1/2 -right-20 blur-[110px] animate-star-medium animate-twinkle-b"></div>
      
      <div className="absolute w-32 sm:w-48 md:w-125 h-32 sm:h-48 md:h-125 bg-purple-300 rounded-full bottom-20 right-1/4 blur-[100px] animate-star-medium animate-twinkle-b"></div>

      <div className="absolute w-36 sm:w-56 md:w-145 h-36 sm:h-56 md:h-145 bg-fuchsia-100 rounded-full -bottom-24 left-1/2 -translate-x-1/2 blur-[120px] animate-star-slow animate-twinkle-b"></div>
    </div>

    <style>{`
      @keyframes starDrift {
        0%, 100% { transform: translate(0px, 0px) scale(1); }
        50% { transform: translate(40px, -30px) scale(1.05); }
      }

      /* Harmonic Twinkle: A and B are inverted */
      @keyframes twinkleFadeA {
        0%, 100% { opacity: 0.05; }
        50% { opacity: 0.7; }
      }

      @keyframes twinkleFadeB {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 0.05; }
      }
      
      .animate-star-slow {
        animation: starDrift 40s infinite ease-in-out;
      }
      .animate-star-medium {
        animation: starDrift 30s infinite ease-in-out;
      }
      .animate-star-fast {
        animation: starDrift 22s infinite ease-in-out;
      }

      /* Group A starts dim and fades in */
      .animate-twinkle-a {
        animation: starDrift 40s infinite ease-in-out, twinkleFadeA 12s infinite ease-in-out;
      }

      /* Group B starts bright and fades out */
      .animate-twinkle-b {
        animation: starDrift 35s infinite ease-in-out, twinkleFadeB 12s infinite ease-in-out;
      }
    `}</style>
  </div>
);

export default MeshBackground;