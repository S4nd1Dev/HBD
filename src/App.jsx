import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Mail, PlayCircle, PauseCircle, Heart, Sparkles } from 'lucide-react';

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
      isHeart: Math.random() > 0.5, // 50% kemungkinan hati, 50% sparkles
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
      setTimeout(() => setIsError(false), 500);
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
            {item.isHeart ? <Heart size={item.size} fill="currentColor" /> : <Sparkles size={item.size} />}
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
              <motion.button animate={{ x: noPosition.x, y: noPosition.y }} onHoverStart={moveNoButton} onClick={moveNoButton} className="px-8 py-3 bg-white/80 text-gray-700 border-2 border-pink-200 font-bold rounded-full shadow-lg absolute sm:static z-10">
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
              {isError && <p className="text-red-500 text-sm mt-2 font-bold animate-pulse">Tetooott! Bohong banget, coba jujur! 🤣</p>}
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
              {isPlaying ? 'Lagu Sedang Diputar 🎶' : 'Putar Lagu "To The Bone" ▶️'}
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
        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border-2 border-pink-100 text-center mt-8">
            
            {/* Foto di Pojok Kanan Atas */}
            <div className="absolute -top-12 -right-4 md:-right-8 w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden shadow-2xl border-4 border-white rotate-6 hover:rotate-0 transition-transform duration-300">
              <img src="/bunga.jpeg" alt="Foto Kita" className="w-full h-full object-cover" />
            </div>

            <Heart size={48} className="text-pink-500 mx-auto mb-6 animate-pulse" fill="#ec4899" />
            
            <h1 className="text-3xl font-bold text-gray-800 mb-6 drop-shadow-sm">Selamat Ulang Tahun, Sayang! 🎉</h1>
            
            {/* TULIS SURATMU DI SINI */}
            <div className="text-gray-700 text-lg leading-relaxed space-y-4 text-justify relative z-20">
              <p>
                Happy Birthday, Hanifa cintaku! 🎈<br/>
                Walaupun sekarang kita kepisah jarak dan cuma bisa tatap muka lewat layar, aku harap website kecil yang aku buat ini bisa bikin kamu senyum hari ini. Kamu itu anugerah terindah buat aku, dan aku bersyukur banget bisa punya kamu.
              </p>
              <p>
                Makasih udah selalu sabar nemenin aku. Semoga di umur yang baru ini kamu makin bahagia, makin sukses, dan apa yang kamu semogakan bisa tercapai.
              </p>
              <p>
               Semoga kamu selalu dikelilingi kebahagiaan, kesehatannya dijaga terus, dan kita bisa cepet-cepet ketemu buat bayar rindu ini. Have a wonderful birthday, my love. You mean the world to me. 💕"
              </p>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}