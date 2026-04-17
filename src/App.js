import React, { useState, useEffect } from "react";
import {
  Heart,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Timer,
  AlertCircle,
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

let auth, db;
const appId = "hidro-metro-vExtreme";

try {
  const app = initializeApp(myFirebaseConfig);
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

// --- TINGKATAN LEVEL ---
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
    count: 150,
    icon: Skull,
    color: "from-slate-900 to-black border border-red-500/50",
    shadow: "shadow-red-900/80",
    text: "text-red-500",
  },
];

// ============================================================================
// WAHAI ADMIN, PASTE RIBUAN SOAL ANDA DI DALAM ARRAY INI!
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
];

// ============================================================================
// WAHAI ADMIN, PASTE SEMUA KOMPONEN SVG ANDA DI SINI
// ============================================================================
const WaterCycleSVG = () => (
  <div className="relative w-full h-48 bg-sky-50 flex items-center justify-center">
    <span className="text-slate-400 font-bold">Contoh SVG</span>
  </div>
);

// --- KOMPONEN UTAMA ---
export default function App() {
  const [gameState, setGameState] = useState("input_name");
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

  const [firebaseStatus, setFirebaseStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [localLeaderboard, setLocalLeaderboard] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaderboardFilter, setLeaderboardFilter] = useState("Semua");

  const isGlobalDatabase = firebaseStatus === "connected";
  const maxTime = playMode === "ujian" ? 15 : 25;

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
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

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
      () => setFirebaseStatus("error")
    );
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    let timer;
    if (gameState === "playing" && feedback === null && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === "playing" && feedback === null) {
      processAnswer(false, true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState, feedback]);

  const generateQuestions = (topicId, mode, targetCount) => {
    let availableQuestions =
      topicId === "campuran"
        ? allQuizData
        : allQuizData.filter((q) => q.category === topicId);
    let limit = Math.min(targetCount, availableQuestions.length);
    let shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, limit);

    return selected.map((q) => {
      if (q.options)
        return {
          ...q,
          options: [...q.options].sort(() => 0.5 - Math.random()),
        };
      return q;
    });
  };

  const startGame = (mode, levelObj) => {
    setPlayMode(mode);
    if (levelObj) setSelectedLevel(levelObj);

    let totalQuestions = 5;
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

  const submitToDB = async () => {
    if (!playerName.trim() || isSubmitting) return;
    setIsSubmitting(true);

    const leaderTopic =
      playMode === "ujian"
        ? `${selectedTopic.name} [${selectedLevel.name}]`
        : selectedTopic.name;
    const payload = {
      name: playerName.trim(),
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

  if (gameState === "input_name")
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative overflow-hidden text-white font-sans selection:bg-sky-500/30">
        <div className="relative z-10 text-center p-8 bg-slate-800/50 rounded-[3rem] border-2 border-slate-700 max-w-md w-full shadow-2xl">
          <User className="w-16 h-16 text-sky-400 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-black text-white mb-2">
            Siapa Nama Kamu?
          </h2>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-900 border-2 border-slate-700 text-white text-center mb-6 focus:border-sky-500 font-bold"
            placeholder="Ketik namamu..."
            autoFocus
          />
          <button
            onClick={() => {
              if (playerName.trim()) setGameState("menu");
            }}
            disabled={!playerName.trim()}
            className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 text-white font-black py-4 px-8 rounded-2xl transition-all"
          >
            Mulai Petualangan
          </button>
        </div>
      </div>
    );

  if (gameState === "menu")
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center p-6 text-white font-sans">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12 pt-8">
            <h1 className="text-5xl md:text-7xl font-black text-sky-400 mb-4">
              HIDROMET QUIZZ
            </h1>
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
                className={`p-6 rounded-[2rem] border-2 border-slate-800 bg-slate-900 hover:bg-slate-800 flex flex-col items-center`}
              >
                <cat.icon className={`w-10 h-10 mb-4 ${cat.color}`} />
                <span className="font-black text-sm text-slate-300">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setGameState("leaderboard")}
            className="w-full bg-slate-800 p-6 rounded-[2rem] font-black text-yellow-500 flex items-center justify-center"
          >
            <Trophy className="w-6 h-6 mr-3" /> LIHAT KLASEMEN
          </button>
        </div>
      </div>
    );

  if (gameState === "select_mode")
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="bg-slate-900 p-8 md:p-12 rounded-[3rem] max-w-2xl w-full text-center">
          <h2 className="text-3xl font-black text-white mb-8">
            {selectedTopic.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => startGame("latihan")}
              className="bg-slate-800 p-8 rounded-3xl text-emerald-400 font-black"
            >
              LATIHAN (5 SOAL)
            </button>
            <button
              onClick={() => setGameState("select_level")}
              className="bg-rose-900/50 p-8 rounded-3xl text-rose-400 font-black"
            >
              UJIAN BERTINGKAT
            </button>
          </div>
        </div>
      </div>
    );

  if (gameState === "select_level")
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="bg-slate-900 p-8 rounded-[3rem] max-w-4xl w-full text-center">
          <h2 className="text-3xl font-black text-white mb-8">
            Pilih Kasta Ujian
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => startGame("ujian", level)}
                className="bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-slate-500 text-white font-black"
              >
                {level.name} <br />
                <span className="text-xs text-slate-400">
                  {level.count} SOAL
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );

  if (gameState === "leaderboard")
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 text-white">
        <div className="bg-slate-900 p-8 rounded-[3rem] w-full max-w-2xl text-center">
          <h2 className="text-3xl font-black mb-8 text-yellow-400">
            LEADERBOARD
          </h2>
          <div className="bg-slate-950 p-4 rounded-2xl h-[50vh] overflow-y-auto mb-6">
            {leaderboardData.map((d, i) => (
              <div
                key={i}
                className="flex justify-between border-b border-slate-800 py-4"
              >
                <span className="font-bold">
                  {i + 1}. {d.name}{" "}
                  <span className="text-[10px] text-sky-400 block">
                    {d.topic}
                  </span>
                </span>
                <span className="font-black text-rose-500">{d.score} PT</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setGameState("menu")}
            className="bg-slate-800 py-4 px-8 rounded-xl font-black"
          >
            KEMBALI
          </button>
        </div>
      </div>
    );

  if (gameState === "gameover" || gameState === "win")
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="bg-slate-900 p-10 rounded-[3rem] text-center w-full max-w-xl">
          <h2 className="text-4xl font-black text-white mb-6">
            {score > 0 ? "SELESAI!" : "GUGUR!"}
          </h2>
          <p className="text-6xl font-black text-sky-400 mb-8">{score}</p>
          {playMode === "ujian" && score > 0 && (
            <button
              onClick={submitToDB}
              disabled={isSubmitting}
              className="w-full bg-rose-600 py-4 rounded-xl text-white font-black mb-4 disabled:opacity-50"
            >
              {isSubmitting ? "MENGIRIM..." : "SIMPAN SKOR"}
            </button>
          )}
          <button
            onClick={() => setGameState("menu")}
            className="w-full bg-slate-800 py-4 rounded-xl text-white font-black"
          >
            MENU UTAMA
          </button>
        </div>
      </div>
    );

  if (gameState === "playing") {
    const q = activeQuiz[currentQIndex];
    if (!q)
      return (
        <div className="min-h-screen bg-[#020617] text-white flex justify-center items-center font-black animate-pulse">
          MEMUAT SOAL...
        </div>
      );

    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center py-6 px-4 md:px-8 font-sans selection:bg-rose-500 selection:text-white">
        {/* HUD Atas */}
        <div className="w-full max-w-4xl bg-slate-900 p-4 rounded-3xl flex justify-between items-center mb-8 border border-slate-800">
          <div className="flex gap-2">
            {playMode === "latihan" ? (
              [...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-6 h-6 ${
                    i < lives
                      ? "text-emerald-500 fill-emerald-500"
                      : "text-slate-800"
                  }`}
                />
              ))
            ) : (
              <span className="font-black text-rose-500">UJIAN</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Timer className="w-6 h-6 text-slate-500" />
            <span
              className={`font-mono font-black text-2xl ${
                timeLeft <= 5 ? "text-rose-500" : "text-white"
              }`}
            >
              {timeLeft}
            </span>
          </div>
          <div className="text-center font-black text-white text-xl">
            SKOR: {score}
          </div>
        </div>

        {/* Soal */}
        <div className="w-full max-w-4xl bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-800">
          <p className="text-sky-400 font-bold text-xs tracking-widest mb-4 uppercase">
            SOAL {currentQIndex + 1} / {activeQuiz.length}
          </p>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-8">
            {q.question}
          </h2>

          {/* Menampilkan Gambar/SVG Khusus Mode Guess */}
          {q.mode === "guess" && (
            <div className="mb-8 max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl">
              {q.imageType === "condensation" && <WaterCycleSVG />}
              {/* === ADMIN: PASTE LOGIKA MENAMPILKAN SVG ANDA DI SINI === */}
            </div>
          )}

          {/* Opsi Pilihan Ganda / Essay */}
          {q.mode === "mcq" || q.mode === "guess" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={!!feedback}
                  onClick={() => handleMCQ(opt)}
                  className={`p-6 rounded-2xl border-2 text-left font-black text-lg transition-all ${
                    !feedback
                      ? "border-slate-700 bg-slate-800 hover:border-sky-500 text-white"
                      : opt === q.answer
                      ? "border-emerald-500 bg-emerald-900 text-emerald-400"
                      : "border-slate-800 bg-slate-900 text-slate-600"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleEssay} className="flex flex-col gap-4">
              <input
                value={essayInput}
                onChange={(e) => setEssayInput(e.target.value)}
                disabled={!!feedback}
                placeholder="KETIK JAWABAN..."
                autoFocus
                className="p-6 rounded-2xl border-2 border-slate-700 bg-slate-950 text-white text-center font-black text-2xl uppercase"
              />
              <button
                type="submit"
                disabled={!!feedback || !essayInput.trim()}
                className="bg-sky-600 text-white py-4 rounded-2xl font-black"
              >
                KUNCI JAWABAN
              </button>
            </form>
          )}

          {/* Feedback & Lanjut Manual */}
          {feedback && (
            <div
              className={`mt-8 p-6 md:p-8 rounded-3xl border-2 ${
                feedback.type === "correct"
                  ? "bg-emerald-950 border-emerald-500/50"
                  : "bg-rose-950 border-rose-500/50"
              }`}
            >
              <p
                className={`font-black text-2xl mb-4 ${
                  feedback.type === "correct"
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {feedback.msg}
              </p>
              <div className="bg-black/30 p-4 rounded-xl text-slate-300 text-sm mb-6">
                <span className="font-bold text-sky-400 block mb-1">
                  FAKTA:
                </span>
                {q.explanation}
              </div>
              <button
                onClick={goToNextQuestion}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center"
              >
                LANJUT KE SOAL BERIKUTNYA{" "}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
