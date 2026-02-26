import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Mail, PlayCircle, PauseCircle, Heart, Sparkles,Flower2 } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isError, setIsError] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMusicWarning, setShowMusicWarning] = useState(false);
  const audioRef = useRef(null);

  // State untuk elemen dekorasi yang melayang di background
  const [floatingItems, setFloatingItems] = useState([]);

  // Bikin posisi acak untuk hiasan background saat web pertama kali dimuat
  useEffect(() => {
    const items = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      size: Math.random() * 20 + 15,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 2,
     itemType: Math.floor(Math.random() * 3), // 50% kemungkinan hati, 50% sparkles
    }));
    setFloatingItems(items);
  }, []);

  const moveNoButton = () => {
    const newX = Math.random() * 200 - 100;
    const newY = Math.random() * 200 - 100;
    setNoPosition({ x: newX, y: newY });
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setStep(3);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 2500);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        setShowMusicWarning(false);
      }
    }
  };

  const handleTapGift = () => {
    if (!isPlaying) {
      setShowMusicWarning(true);
      return;
    }
    if (tapCount < 4) {
      setTapCount(tapCount + 1);
    } else {
      setStep(4);
    }
  };

  // --- STATE & FUNGSI UNTUK LEDAKAN BUNGA & LOVE DI SURAT ---
  const [burstItems, setBurstItems] = useState([]);

  const triggerBurst = () => {
    const newItems = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 300, // Menyebar luas ke kiri/kanan
      y: (Math.random() - 0.5) * 300, // Menyebar luas ke atas/bawah
      scale: Math.random() * 1 + 0.5,
      rotate: Math.random() * 360,
      type: Math.random() > 0.5 ? 'heart' : 'flower' // 50% love, 50% bunga
    }));
    setBurstItems((prev) => [...prev, ...newItems]);
  };

  // Menentukan warna background berdasarkan step
  const bgClass = step === 5 
    ? 'bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600' // Background akhir yang estetik
    : 'bg-gradient-to-br from-pink-50 via-white to-pink-100';      // Background awal yang lembut

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden font-sans transition-colors duration-1000 relative ${bgClass}`}>
      
      {/* DEKORASI BACKGROUND MELAYANG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingItems.map((item) => (
          <motion.div
            key={item.id}
            className="absolute text-pink-300/40"
            style={{ left: item.left, top: item.top }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
          >
            {item.itemType === 0 && <Heart size={item.size} fill="currentColor" />}
            {item.itemType === 1 && <Sparkles size={item.size} />}
            {item.itemType === 2 && <Flower2 size={item.size} className="text-pink-400" />}
          </motion.div>
        ))}
      </div>

      <audio ref={audioRef} src="/lagu.mp3" loop />
      
      <AnimatePresence mode="wait">
        
        {/* STEP 0: Surat Pembuka */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5 }} className="text-center cursor-pointer relative z-10" onClick={() => setStep(1)}>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Mail size={120} className="text-pink-500 mx-auto drop-shadow-xl" />
            </motion.div>
            <h2 className="text-2xl font-bold text-pink-600 mt-6 animate-pulse bg-white/50 px-6 py-2 rounded-full backdrop-blur-sm">
              Ada surat buat kamu. Klik untuk buka! 💌
            </h2>
          </motion.div>
        )}

        {/* STEP 1: Layar Sapaan & Tombol Usil */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }} className="text-center max-w-lg relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-6 leading-relaxed bg-white/50 p-4 rounded-2xl backdrop-blur-sm shadow-sm">
              Halo Hanifa, ada kado nih buat kamu. Mau buka sekarang? 🎁
            </h1>
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 min-h-[100px]">
              <button onClick={() => setStep(2)} className="px-8 py-3 bg-pink-500 text-white font-bold rounded-full shadow-lg hover:bg-pink-600 transition-colors z-20">
                Mau banget! 💖
              </button>
              <motion.button animate={{ x: noPosition.x, y: noPosition.y }} onHoverStart={moveNoButton} onClick={moveNoButton} className="px-8 py-3 bg-white/80 text-gray-700 border-2 border-pink-200 font-bold rounded-full shadow-lg z-10">
  Nanti aja deh 🙈
</motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Verifikasi Identitas */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 100 }} className="text-center max-w-lg bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-pink-200 relative z-10">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">Eits, tunggu dulu! 🛑</h2>
            <p className="text-gray-700 mb-6 text-lg">
              Sistem mendeteksi percobaan akses. Coba buktikan dulu kalau kamu beneran Hanifa yang dikenal sandi <br/><br/>
              <b>Pertanyaan:</b> Siapa yang paling sering ketiduran pas lagi asik-asik telponan? 😴
            </p>
            <motion.div animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="flex flex-col gap-3">
              <button onClick={() => handleAnswer(false)} className="px-6 py-3 bg-pink-50 text-pink-600 font-bold rounded-xl hover:bg-pink-100 border border-pink-200 transition-colors">Hanifa dong! 🙋‍♀️</button>
              <button onClick={() => handleAnswer(false)} className="px-6 py-3 bg-pink-50 text-pink-600 font-bold rounded-xl hover:bg-pink-100 border border-pink-200 transition-colors">Dua-duanya sama aja 🙄</button>
              <button onClick={() => handleAnswer(true)} className="px-6 py-3 bg-pink-50 text-pink-600 font-bold rounded-xl hover:bg-pink-100 border border-pink-200 transition-colors">Pasti sandi lah! 👦🏻</button>
              {/* Animasi Error yang Meriah & TETOOT */}
            <AnimatePresence>
              {isError && (
                <motion.p
                  initial={{ opacity: 0, scale: 0 }} // Mulai dari hilang & ukuran 0
                  animate={{ 
                    opacity: 1, 
                    scale: [1.3, 1], // Mengembang gede dulu baru balik ke 1 (efek bounce)
                    color: ["#ef4444", "#ffffff", "#ef4444"] // Berkedip merah-putih-merah
                  }}
                  exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }} // Hilang cepet
                  transition={{ 
                    duration: 0.5, 
                    ease: "backOut", // Efek membal di akhir
                    color: { repeat: Infinity, duration: 0.3 } // Kedip warna terus-menerus
                  }}
                  className="text-red-600 text-base mt-4 font-extrabold bg-red-100/80 px-4 py-2 rounded-full backdrop-blur-sm shadow-md"
                >
                  TETOOOTT! Bohong banget, coba jujur! 🤣😜
                </motion.p>
              )}
            </AnimatePresence>
            </motion.div>
          </motion.div>
        )}

        {/* STEP 3: Wajib Play Musik & Tap Kado */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -50 }} className="text-center flex flex-col items-center max-w-md bg-white/80 p-8 rounded-3xl backdrop-blur-sm shadow-xl relative z-10">
            <h2 className="text-3xl font-bold text-pink-600 mb-2">Yey! Verifikasi berhasil 🎉</h2>
            <p className="text-gray-700 mb-6 text-lg">
              Sebelum buka kado, wajib pencet tombol play di bawah ini dulu ya! Biar *vibes*-nya dapet ✨
            </p>
            <button 
              onClick={toggleAudio}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all mb-8 ${isPlaying ? 'bg-pink-600' : 'bg-pink-500 animate-bounce'}`}
            >
              {isPlaying ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
              {isPlaying ? 'Lagu Sedang Diputar 🎶' : 'Putar Lagu Spesial buat kamu ▶️'}
            </button>
            {showMusicWarning && <p className="text-red-500 font-bold mb-4 animate-pulse">Eits, putar lagunya dulu dong sayang! 🥺</p>}
            <p className="text-gray-600 font-semibold mb-2">Tap kadonya {5 - tapCount} kali lagi!</p>
            <motion.button onClick={handleTapGift} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9, rotate: [0, -10, 10, -10, 10, 0] }} animate={{ scale: 1 + tapCount * 0.1 }} className="text-pink-500 drop-shadow-2xl mt-4">
              <Gift size={120} strokeWidth={1.5} />
            </motion.button>
          </motion.div>
        )}

        {/* STEP 4: Konfirmasi Kesiapan */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }} className="text-center relative z-10">
            <h2 className="text-4xl font-bold text-pink-600 mb-8 bg-white/60 px-8 py-4 rounded-3xl backdrop-blur-md shadow-lg">Apakah cantikku ini udah siap? 🥰</h2>
            <button onClick={() => setStep(5)} className="px-10 py-4 bg-pink-500 text-white text-xl font-bold rounded-full shadow-xl hover:bg-pink-600 transition-colors animate-bounce">
              Udah siap! ❤️
            </button>
          </motion.div>
        )}

        {/* STEP 5: Puncak Acara (Surat + Foto) */}
        {/* STEP 5: Puncak Acara (Surat + Orbit 10 Foto) */}
        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden z-10">
            
            {/* --- ORBIT 10 FOTO MELINGKAR (MUTER KELILING) --- */}
            <motion.div 
              className="absolute top-1/2 left-1/2 w-0 h-0 z-0"
              animate={{ rotate: 360 }} // Memutar wadah besarnya 360 derajat
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }} // Muter pelan selama 40 detik
            >
              {[...Array(10)].map((_, i) => {
                const angle = i * 36; // 360 derajat dibagi 10 foto = jarak 36 derajat tiap foto
                return (
                  <div 
                    key={i} 
                    className="absolute top-0 left-0"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    {/* Radius/Jarak dorongan foto dari tengah (Beda ukuran buat HP & Laptop) */}
                    <div className="transform -translate-y-[200px] sm:-translate-y-[280px] md:-translate-y-[380px]">
                      
                      {/* Foto yang counter-rotate (diputar balik) biar fotonya nggak jungkir balik */}
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                        className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl shadow-2xl border-4 border-white overflow-hidden relative -left-1/2 -top-1/2 bg-gray-200"
                      >
                         <img src={`/foto-${i + 1}.jpeg`} alt={`Kenangan ${i+1}`} className="w-full h-full object-cover" />
                      </motion.div>

                    </div>
                  </div>
                )
              })}
            </motion.div>
            {/* ------------------------------------------------ */}

            {/* KERTAS SURAT (Ada di tengah & lapisan paling atas biar nggak ketabrak foto) */}
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ duration: 1, delay: 0.5 }} 
              className="relative z-20 w-full max-w-xl bg-white/85 backdrop-blur-md pt-10 pb-10 px-6 md:px-12 rounded-3xl shadow-[0_0_40px_rgba(236,72,153,0.3)] border-2 border-pink-200 text-center mx-4"
            >
              
              {/* LOGO HATI TENGAH (Bisa dipencet keluar bunga) */}
              <motion.div className="relative cursor-pointer w-fit mx-auto mb-4 z-30" whileTap={{ scale: 0.8 }} onClick={triggerBurst}>
                <Heart size={48} className="text-pink-500 animate-pulse drop-shadow-md" fill="#ec4899" />
                <AnimatePresence>
                  {burstItems.map((item) => (
                    <motion.div key={item.id} initial={{ opacity: 1, scale: 0, x: 0, y: 0 }} animate={{ opacity: 0, scale: item.scale, x: item.x, y: item.y, rotate: item.rotate }} transition={{ duration: 1, ease: "easeOut" }} onAnimationComplete={() => setBurstItems((prev) => prev.filter(b => b.id !== item.id))} className="absolute top-1/2 left-1/2 pointer-events-none" style={{ marginLeft: '-12px', marginTop: '-12px' }}>
                      {item.type === 'heart' ? <Heart size={24} className="text-pink-500" fill="#ec4899" /> : <Flower2 size={24} className="text-pink-400" />}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              
              {/* TULIS SURATMU DI SINI */}
            <div className="text-gray-700 text-sm md:text-base md:text-lg leading-relaxed space-y-4 text-justify relative z-30">
              <p>
                Happy Birthday, Hanifa cintaku! 🎈<br/>
                Walaupun sekarang kita terpisah jarak dan cuma bisa tatap muka lewat layar, aku harap website kecil yang aku buat ini bisa bikin kamu senyum hari ini. Kamu itu anugerah terindah buat aku, dan aku bersyukur banget bisa punya kamu.
              </p>
              <p>
                Makasih udah selalu sabar nemenin aku. Semoga di umur yang baru ini kamu makin bahagia, makin sukses, dan apa yang kamu semogakan bisa tercapai.
              </p>
              <p className="font-semibold text-pink-600 mt-4 text-center">
                Semoga kamu selalu dikelilingi kebahagiaan, kesehatannya dijaga terus, dan kita bisa cepet-cepet ketemu buat bayar rindu ini. Have a wonderful birthday, my love. You mean the world to me. 💕
              </p>
            </div>

            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}