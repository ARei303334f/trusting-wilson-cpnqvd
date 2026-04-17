import React, { useState, useEffect } from "react";
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Heart,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  Play,
  RotateCcw,
  Timer,
  AlertCircle,
  ListOrdered,
  User,
  Flame,
  BookOpen,
  Plane,
  Droplets,
  Globe2,
  CloudLightning,
  Shuffle,
  ChevronLeft,
  Satellite,
  AlertTriangle,
  Zap,
  Skull,
  ShieldAlert,
  Award,
  Star,
} from "lucide-react";

// --- INTEGRASI DATABASE (FIREBASE) ---
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

const myFirebaseConfig = {
  apiKey: "AIzaSyBwhUjb4qd685DD7tXQ6FwNLT2KemIkaAc",
  authDomain: "hidrometquizz.firebaseapp.com",
  projectId: "hidrometquizz",
  storageBucket: "hidrometquizz.firebasestorage.app",
  messagingSenderId: "89015397964",
  appId: "1:89015397964:web:f8af369bb0f2c99b64cee9",
  measurementId: "G-BMQFV3BFJY",
};

let app, auth, db;
const appId = "hidro-metro-vExtreme";

try {
  app = initializeApp(myFirebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase gagal inisialisasi.");
}

// --- KATEGORI TOPIK ---
const CATEGORIES = [
  {
    id: "iklim_cuaca",
    name: "Iklim & Cuaca",
    icon: CloudLightning,
    color: "text-sky-500",
    bg: "bg-sky-100",
    border: "border-sky-200",
  },
  {
    id: "penerbangan",
    name: "Meteorologi Penerbangan",
    icon: Plane,
    color: "text-indigo-500",
    bg: "bg-indigo-100",
    border: "border-indigo-200",
  },
  {
    id: "hidrologi",
    name: "Hidrologi",
    icon: Droplets,
    color: "text-blue-500",
    bg: "bg-blue-100",
    border: "border-blue-200",
  },
  {
    id: "klimatologi",
    name: "Klimatologi",
    icon: Globe2,
    color: "text-emerald-500",
    bg: "bg-emerald-100",
    border: "border-emerald-200",
  },
  {
    id: "instrumen",
    name: "Instrumen & Observasi",
    icon: Satellite,
    color: "text-orange-500",
    bg: "bg-orange-100",
    border: "border-orange-200",
  },
  {
    id: "kebencanaan",
    name: "Kebencanaan",
    icon: AlertTriangle,
    color: "text-rose-600",
    bg: "bg-rose-100",
    border: "border-rose-300",
  },
  {
    id: "campuran",
    name: "Campuran",
    icon: Shuffle,
    color: "text-purple-500",
    bg: "bg-purple-100",
    border: "border-purple-200",
  },
];

// --- TINGKATAN LEVEL UJIAN KILAT ---
const LEVELS = [
  {
    id: "easy",
    name: "EASY",
    count: 10,
    icon: Star,
    color: "from-emerald-400 to-emerald-600",
    shadow: "shadow-emerald-500/50",
    text: "text-emerald-400",
  },
  {
    id: "medium",
    name: "MEDIUM",
    count: 30,
    icon: Award,
    color: "from-yellow-400 to-amber-600",
    shadow: "shadow-amber-500/50",
    text: "text-amber-400",
  },
  {
    id: "high",
    name: "HIGH",
    count: 70,
    icon: ShieldAlert,
    color: "from-orange-500 to-red-600",
    shadow: "shadow-orange-500/50",
    text: "text-orange-400",
  },
  {
    id: "master",
    name: "MASTER",
    count: 90,
    icon: Trophy,
    color: "from-rose-600 to-pink-700",
    shadow: "shadow-rose-500/50",
    text: "text-rose-400",
  },
  {
    id: "grandmaster",
    name: "GRANDMASTER",
    count: 100,
    icon: Zap,
    color: "from-purple-600 to-indigo-800",
    shadow: "shadow-purple-500/50",
    text: "text-purple-400",
  },
  {
    id: "extreme",
    name: "EXTREME",
    count: 150, // DIUBAH MENJADI 150 SOAL
    icon: Skull,
    color: "from-slate-900 to-black border border-red-500/50",
    shadow: "shadow-red-900/80",
    text: "text-red-500",
  },
];

// ============================================================================
// WAHAI ADMIN, PASTE RIBUAN SOAL ANDA DI DALAM ARRAY `allQuizData` INI!
// (Soal telah di-skip di sini agar file rapi. Silakan copy-paste soal asli Anda kemari)
// ============================================================================
const allQuizData = [
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Atmosfer",
    question: "Lapisan atmosfer tempat terjadinya fenomena cuaca adalah...",
    options: ["Stratosfer", "Troposfer", "Mesosfer", "Termosfer"],
    answer: "Troposfer",
    explanation:
      "Troposfer mengandung 80% massa atmosfer dan hampir seluruh uap air bumi.",
  },
  // PASTE SISA SOAL ANDA DI BAWAH INI...
];

// --- KOMPONEN ILUSTRASI ---
// (Komponen SVG dipertahankan untuk menghemat token, Anda bisa menggunakan yang lama jika ingin lengkap)
const WaterCycleSVG = () => (
  <div className="relative w-full h-48 bg-sky-50 rounded-2xl overflow-hidden border-2 border-sky-200 flex flex-col items-center justify-end p-4 shadow-inner">
    <Sun
      className="absolute top-4 left-4 text-yellow-400 w-12 h-12 animate-pulse"
      fill="currentColor"
    />
    <Cloud
      className="absolute top-6 right-8 text-slate-300 w-16 h-16"
      fill="currentColor"
    />
    <div className="w-full h-12 bg-blue-500 rounded-t-xl absolute bottom-0 left-0 right-0 flex items-center justify-center">
      <span className="text-white text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase">
        Samudra
      </span>
    </div>
  </div>
);

// --- KOMPONEN UTAMA ---
export default function App() {
  const [gameState, setGameState] = useState("input_name"); // Mulai dari input nama
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [playMode, setPlayMode] = useState("latihan");

  const [activeQuiz, setActiveQuiz] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [feedback, setFeedback] = useState(null);
  const [essayInput, setEssayInput] = useState("");

  // Database Status
  const [firebaseStatus, setFirebaseStatus] = useState("loading");
  const [firebaseErrorMsg, setFirebaseErrorMsg] = useState("");
  const [user, setUser] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [localLeaderboard, setLocalLeaderboard] = useState([]);
  const [playerName, setPlayerName] = useState(""); // NAMA DISIMPAN DI SINI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaderboardFilter, setLeaderboardFilter] = useState("Semua");

  const isGlobalDatabase = firebaseStatus === "connected";
  const maxTime = playMode === "ujian" ? 15 : 25;

  // Firebase Init
  useEffect(() => {
    if (!auth) {
      setFirebaseStatus("local");
      return;
    }
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (e) {
        setFirebaseStatus("error");
        setFirebaseErrorMsg("Anonymous Auth belum aktif.");
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Leaderboard Listener
  useEffect(() => {
    if (!db || !user) return;
    const scoresRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "scores"
    );
    const unsubscribe = onSnapshot(
      scoresRef,
      (snapshot) => {
        setFirebaseStatus("connected");
        const scores = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        scores.sort((a, b) => b.score - a.score);
        setLeaderboardData(scores);
      },
      () => {
        setFirebaseStatus("error");
        setFirebaseErrorMsg("Firestore Test Mode belum aktif.");
      }
    );
    return () => unsubscribe();
  }, [user]);

  // Timer Logic - HANYA BERJALAN JIKA FEEDBACK NULL (Waktu berhenti saat baca pembahasan)
  useEffect(() => {
    let timer;
    if (gameState === "playing" && feedback === null && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === "playing" && feedback === null) {
      processAnswer(false, true); // Jika waktu habis, proses jawaban keliru
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState, feedback]);

  // SISTEM ENGINE GENERATOR SOAL (Telah diperbaiki agar tidak error jika soal kurang)
  const generateQuestions = (topicId, mode, targetCount) => {
    let availableQuestions =
      topicId === "campuran"
        ? allQuizData
        : allQuizData.filter((q) => q.category === topicId);

    // Safeguard jika jumlah soal di database kurang dari target (misal Extreme 150, tapi soal cuma ada 100)
    let limit = Math.min(targetCount, availableQuestions.length);

    // Acak seluruh soal yang tersedia
    let shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, limit);

    // Acak urutan Pilihan Ganda
    return selected.map((q) => {
      if (q.options) {
        return {
          ...q,
          options: [...q.options].sort(() => 0.5 - Math.random()),
        };
      }
      return q;
    });
  };

  // FUNGSI MULAI GAME (Telah diperbaiki dari syntax error)
  const startGame = (mode, levelObj) => {
    setPlayMode(mode);
    if (levelObj) setSelectedLevel(levelObj);

    let totalQuestions = 5; // Default latihan
    if (mode === "ujian" && levelObj) {
      totalQuestions = levelObj.count;
    }

    const generatedQuiz = generateQuestions(
      selectedTopic.id,
      mode,
      totalQuestions
    );

    setActiveQuiz(generatedQuiz);
    setGameState("playing");
    setCurrentQIndex(0);
    setLives(mode === "latihan" ? 3 : 999);
    setScore(0);
    setStreak(0);
    setTimeLeft(mode === "ujian" ? 15 : 25);
    setFeedback(null);
    setEssayInput("");
  };

  // PROSES JAWABAN (Timeout dihapus, diganti manual)
  const processAnswer = (isCorrect, isTimeout = false) => {
    if (isCorrect) {
      const bonus = streak >= 2 ? (streak >= 5 ? 10 : 5) : 0;
      setScore((prev) => prev + 10 + bonus);
      setStreak((prev) => prev + 1);
      setFeedback({
        type: "correct",
        msg: bonus > 0 ? `🔥 STREAK BONUS +${bonus}!` : "JAWABAN TEPAT!",
      });
    } else {
      if (playMode === "latihan") setLives((prev) => prev - 1);
      setStreak(0);
      setFeedback({
        type: "wrong",
        msg: isTimeout ? "WAKTU HABIS!" : "JAWABAN KELIRU!",
      });
    }
  };

  // FUNGSI BARU: PINDAH SOAL MANUAL
  const goToNextQuestion = () => {
    if (playMode === "latihan" && feedback?.type === "wrong" && lives <= 0) {
      setGameState("gameover");
    } else if (currentQIndex + 1 < activeQuiz.length) {
      setCurrentQIndex((prev) => prev + 1);
      setTimeLeft(playMode === "ujian" ? 15 : 25);
      setFeedback(null);
      setEssayInput("");
    } else {
      setGameState("win");
    }
  };

  const handleMCQ = (opt) => {
    if (!feedback) processAnswer(opt === activeQuiz[currentQIndex].answer);
  };

  const handleEssay = (e) => {
    e.preventDefault();
    if (feedback || !essayInput.trim()) return;
    const userAns = essayInput.toLowerCase().trim();
    const correct = activeQuiz[currentQIndex].answerKeywords.some((k) =>
      userAns.includes(k.toLowerCase())
    );
    processAnswer(correct);
  };

  // SUBMIT LEADERBOARD (Telah diubah karena nama sudah didapat di awal)
  const submitToDB = async () => {
    if (!playerName.trim() || isSubmitting) return;
    setIsSubmitting(true);

    const leaderTopic =
      playMode === "ujian"
        ? `${selectedTopic.name} [${selectedLevel.name}]`
        : selectedTopic.name;

    const payload = {
      name: playerName.trim(), // Memakai nama dari Input awal
      score,
      topic: leaderTopic,
      date: new Date().toISOString(),
    };

    if (db && user && isGlobalDatabase) {
      try {
        await addDoc(
          collection(db, "artifacts", appId, "public", "data", "scores"),
          payload
        );
      } catch (e) {
        console.error(e);
      }
    } else {
      setLocalLeaderboard((prev) =>
        [...prev, payload].sort((a, b) => b.score - a.score).slice(0, 15)
      );
    }
    setIsSubmitting(false);
    setLeaderboardFilter("Semua");
    setGameState("leaderboard");
  };

  // --- RENDERING VIEWS ---

  if (gameState === "input_name") {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative overflow-hidden text-white font-sans selection:bg-sky-500/30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-600/10 blur-[120px] rounded-full"></div>

        <div className="relative z-10 text-center p-8 bg-slate-800/50 rounded-[3rem] border-2 border-slate-700 backdrop-blur-xl max-w-md w-full shadow-2xl mt-10">
          <User className="w-16 h-16 text-sky-400 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            Siapa Nama Kamu?
          </h2>
          <p className="text-slate-400 mb-8 font-medium">
            Masukkan namamu untuk dicatat di Leaderboard
          </p>

          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-900 border-2 border-slate-700 text-white text-center mb-6 focus:border-sky-500 outline-none font-bold tracking-wider transition-colors shadow-inner"
            placeholder="Ketik namamu..."
            autoFocus
          />

          <button
            onClick={() => {
              if (playerName.trim()) setGameState("menu");
            }}
            disabled={!playerName.trim()}
            className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-500 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-lg active:scale-95"
          >
            Mulai Petualangan
          </button>
        </div>
      </div>
    );
  }

  // TAMPILAN MENU UTAMA
  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center p-6 text-white font-sans">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12 pt-8">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500">
              HIDROMET QUIZZ
            </h1>
            <p className="text-slate-400 tracking-[0.3em] font-bold text-xs">
              UJI PENGETAHUAN BUMI & ATMOSFER
            </p>
            <p className="text-emerald-400 font-bold mt-2">
              Selamat Bermain, {playerName}!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedTopic(cat);
                  setGameState("select_mode");
                }}
                className={`p-6 rounded-[2rem] border-2 border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-all flex flex-col items-center text-center group hover:border-${
                  cat.border.split("-")[1]
                }-500`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <cat.icon className="w-8 h-8" />
                </div>
                <span className="font-black tracking-tight text-sm text-slate-300 group-hover:text-white">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setGameState("leaderboard")}
            className="w-full bg-slate-800 border-2 border-slate-700 hover:bg-slate-700 p-6 rounded-[2rem] font-black text-xl tracking-widest transition-all flex items-center justify-center text-yellow-500"
          >
            <Trophy className="w-6 h-6 mr-3" /> LIHAT KLASEMEN GLOBAL
          </button>
        </div>
      </div>
    );
  }

  if (gameState === "select_mode")
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[3rem] max-w-2xl w-full text-center shadow-2xl relative">
          <button
            onClick={() => setGameState("menu")}
            className="absolute top-8 left-8 flex items-center text-slate-500 hover:text-white font-black text-[10px] tracking-widest transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> KEMBALI
          </button>
          <div className="mb-10 pt-4">
            <div
              className={`w-20 h-20 rounded-[2rem] ${selectedTopic.bg} ${selectedTopic.color} flex items-center justify-center mx-auto mb-6 shadow-xl`}
            >
              <selectedTopic.icon className="w-10 h-10" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {selectedTopic.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-700 hover:border-emerald-500/50 transition-all flex flex-col">
              <h3 className="font-black text-emerald-400 flex items-center mb-4 text-xl tracking-tight">
                <BookOpen className="w-6 h-6 mr-3" /> Latihan Santai
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-bold leading-relaxed">
                Sesi santai 5 soal dengan 3 nyawa. Waktu 25 detik per soal.
                Cocok untuk pemanasan.
              </p>
              <button
                onClick={() => startGame("latihan")}
                className="w-full mt-auto bg-slate-700 hover:bg-emerald-600 py-4 rounded-2xl text-white font-black text-xs tracking-widest transition-all"
              >
                MULAI LATIHAN
              </button>
            </div>
            <div className="bg-gradient-to-br from-rose-900/40 to-slate-900 p-8 rounded-[2.5rem] border border-rose-500/30 hover:border-rose-500 transition-all flex flex-col relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flame className="w-32 h-32 text-rose-500" />
              </div>
              <h3 className="font-black text-rose-400 flex items-center mb-4 text-xl tracking-tight">
                <Flame className="w-6 h-6 mr-3 animate-pulse" /> Ujian
                Bertingkat
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-bold leading-relaxed">
                Mode brutal tanpa nyawa. Waktu 15 detik/soal. Pilih levelmu dari
                Easy hingga Extreme 150 soal!
              </p>
              <button
                onClick={() => setGameState("select_level")}
                className="w-full mt-auto bg-rose-600 hover:bg-rose-500 py-4 rounded-2xl text-white font-black text-xs tracking-widest transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)]"
              >
                PILIH TINGKATAN
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  if (gameState === "select_level")
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[3rem] max-w-4xl w-full text-center shadow-2xl relative">
          <button
            onClick={() => setGameState("select_mode")}
            className="absolute top-8 left-8 flex items-center text-slate-500 hover:text-white font-black text-[10px] tracking-widest transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> KEMBALI
          </button>
          <div className="mb-10 pt-4">
            <Flame className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
              Pilih Kasta Ujian
            </h2>
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">
              Topik: {selectedTopic.name}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => startGame("ujian", level)}
                className={`relative overflow-hidden bg-slate-800/80 border border-slate-700 hover:border-slate-500 p-6 rounded-[2rem] flex flex-col items-center justify-center transition-all hover:-translate-y-2 hover:${level.shadow} group`}
              >
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${level.color}`}
                ></div>
                <level.icon
                  className={`w-10 h-10 mb-4 transition-transform group-hover:scale-125 group-hover:rotate-12 ${level.text}`}
                />
                <h3
                  className={`font-black text-xl md:text-2xl tracking-tighter mb-1 bg-clip-text text-transparent bg-gradient-to-r ${level.color}`}
                >
                  {level.name}
                </h3>
                <p className="text-slate-400 text-[10px] font-black tracking-[0.2em]">
                  {level.count} SOAL
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );

  if (gameState === "gameover" || gameState === "win")
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="bg-slate-900 p-10 md:p-16 rounded-[4rem] max-w-xl w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 relative overflow-hidden">
          {gameState === "win" || playMode === "ujian" ? (
            <div className="mb-10 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-500/20 blur-3xl rounded-full"></div>
              <Trophy className="w-32 h-32 text-yellow-500 mx-auto drop-shadow-[0_0_20px_rgba(234,179,8,0.5)] animate-bounce" />
            </div>
          ) : (
            <Skull className="w-32 h-32 text-rose-500 mx-auto mb-10 opacity-30" />
          )}

          <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
            {playMode === "ujian"
              ? "UJIAN SELESAI!"
              : gameState === "win"
              ? "LATIHAN SELESAI!"
              : "GUGUR!"}
          </h2>
          <p className="text-sky-400 font-black text-xs tracking-[0.3em] uppercase mb-10">
            {selectedTopic.name}{" "}
            {playMode === "ujian" ? `| KASTA: ${selectedLevel?.name}` : ""}
          </p>

          <div className="bg-black/50 p-8 rounded-[3rem] mb-10 border border-slate-800 shadow-inner relative overflow-hidden">
            <p className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase mb-2">
              TOTAL SKOR
            </p>
            <p className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tighter">
              {score}
            </p>
          </div>

          {playMode === "ujian" && score > 0 && (
            <div className="mb-8">
              <p className="text-[10px] font-black text-rose-500 tracking-[0.3em] uppercase mb-4 animate-pulse">
                Pemain: {playerName}
              </p>
              <button
                disabled={isSubmitting}
                onClick={submitToDB}
                className="w-full bg-gradient-to-r from-rose-600 to-red-700 py-6 rounded-[2rem] text-white font-black text-xs tracking-[0.3em] shadow-[0_0_30px_rgba(225,29,72,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isSubmitting
                  ? "MENGIRIM DATA..."
                  : "SIMPAN SKOR KE LEADERBOARD"}
              </button>
            </div>
          )}

          <button
            onClick={() => setGameState("menu")}
            className="w-full bg-slate-800 hover:bg-slate-700 py-6 rounded-[2rem] text-slate-300 hover:text-white font-black text-xs tracking-[0.3em] transition-all"
          >
            MENU UTAMA
          </button>
        </div>
      </div>
    );

  if (gameState === "leaderboard")
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] max-w-3xl w-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-sky-500 to-rose-500"></div>
          <div className="text-center mb-8 pt-4">
            <div className="w-20 h-20 bg-yellow-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
              <Trophy className="w-10 h-10 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter">
              Klasemen Teratas
            </h2>
          </div>
          <div className="bg-slate-800/50 rounded-[2rem] border border-slate-700 p-2 overflow-x-auto flex gap-2 mb-8 custom-scrollbar">
            <button
              onClick={() => setLeaderboardFilter("Semua")}
              className={`shrink-0 px-6 py-3 rounded-full text-[10px] font-black tracking-widest transition-all ${
                leaderboardFilter === "Semua"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-transparent text-slate-400 hover:bg-slate-700"
              }`}
            >
              SEMUA KASTA
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setLeaderboardFilter(c.name)}
                className={`shrink-0 px-6 py-3 rounded-full text-[10px] font-black tracking-widest transition-all ${
                  leaderboardFilter === c.name
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-transparent text-slate-400 hover:bg-slate-700"
                }`}
              >
                {c.name.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="bg-slate-950 rounded-[2rem] border border-slate-800 overflow-hidden mb-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
            {(isGlobalDatabase ? leaderboardData : localLeaderboard)
              .filter(
                (d) =>
                  leaderboardFilter === "Semua" ||
                  d.topic.includes(leaderboardFilter)
              )
              .slice(0, 15)
              .map((d, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-6 border-b border-slate-800/50 transition-all hover:bg-slate-800/50 ${
                    i === 0 ? "bg-yellow-500/5" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`w-12 font-black text-3xl text-center ${
                        i === 0
                          ? "text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                          : i === 1
                          ? "text-slate-300"
                          : i === 2
                          ? "text-amber-600"
                          : "text-slate-600"
                      }`}
                    >
                      {i === 0
                        ? "🥇"
                        : i === 1
                        ? "🥈"
                        : i === 2
                        ? "🥉"
                        : `#${i + 1}`}
                    </span>
                    <div className="ml-4">
                      <p className="font-black text-white text-xl tracking-tight uppercase">
                        {d.name}
                      </p>
                      <p className="text-[10px] text-sky-400 font-black tracking-widest uppercase mt-1">
                        {d.topic}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-rose-500 text-3xl tracking-tighter">
                      {d.score}{" "}
                      <span className="text-[10px] text-slate-500 tracking-widest">
                        PT
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <button
            onClick={() => setGameState("menu")}
            className="w-full bg-slate-800 hover:bg-slate-700 py-6 rounded-[1.5rem] text-white font-black text-xs tracking-[0.3em] transition-all"
          >
            KEMBALI KE MENU
          </button>
        </div>
      </div>
    );

  // VIEW PERMAINAN UTAMA
  if (gameState === "playing") {
    const q = activeQuiz[currentQIndex];
    if (!q)
      return (
        <div className="min-h-screen bg-[#020617] flex justify-center items-center text-white mt-20 font-black animate-pulse">
          MEMUAT SOAL...
        </div>
      );

    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center py-6 px-4 md:px-8 font-sans selection:bg-rose-500 selection:text-white">
        <div className="w-full max-w-4xl bg-slate-900 p-4 md:p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between mb-8 border border-slate-800 gap-4">
          <div className="flex items-center gap-4">
            {playMode === "latihan" ? (
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-8 h-8 transition-all duration-500 ${
                      i < lives
                        ? "text-emerald-500 fill-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        : "text-slate-800"
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div
                className={`bg-gradient-to-r ${selectedLevel?.color} text-white px-4 py-2 md:py-3 rounded-2xl text-[10px] md:text-xs font-black flex items-center tracking-widest shadow-lg`}
              >
                <selectedLevel.icon className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-pulse" />{" "}
                {selectedLevel?.name}
              </div>
            )}
            <div className="hidden md:block w-px h-8 bg-slate-800 mx-2"></div>
            <span className="hidden md:block text-[10px] font-black px-4 py-2 rounded-full bg-slate-800 text-sky-400 uppercase tracking-widest border border-slate-700">
              {selectedTopic ? selectedTopic.name : "MENU UTAMA"}
            </span>
          </div>

          <div className="flex-1 px-4 md:px-12 flex items-center gap-4">
            <Timer
              className={`w-6 h-6 md:w-8 md:h-8 shrink-0 ${
                timeLeft <= 5 ? "text-rose-500 animate-spin" : "text-slate-500"
              }`}
            />
            <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-1000 ease-linear ${
                  timeLeft <= 5
                    ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,1)]"
                    : "bg-sky-500"
                }`}
                style={{ width: `${(timeLeft / maxTime) * 100}%` }}
              ></div>
            </div>
            <span
              className={`font-mono font-black text-2xl md:text-3xl w-10 text-right ${
                timeLeft <= 5 ? "text-rose-500" : "text-slate-400"
              }`}
            >
              {timeLeft}
            </span>
          </div>

          <div className="text-center min-w-[80px] bg-black/50 py-2 px-4 rounded-2xl border border-slate-800">
            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
              SKOR
            </div>
            <div className="font-black text-white text-2xl md:text-3xl tracking-tighter leading-none">
              {score}
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl bg-slate-900 p-8 md:p-16 rounded-[4rem] shadow-2xl border border-slate-800 relative overflow-hidden group">
          {streak >= 2 && (
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-yellow-500 animate-pulse"></div>
          )}

          <div className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full animate-pulse ${
                  playMode === "ujian"
                    ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
                    : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                }`}
              ></div>
              <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
                {q.topic}
              </span>
            </div>
            <span className="text-[10px] md:text-xs font-black text-white bg-slate-800 px-5 py-2.5 rounded-full border border-slate-700 tracking-widest">
              SOAL {currentQIndex + 1}{" "}
              <span className="text-slate-500">/ {activeQuiz.length}</span>
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-12 leading-[1.2] tracking-tight">
            {q.question}
          </h2>

          {q.mode === "guess" && (
            <div className="mb-12 max-w-lg mx-auto transform hover:scale-[1.02] transition-transform shadow-2xl rounded-3xl overflow-hidden">
              {q.imageType === "condensation" && <WaterCycleSVG />}
              {/* Gambar lain (Dihapus dari case switch untuk menyederhanakan kode jika anda paste sisa SVG nanti) */}
            </div>
          )}

          {q.mode === "mcq" || q.mode === "guess" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={!!feedback}
                  onClick={() => handleMCQ(opt)}
                  className={`group p-6 md:p-8 rounded-[2.5rem] border-2 text-left font-black text-sm md:text-lg tracking-tight transition-all duration-300 ${
                    !feedback
                      ? "border-slate-700 bg-slate-800/50 hover:border-sky-500 hover:bg-sky-500/10 text-slate-300 hover:text-white hover:-translate-y-1 shadow-lg"
                      : opt === q.answer
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 ring-4 ring-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                      : "border-slate-800 bg-slate-900 text-slate-600 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 text-xs md:text-sm font-black transition-colors ${
                        !feedback
                          ? "bg-slate-700 group-hover:bg-sky-500 text-slate-400 group-hover:text-white"
                          : opt === q.answer
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-800 text-slate-700"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    {opt}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form
              onSubmit={handleEssay}
              className="flex flex-col gap-6 max-w-2xl mx-auto"
            >
              <div className="relative">
                <input
                  value={essayInput}
                  onChange={(e) => setEssayInput(e.target.value)}
                  disabled={!!feedback}
                  placeholder="KETIK DI SINI..."
                  className={`w-full p-8 rounded-[3rem] border-2 text-center font-black text-2xl md:text-4xl tracking-[0.2em] outline-none transition-all uppercase shadow-inner ${
                    !feedback
                      ? "border-slate-700 focus:border-sky-500 bg-slate-950 text-white"
                      : "border-slate-800 bg-slate-900 text-slate-600"
                  }`}
                  autoFocus
                />
                {!feedback && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-800 px-4 py-1 rounded-full text-[8px] font-black text-slate-400 tracking-[0.4em] border border-slate-700">
                    ENTER
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={!!feedback || !essayInput.trim()}
                className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-6 rounded-[2.5rem] font-black text-xs tracking-[0.4em] shadow-[0_0_30px_rgba(2,132,199,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase disabled:opacity-50 disabled:scale-100"
              >
                KUNCI JAWABAN
              </button>
            </form>
          )}

          {/* PERSETUJUAN & TOMBOL LANJUT MANUAL */}
          {feedback && (
            <div
              className={`mt-12 p-8 md:p-10 rounded-[3rem] animate-in zoom-in-95 duration-500 border-2 relative overflow-hidden ${
                feedback.type === "correct"
                  ? "bg-emerald-950 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                  : "bg-rose-950 border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.2)]"
              }`}
            >
              <div
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 blur-[50px] rounded-full ${
                  feedback.type === "correct"
                    ? "bg-emerald-500/30"
                    : "bg-rose-500/30"
                }`}
              ></div>

              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start relative z-10 text-center md:text-left">
                <div
                  className={`p-6 rounded-[2rem] shadow-xl shrink-0 ${
                    feedback.type === "correct"
                      ? "bg-emerald-500 shadow-emerald-500/50"
                      : "bg-rose-600 shadow-rose-600/50"
                  } text-white`}
                >
                  {feedback.type === "correct" ? (
                    <CheckCircle2 className="w-12 h-12" />
                  ) : (
                    <AlertCircle className="w-12 h-12" />
                  )}
                </div>
                <div className="flex-1 w-full">
                  <p
                    className={`font-black text-3xl md:text-4xl tracking-tighter mb-4 ${
                      feedback.type === "correct"
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {feedback.msg}
                  </p>
                  <div className="bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 text-slate-300 leading-relaxed font-medium text-sm md:text-base">
                    <span className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-[0.3em]">
                      Fakta Meteorologi:
                    </span>
                    {q.explanation}
                  </div>

                  {/* TOMBOL LANJUT MANUAL DI SINI */}
                  <button
                    onClick={goToNextQuestion}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-6 rounded-[1.5rem] tracking-[0.2em] shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center hover:scale-[1.02] active:scale-[0.98]"
                  >
                    SAYA PAHAM, LANJUT KE SOAL BERIKUTNYA{" "}
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
