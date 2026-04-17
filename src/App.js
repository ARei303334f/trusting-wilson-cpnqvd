/* eslint-disable */
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
  // 1. IKLIM & CUACA
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
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Awan",
    question: "Awan tinggi yang berbentuk serat halus kristal es adalah...",
    options: ["Stratus", "Sirus", "Kumulus", "Nimbostratus"],
    answer: "Sirus",
    explanation:
      "Awan Sirus (Cirrus) terbentuk di ketinggian di atas 6.000 meter.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Radiasi",
    question: "Gas yang paling dominan di atmosfer bumi adalah...",
    options: ["Oksigen", "Nitrogen", "Argon", "Karbondioksida"],
    answer: "Nitrogen",
    explanation:
      "Nitrogen menyusun sekitar 78% atmosfer bumi, diikuti Oksigen 21%.",
  },
  {
    category: "iklim_cuaca",
    mode: "essay",
    topic: "Alat",
    question: "Alat pengukur tekanan udara atmosfer dinamakan...",
    answerKeywords: ["barometer"],
    explanation: "Barometer bekerja mengukur berat kolom udara di atasnya.",
  },
  {
    category: "iklim_cuaca",
    mode: "essay",
    topic: "Unsur",
    question: "Bahan utama pembentuk awan dan presipitasi adalah uap...",
    answerKeywords: ["air"],
    explanation: "Uap air adalah gas H2O yang tidak terlihat di atmosfer.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Atmosfer",
    question: "cuaca adalah...",
    options: [
      "Rata-rata kondisi atmosfer",
      "Kondisi atmosfer sesaat",
      "Pola iklim global",
      "Variasi suhu tahunan",
    ],
    answer: "Kondisi atmosfer sesaat",
    explanation:
      "Cuaca menggambarkan kondisi atmosfer dalam waktu singkat di suatu tempat.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Hujan",
    question: "Hujan yang terjadi karena naiknya udara panas disebut...",
    options: ["Orografis", "Frontal", "Konvektif", "Siklonal"],
    answer: "Konvektif",
    explanation: "Udara panas naik lalu mendingin dan mengembun.",
  },
  {
    category: "iklim_cuaca",
    mode: "essay",
    topic: "Angin",
    question: "Angin yang bertiup dari laut ke darat disebut...",
    answerKeywords: ["angin laut"],
    explanation: "Terjadi siang hari karena daratan lebih cepat panas.",
  },
  {
    category: "iklim_cuaca",
    mode: "essay",
    topic: "Angin",
    question: "Angin yang bertiup dari darat ke laut disebut...",
    answerKeywords: ["angin darat"],
    explanation: "Terjadi malam hari karena daratan lebih cepat dingin.",
  },
  {
    category: "iklim_cuaca",
    mode: "essay",
    topic: "Dasar",
    question: "Apakah cuaca dan iklim berbeda?",
    answerKeywords: ["ya", "iya", "yes"],
    explanation: "Cuaca sesaat, iklim jangka panjang.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Dasar",
    question: "Cuaca adalah...",
    options: [
      "Rata-rata kondisi",
      "Kondisi sesaat",
      "Pola global",
      "Variasi tahunan",
    ],
    answer: "Kondisi sesaat",
    explanation: "Cuaca bersifat jangka pendek.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Kelembapan",
    question: "Kelembapan relatif adalah...",
    options: [
      "Jumlah uap air",
      "Perbandingan uap air aktual dengan maksimum",
      "Tekanan udara",
      "Suhu udara",
    ],
    answer: "Perbandingan uap air aktual dengan maksimum",
    explanation: "RH dinyatakan dalam persen.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Siklus Iklim",
    question:
      "Menurut Hipotesis Milankovitch, perubahan bentuk orbit Bumi mengelilingi Matahari dari hampir lingkaran menjadi lebih elips (Eccentricity) terjadi dalam siklus periode sekitar...",
    options: ["26.000 tahun", "41.000 tahun", "100.000 tahun", "413.000 tahun"],
    answer: "100.000 tahun",
    explanation:
      "Siklus eksentrisitas memengaruhi seberapa dekat Bumi dengan Matahari, yang menjadi salah satu pemicu utama periode glasial (zaman es).",
  },
  {
    category: "iklim_cuaca",
    mode: "guess",
    topic: "Orbit Bumi",
    question:
      "Berdasarkan orbit elips Bumi, titik di mana Bumi berada pada jarak terdekat dengan Matahari (sekitar awal Januari) dinamakan...",
    imageType: "orbit_elliptical",
    options: ["Aphelion", "Perihelion", "Perigee", "Apogee"],
    answer: "Perihelion",
    explanation:
      "Perihelion adalah titik terdekat orbit Bumi ke Matahari (sekitar 147 juta km), sedangkan Aphelion adalah titik terjauh.",
  },
  {
    category: "iklim_cuaca",
    mode: "essay",
    topic: "Siklus Iklim",
    question:
      "Gerakan bergoyang pada sumbu rotasi Bumi akibat tarikan gravitasi Matahari dan Bulan, yang mengubah orientasi kutub secara periodik disebut...",
    answerKeywords: ["presesi", "precession", "wobble", "wobbling"],
    explanation:
      "Siklus Presesi terjadi sekitar setiap 26.000 tahun dan memengaruhi penempatan musim dalam orbit elips Bumi.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Siklon Tropis",
    question:
      "Pembentukan siklon tropis di dekat ekuator (khatulistiwa) secara klasik dianggap sangat mustahil karena...",
    options: [
      "Suhu permukaan laut yang terlalu dingin",
      "Kurangnya pasokan uap air dari samudra",
      "Tekanan udara atmosfer yang terlalu padat",
      "Nilai parameter gaya Coriolis yang sangat kecil",
    ],
    answer: "Nilai parameter gaya Coriolis yang sangat kecil",
    explanation:
      "Gaya Coriolis diperlukan untuk membelokkan angin dan mempertahankan rotasi siklonik. Di ekuator, nilainya mendekati nol.",
  },
  {
    category: "iklim_cuaca",
    mode: "essay",
    topic: "Cuaca Ekstrem",
    question:
      "Aliran arus listrik mematikan yang merambat di luar permukaan kulit (tidak masuk ke organ dalam) saat seseorang tersambar petir dalam kondisi basah/hujan disebut fenomena...",
    answerKeywords: ["flashover", "surface flashover"],
    explanation:
      "Eksperimen membuktikan air hujan di kulit kepala mempercepat flashover, menurunkan arus ke otak, dan meningkatkan peluang selamat.",
  },
  {
    category: "iklim_cuaca",
    mode: "guess",
    topic: "Pemanasan Global",
    question:
      "Mencairnya lapisan tanah yang membeku permanen akibat suhu global yang menghangat akan melepaskan gas rumah kaca yang 25 kali lebih kuat dari CO2, yaitu...",
    imageType: "permafrost",
    options: ["Karbon monoksida", "Metana", "Nitrogen oksida", "Ozon"],
    answer: "Metana",
    explanation:
      "Lapisan Permafrost di kutub menyimpan banyak material organik purba yang jika mencair akan membusuk dan melepaskan Metana.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Atmosfer Bumi",
    question:
      "Peningkatan gas rumah kaca memicu pemanasan suhu atmosfer. Dampak langsung dari udara atmosfer yang lebih hangat terhadap siklus hidrologi adalah...",
    options: [
      "Udara hangat dapat menahan lebih banyak uap air, memicu badai intens",
      "Udara hangat kehilangan kemampuannya menahan uap air",
      "Terhentinya proses evaporasi di seluruh samudra",
      "Proses kondensasi terjadi sebelum mencapai troposfer",
    ],
    answer:
      "Udara hangat dapat menahan lebih banyak uap air, memicu badai intens",
    explanation:
      "Atmosfer yang panas dapat 'menyerap' uap air lebih banyak. Saat terkondensasi, energi laten yang dilepas memicu badai ekstrem.",
  },
  {
    category: "iklim_cuaca",
    mode: "essay",
    topic: "Sistem Bumi",
    question:
      "Istilah untuk lapisan Bumi terbawah yang menjadi tempat terkonsentrasinya sebagian besar uap air dan tempat terjadinya cuaca adalah...",
    answerKeywords: ["troposfer", "troposphere"],
    explanation:
      "Troposfer terbentang dari 0 hingga 15 km dari permukaan tanah, mengatur dinamika sistem hidro-meteorologi bumi.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Cuaca Ekstrem",
    question:
      "Banjir pesisir tiba-tiba yang diakibatkan oleh angin badai yang mendorong air laut ke daratan, sering terjadi bersamaan dengan datangnya siklon tropis, dinamakan...",
    options: [
      "Banjir Bandang",
      "Storm Surge",
      "Tsunami Pesisir",
      "Likuifaksi Laut",
    ],
    answer: "Storm Surge",
    explanation:
      "Storm surge adalah gelombang pasang badai yang merusak, terjadi karena dorongan angin ekstrem dan tekanan udara yang sangat rendah di lautan.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Siklus Iklim",
    question:
      "Perubahan kemiringan sumbu rotasi Bumi (Obliquity) sangat memengaruhi intensitas musim panas dan dingin. Siklus perubahannya terjadi selama...",
    options: ["10.000 tahun", "26.000 tahun", "41.000 tahun", "100.000 tahun"],
    answer: "41.000 tahun",
    explanation:
      "Siklus Obliquity bervariasi dari 22.1 hingga 24.5 derajat setiap 41.000 tahun, memengaruhi sebaran radiasi matahari di kutub.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Vibes Hujan",
    question:
      "Pas mau hujan atau setelah hujan turun, biasanya ada bau tanah yang khas dan bikin vibes jadi indie banget. Anak Gen Z sering nyebutnya apa?",
    options: ["Aerosol", "Petrikor", "Ozonizer", "Geosmin"],
    answer: "Petrikor",
    explanation:
      "Petrikor (Petrichor) adalah aroma khas hasil kombinasi minyak dari tanaman dan senyawa geosmin dari bakteri tanah yang dilepaskan ke udara saat terkena air hujan[cite: 6].",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Local Wisdom Sulsel",
    question:
      "Lagi di pantai barat Sulawesi Selatan (kayak Makassar) pas bulan Desember, terus tiba-tiba dihantam angin kencang banget dari arah laut. Warga lokal biasanya teriak ada angin apa?",
    options: ["Angin Timboro", "Angin Mamiri", "Angin Bura'", "Angin Bahorok"],
    answer: "Angin Bura'",
    explanation:
      "Angin Bura' adalah istilah lokal Bugis-Makassar untuk angin kencang yang dibawa oleh Muson Barat (Oktober–Maret) di pantai barat Sulsel[cite: 12]. Jangan tertukar sama Angin Timboro yang cenderung sepoi-sepoi di pantai timur saat kemarau[cite: 12].",
  },
  {
    category: "iklim_cuaca",
    mode: "essay",
    topic: "Cloud Ghosting",
    question:
      "Pernah liat garis-garis hujan di bawah awan tapi pas lu tungguin hujannya nggak pernah nyampe tanah? Istilah meteorologi buat hujan yang 'nge-ghosting' bumi ini adalah...",
    answerKeywords: ["virga"],
    explanation:
      "Virga adalah fenomena presipitasi (hujan/salju) yang menguap kembali sebelum menyentuh permukaan tanah karena melewati lapisan udara yang sangat kering di bawah awan[cite: 6].",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Jebakan ENSO",
    question:
      "Nama 'El Niño' diambil dari bahasa Spanyol. Secara harafiah, nelayan di Peru menamainya begitu karena fenomena ini sering muncul barengan dengan...",
    options: [
      "Kiamat kecil",
      "Dewa Laut",
      "Kelahiran bayi Yesus (Natal)",
      "Musim badai monster",
    ],
    answer: "Kelahiran bayi Yesus (Natal)",
    explanation:
      "El Niño berarti 'Anak Laki-Laki' (merujuk pada bayi Yesus) karena arus air hangat ini biasanya muncul di pantai Amerika Selatan sekitar bulan Desember atau waktu Natal[cite: 8].",
  },
  {
    category: "iklim_cuaca",
    mode: "guess",
    topic: "Awan Cantik Tapi Bahaya",
    question:
      "Awan yang bentuknya kayak kantong-kantong bergantungan ini estetik banget buat di-posting di Story IG, tapi hati-hati karena ini pertanda adanya badai Multi-cell. Namanya awan...",
    imageType: "mammatus_cloud",
    options: ["Altocumulus", "Mammatus", "Cirrocumulus", "Lenticular"],
    answer: "Mammatus",
    explanation:
      "Awan Mammatus berbentuk seperti tonjolan kantong di bawah awan induknya. Ini adalah indikator adanya turbulensi kuat dan sering menjadi bagian dari sistem badai besar (thunderstorm)[cite: 6].",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Gen Z Climate Debate",
    question:
      "Ada kelompok yang saking paniknya nganggep perubahan iklim itu kiamat yang bakal terjadi besok pagi tanpa liat adanya potensi adaptasi manusia. Kelompok ini sering dikritik sebagai...",
    options: ["Skeptis", "Realis", "Alarmist", "Hedonist"],
    answer: "Alarmist",
    explanation:
      "Alarmist adalah istilah untuk kelompok yang menekankan urgensi dan ancaman iklim secara ekstrem/berlebihan tanpa mempertimbangkan inovasi atau keberhasilan adaptasi yang sudah ada[cite: 15, 16].",
  },
  {
    category: "iklim_cuaca",
    mode: "essay",
    topic: "Jebakan Salju",
    question:
      "Bukan salju biasa, ini adalah butiran es kecil, putih, dan lembut yang terbentuk pas kristal salju dibungkus sama tetesan air dingin (riming). Namanya...",
    answerKeywords: ["graupel"],
    explanation:
      "Graupel sering disebut 'salju pelet' atau 'hujan es lembut'. Bedanya sama salju biasa adalah graupel lebih padat dan bulat karena proses rime[cite: 6].",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Jebakan Hitungan",
    question:
      "Dalam klasifikasi iklim Schmidt-Ferguson, rumus untuk nyari nilai Q adalah perbandingan antara jumlah rata-rata bulan kering dan bulan basah. Jebakannya: urutan pembagiannya yang bener gimana?",
    options: [
      "(Bulan Basah / Bulan Kering) x 100%",
      "(Bulan Kering / Bulan Basah) x 100%",
      "(Bulan Kering x Bulan Basah) / 12",
      "(Total Hujan / 12)",
    ],
    answer: "(Bulan Kering / Bulan Basah) x 100%",
    explanation:
      "Jangan kebalik! Nilai Q Schmidt-Ferguson dihitung dengan membagi jumlah rata-rata bulan kering dengan bulan basah (Md/Mw)[cite: 9].",
  },
  {
    category: "iklim_cuaca",
    mode: "guess",
    topic: "Level Boss Cb",
    question:
      "Liat bagian paling atas awan Cumulonimbus yang sampe 'tembus' ke lapisan stratosfer ini? Bagian yang menonjol di atas anvil (landasan) ini disebut...",
    imageType: "overshooting_top",
    options: [
      "Anvil Head",
      "Overshooting Top",
      "Mammatus Peak",
      "Thunder Crown",
    ],
    answer: "Overshooting Top",
    explanation:
      "Overshooting Top terjadi ketika dorongan udara naik (updraft) di dalam awan Cb sangat kuat sehingga menembus batas tropopause dan masuk ke stratosfer[cite: 6].",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Jebakan Coriolis",
    question:
      "Siklon Vamei (2001) bikin heboh dunia karena dia 'bandel' muncul di lintang 1.5° LU. Kenapa ini disebut jebakan logika meteorologi?",
    options: [
      "Karena suhunya terlalu panas",
      "Karena gaya Coriolis di dekat ekuator hampir nol (nggak cukup buat muter badai)",
      "Karena di situ nggak ada laut",
      "Karena angin pasatnya terlalu lemah",
    ],
    answer:
      "Karena gaya Coriolis di dekat ekuator hampir nol (nggak cukup buat muter badai)",
    explanation:
      "Secara teori, siklon nggak bisa terbentuk di bawah 5° lintang karena gaya Coriolis yang memutar badai nilainya nol di ekuator. Vamei adalah pengecualian yang sangat langka[cite: 1, 11].",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Bedanya Apa Bang?",
    question:
      "Orang awam sering nyamain 'Global Warming' sama 'Climate Change'. Padahal beda loh! Jebakannya: Kalau Global Warming itu cuma fokus ke..., sedangkan Climate Change itu se-circle-circlenya.",
    options: [
      "Kenaikan suhu doang",
      "Perubahan curah hujan ekstrem",
      "Mencairnya es kutub secara spesifik",
      "Gas buang pabrik",
    ],
    answer: "Kenaikan suhu doang",
    explanation:
      "Global Warming spesifik merujuk pada naiknya SUHU rata-rata global. Sedangkan Climate Change lebih luas, mencakup efek dari naiknya suhu tersebut (seperti badai, pergeseran musim, kekeringan).",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Gas Bikin Gerah",
    question:
      "Kalau lu ditanya, udara yang tiap detik lu hirup ini paling dominan isinya gas apa? Awas jebakan batman, jangan asal sebut oksigen!",
    options: [
      "Oksigen (O2)",
      "Karbon dioksida (CO2)",
      "Nitrogen (N2)",
      "Uap Air (H2O)",
    ],
    answer: "Nitrogen (N2)",
    explanation:
      "Udara kita terdiri dari gas tetap (Permanent Gases). Yang paling banyak adalah Nitrogen (78%), baru disusul Oksigen (21%).",
  },
  {
    category: "iklim_cuaca",
    mode: "essay",
    topic: "Kebalikan Si Bocah Laki",
    question:
      "Kalau El Niño artinya 'Anak Laki-Laki' (merujuk ke bayi Yesus karena muncul saat Natal), maka kebalikannya, La Niña (yang bikin Indonesia kebanjiran), artinya adalah anak...",
    answerKeywords: ["perempuan", "cewek"],
    explanation:
      "Dalam bahasa Spanyol, La Niña berarti 'Anak Perempuan'. Fase ini ditandai dengan menguatnya angin pasat yang mendorong air hangat berlebih ke perairan Indonesia.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Hujan vs Shower",
    question:
      "Bedanya hujan 'Rain' biasa sama hujan 'Shower' tuh apa sih secara meteorologi? Bukannya sama-sama air jatuh dari langit?",
    options: [
      "Rain itu gerimis, Shower itu hujan batu es",
      "Rain turun awet dari awan Stratus, Shower turun deres tiba-tiba dari awan Cumulus",
      "Rain itu hujan di darat, Shower itu hujan di laut",
      "Rain bikin basah, Shower bikin banjir",
    ],
    answer:
      "Rain turun awet dari awan Stratus, Shower turun deres tiba-tiba dari awan Cumulus",
    explanation:
      "Hujan 'Shower' bersifat konvektif, turun deras, durasinya cepat, dan areanya lokal (dari awan Cumulus/Cb). Kalau 'Rain' sifatnya stratiform, intensitas ringan-sedang tapi awet berjam-jam di area luas.",
  },
  {
    category: "iklim_cuaca",
    mode: "guess",
    topic: "Awan Kiamat",
    question:
      "Pernah liat awan panjang bergulung di langit yang bentuknya mirip ombak tsunami mau ngehantam kota? Keliatannya serem abis, tapi nama ilmiah aslinya adalah...",
    imageType: "roll_cloud",
    options: [
      "Roll Cloud (Arcus)",
      "Mammatus",
      "Lenticular Cloud",
      "Wall Cloud",
    ],
    answer: "Roll Cloud (Arcus)",
    explanation:
      "Roll cloud atau awan gulung adalah formasi awan langka (jenis Arcus) yang terbentuk karena hembusan downdraft dingin dari badai Cb di belakangnya, menciptakan ilusi gelombang tsunami di langit.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Atapnya Awan Badai",
    question:
      "Awan Cb (Cumulonimbus) bagian puncaknya rata kayak meja/landasan besi. Kenapa dia bisa rata gitu, nggak bablas terus aja tinggi ke luar angkasa?",
    options: [
      "Karena nabrak lapisan Ozon yang beracun",
      "Karena nabrak atap Tropopause (batas stratosfer yang tiba-tiba hangat)",
      "Karena kehabisan uap air di tengah jalan",
      "Karena terdorong gaya gravitasi bulan",
    ],
    answer:
      "Karena nabrak atap Tropopause (batas stratosfer yang tiba-tiba hangat)",
    explanation:
      "Di stratosfer, suhu udara berbalik memanas karena ozon. Awan badai (konveksi) butuh udara sekitar yang lebih dingin untuk bisa naik. Pas ketemu stratosfer yang hangat, udaranya mentok dan menyebar ke samping membentuk landasan (Anvil).",
  },
  {
    category: "iklim_cuaca",
    mode: "essay",
    topic: "Bau Indie",
    question:
      "Pas mau hujan atau setelah hujan turun membasahi tanah kering, biasanya kecium bau tanah khas yang bikin vibes jadi indie banget. Fenomena bau ini disebut...",
    answerKeywords: ["petrikor", "petrichor"],
    explanation:
      "Petrikor dihasilkan oleh senyawa geosmin (dari bakteri Streptomyces di tanah) dan minyak nabati tanaman yang terlepas ke udara saat terkena benturan tetesan hujan.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Suhu Neraka atau Es?",
    question:
      "Kalau lu nekat terbang pakai parasut nembus masuk ke dalem awan badai Cumulonimbus (Cb) yang badak banget dan keliatan hitam pekat dari luar, apa yang bakal lu rasain di dalem sana?",
    options: [
      "Panas banget karena banyak petir",
      "Hampa udara kayak di luar angkasa",
      "Super dingin ekstrem, isinya kristal es dan air yang di bawah titik beku",
      "Biasa aja kayak kabut di puncak gunung",
    ],
    answer:
      "Super dingin ekstrem, isinya kristal es dan air yang di bawah titik beku",
    explanation:
      "Awan Cb adalah pabrik es raksasa. Bagian tengah hingga puncaknya bersuhu sangat minus, penuh dengan supercooled liquid water, salju, dan bongkahan es (hail) yang lagi diaduk-aduk sama angin.",
  },
  {
    category: "iklim_cuaca",
    mode: "guess",
    topic: "Kode Warna Radar",
    question:
      "Kalau lu buka aplikasi cuaca atau layar Radar BMKG, terus ngeliat gumpalan awan warnanya MERAH PEKAT sampai UNGU, itu artinya lu mending jangan keluar rumah karena ada potensi...",
    imageType: "weather_radar",
    options: [
      "Kabut polusi tebal",
      "Hujan sangat lebat, petir, sampai hujan es (Hail)",
      "Suhu udara lagi panas-panasnya",
      "Angin sepoi-sepoi aja",
    ],
    answer: "Hujan sangat lebat, petir, sampai hujan es (Hail)",
    explanation:
      "Radar cuaca mengukur pantulan dari objek di langit (reflectivity dalam decibel Z / dBZ). Warna merah/ungu (di atas 50 dBZ) berarti tetesan airnya sangat besar atau bahkan berupa padatan es.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Beda Tongkrongan, Beda Nama",
    question:
      "Badai monster yang muter-muter itu namanya beda-beda tergantung lokasinya. Kalau kejadiannya di Samudra Pasifik Barat (dekat Jepang, Filipina & Asia Timur), dia dipanggil...",
    options: ["Hurricane", "Typhoon (Topan)", "Cyclone (Siklon)", "Tornado"],
    answer: "Typhoon (Topan)",
    explanation:
      "Itu fenomena yang sama (Tropical Cyclone). Di Atlantik disebut Hurricane, di Pasifik Barat disebut Typhoon, dan di Samudra Hindia/Australia disebut Cyclone.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Bentuk Asli Salju",
    question:
      "Bintang salju (Snowflake) yang jatuh dari langit itu selalu punya bentuk dasar sudut yang jumlahnya PASTI sama. Jebakan nih, jumlah sudutnya ada berapa?",
    options: ["4 (Persegi)", "5 (Bintang)", "6 (Hexagon)", "8 (Octagon)"],
    answer: "6 (Hexagon)",
    explanation:
      "Salju selalu berbentuk segi enam (hexagonal) karena molekul air (H2O) saat membeku di awan akan saling mengikat melalui ikatan hidrogen dalam struktur geometris segi enam yang paling stabil.",
  },
  {
    category: "iklim_cuaca",
    mode: "essay",
    topic: "Polusi Pabrik",
    question:
      "Fenomena hujan yang bikin patung-patung sejarah di Eropa pada hancur dan korosi karena uap airnya nyampur sama sulfur dioksida (SO2) dari pabrik disebut fenomena hujan...",
    answerKeywords: ["asam", "acid", "acid rain"],
    explanation:
      "Hujan asam (acid rain) memiliki pH di bawah 5.0. Presipitasi ini merusak ekosistem dan melarutkan kalsium pada monumen marmer atau batu kapur.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "London Galau",
    question:
      "Kota London di Inggris sering banget digambarin selalu mendung, hujan rintik-rintik (drizzle), atau berkabut. Secara klimatologis, kenapa sih London se-galau itu cuacanya?",
    options: [
      "Karena polusi revolusi industri zaman dulu masih nyisa",
      "Karena posisinya pas banget di jalur pertemuan arus laut hangat Gulf Stream sama udara dingin kutub utara",
      "Karena dilewati angin pasat khatulistiwa",
      "Karena banyak gedung tinggi yang nutupin matahari",
    ],
    answer:
      "Karena posisinya pas banget di jalur pertemuan arus laut hangat Gulf Stream sama udara dingin kutub utara",
    explanation:
      "Inggris Raya dilewati sistem cuaca Frontal yang aktif karena arus laut hangat dari Karibia (Gulf Stream) bertemu dengan udara Artik, sehingga awan stratus dan kabut mudah terbentuk sepanjang tahun.",
  },
  {
    category: "iklim_cuaca",
    mode: "essay",
    topic: "Kenaikan Pangkat Awan",
    question:
      "Awan Cumulonimbus (Cb) baru resmi naik pangkat dan dapet gelar kehormatan meteorologis sebagai sebuah 'Thunderstorm' (Badai Petir) kalau di dalamnya sudah mulai muncul fenomena...",
    answerKeywords: [
      "petir",
      "kilat",
      "guruh",
      "guntur",
      "lightning",
      "thunder",
    ],
    explanation:
      "Awan konvektif biasa (Shower) hanya disebut Thunderstorm apabila sudah mendeteksi aktivitas listrik yang ditandai dengan minimal ada satu kilatan petir atau suara guntur.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Petir Pas Salju?",
    question:
      "Pernah dengar 'Thundersnow'? Ini kejadian langka yang bikin mind-blowing. Menurut lu, emang logis bisa ada petir pas lagi turun badai salju di musim dingin?",
    options: [
      "Mustahil, petir cuma bisa muncul kalau suhunya panas/tropis",
      "Mustahil, salju menyerap listrik dari atmosfer",
      "Bisa aja, kalau ada campur tangan HAARP (konspirasi)",
      "Bisa banget! Asalkan ada updraft kuat yang bikin gesekan antar kristal es di dalam badai salju tersebut",
    ],
    answer:
      "Bisa banget! Asalkan ada updraft kuat yang bikin gesekan antar kristal es di dalam badai salju tersebut",
    explanation:
      "Thundersnow memang langka karena butuh udara naik (updraft) yang kuat di musim dingin yang stabil. Kalau berhasil terbentuk, gesekan butiran salju dan es akan menciptakan pemisahan muatan listrik.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Pasukan Awan Baris",
    question:
      "Kalau ada sekumpulan awan Cumulonimbus (Cb) yang berbaris panjang ngebentuk garis raksasa melintang di langit, dan siap menyapu satu wilayah dengan badai, formasi 'pasukan' ini disebut...",
    options: [
      "Supercell",
      "Squall Line",
      "Mesoscale Convective Complex",
      "Trade Winds",
    ],
    answer: "Squall Line",
    explanation:
      "Squall line adalah barisan badai petir (thunderstorm) yang bergerak bersama-sama, biasanya berada di sepanjang atau di depan sebuah front dingin. Bahaya utamanya adalah angin kencang garis lurus.",
  },
  {
    category: "iklim_cuaca",
    mode: "essay",
    topic: "Gas Kentut Sapi",
    question:
      "Gas variabel rumah kaca ini efek pemanasannya 25 kali lebih parah dari CO2, dan kocaknya, penyumbang antropogenik terbesarnya adalah sendawa dan kentut sapi (fermentasi enterik). Gas apa ini?",
    answerKeywords: ["metana", "methane", "ch4"],
    explanation:
      "Sektor peternakan adalah penghasil utama Metana (CH4) karena sistem pencernaan ruminansia pada sapi memproduksi gas ini secara alami dalam jumlah raksasa setiap harinya.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Debat Panas Skenario",
    question:
      "Kelompok Skeptis perubahan iklim sering ngeroasting narasi kelompok Alarmist soal laporan IPCC. Yang paling sering dikritik sama Skeptis itu apanya sih?",
    options: [
      "Termometer BMKG rusak semua",
      "Paus biru bukan mamalia laut",
      "Model komputer prediksi iklim jangka panjang itu penuh ketidakpastian dan terlalu lebay",
      "Karbon dioksida itu sebenarnya warna hijau",
    ],
    answer:
      "Model komputer prediksi iklim jangka panjang itu penuh ketidakpastian dan terlalu lebay",
    explanation:
      "Kelompok skeptis menganggap proyeksi model iklim GCM (Global Climate Models) gagal memasukkan variabel alami dengan tepat, sehingga hasilnya sering overestimasi (terlalu panas) dari data observasi nyatanya.",
  },
  {
    category: "iklim_cuaca",
    mode: "mcq",
    topic: "Jackpot Peru",
    question:
      "Pas La Niña, angin pasat niup kenceng banget ke arah barat (Indonesia). Efeknya buat nelayan di negara asalnya El Nino (Peru, Amerika Selatan) justru Jackpot, soalnya...",
    options: [
      "Banyak paus terdampar buat diambil dagingnya",
      "Laut mereka jadi hangat dan enak buat berenang",
      "Air dingin kaya nutrisi dari dasar laut pada naik (Upwelling), bikin panen ikan melimpah ruah",
      "Perahunya ketiup otomatis ke Australia",
    ],
    answer:
      "Air dingin kaya nutrisi dari dasar laut pada naik (Upwelling), bikin panen ikan melimpah ruah",
    explanation:
      "Keluarnya massa air hangat di permukaan Pasifik Timur (Peru) yang ditiup ke barat membuat kekosongan yang langsung diisi oleh air laut dalam (dingin dan kaya nutrisi fitoplankton). Ini adalah surga bagi perikanan.",
  },
  {
    category: "iklim_cuaca",
    mode: "guess",
    topic: "Pusat Ketenangan Badai",
    question:
      "Di tengah-tengah badai hurricane atau topan yang lagi ngamuk parah dengan angin hancur-hancuran, ada area bolong persis di tengahnya yang anehnya malah cerah, tenang, dan nggak ada hujan. Namanya adalah...",
    imageType: "cyclone_eye",
    options: [
      "Mata Badai (Eye)",
      "Zona Kematian (Death Zone)",
      "Titik Nadir",
      "Inti Siklonik",
    ],
    answer: "Mata Badai (Eye)",
    explanation:
      "Mata badai (Eye) adalah zona tekanan paling rendah akibat subsidensi (udara turun) pelan di tengah pusaran rotasi badai. Cuaca di situ sangat tenang dan awannya menghilang, sangat kontras dengan Dinding Mata (Eyewall) di sekelilingnya yang mematikan.",
  },

  // 2. METEOROLOGI PENERBANGAN
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Bahaya",
    question:
      "Awan badai yang sangat ditakuti pilot karena turbulensi ekstrem adalah...",
    imageType: "cumulonimbus",
    options: ["Sirus", "Stratus", "Kumulonimbus", "Altokumulus"],
    answer: "Kumulonimbus",
    explanation:
      "Cb adalah awan vertikal masif yang bisa mencapai ketinggian 60.000 kaki.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Bahaya",
    question: "Goncangan di langit cerah tanpa awan biasanya disebut...",
    options: [
      "Icing",
      "CAT (Clear Air Turbulence)",
      "Wake Turbulence",
      "Microburst",
    ],
    answer: "CAT (Clear Air Turbulence)",
    explanation: "CAT sering ditemukan di sekitar aliran Jet Stream.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Bandara",
    question: "Sebutkan singkatan stasiun cuaca otomatis bandara (3 huruf)!",
    answerKeywords: ["aws"],
    explanation:
      "AWS (Automatic Weather Station) menyediakan data cuaca real-time otomatis.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Angin",
    question:
      "Angin dari depan pesawat saat mendarat disebut (bahasa Inggris)...",
    answerKeywords: ["headwind", "head wind"],
    explanation:
      "Headwind memberikan gaya angkat ekstra dan membantu pengereman.",
  },
  // --- TAMBAHAN BATCH 2: METEOROLOGI PENERBANGAN ---
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Lapisan Atmosfer",
    question:
      "Pesawat komersial jet sering melakukan jelajah (cruising) di ketinggian sekitar 10-11 km. Hal ini dilakukan untuk menghindari sebagian besar fenomena cuaca berbahaya yang terkonsentrasi di lapisan...",
    options: ["Troposfer", "Stratosfer", "Mesosfer", "Termosfer"],
    answer: "Troposfer",
    explanation:
      "Troposfer (0-15 km) merupakan tempat terkonsentrasinya sebagian besar uap air dan dinamika udara pembentuk cuaca, badai, dan awan vertikal.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Awan Bahaya",
    question:
      "Badai petir terbentuk ketika udara lembab naik dengan sangat cepat melalui proses konveksi. Awan vertikal masif penghasil petir dan turbulensi ekstrem ini dinamakan awan...",
    answerKeywords: ["cumulonimbus", "kumulonimbus", "cb"],
    explanation:
      "Awan Cumulonimbus (Cb) adalah musuh utama penerbangan karena mengandung updraft/downdraft kuat, petir, dan potensi hujan es (hail).",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Bahaya Petir",
    question:
      "Petir adalah bahaya atmosferik berenergi tinggi bagi pesawat dan petugas darat. Berdasarkan literatur eksperimental, sebuah kilatan petir ekstrem dapat menghasilkan arus listrik hingga mencapai...",
    options: ["10 kA", "50 kA", "100 kA", "Lebih dari 200 kA"],
    answer: "Lebih dari 200 kA",
    explanation:
      "Petir adalah fenomena berenergi tinggi yang dapat menghasilkan arus lebih dari 200 kA. Pesawat modern memiliki konduktor untuk menyalurkan arus flashover agar tidak merusak sistem internal.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Abu Vulkanik",
    question:
      "Erupsi gunung berapi (bahaya geologis-meteorologis) sangat mematikan bagi penerbangan jet komersial karena material yang dilepaskan dapat...",
    options: [
      "Mengurangi tekanan udara kabin secara instan",
      "Meleleh di dalam mesin jet dan menyebabkan mesin mati (engine stall)",
      "Membekukan bahan bakar pesawat seketika",
      "Menimbulkan gaya sentripetal yang menyedot pesawat",
    ],
    answer:
      "Meleleh di dalam mesin jet dan menyebabkan mesin mati (engine stall)",
    explanation:
      "Abu vulkanik mengandung partikel kaca dan silika tajam yang akan meleleh terkena panas mesin jet, menutupi turbin, dan mematikan mesin secara total.",
  },
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Presipitasi Ekstrem",
    question:
      "Fenomena jatuhnya butiran es berukuran besar dari awan badai bersuhu sangat dingin ini dapat menyebabkan kerusakan fisik pada kaca kokpit dan radar depan (radome) pesawat. Fenomena ini disebut...",
    imageType: "hail_storm",
    options: [
      "Salju (Snow)",
      "Hujan Es (Hail)",
      "Kabut Beku (Freezing Fog)",
      "Sleet",
    ],
    answer: "Hujan Es (Hail)",
    explanation:
      "Hujan es (hail) terjadi akibat uap air membeku di awan dingin. Arus udara naik (updraft) yang kuat di awan badai menahan butiran es agar terus membesar sebelum akhirnya jatuh.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Dinamika Angin",
    question:
      "Perbedaan kecepatan dan arah angin secara tiba-tiba pada ketinggian atau jarak yang sangat dekat dapat menyebabkan pesawat kehilangan gaya angkat secara mendadak. Fenomena angin ini disebut...",
    options: [
      "Gaya Coriolis",
      "Vertical Wind Shear",
      "Aliran Eddy",
      "Geostrophic Wind",
    ],
    answer: "Vertical Wind Shear",
    explanation:
      "Wind shear (geseran angin vertikal maupun horizontal) memicu turbulensi parah, sangat berbahaya terutama saat fase lepas landas atau mendarat.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Aliran Udara",
    question:
      "Hembusan udara dari awan badai yang terhempas sangat kuat ke bawah (turun) dan menyebar saat menyentuh landasan bandara disebut fenomena...",
    answerKeywords: ["microburst", "downdraft", "downburst"],
    explanation:
      "Microburst menghasilkan headwind palsu diikuti tailwind ekstrem yang membuat pesawat tiba-tiba kehilangan ketinggian sesaat sebelum mendarat.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Tekanan Udara",
    question:
      "Instrumen krusial di kokpit pesawat yang bekerja menyerupai barometer, menggunakan pembacaan tekanan udara statis luar untuk menentukan ketinggian pesawat adalah...",
    answerKeywords: ["altimeter", "altimeter aneroid", "barometrik altimeter"],
    explanation:
      "Altimeter menerjemahkan penurunan tekanan udara (yang secara bertahap turun seiring ketinggian di atmosfer) menjadi informasi ribuan kaki (feet).",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Gaya Coriolis",
    question:
      "Parameter gaya Coriolis (f = 2Ω sin φ) mempengaruhi arah angin. Mengapa pesawat yang terbang melintasi kawasan ekuator (khatulistiwa) sangat jarang dihadang oleh badai siklon tropis?",
    options: [
      "Angin pasat bertiup terlalu kencang",
      "Gaya Coriolis bernilai sangat kecil/nol sehingga angin gagal membentuk rotasi badai",
      "Suhu muka laut terlalu dingin untuk membentuk awan badai",
      "Pengaruh gravitasi bulan menarik badai ke arah kutub",
    ],
    answer:
      "Gaya Coriolis bernilai sangat kecil/nol sehingga angin gagal membentuk rotasi badai",
    explanation:
      "Meskipun ada awan badai, efek Coriolis yang mendekati nol di ekuator mencegah badai berputar dan berkumpul menjadi satu sistem siklon besar (meski ada anomali sangat langka seperti Siklon Vamei).",
  },
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Visibility",
    question:
      "Fenomena kondensasi uap air masif akibat pendinginan suhu permukaan hingga mencapai titik embunnya, yang sering menutup jarak pandang (visibility) landasan pacu di pagi hari adalah...",
    imageType: "radiation_fog",
    options: [
      "Asap (Smog)",
      "Kabut (Fog)",
      "Awan Stratus Tinggi",
      "Inversi Suhu",
    ],
    answer: "Kabut (Fog)",
    explanation:
      "Kabut (khususnya radiasi/radiation fog) pada dasarnya adalah awan yang menyentuh permukaan tanah. Ini menyebabkan penundaan jadwal penerbangan secara masal akibat jarak pandang di bawah standar minimum pendaratan.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Jalur VIP Pesawat",
    question:
      "Kenapa sih pesawat jet komersial sukanya terbang di ketinggian 30.000+ kaki (lapisan Tropopause/Stratosfer bawah)? Jebakannya: bukan biar cepet nyampe lho ya!",
    options: [
      "Biar bisa ngeliat lengkungan bumi",
      "Numpang Wi-Fi dari satelit cuaca",
      "Biar terhindar dari awan badai dan cuaca ekstrem yang cuma ada di Troposfer",
      "Karena di atas sana gaya gravitasi bumi udah nggak kerasa",
    ],
    answer:
      "Biar terhindar dari awan badai dan cuaca ekstrem yang cuma ada di Troposfer",
    explanation:
      "Hampir 99% fenomena cuaca (awan, hujan, badai) mentok di lapisan Troposfer. Terbang di atasnya (Stratosfer) ibarat lewat jalan tol VIP tanpa hambatan cuaca.",
  },
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Turbulensi Gaib",
    question:
      "Pernah naik pesawat, cuaca di luar cerah biru tanpa awan setitik pun, tapi tiba-tiba pesawat guncang parah berasa naik roller coaster? Ini ulah turbulensi gaib yang disebut...",
    imageType: "clear_air_turbulence",
    options: [
      "Clear Air Turbulence (CAT)",
      "Wake Turbulence",
      "Wind Shear",
      "Thermal Updraft",
    ],
    answer: "Clear Air Turbulence (CAT)",
    explanation:
      "CAT (Clear Air Turbulence) sering terjadi di area Jet Stream. Sangat berbahaya karena turbulensi ini tidak bisa dideteksi oleh radar cuaca pesawat karena tidak ada uap air/awan yang memantulkan sinyal.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Sangkar Listrik",
    question:
      "Pesawat itu sering banget kesamber petir di udara. Tapi penumpang di dalem chill aja karena bodi logam pesawat mengalirkan listrik ke luar. Prinsip fisika pelindung ini disebut Sangkar...",
    answerKeywords: ["faraday", "kandang faraday", "sangkar faraday"],
    explanation:
      "Prinsip Sangkar Faraday membuat arus listrik dari petir (ratusan ribu Ampere) hanya mengalir di 'kulit' luar pesawat (surface flashover) dan dilepaskan lewat ekor tanpa menyetrum isi kabin.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Musuh Mesin Jet",
    question:
      "Lagi asik terbang, tiba-tiba pesawat ngelewatin awan abu vulkanik letusan gunung. Kenapa abu ini lebih mematikan dari badai petir buat pesawat jet?",
    options: [
      "Bikin kaca depan pesawat pecah berantakan",
      "Abu mengandung kaca silika yang meleleh kena panas mesin, lalu membeku dan bikin mesin jet mati total",
      "Abu bikin oksigen di kabin habis",
      "Berat abu bikin pesawat jatuh karena kelebihan muatan",
    ],
    answer:
      "Abu mengandung kaca silika yang meleleh kena panas mesin, lalu membeku dan bikin mesin jet mati total",
    explanation:
      "Abu vulkanik (seperti kasus British Airways Flight 9 di Gunung Galunggung) meleleh di ruang bakar mesin jet, melapisi turbin dengan kaca padat, dan mematikan semua mesin di udara.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Kode Rahasia Pilot",
    question:
      "Pilot mau mendarat dan minta data METAR. Bedanya laporan METAR sama TAF itu apa sih? Jangan ketuker ya!",
    options: [
      "METAR itu cuaca aktual saat ini, TAF itu prakiraan cuaca ke depan",
      "METAR buat pesawat lokal, TAF buat penerbangan internasional",
      "METAR buat cuaca di darat, TAF buat cuaca di laut",
      "METAR pake bahasa Inggris, TAF pake bahasa sandi morse",
    ],
    answer: "METAR itu cuaca aktual saat ini, TAF itu prakiraan cuaca ke depan",
    explanation:
      "METAR (Meteorological Aerodrome Report) adalah observasi cuaca detik ini juga. Kalau TAF (Terminal Aerodrome Forecast) adalah prakiraan (forecast) untuk 9-30 jam ke depan.",
  },
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Pukulan Angin Kebawah",
    question:
      "Pesawat lagi mau landing, tiba-tiba dihantam aliran angin dari awan badai yang terhempas kuat ke tanah lalu menyebar ke segala arah. Fenomena yang bikin pesawat tiba-tiba anjlok ini dinamakan...",
    imageType: "microburst_downburst",
    options: ["Tornado", "Microburst", "Geostrophic Wind", "Angin Fohn"],
    answer: "Microburst",
    explanation:
      "Microburst sangat mematikan saat fase landing. Awalnya memberi 'headwind' palsu yang bikin pesawat naik, detik berikutnya berubah jadi 'tailwind' ekstrem yang bikin pesawat kehilangan daya angkat (wind shear parah).",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Hidung Pesawat Penyok",
    question:
      "Nembus awan Cumulonimbus, eh hidung pesawat (radome) dan kaca kokpit retak-retak parah kayak dilempari batu es dari langit. Hujan es batu ini namanya apa?",
    answerKeywords: ["hail", "hujan es"],
    explanation:
      "Hujan es (hail) adalah bongkahan es padat yang terbentuk karena arus udara naik turun di dalam awan badai bersuhu super dingin. Benturannya di kecepatan 800 km/jam sangat merusak bodi pesawat.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Jebakan Suhu Siang Bolong",
    question:
      "Kenapa pesawat kalau mau lepas landas (take-off) di siang hari yang cuacanya PANAS TERIK (misal di Dubai) butuh landasan pacu yang jauh lebih panjang dari biasanya?",
    options: [
      "Biar ban pesawat nggak cepat meleleh kena aspal",
      "Suhu panas bikin udara makin padat sehingga mesin susah nyedot angin",
      "Suhu panas bikin molekul udara renggang (Density Altitude tinggi), jadi gaya angkat sayap pesawat berkurang",
      "Karena silau matahari bikin pilot butuh waktu lebih lama buat lari",
    ],
    answer:
      "Suhu panas bikin molekul udara renggang (Density Altitude tinggi), jadi gaya angkat sayap pesawat berkurang",
    explanation:
      "Udara panas itu renggang (partikel udaranya sedikit). Karena sayap butuh partikel udara yang padat untuk menciptakan gaya angkat (Lift), pesawat harus lari lebih kencang dan lebih jauh di cuaca terik.",
  },
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Sayap Membeku",
    question:
      "Ngelewatin awan di suhu minus, tiba-tiba terbentuk lapisan es tebal dan berduri di pinggiran sayap pesawat. Fenomena 'Icing' ini terjadi karena nabrak apa di dalam awan?",
    imageType: "wing_icing",
    options: [
      "Komet kecil",
      "Supercooled Liquid Water (SLW)",
      "Kristal Salju Padat",
      "Gas Nitrogen Cair",
    ],
    answer: "Supercooled Liquid Water (SLW)",
    explanation:
      "Jebakannya adalah: es nempel BUKAN karena nabrak salju. Tapi nabrak tetesan air yang suhunya di bawah 0°C tapi belum beku (SLW). Begitu air ini menyentuh sayap besi, dia langsung membeku seketika (Clear Ice / Rime Ice).",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Jebakan Singkatan Cuaca",
    question:
      "Di data cuaca penerbangan ada singkatan CAVOK. Kalau lihat ini, pilot biasanya langsung nyantai. CAVOK itu singkatan dari apa?",
    options: [
      "Captain And Velocity OK",
      "Ceiling And Visibility OK",
      "Cloud Area Vapour OK",
      "Clear Air Very OK",
    ],
    answer: "Ceiling And Visibility OK",
    explanation:
      "CAVOK artinya kondisi ideal banget: Jarak pandang lebih dari 10 km, tidak ada awan di bawah 5.000 kaki, dan tidak ada cuaca signifikan (hujan/badai).",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Mendarat Kepiting",
    question:
      "Liat video pesawat mendarat tapi hidungnya miring serong (nggak lurus sama jalanan), gaya mendarat 'crabbing' ini dilakuin pilot karena...",
    options: [
      "Roda depannya macet",
      "Pilotnya lagi pamer skill drifting",
      "Ketiup Angin Samping (Crosswind) yang kenceng banget",
      "Menghindari burung di landasan",
    ],
    answer: "Ketiup Angin Samping (Crosswind) yang kenceng banget",
    explanation:
      "Crosswind memaksa pilot memiringkan hidung pesawat melawan arah angin agar jalurnya tetap lurus sejajar dengan landasan pacu. Pas mau nyentuh aspal, baru hidungnya dilurusin (de-crab).",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Pusing di Ketinggian",
    question:
      "Kalau tekanan udara di kabin tiba-tiba bocor, masker oksigen bakal turun otomatis. Kondisi tubuh manusia yang kekurangan oksigen akibat tekanan udara luar yang tipis disebut...",
    answerKeywords: ["hipoksia", "hypoxia"],
    explanation:
      "Di ketinggian 30.000 kaki, tekanan udara sangat rendah sehingga paru-paru tidak bisa menyerap oksigen. Hypoxia bisa bikin orang pingsan dalam hitungan detik tanpa disadari (euforia palsu).",
  },
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Monitor Kiamat",
    question:
      "Layar Weather Radar di kokpit ini ibarat mata ketiganya pilot. Kalau di layar ada gumpalan gede warnanya MERAH PEKAT sampai MAGENTA (Ungu), pilot wajib ngapain?",
    imageType: "cockpit_weather_radar",
    options: [
      "Terobos aja karena itu cuma kabut",
      "Menghindar sejauh mungkin karena itu inti badai Cumulonimbus",
      "Turunin ketinggian pesawat karena itu tanda daratan",
      "Nyalain wiper karena itu cuma hujan rintik",
    ],
    answer: "Menghindar sejauh mungkin karena itu inti badai Cumulonimbus",
    explanation:
      "Radar pesawat mendeteksi kepadatan tetesan air. Hijau itu hujan ringan, kuning sedang, merah itu hujan sangat lebat/turbulensi, dan magenta/ungu biasanya berisi hujan es (hail) yang bisa menghancurkan pesawat.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Awan Cantik Rasa UFO",
    question:
      "Pernah liat awan bentuknya kayak tumpukan piring UFO (Lenticular Cloud) diem aja di atas puncak gunung? Buat pesawat kecil, lewat dekat awan ini hukumnya haram, karena...",
    options: [
      "Banyak radiasi alien",
      "Suhu di dalamnya mencapai titik beku absolut",
      "Awan itu tanda adanya Mountain Wave (turbulensi gelombang gunung) yang ekstrem",
      "Awan itu isinya gas metana beracun",
    ],
    answer:
      "Awan itu tanda adanya Mountain Wave (turbulensi gelombang gunung) yang ekstrem",
    explanation:
      "Awan Lentikular yang diam sebenarnya menyembunyikan arus angin kencang yang bergelombang naik-turun menabrak gunung (Mountain Wave). Pesawat kecil bisa terhempas ke tebing jika terjebak di arus turunnya.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Alat Ukur Tekanan",
    question:
      "Di kokpit, instrumen yang nampilin angka ketinggian (misal 35.000 feet) sebenarnya beroperasi dengan cara mengukur tekanan udara statis di luar pesawat. Instrumen ini dinamakan...",
    answerKeywords: ["altimeter"],
    explanation:
      "Altimeter pada dasarnya adalah barometer aneroid. Semakin tinggi pesawat, tekanan udara luar semakin turun, dan jarum altimeter akan menerjemahkannya menjadi ketinggian kaki (feet).",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Jalan Tol Angin",
    question:
      "Kenapa penerbangan dari Jakarta ke Tokyo biasanya LEBIH CEPAT durasinya dibanding perjalanan pulang dari Tokyo ke Jakarta? (Anggap pesawat dan rutenya sama).",
    options: [
      "Efek rotasi bumi (Bumi muter ke timur)",
      "Karena ikut arus Jet Stream (angin kencang dari barat ke timur di ketinggian jelajah)",
      "Pilotnya pengen cepet pulang",
      "Perbedaan gravitasi utara dan selatan",
    ],
    answer:
      "Karena ikut arus Jet Stream (angin kencang dari barat ke timur di ketinggian jelajah)",
    explanation:
      "Jet Stream adalah 'sungai' angin berkecepatan tinggi di sekitar Tropopause yang mengalir dari Barat ke Timur. Pesawat yang menuju ke Timur mendapat dorongan dari belakang (tailwind), menghemat waktu dan bahan bakar.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Delay Pagi Hari",
    question:
      "Lu mau terbang penerbangan pertama jam 6 pagi, eh diumumin delay karena jarak pandang landasan cuma 50 meter ketutup kabut putih. Kabut ini terbentuk karena pendinginan permukaan bumi semalaman, disebut...",
    options: ["Advection Fog", "Radiation Fog", "Smog", "Volcanic Ash"],
    answer: "Radiation Fog",
    explanation:
      "Kabut Radiasi (Radiation Fog) paling sering bikin delay penerbangan pagi. Terjadi saat malam hari cuaca cerah dan angin tenang, panas bumi memancar habis sehingga suhu turun mendekati titik embun.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Dibelokkin Siapa?",
    question:
      "Angin di atas lautan itu bergeraknya nggak lurus dari tekanan tinggi ke rendah lho, tapi agak melengkung. Gaya tak kasat mata akibat rotasi bumi yang ngebelokin angin ini disebut...",
    options: [
      "Gaya Sentrifugal",
      "Gaya Coriolis",
      "Gaya Gesek",
      "Gaya Magnet Bumi",
    ],
    answer: "Gaya Coriolis",
    explanation:
      "Gaya Coriolis membelokkan arah angin ke kanan di Belahan Bumi Utara dan ke kiri di Belahan Bumi Selatan. Gaya ini sangat krusial dalam pembentukan sistem cuaca skala besar seperti Siklon Tropis.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Hati-hati Wake Turbulence",
    question:
      "Kenapa pesawat kecil kayak Cessna dilarang keras take-off tepat di belakang pesawat raksasa kayak Airbus A380 yang baru aja terbang lepas landas?",
    options: [
      "Biar nggak ngalangin antrian",
      "Kena asep knalpot jet yang panas",
      "Sayap A380 ninggalin pusaran angin vorteks (Wake Turbulence) yang bisa bikin pesawat kecil kebalik",
      "Gelombang suaranya bisa mecahin kaca pesawat kecil",
    ],
    answer:
      "Sayap A380 ninggalin pusaran angin vorteks (Wake Turbulence) yang bisa bikin pesawat kecil kebalik",
    explanation:
      "Pesawat yang sedang terbang menciptakan pusaran angin tornado horizontal (Wingtip Vortices) di belakang sayapnya. Pesawat kecil yang masuk ke area ini bisa terguling (roll) dan kehilangan kendali.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Angin Bawah",
    question:
      "Tebak Kata: Perubahan arah dan kecepatan angin secara mendadak (bisa vertikal maupun horizontal) yang sangat berbahaya buat pesawat pas lagi deket sama landasan. Dua kata, bahasa Inggris...",
    answerKeywords: ["wind shear", "windshear"],
    explanation:
      "Wind shear mematikan karena saat pesawat terbang pelan mau mendarat, perubahan angin tiba-tiba bisa merusak kalkulasi daya angkat, menyebabkan hard landing atau overshoot landasan.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Teori Konspirasi Langit",
    question:
      "Sering liat garis putih panjang di langit yang ditinggalin sama pesawat jet? Orang penganut konspirasi nyebutnya 'Chemtrail' penyebar racun. Aslinya secara meteorologi, garis putih itu adalah...",
    options: [
      "Bahan bakar avtur yang sengaja dibuang (Fuel dumping)",
      "Uap air panas dari mesin jet yang langsung membeku jadi kristal es di suhu minus",
      "Asap knalpot kotor dari mesin pesawat",
      "Gas nitrogen pelindung pesawat",
    ],
    answer:
      "Uap air panas dari mesin jet yang langsung membeku jadi kristal es di suhu minus",
    explanation:
      "Jejak itu namanya Contrail (Condensation Trail). Mesin jet ngeluarin uap air panas. Karena suhu di ketinggian jelajah itu sekitar -50°C, uap itu langsung menyublim jadi kristal es (mirip nafas kita yang berasap kalau di tempat salju).",
  },
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Listrik Nyasar",
    question:
      "Lagi terbang nembus badai, tiba-tiba kaca depan kokpit (windshield) ngeluarin cahaya ungu-biru kayak akar kilat yang nari-nari. Penumpang mungkin mikir itu alien, padahal itu murni fenomena listrik statis yang dinamakan...",
    imageType: "st_elmos_fire",
    options: [
      "Aurora Borealis",
      "Ball Lightning",
      "St. Elmo's Fire",
      "Red Sprite",
    ],
    answer: "St. Elmo's Fire",
    explanation:
      "St. Elmo's Fire adalah plasma bercahaya (korona discharge) yang tercipta ketika gesekan badan pesawat dengan kristal es di dalam awan badai menghasilkan penumpukan listrik statis yang sangat besar.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Angin Penolong",
    question:
      "Pas mau lepas landas (take-off), pilot itu selalu sengaja milih arah landasan yang NGELAWAN arah datangnya angin (ditabrak angin dari depan). Angin dari depan yang ngebantu pesawat buat cepet ngangkat ini namanya...",
    answerKeywords: ["headwind", "head wind"],
    explanation:
      "Headwind (angin dari depan) mempercepat aliran udara yang melewati sayap, sehingga pesawat mendapatkan gaya angkat (lift) maksimum dengan jarak lari yang lebih pendek.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Jebakan Radar Abu",
    question:
      "Kita tau abu gunung berapi (volcanic ash) itu mesin pembunuh buat pesawat jet. Tapi jebakannya: kenapa radar cuaca canggih di moncong pesawat NGGAK BISA ngedeteksi abu ini?",
    options: [
      "Karena abu vulkanik itu warnanya transparan",
      "Karena sistem radarnya sengaja dimatikan pilot biar nggak berisik",
      "Karena radar cuaca cuma bisa mantulin sinyal dari partikel air/es, sedangkan abu vulkanik itu debu kering",
      "Karena partikel abu bergerak lebih cepat dari gelombang radar",
    ],
    answer:
      "Karena radar cuaca cuma bisa mantulin sinyal dari partikel air/es, sedangkan abu vulkanik itu debu kering",
    explanation:
      "Weather Radar di pesawat bekerja dengan menangkap pantulan (reflectivity) dari titik-titik air, hujan, atau es. Abu vulkanik itu partikel silika/kaca kering, jadi sinyal radar tembus begitu aja (layar radar kelihatan bersih padahal bahaya di depan mata).",
  },
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Sensor Maut",
    question:
      "Pipa L kecil di moncong pesawat ini kerjanya ngukur kecepatan pesawat. Kalau lubangnya ketutup es karena pemanasnya rusak (kayak kasus fatal Air France 447), speedometer pesawat bakal error. Ini namanya pipa...",
    imageType: "pitot_tube",
    options: ["Static Port", "Pitot Tube", "Angle of Attack Sensor", "Radome"],
    answer: "Pitot Tube",
    explanation:
      "Tabung Pitot mengukur tekanan udara dinamis (angin yang nabrak pipa). Selisih tekanan dinamis dan statis itulah yang dikonversi jadi indikator kecepatan pesawat (Airspeed Indicator). Kalau ketutup es, kecepatan terbaca nol atau ngaco.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Isi Ban Pesawat",
    question:
      "Ban pesawat jet komersial itu gede-gede, tapi dilarang keras diisi pake udara kompresor bengkel biasa. Ban pesawat wajib diisi pakai gas Nitrogen murni. Alasannya apa?",
    options: [
      "Biar pesawat lebih enteng pas terbang",
      "Karena udara biasa mengandung uap air yang bakal membeku di suhu -50°C dan bisa meledak pas mendarat panas",
      "Nitrogen warnanya hitam, cocok buat ban",
      "Nitrogen mencegah ban tersambar petir",
    ],
    answer:
      "Karena udara biasa mengandung uap air yang bakal membeku di suhu -50°C dan bisa meledak pas mendarat panas",
    explanation:
      "Udara biasa ada uap airnya (H2O). Di ketinggian jelajah, uap air ini bakal membeku. Pas pesawat mendarat kasar dan ban jadi panas banget, es itu bakal menguap mendadak, mengembang, dan bikin ban meledak.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Jarak Pandang Landasan",
    question:
      "Tebak Singkatan: Pas bandara lagi ketutup kabut (Fog) tebal, petugas BMKG bakal ngeluarin data jarak pandang khusus di landasan pacu yang diukur pakai sensor laser. Singkatannya tiga huruf: R _ _",
    answerKeywords: ["rvr", "runway visual range"],
    explanation:
      "RVR (Runway Visual Range) sangat vital untuk pendaratan instrumen (ILS). Kalau RVR turun di bawah batas minimum maskapai (misal di bawah 800 meter), pesawat nggak boleh mendarat dan harus dialihkan (divert).",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Jebakan Altimeter",
    question:
      "Air Traffic Control (ATC) ngasih tau pilot: 'Altimeter setting QNH 1011'. Kalau pilot masukin angka QNH itu, berarti layar altimeter bakal nunjukin jarak ketinggian pesawat diukur dari mana?",
    options: [
      "Dari aspal bandara (Ground Level)",
      "Dari pusat inti bumi",
      "Dari puncak awan terdekat",
      "Dari rata-rata permukaan air laut (Mean Sea Level / MSL)",
    ],
    answer: "Dari rata-rata permukaan air laut (Mean Sea Level / MSL)",
    explanation:
      "QNH adalah tekanan udara yang disesuaikan ke permukaan laut (MSL). Jadi angka yang muncul di layar pilot adalah Altitude (ketinggian dari laut). Kalau QFE, baru diukur dari tanah bandara (Height).",
  },
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Detektor Arah Sederhana",
    question:
      "Nggak peduli secanggih apa bandaranya, benda jadul berbentuk kerucut bolong berwarna oranye-putih ini pasti selalu ada tertancap di dekat landasan buat ngebantu pilot liat arah angin darat. Namanya...",
    imageType: "windsock",
    options: ["Anemometer", "Windsock", "Ceilometer", "Wind Profiler"],
    answer: "Windsock",
    explanation:
      "Windsock (Kantung Angin) itu simpel, tapi sangat responsif. Pilot bisa langsung tau arah dan seberapa kencang angin darat hanya dari melihat seberapa tegang/berkibar kantung tersebut.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Ngesot di Aspal",
    question:
      "Pesawat habis mendarat pas ujan deras, tapi remnya mendadak blong gara-gara ban pesawat 'naik/berselancar' di atas genangan air dan nggak nyentuh aspal. Fenomena maut ini disebut...",
    options: [
      "Wind Shear",
      "Skidding",
      "Hydroplaning / Aquaplaning",
      "Drifting",
    ],
    answer: "Hydroplaning / Aquaplaning",
    explanation:
      "Hydroplaning terjadi saat lapisan tipis air terjebak di bawah ban pesawat yang melaju sangat kencang, membuat ban kehilangan gesekan 100% dengan aspal. Pesawat bisa tergelincir keluar landasan (overrun).",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Awan UFO Gunung",
    question:
      "Terbang dekat pegunungan, pilot liat ada awan aneh yang diam aja nggak gerak berbentuk kayak tumpukan piring UFO. Awan ini wajib dijauhi karena...",
    options: [
      "Di dalamnya ada alien",
      "Awan itu bukti adanya Mountain Wave (turbulensi gelombang gunung) dan downdraft maut",
      "Awan itu nyedot oksigen mesin",
      "Suhunya mencapai nol mutlak",
    ],
    answer:
      "Awan itu bukti adanya Mountain Wave (turbulensi gelombang gunung) dan downdraft maut",
    explanation:
      "Awan Lentikular (Lenticular) terbentuk di puncak gelombang angin yang menabrak punggung gunung. Di balik keindahannya, tersembunyi arus turun (downdraft/rotor) beringas yang bisa membanting pesawat kecil ke tanah.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Pesan Bahaya",
    question:
      "Info cuaca darurat yang langsung di-broadcast radio ke semua pesawat di udara kalau ada fenomena mengerikan (badai petir parah, badai pasir, abu vulkanik). Singkatan dari 'Significant Meteorological Information' adalah...",
    answerKeywords: ["sigmet"],
    explanation:
      "SIGMET dikerluarkan oleh pusat pantauan cuaca penerbangan untuk memberi warning area yang harus dihindari oleh semua jenis armada udara demi keselamatan.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Suhu Kulkas",
    question:
      "Pesawat jet lagi cruising anteng di ketinggian 35.000 feet (sekitar 10,6 km). Kalau lu tempelin tangan di kaca jendela pesawat (yang berlapis-lapis itu), suhu murni di luar sana kira-kira sedingin apa?",
    options: ["0 °C", "-15 °C", "-40 °C sampai -55 °C", "-100 °C"],
    answer: "-40 °C sampai -55 °C",
    explanation:
      "Suhu turun secara berkala di troposfer (lapse rate). Pada ketinggian jelajah pesawat jet komersial (mendekati tropopause), suhu rata-rata luar ruang berada di angka -50°C, cukup dingin untuk membekukan daging instan.",
  },
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Pemanas Sayap",
    question:
      "Biar pinggiran sayap pesawat nggak numpuk es (icing) pas masuk awan, sistem pesawat bakal ngambil/membocorkan udara super panas dari ruang mesin turbin buat dialirkan ke dalam sayap. Sistem ini disebut...",
    imageType: "bleed_air_system",
    options: [
      "Radiator Core",
      "Freon Cooler",
      "Bleed Air System",
      "Thermal Exhaust",
    ],
    answer: "Bleed Air System",
    explanation:
      "Bleed Air (udara bocoran) mengambil udara panas bertekanan tinggi dari kompresor mesin jet, lalu disalurkan lewat pipa-pipa ke 'leading edge' (pinggiran depan) sayap untuk melelehkan es (Anti-icing system).",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Logika Titik Embun",
    question:
      "Pilot dapet data METAR pagi hari: Suhu (Temperature) 24°C, Titik Embun (Dew Point) juga 24°C. Wah, kalau angkanya nempel begini, pilot harus waspada karena bandara kemungkinan besar bakal mengalami...",
    options: [
      "Kabut tebal (Fog) karena kelembapan mencapai 100%",
      "Badai debu gurun",
      "Angin puyuh",
      "Cuaca sangat cerah tanpa awan",
    ],
    answer: "Kabut tebal (Fog) karena kelembapan mencapai 100%",
    explanation:
      "Ketika suhu (T) sama dengan suhu titik embun (Td), berarti udara sudah jenuh sepenuhnya (RH 100%). Uap air akan mengembun menjadi titik-titik air mikroskopis yang melayang, alias kabut pekat pembunuh jarak pandang.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Angin Bikin Rem Blong",
    question:
      "Pas landing, pesawat malah ketiup kuat dari ARAH BELAKANG ekornya. Hal ini bikin kecepatan darat (Ground Speed) pesawat makin kenceng dan susah ngerem di aspal. Angin dari belakang ini namanya...",
    options: ["Headwind", "Crosswind", "Tailwind", "Downdraft"],
    answer: "Tailwind",
    explanation:
      "Tailwind (Angin buritan) sangat tidak disukai saat mendarat karena membuat pesawat melaju terlalu cepat di atas aspal, menghabiskan sisa landasan, dan berisiko bablas jatuh ke ujung runway.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Mandi Musim Dingin",
    question:
      "Sebelum take-off di bandara yang lagi turun salju lebat, badan pesawat wajib 'dimandiin' pake semprotan cairan kimia oranye/hijau yang kental biar lapisan esnya rontok. Proses ini dinamakan...",
    answerKeywords: ["de-icing", "deicing", "anti-icing"],
    explanation:
      "Proses De-icing menggunakan cairan glycol panas untuk merontokkan es di sayap. Es harus dibersihkan 100% karena bongkahan es kecil saja bisa merusak aliran udara sayap dan bikin pesawat gagal terbang (stall).",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Bumpy Siang Bolong",
    question:
      "Naik pesawat baling-baling (Propeller) ukuran kecil di siang hari bolong yang super cerah dan panas di atas Kalimantan. Tiba-tiba perjalanannya gradak-gruduk naik turun. Secara meteorologi ini gara-gara apa?",
    options: [
      "Mesinnya brebet karena kepanasan",
      "Arus konveksi (udara panas dari aspal/tanah yang menguap naik ke atas dan nabrak perut pesawat)",
      "Efek Coriolis yang narik sayap pesawat",
      "Awan Stratus tipis",
    ],
    answer:
      "Arus konveksi (udara panas dari aspal/tanah yang menguap naik ke atas dan nabrak perut pesawat)",
    explanation:
      "Di siang terik, permukaan daratan memanas dan memanaskan udara di atasnya. Udara panas ini naik dalam bentuk pilar-pilar kolom (thermal updraft) yang menyebabkan guncangan (turbulence) pada pesawat yang terbang rendah.",
  },
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Tembok Badai",
    question:
      "Liat layar radar cuaca, ada awan warna merah/ungu berbaris nyambung panjang banget kayak Tembok Besar China nutupin rute depan pesawat. Kumpulan badai berbaris mematikan ini namanya...",
    imageType: "squall_line_radar",
    options: ["Dry Line", "Supercell", "Squall Line", "Mesocyclone"],
    answer: "Squall Line",
    explanation:
      "Squall Line adalah garis memanjang yang berisi barisan badai petir (thunderstorm) sangat aktif. Pilot tidak akan pernah mau menembus garis merah ini dan biasanya akan meminta deviasi memutar puluhan mil jauhnya.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Inti Jet Stream",
    question:
      "Arus Jet (Jet Stream) yang super kencang ini adalah 'jalan tol' buat pesawat kalau terbang ke timur. Di lapisan manakah kecepatan angin Jet Stream mencapai puncaknya (Core)?",
    options: [
      "Permukaan tanah",
      "Puncak Mesosfer",
      "Batas Tropopause (perbatasan troposfer & stratosfer)",
      "Di dalam awan Cumulus",
    ],
    answer: "Batas Tropopause (perbatasan troposfer & stratosfer)",
    explanation:
      "Inti (Core) dari angin Jet Stream bersembunyi tepat di garis batas Tropopause (sekitar 10-12 km ke atas), di mana perbedaan suhu antara kutub dan ekuator sangat tajam, memicu angin secepat 300+ km/jam.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Angka Misterius di Aspal",
    question:
      "Pas pesawat mau take-off, di ujung aspal landasan ada tulisan angka gede, misal '27'. Jebakannya: Angka 27 itu maksudnya apa sih?",
    options: [
      "Itu landasan ke-27 yang dibangun di bandara itu",
      "Panjang landasan 2700 meter",
      "Arah landasan menghadap ke 270 derajat (Barat) sesuai kompas magnetik",
      "Batas kecepatan maksimal 270 knot",
    ],
    answer:
      "Arah landasan menghadap ke 270 derajat (Barat) sesuai kompas magnetik",
    explanation:
      "Angka di runway (01 sampai 36) itu penunjuk arah kompas (Heading) dibagi 10. Runway 27 berarti menghadap 270° (arah Barat). Runway 09 menghadap 90° (arah Timur). Ini buat nyesuain arah lepas landas dengan arah angin.",
  },
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Mendarat Kepiting",
    question:
      "Pilot lagi mau mendarat tapi hidung pesawatnya malah miring serong (nggak sejajar sama garis landasan). Gaya mendarat ala kepiting (Crabbing) ini wajib dilakuin kalau lagi dihantam...",
    imageType: "crosswind_landing",
    options: ["Headwind", "Tailwind", "Crosswind (Angin Samping)", "Updraft"],
    answer: "Crosswind (Angin Samping)",
    explanation:
      "Kalau ada angin kencang dari samping (Crosswind), pesawat bakal terdorong keluar jalur pendaratan. Pilot harus memiringkan hidung pesawat melawan arah angin biar jalurnya tetap lurus sejajar dengan landasan.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Prank Altimeter",
    question:
      "Ada pepatah penerbangan: 'High to Low, Look out Below'. Kalau pesawat terbang dari area tekanan udara TINGGI ke RENDAH tanpa kalibrasi altimeter, jarum ketinggian bakal ngasih info palsu. Pesawat aslinya lebih (TINGGI/RENDAH) dari angka di layar?",
    answerKeywords: ["rendah"],
    explanation:
      "Altimeter mengira tekanan yang turun itu karena pesawat naik ketinggian, padahal karena cuaca. Efeknya fatal: layar nunjukin tinggi 5.000 kaki, padahal aslinya pesawat lebih RENDAH dan bisa nabrak gunung.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Musuh 3H",
    question:
      "Pesawat itu paling benci sama kondisi 3H: Hot (Panas), High (Dataran Tinggi), dan Humid (Lembap). Kenapa 3 kondisi ini bikin pesawat susah terbang?",
    options: [
      "Karena pilotnya gampang gerah dan dehidrasi",
      "Bikin molekul udara jadi sangat renggang (Density Altitude tinggi), jadi sayap kurang dapet gaya angkat",
      "Karena 3H memicu badai salju mendadak",
      "Karena aspal landasan jadi lengket",
    ],
    answer:
      "Bikin molekul udara jadi sangat renggang (Density Altitude tinggi), jadi sayap kurang dapet gaya angkat",
    explanation:
      "Udara panas, lembap, dan di tempat tinggi (seperti bandara di pegunungan) itu partikelnya renggang. Sayap pesawat dan mesin jet butuh udara yang padat (dingin/kering) biar performanya maksimal.",
  },
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Jejak Putih Akrobatik",
    question:
      "Pas pesawat tempur lagi manuver belok tajam (G-force tinggi), sering muncul jejak asap putih dari ujung sayapnya (Wingtip), BUKAN dari knalpot mesin. Fenomena fisika ini disebut...",
    imageType: "aerodynamic_contrail",
    options: [
      "Exhaust Contrail",
      "Aerodynamic Contrail",
      "Fuel Dumping",
      "Chemtrail",
    ],
    answer: "Aerodynamic Contrail",
    explanation:
      "Jebakan: Ini bukan uap panas mesin. Saat bermanuver tajam, tekanan udara di atas/ujung sayap turun drastis secara tiba-tiba. Penurunan tekanan ini bikin suhu anjlok mendadak dan uap air di udara langsung mengembun jadi awan tipis.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Fase Paling Brutal",
    question:
      "Badai petir (Thunderstorm) punya 3 fase hidup: Cumulus, Mature (Matang), dan Dissipating (Punah). Di fase mana pilot haram hukumnya mendekat karena ada Updraft dan Downdraft kencang secara bersamaan?",
    options: [
      "Cumulus",
      "Mature (Matang)",
      "Dissipating (Punah)",
      "Semua fase aman",
    ],
    answer: "Mature (Matang)",
    explanation:
      "Fase Mature adalah puncak badai. Di fase ini, presipitasi (hujan/es) mulai turun membawa arus udara ke bawah (downdraft), sementara arus udara panas masih terus naik (updraft). Gesekan dua arus ini bikin turbulensi paling brutal.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Kabut Pindah Rumah",
    question:
      "Kota San Francisco itu terkenal banget sama jembatan Golden Gate yang sering ketutup kabut bergulung dari arah laut. Kabut yang gerak horizontal ditiup angin ini secara meteorologi disebut kabut...",
    options: ["Radiation Fog", "Advection Fog", "Upslope Fog", "Steam Fog"],
    answer: "Advection Fog",
    explanation:
      "Advection Fog terjadi karena udara lembap dan hangat dari laut ditiup (adveksi) melewati permukaan daratan/air yang lebih dingin, sehingga udaranya mengembun sambil terus bergerak.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Angin Lembah Siang",
    question:
      "Pas siang hari bolong di daerah pegunungan, matahari manasin lereng gunung. Udara panas ini naik dari lembah ke arah puncak gunung. Angin udara naik ini disebut angin...",
    answerKeywords: ["anabatik", "anabatic", "angin lembah"],
    explanation:
      "Angin Anabatik terjadi siang hari saat lereng gunung lebih cepat panas, memicu updraft. Pilot pesawat kecil atau paralayang sering manfaatin angin ini buat nambah ketinggian gratis.",
  },
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Mesin Cuci Langit",
    question:
      "Liat awan bentuk gulungan silinder di bawah awan Lentikular gunung? Awan ini adalah zona turbulensi paling parah yang bakal ngebanting pesawat kayak di dalam mesin cuci. Namanya...",
    imageType: "rotor_cloud",
    options: ["Wall Cloud", "Rotor Cloud", "Arcus", "Cumulus Humilis"],
    answer: "Rotor Cloud",
    explanation:
      "Rotor Cloud terbentuk di bawah Mountain Wave. Anginnya berputar-putar kayak silinder raksasa (vertikal). Turbulensi di dalam awan ini saking parahnya bisa merusak struktur fisik pesawat terbang.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Atap Bumi Nggak Rata",
    question:
      "Jebakan Fisika Atmosfer: Lapisan Tropopause (atapnya cuaca) itu ketinggiannya NGGAK RATA di seluruh bumi. Di mana batas Tropopause ini letaknya paling tinggi?",
    options: [
      "Di Kutub Utara",
      "Di Kutub Selatan",
      "Di Ekuator (Khatulistiwa)",
      "Di atas Samudra Atlantik",
    ],
    answer: "Di Ekuator (Khatulistiwa)",
    explanation:
      "Tropopause di Ekuator bisa setinggi 16-18 km karena udara panas selalu memuai ke atas. Di Kutub, udaranya dingin dan menyusut, jadi Tropopause-nya ceper cuma sekitar 8 km. Makanya pesawat di Indonesia kadang masih bisa nabrak pucuk awan Cb di ketinggian jelajah.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Es Paling Mematikan",
    question:
      "Pesawat yang ngelewatin awan dingin bisa kena fenomena Icing. Dari jenis-jenis es di bawah ini, mana yang paling bahaya, berat, dan bening (susah diliat sama pilot)?",
    options: ["Rime Ice", "Clear Ice (Glaze)", "Frost", "Snowflakes"],
    answer: "Clear Ice (Glaze)",
    explanation:
      "Clear Ice terbentuk dari tetesan air besar (Supercooled) yang nabrak sayap, tapi ngalirnya pelan-pelan ke belakang sayap sebelum membeku jadi es bening dan keras. Es ini sangat berat, mengubah bentuk aerodinamis sayap, dan susah dihancurin pakai de-icer.",
  },
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Peta Siaga Debu",
    question:
      "Kalau Gunung Ruang atau Merapi meletus, pusat pemantau meteorologi (VAAC) bakal ngerilis peta khusus yang warnanya abu-abu/merah transparan, lengkap sama arah angin. Peta ini fungsinya buat nge-track pergerakan...",
    imageType: "volcanic_ash_map",
    options: [
      "Badai Pasir",
      "Gas Metana",
      "Volcanic Ash (Abu Vulkanik)",
      "Gelombang Panas",
    ],
    answer: "Volcanic Ash (Abu Vulkanik)",
    explanation:
      "Volcanic Ash Advisory Center (VAAC) melacak sebaran abu vulkanik menggunakan citra satelit dan prediksi angin, karena abu vulkanik sangat mematikan bagi mesin jet turbin pesawat.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Warning Kelas Teri",
    question:
      "Kalau SIGMET itu warning cuaca ekstrem buat SEMUA pesawat, ada juga warning cuaca kelas menengah yang bahaya buat pesawat kecil/latih tapi aman buat jet komersial (kayak turbulensi sedang atau icing ringan). Namanya apa?",
    answerKeywords: ["airmet"],
    explanation:
      "AIRMET (Airmen's Meteorological Information) dikeluarkan untuk memperingatkan pesawat ringan atau pesawat tanpa instrumen lengkap tentang potensi cuaca buruk skala menengah.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Terbang Pake Mata",
    question:
      "Aturan terbang dibagi dua: IFR (Instrument) dan VFR (Visual). Jebakannya: Syarat utama pilot boleh terbang dengan mode VFR itu apa?",
    options: [
      "Pesawat harus punya radar canggih",
      "Kondisi cuaca harus cerah (VMC), pilot harus bisa liat horizon, dan DILARANG masuk ke dalam awan",
      "Pilot harus hafal rute di luar kepala",
      "Pesawat hanya boleh terbang di malam hari",
    ],
    answer:
      "Kondisi cuaca harus cerah (VMC), pilot harus bisa liat horizon, dan DILARANG masuk ke dalam awan",
    explanation:
      "VFR (Visual Flight Rules) artinya pilot nerbangin pesawat pakai matanya sendiri buat lihat luar dan hindarin pesawat lain. Begitu cuaca jelek atau masuk awan (IMC), pilot wajib ganti ke IFR dan dipandu sama ATC/Instrumen layar.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Musim Kencangnya Jet",
    question:
      "Jet Stream (arus angin tol di atas sana) itu kecepatannya fluktuatif sepanjang tahun. Di musim apakah angin Jet Stream ini mencapai kecepatan paling ngeri/kencang?",
    options: ["Musim Panas", "Musim Semi", "Musim Dingin", "Musim Gugur"],
    answer: "Musim Dingin",
    explanation:
      "Jet Stream digerakkan oleh perbedaan suhu antara udara kutub dan ekuator. Di musim dingin, suhu kutub sangat ekstrem dinginnya, sehingga kontras suhunya paling besar, yang memicu angin menjadi sangat kencang.",
  },
  {
    category: "penerbangan",
    mode: "guess",
    topic: "Radar Ketipu",
    question:
      "Pesawat lagi terbang tinggi, tapi pilot iseng nundukin sudut (Tilt) antena radar cuacanya ke bawah. Tiba-tiba di layar muncul area merah jambu raksasa nggak bergerak, padahal di luar cerah. Radar ini aslinya nangkep pantulan apa?",
    imageType: "ground_clutter_radar",
    options: [
      "Alien Mothership",
      "Awan badai tersembunyi",
      "Ground Clutter (Pantulan dari gedung kota / pegunungan)",
      "Satelit jatuh",
    ],
    answer: "Ground Clutter (Pantulan dari gedung kota / pegunungan)",
    explanation:
      "Radar cuaca bekerja memantulkan sinyal. Kalau antena diarahkan terlalu ke bawah (Tilt Down), sinyalnya bakal mantul ke atap gedung, gunung, atau daratan, menghasilkan gumpalan merah palsu di layar yang disebut Ground Clutter.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Umur Pukulan Maut",
    question:
      "Microburst (angin hempasan awan badai ke bawah) itu pembunuh berdarah dingin pas landing. Meskipun fatal, durasi umur angin ini dari muncul sampai hilang ternyata sangat singkat, yaitu sekitar (jawab dalam hitungan angka) ... sampai 15 menit.",
    answerKeywords: ["5", "lima"],
    explanation:
      "Microburst sangat intens, tapi umurnya sangat singkat (biasanya cuma 5 sampai 15 menit). Tantangannya, durasi ini cukup panjang untuk menghempaskan pesawat yang kebetulan lewat di bawahnya saat landing.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Sensor Angin Bandara",
    question:
      "Karena Microburst susah diprediksi pakai radar biasa, bandara modern masang banyak sensor tiang anemometer di sekitar landasan untuk ngedeteksi wind shear jarak rendah. Sistem alarm ini disingkat...",
    options: ["TCAS", "GPWS", "LLWAS", "ILS"],
    answer: "LLWAS",
    explanation:
      "LLWAS (Low Level Wind Shear Alert System) menganalisis perbedaan kecepatan dan arah angin dari berbagai tiang sensor di keliling bandara. Kalau ada perbedaan mendadak (divergensi), alarm di menara ATC bakal bunyi ngasihtau pilot.",
  },
  {
    category: "penerbangan",
    mode: "mcq",
    topic: "Tetesan Maut",
    question:
      "Ada presipitasi namanya Freezing Rain. Kenapa hujan jenis ini bikin pilot komersial jantungan?",
    options: [
      "Karena airnya warna hitam",
      "Air hujannya masih cair pas jatuh, tapi suhunya minus. Begitu nabrak body pesawat, langsung beku jadi es padat (Clear Ice)",
      "Karena airnya membakar cat pesawat",
      "Karena hujan ini bawa aliran listrik",
    ],
    answer:
      "Air hujannya masih cair pas jatuh, tapi suhunya minus. Begitu nabrak body pesawat, langsung beku jadi es padat (Clear Ice)",
    explanation:
      "Freezing rain adalah supercooled liquid water. Kalau pesawat nekat nembus hujan ini, seluruh bodi pesawat bakal berlapis es tebal seketika, ngerubah aerodinamika, nambah beban, dan bikin pesawat jatuh.",
  },
  {
    category: "penerbangan",
    mode: "essay",
    topic: "Angin Gunung Malam",
    question:
      "Kebalikan dari angin Anabatik, pas malam hari suhu lereng gunung jadi dingin banget, bikin udara jadi berat dan merosot/mengalir turun ke arah lembah. Angin udara turun ini disebut...",
    answerKeywords: ["katabatik", "katabatic"],
    explanation:
      "Angin Katabatik mengalir turun ke lembah di malam hari. Angin ini bisa jadi sangat kencang dan berbahaya (seperti angin Bora atau Foehn) kalau dipicu oleh topografi yang sempit (efek corong).",
  },

  // 3. HIDROLOGI
  {
    category: "hidrologi",
    mode: "guess",
    topic: "Siklus",
    question: "Proses uap air mendingin menjadi titik air di awan disebut...",
    imageType: "condensation",
    options: ["Evaporasi", "Infiltrasi", "Kondensasi", "Sublimasi"],
    answer: "Kondensasi",
    explanation: "Kondensasi terjadi saat udara jenuh uap air mendingin.",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Hujan",
    question: "Hujan akibat massa udara naik melewati lereng gunung disebut...",
    options: ["Zenithal", "Orografis", "Frontal", "Muson"],
    answer: "Orografis",
    explanation: "Orografis dipicu oleh rintangan pegunungan.",
  },
  {
    category: "hidrologi",
    mode: "essay",
    topic: "Tanah",
    question:
      "Proses air hujan meresap ke dalam tanah melalui pori-pori tanah disebut...",
    answerKeywords: ["infiltrasi"],
    explanation: "Infiltrasi mengisi cadangan air tanah di bawah permukaan.",
  },
  {
    category: "hidrologi",
    mode: "essay",
    topic: "Siklus",
    question:
      "Istilah ilmiah untuk jatuhnya air (hujan, salju, es) ke bumi adalah...",
    answerKeywords: ["presipitasi"],
    explanation:
      "Presipitasi terjadi jika butiran air di awan sudah terlalu berat.",
  },
  // --- TAMBAHAN BATCH 3: HIDROLOGI ---
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Siklus Air",
    question:
      "Komponen Bumi yang mencakup seluruh air (samudra, sungai, air tanah, uap air atmosfer) dan menjadi pusat dari siklus hidrologi dinamakan lapisan...",
    options: ["Atmosfer", "Biosfer", "Hidrosfer", "Geosfer"],
    answer: "Hidrosfer",
    explanation:
      "Hidrosfer mencakup 97% air asin di samudra dan air tawar di daratan. Ia menggerakkan siklus evaporasi, presipitasi, dan aliran permukaan bumi[cite: 253, 254].",
  },
  {
    category: "hidrologi",
    mode: "essay",
    topic: "Lahan Kedap Air",
    question:
      "Pembangunan aspal dan beton di kota mengurangi kemampuan tanah menyerap air. Air hujan yang gagal terserap dan mengalir deras di atas permukaan tanah disebut aliran...",
    answerKeywords: [
      "permukaan",
      "runoff",
      "surface runoff",
      "limpasan permukaan",
    ],
    explanation:
      "Urbanisasi (antroposfer) memicu aliran permukaan (runoff) yang masif karena air tidak bisa berinfiltrasi ke dalam tanah, sehingga mempercepat terjadinya banjir[cite: 277].",
  },
  {
    category: "hidrologi",
    mode: "guess",
    topic: "Cadangan Air",
    question:
      "Lapisan Bumi yang membeku secara permanen dan menyimpan sekitar 69% cadangan air tawar dunia disebut dengan istilah...",
    imageType: "cryosphere",
    options: ["Hidrosfer", "Kriosfer", "Permafrost", "Astenosfer"],
    answer: "Kriosfer",
    explanation:
      "Kriosfer adalah bagian Bumi yang membeku, seperti gletser dan tudung es. Pencairannya akibat pemanasan global langsung menambah volume laut dan memicu banjir rob[cite: 261, 262, 265].",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Definisi Ilmu",
    question:
      "Cabang keilmuan yang secara spesifik mempelajari interaksi antara proses cuaca/iklim (atmosfer) dengan siklus pergerakan air di daratan (hidrosfer) adalah...",
    options: [
      "Klimatologi",
      "Meteorologi Penerbangan",
      "Hidro-meteorologi",
      "Oseanografi",
    ],
    answer: "Hidro-meteorologi",
    explanation:
      "Hidro-meteorologi mengintegrasikan data meteorologi (curah hujan, angin) dengan hidrologi (aliran sungai, kelembapan tanah) untuk memprediksi bencana hidrometeorologi[cite: 301, 303].",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Tanah Longsor",
    question:
      "Hujan lebat yang terjadi terus-menerus sering memicu longsor di perbukitan. Secara hidrometeorologis, hal ini dapat terjadi akibat dari...",
    options: [
      "Saturasi (kejenuhan) air melebihi daya ikat atau daya tahan geser tanah",
      "Terjadinya pencairan permafrost di bawah tanah bukit",
      "Meningkatnya laju transpirasi oleh pepohonan besar",
      "Erosi angin secara masif di lereng yang curam",
    ],
    answer:
      "Saturasi (kejenuhan) air melebihi daya ikat atau daya tahan geser tanah",
    explanation:
      "Tanah yang terlalu jenuh (saturasi tinggi) akibat hujan lebat akan menjadi tidak stabil dan kehilangan daya ikatnya, menyebabkannya longsor tertarik gaya gravitasi[cite: 325].",
  },
  {
    category: "hidrologi",
    mode: "essay",
    topic: "Vegetasi",
    question:
      "Hutan hujan tropis sangat penting bagi siklus air karena melepaskan uap air ke atmosfer dari pori-pori daunnya. Proses ini dinamakan...",
    answerKeywords: ["transpirasi", "evapotranspirasi"],
    explanation:
      "Biosfer (tumbuhan) menjaga keseimbangan air lewat proses transpirasi. Jika hutan ditebang, siklus uap air lokal akan rusak dan memperparah potensi banjir bandang atau kekeringan[cite: 271, 272].",
  },
  {
    category: "hidrologi",
    mode: "guess",
    topic: "Bencana Air Tanah",
    question:
      "Fenomena terbentuknya lubang raksasa yang amblas secara tiba-tiba akibat erosi air bawah tanah, khususnya pada daerah dengan batuan kapur (karst) disebut...",
    imageType: "sinkhole",
    options: ["Likuifaksi", "Subsiden", "Sinkhole", "Abrasi"],
    answer: "Sinkhole",
    explanation:
      "Air hujan yang bersifat agak asam meresap secara infiltrasi dan perlahan melarutkan batuan kapur di bawah tanah. Rongga yang membesar ini suatu saat akan runtuh dan menelan permukaan[cite: 330, 331, 332].",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Kekeringan",
    question:
      "Kekeringan yang memicu bencana susulan (seperti kebakaran hutan) memiliki dua pemicu utama dari parameter cuaca, yaitu curah hujan yang sangat rendah dan...",
    options: [
      "Laju infiltrasi tinggi",
      "Laju evaporasi sangat tinggi",
      "Tingkat kondensasi di awan berlebih",
      "Arus permukaan sungai yang cepat",
    ],
    answer: "Laju evaporasi sangat tinggi",
    explanation:
      "Kekeringan parah terbentuk melalui kombinasi maut: defisit curah hujan (tidak ada air yang masuk) dan evaporasi tinggi (air di permukaan tanah, danau, dan sungai terus menerus diuapkan akibat suhu terik)[cite: 341].",
  },
  {
    category: "hidrologi",
    mode: "essay",
    topic: "Siklus Dasar",
    question:
      "Proses meresapnya air hujan masuk ke dalam pori-pori tanah yang sangat krusial untuk mengisi cadangan air tanah (groundwater) disebut...",
    answerKeywords: ["infiltrasi", "peresapan"],
    explanation:
      "Infiltrasi merupakan tahap krusial untuk mengisi cadangan air tanah serta mengurangi debit puncak (peak discharge) dari air limpasan permukaan[cite: 254, 332].",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Dampak Lanjutan",
    question:
      "Ketika gempa bumi besar mengguncang lapisan tanah yang sudah sangat jenuh oleh air (faktor hidrologi dari curah hujan tinggi), tanah dapat kehilangan kekuatan sama sekali dan bersikap seperti benda cair. Fenomena ini disebut...",
    options: ["Abrasi", "Likuifaksi", "Sinkhole", "Storm Surge"],
    answer: "Likuifaksi",
    explanation:
      "Likuifaksi (liquefaction) mematikan karena tanah yang jenuh oleh air (faktor hidrosfer) diguncang gempa (faktor geosfer) sehingga strukturnya hancur dan menjadi cair lumpur[cite: 326].",
  },
  // =================================================================
  // --- TAMBAHAN BATCH 13: HIDROLOGI (30 SOAL GEN Z & JEBAKAN) ---
  // =================================================================
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Air Nyasar",
    question:
      "Air hujan yang jatuh ke tanah itu bakal meresap masuk. Tapi apa bedanya proses 'Infiltrasi' sama 'Perkolasi'? Awas jebakan istilah!",
    options: [
      "Infiltrasi itu air masuk ke sungai, Perkolasi air masuk ke laut",
      "Infiltrasi itu air masuk lewat permukaan tanah, Perkolasi itu air yang udah di dalam tanah merembes makin dalam ke air tanah",
      "Infiltrasi itu penguapan, Perkolasi itu pendinginan",
      "Nggak ada bedanya, cuma beda bahasa aja",
    ],
    answer:
      "Infiltrasi itu air masuk lewat permukaan tanah, Perkolasi itu air yang udah di dalam tanah merembes makin dalam ke air tanah",
    explanation:
      "Infiltrasi itu pintu masuknya (dari permukaan aspal/tanah ke pori tanah atas). Kalau Perkolasi itu perjalanannya (merembes vertikal terus ke bawah sampai nyentuh zona air tanah / akuifer).",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Pohon Keringatan",
    question:
      "Pohon itu aslinya juga 'keringatan' ngelepasin uap air ke udara lho lewat stomata daunnya. Proses penguapan khusus dari tumbuhan ini disebut...",
    options: ["Evaporasi", "Sublimasi", "Transpirasi", "Kondensasi"],
    answer: "Transpirasi",
    explanation:
      "Evaporasi itu penguapan dari benda mati (laut, danau, aspal basah). Kalau Transpirasi itu penguapan biologis dari makhluk hidup (tumbuhan). Gabungan keduanya disebut Evapotranspirasi.",
  },
  {
    category: "hidrologi",
    mode: "essay",
    topic: "Nyangkut di Daun",
    question:
      "Sebelum air hujan nyentuh tanah, sering banget airnya nyangkut dan tertahan di kanopi pohon atau atap rumah, terus nguap lagi. Proses 'nyangkutnya' air ini dinamakan...",
    answerKeywords: ["intersepsi", "interception"],
    explanation:
      "Intersepsi sangat penting buat mencegah erosi. Hutan hujan tropis punya tingkat intersepsi yang tinggi, sehingga air hujan nggak langsung memukul tanah dengan keras.",
  },
  {
    category: "hidrologi",
    mode: "guess",
    topic: "Danau Sepotong",
    question:
      "Sungai di dataran rendah itu biasanya berkelok-kelok (Meander). Kalau kelokannya terputus karena arus sungai nyari jalan pintas, bakal terbentuk danau melengkung yang dinamakan...",
    imageType: "oxbow_lake",
    options: [
      "Danau Tektonik",
      "Oxbow Lake (Danau Tapal Kuda)",
      "Danau Karst",
      "Laguna",
    ],
    answer: "Oxbow Lake (Danau Tapal Kuda)",
    explanation:
      "Oxbow lake terbentuk murni karena proses hidrologi erosi dan sedimentasi alami. Sungai yang tadinya melengkung parah akhirnya 'dipotong' lurus oleh air, meninggalkan genangan melengkung seperti tapal kuda.",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Batas Kekuasaan Sungai",
    question:
      "Daerah Aliran Sungai (DAS) itu ibarat mangkuk penampung hujan. Jebakannya: Batas pemisah antara satu DAS dengan DAS lainnya di alam nyata itu berupa apa?",
    options: [
      "Jalan raya provinsi",
      "Punggung bukit / pegunungan",
      "Garis lintang bumi",
      "Lautan",
    ],
    answer: "Punggung bukit / pegunungan",
    explanation:
      "Batas DAS (Watershed Divide) selalu berupa tempat-tempat tertinggi (punggung bukit/gunung). Air hujan yang jatuh di sisi kiri bukit akan masuk ke DAS A, yang jatuh di sisi kanan masuk ke DAS B.",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Misteri Air Laut",
    question:
      "Lu sadar nggak sih, air hujan yang turun dari langit itu tawar, sungai juga tawar. Lah terus dari mana datangnya rasa ASIN di laut?",
    options: [
      "Dari keringat ikan",
      "Dari pelapukan batuan di darat yang mineral garamnya dibilas oleh air hujan dan terbawa sungai ke laut selama jutaan tahun",
      "Dari letusan gunung berapi bawah laut aja",
      "Karena lautan menguap terus-menerus",
    ],
    answer:
      "Dari pelapukan batuan di darat yang mineral garamnya dibilas oleh air hujan dan terbawa sungai ke laut selama jutaan tahun",
    explanation:
      "Air sungai sebenarnya punya sedikit banget kandungan garam dari pelapukan batu (terlalu kecil buat dirasain lidah). Tapi karena jutaan tahun mengalir numpuk di laut dan airnya terus menguap (garamnya tertinggal), laut jadi asin banget.",
  },
  {
    category: "hidrologi",
    mode: "essay",
    topic: "Invasi Asin",
    question:
      "Warga pesisir (kayak di Jakarta Utara) sering ngeluh air sumurnya jadi asin. Ini gara-gara air laut meresap masuk ke daratan bawah tanah akibat penyedotan air tanah berlebih. Namanya...",
    answerKeywords: ["intrusi", "intrusi air laut", "intrusi laut"],
    explanation:
      "Intrusi air laut terjadi saat rongga pori-pori tanah di bawah kota kosong (karena air tawarnya disedot pompa). Karena tekanan air laut lebih kuat, air asin akhirnya menerobos masuk ke bawah kota.",
  },
  {
    category: "hidrologi",
    mode: "guess",
    topic: "Batas Bawah Tanah",
    question:
      "Garis batas bawah tanah yang memisahkan area tanah yang kering (Zona Aerasi) dengan area tanah yang full terendam air (Zona Saturasi) disebut dengan...",
    imageType: "water_table",
    options: [
      "Water Table (Muka Air Tanah)",
      "Bedrock",
      "Aquifer",
      "Infiltration Line",
    ],
    answer: "Water Table (Muka Air Tanah)",
    explanation:
      "Water table adalah kedalaman minimum kalau lu mau gali sumur dan nemuin genangan air. Saat musim kemarau, water table bakal turun, makanya sumur banyak yang kering.",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Air Punya Privilese",
    question:
      "Air sumur Artesis itu unik banget karena airnya bisa nyembur keluar sendiri tanpa perlu dipompa. Kenapa bisa gitu?",
    options: [
      "Karena ada jin penunggunya",
      "Karena airnya kejebak di antara dua lapisan batu kedap air di posisi miring, jadi tekanannya tinggi banget",
      "Karena ada gempa bumi",
      "Karena suhunya mendidih",
    ],
    answer:
      "Karena airnya kejebak di antara dua lapisan batu kedap air di posisi miring, jadi tekanannya tinggi banget",
    explanation:
      "Sumur artesis (Confined Aquifer) itu ibarat pipa air kota yang tertutup. Karena sumber airnya ada di tempat yang lebih tinggi, pas tanah di bawahnya dibor, air langsung muncrat karena hukum bejana berhubungan.",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Tanah Liat Super Plin-Plan",
    question:
      "Jebakan Tanah! Tanah lempung (Clay) itu Porositasnya (jumlah rongga) tinggi banget, tapi Permeabilitasnya (kemampuan ngalirin air) sangat RENDAH. Maksudnya gimana tuh?",
    options: [
      "Dia nggak bisa nyimpen air sama sekali",
      "Dia bisa nyimpen banyak air, tapi airnya nggak bisa ngalir / rembes ke mana-mana karena pori-porinya terlalu sempit",
      "Air langsung tembus ke bawah dalam sedetik",
      "Tanahnya langsung larut jadi air",
    ],
    answer:
      "Dia bisa nyimpen banyak air, tapi airnya nggak bisa ngalir / rembes ke mana-mana karena pori-porinya terlalu sempit",
    explanation:
      "Lempung itu spons mikroskopis. Dia nyerap dan nahan air (susah kering), tapi porinya saking kecilnya bikin air terjebak. Beda sama pasir yang porositas dan permeabilitasnya sama-sama bagus.",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Anehnya Air",
    question:
      "Semua benda di alam semesta kalau membeku (jadi padat) massanya bakal lebih berat dan tenggelam. TAPI air itu anomali! Es batu malah mengapung di air. Kenapa es bisa lebih ringan?",
    options: [
      "Karena es itu isinya oksigen",
      "Karena ikatan molekul air membentuk struktur kristal renggang (segi enam) saat membeku, bikin volumenya nambah dan massa jenisnya turun",
      "Karena es dicetak pake kulkas",
      "Karena gaya magnet bumi",
    ],
    answer:
      "Karena ikatan molekul air membentuk struktur kristal renggang (segi enam) saat membeku, bikin volumenya nambah dan massa jenisnya turun",
    explanation:
      "Anomali air ini yang nyelamatin ekosistem bumi! Kalau es tenggelam, lautan bakal membeku dari bawah ke atas dan semua ikan mati. Karena es mengapung, dia jadi 'selimut' yang jagain air di bawahnya tetap cair.",
  },
  {
    category: "hidrologi",
    mode: "guess",
    topic: "Grafik Panik Peneliti",
    question:
      "Kalau curah hujan lagi ekstrem, peneliti hidrologi bakal mantengin grafik ini yang nampilin fluktuasi Debit Sungai terhadap Waktu. Kalau kurvanya naik tajam, siap-siap banjir bandang! Nama grafiknya adalah...",
    imageType: "hydrograph",
    options: ["Seismogram", "Hidrograf", "Klimatograf", "Topografi"],
    answer: "Hidrograf",
    explanation:
      "Hidrograf adalah denyut nadinya sungai. Grafik ini mengukur berapa meter kubik per detik (m3/s) air yang lewat. Daerah perkotaan yang full aspal biasanya punya hidrograf yang lonjakannya sangat curam (Flashy).",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Air Minum Dunia",
    question:
      "Dari 100% total air di Bumi, air tawar (freshwater) itu cuma sekitar 2.5% doang. Jebakannya: dari 2.5% air tawar itu, paling banyak disimpen di mana?",
    options: [
      "Sungai dan Danau",
      "Air tanah dalam",
      "Gletser dan Lapisan Es (Kriosfer)",
      "Awan di langit",
    ],
    answer: "Gletser dan Lapisan Es (Kriosfer)",
    explanation:
      "Hampir 69% air tawar dunia itu beku di Antartika dan Greenland. Sekitar 30% ada di air tanah. Sementara air yang kita lihat tiap hari (sungai, danau) itu cuma 1% dari total air tawar dunia!",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Panci Misterius",
    question:
      "Di stasiun BMKG ada alat evaporimeter berbentuk panci raksasa isi air. Anehnya, di atas panci itu dikasih kawat pelindung. Buat apa kawat itu dipasang?",
    options: [
      "Biar airnya nggak kepanasan",
      "Biar airnya nggak diminum burung atau anjing liar, karena bisa bikin perhitungan penguapan (evaporasi) jadi ngaco",
      "Sebagai sensor radar",
      "Biar daun nggak masuk",
    ],
    answer:
      "Biar airnya nggak diminum burung atau anjing liar, karena bisa bikin perhitungan penguapan (evaporasi) jadi ngaco",
    explanation:
      "Evaporimeter Panci Kelas A ngukur penguapan dalam milimeter. Kalau airnya berkurang gara-gara diseruput burung merpati atau anjing yang numpang minum, data hidrologinya bakal rusak!",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Bencana Aspal",
    question:
      "Apa efek paling nyata dari kota yang terlalu banyak aspal dan beton (Urbanisasi) terhadap siklus hidrologi lokal?",
    options: [
      "Hujan berhenti turun",
      "Infiltrasi air tanah turun drastis, tapi Limpasan Permukaan (Surface Runoff) meroket tajam bikin banjir kilat",
      "Laju evaporasi terhenti",
      "Kualitas air sungai jadi jernih",
    ],
    answer:
      "Infiltrasi air tanah turun drastis, tapi Limpasan Permukaan (Surface Runoff) meroket tajam bikin banjir kilat",
    explanation:
      "Beton nggak bisa nyerap air. Semua air hujan 100% jadi aliran permukaan yang langsung menyerbu selokan dan sungai di saat yang bersamaan, memicu banjir kilat (Flash Flood).",
  },
  {
    category: "hidrologi",
    mode: "essay",
    topic: "Air Ngalir di Aspal",
    question:
      "Sisa air hujan yang gagal meresap ke dalam tanah (karena tanahnya udah jenuh atau tertutup aspal) dan akhirnya ngalir bebas di permukaan tanah disebut dengan istilah...",
    answerKeywords: [
      "runoff",
      "limpasan",
      "surface runoff",
      "limpasan permukaan",
    ],
    explanation:
      "Surface runoff adalah sumber utama pengisi air sungai saat hujan lebat. Jika tidak dikelola dengan sistem drainase atau sumur resapan yang baik, runoff inilah yang merendam kota.",
  },
  {
    category: "hidrologi",
    mode: "guess",
    topic: "Gua Batman",
    question:
      "Daerah dengan batuan kapur (Karst) kayak di Gunung Kidul itu daratannya gersang, tapi aslinya mereka punya 'sungai bawah tanah' raksasa di dalam gua-gua. Wilayah dengan topografi bolong-bolong dilarutkan air ini disebut...",
    imageType: "karst_cave",
    options: ["Topografi Karst", "Akuifer Tertekan", "Geyser", "Volkanik"],
    answer: "Topografi Karst",
    explanation:
      "Air hujan yang bersifat asam lemah melarutkan batuan gamping (CaCO3) selama ribuan tahun, menciptakan rongga, stalaktit, dan sungai raksasa yang ngalir jauh di bawah tanah (underground river).",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Pohon vs Sungai",
    question:
      "Pola aliran sungai di pegunungan biasanya bercabang-cabang rapi kayak struktur ranting pohon. Pola hidrologis yang paling umum di dunia ini disebut pola...",
    options: ["Trellis", "Radial", "Dendritik", "Rektangular"],
    answer: "Dendritik",
    explanation:
      "Dendritik (dari bahasa Yunani 'dendron' yang berarti pohon) terbentuk di daerah yang batuannya seragam. Mirip banget sama pembuluh darah atau ranting pohon yang menyatu ke batang utama.",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Air Anti Gravitasi",
    question:
      "Sadar nggak sih kalau tanah yang agak tinggi dari genangan air tetep ikutan basah? Air di tanah bisa bergerak NAIK melawan gravitasi melalui pori-pori sempit. Gaya ini disebut...",
    options: [
      "Adveksi",
      "Gravitasi Balik",
      "Kapilaritas",
      "Tegangan Permukaan",
    ],
    answer: "Kapilaritas",
    explanation:
      "Mirip kayak tisu yang ujungnya dicelupin ke air tapi basahnya merambat ke atas. Pori-pori tanah yang super kecil punya gaya adhesi yang 'narik' molekul air untuk naik ke atas (Capillary action).",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Jalur Air Panjang",
    question:
      "Air laut menguap -> jadi awan -> kebawa angin ke gunung -> turun salju -> saljunya cair masuk sungai -> baliknya lama ke laut. Siklus perjalanan super jauh ini disebut...",
    options: [
      "Siklus Hidrologi Pendek",
      "Siklus Hidrologi Sedang",
      "Siklus Hidrologi Panjang",
      "Siklus Geologi",
    ],
    answer: "Siklus Hidrologi Panjang",
    explanation:
      "Kalau pendek: ngendap di laut, hujan di laut. Sedang: hujan di darat lalu ngalir ke laut. Panjang: sampai membentuk salju/gletser di pegunungan yang butuh waktu lama untuk cair kembali ke laut.",
  },
  {
    category: "hidrologi",
    mode: "guess",
    topic: "Semburan Air Bumi",
    question:
      "Mata air panas yang secara berkala nyemburin kolom air mendidih dan uap panas tinggi banget ke udara. Semburan hidrologi-geotermal ini namanya apa?",
    imageType: "geyser",
    options: ["Mata Air Artesis", "Fumarol", "Geyser", "Hot Spring"],
    answer: "Geyser",
    explanation:
      "Geyser (seperti Old Faithful di Yellowstone) terbentuk karena air tanah meresap ke saluran batu sempit dan dipanaskan oleh magma. Saat air mendidih berubah jadi uap, tekanan ekspansinya nembak air ke atas.",
  },
  {
    category: "hidrologi",
    mode: "essay",
    topic: "Danau Hijau Kematian",
    question:
      "Danau tiba-tiba berubah jadi hijau pekat karena mekar alga raksasa gara-gara airnya tercemar pupuk pertanian yang kaya Nitrogen dan Fosfor. Ikan pada mati kehabisan oksigen. Bencana ekologis ini disebut...",
    answerKeywords: ["eutrofikasi", "eutrophication"],
    explanation:
      "Eutrofikasi bikin alga tumbuh gila-gilaan menutupi permukaan air. Pas alga itu mati dan membusuk, bakteri pembusuk nyedot habis semua oksigen di dalam air, bikin danau jadi zona mati.",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Banjir Bandang",
    question:
      "Banjir Bandang (Flash Flood) beda banget sama banjir kiriman biasa. Apa ciri khas utama yang bikin Flash Flood sangat mematikan?",
    options: [
      "Banjirnya pelan-pelan naiknya",
      "Airnya bening dan bersih",
      "Datangnya super tiba-tiba tanpa peringatan, arusnya ganas, dan bawa puing-puing (pohon/batu) dari hulu",
      "Cuma terjadi di pesisir pantai",
    ],
    answer:
      "Datangnya super tiba-tiba tanpa peringatan, arusnya ganas, dan bawa puing-puing (pohon/batu) dari hulu",
    explanation:
      "Flash flood terjadi karena curah hujan ekstrem dalam waktu sangat singkat di area hulu (pegunungan). Airnya meluncur ke bawah seperti tembok tsunami lumpur karena topografi yang miring.",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Hujan Gunung",
    question:
      "Angin laut bawa awan basah, terus awannya nabrak lereng gunung dan dipaksa naik. Udaranya mendingin, turunlah hujan lebat di lereng itu. Hujan tipe ini namanya...",
    options: [
      "Hujan Konvektif",
      "Hujan Orografis",
      "Hujan Frontal",
      "Hujan Zenithal",
    ],
    answer: "Hujan Orografis",
    explanation:
      "Hujan Orografis (Orography = pegunungan) bikin lereng sisi angin (Windward) jadi subur hijau, tapi sisi baliknya (Leeward) jadi gersang karena udaranya udah kering (Daerah Bayangan Hujan).",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Batas Titik Kritis",
    question:
      "Biar uap air (gas) di udara bisa berubah jadi embun/awan (cair), suhu udara itu harus didinginin sampai menyentuh batas angka tertentu yang disebut dengan...",
    options: [
      "Titik Beku (Freezing Point)",
      "Titik Embun (Dew Point)",
      "Titik Nol Mutlak",
      "Titik Didih",
    ],
    answer: "Titik Embun (Dew Point)",
    explanation:
      "Dew Point adalah suhu mutlak di mana udara 100% jenuh oleh uap air. Kalau suhu udara turun menyentuh Dew Point, proses kondensasi pun dimulai.",
  },
  {
    category: "hidrologi",
    mode: "essay",
    topic: "Balik Wujud",
    question:
      "Proses perubahan wujud uap air (gas) di udara berubah kembali menjadi titik-titik air cair pembentuk awan disebut dengan proses...",
    answerKeywords: ["kondensasi", "pengembunan"],
    explanation:
      "Kondensasi adalah proses fundamental di atmosfer yang menjembatani evaporasi (uap naik) dengan presipitasi (air turun).",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Sungai Nggak Modal",
    question:
      "Ada jenis sungai di daerah gurun atau Nusa Tenggara yang airnya CUMA MENGALIR kalau lagi musim hujan badai aja. Pas kemarau, sungainya berubah jadi jalanan tanah kering. Sungai ini disebut sungai...",
    options: [
      "Sungai Perenial",
      "Sungai Episodik / Ephemeral",
      "Sungai Periodik",
      "Sungai Eksotik",
    ],
    answer: "Sungai Episodik / Ephemeral",
    explanation:
      "Sungai ephemeral adalah sungai musiman yang durasi keringnya lebih lama daripada durasi basahnya. Namun sangat berbahaya jika terjadi hujan karena bisa jadi jalur flash flood.",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Penyaring Alami Bumi",
    question:
      "Kenapa mata air di pegunungan (kayak air mineral botolan) itu jernih banget dan bisa langsung diminum?",
    options: [
      "Karena belum disentuh manusia",
      "Karena air tanah tersebut melewati proses filtrasi alami berabad-abad lewat pori-pori batuan dan pasir",
      "Karena es di puncak gunung itu steril",
      "Karena ditambahin bahan kimia di alam",
    ],
    answer:
      "Karena air tanah tersebut melewati proses filtrasi alami berabad-abad lewat pori-pori batuan dan pasir",
    explanation:
      "Batuan akuifer (pasir, kerikil, batu kapur) berfungsi sebagai filter raksasa. Bakteri dan kotoran tersangkut di pori batuan, dan air diperkaya dengan mineral alami.",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Bedanya Bendungan & Waduk",
    question:
      "Jebakan istilah! Orang awam suka kebalik sebut 'Bendungan' sama 'Waduk'. Bedanya apa sih?",
    options: [
      "Waduk itu buatan, Bendungan alami",
      "Bendungan itu tembok fisiknya (strukturnya), Waduk itu danau tampungan airnya",
      "Waduk buat listrik, Bendungan buat irigasi",
      "Sama aja nggak ada beda",
    ],
    answer:
      "Bendungan itu tembok fisiknya (strukturnya), Waduk itu danau tampungan airnya",
    explanation:
      "Bendungan (Dam) adalah struktur beton penahannya. Sementara Waduk (Reservoir) adalah wadah genangan air raksasa yang terbentuk di belakang bendungan tersebut.",
  },
  {
    category: "hidrologi",
    mode: "mcq",
    topic: "Bypass Proses Air",
    question:
      "Biasanya es kalau mau nguap jadi gas, harus meleleh dulu jadi air (cair). Tapi di cuaca ekstrem pegunungan tinggi, es/salju bisa aja langsung MENGUAP jadi gas tanpa mencair. Ini disebut...",
    options: ["Deposisi", "Sublimasi", "Kondensasi", "Evaporasi"],
    answer: "Sublimasi",
    explanation:
      "Sublimasi butuh energi panas yang sangat besar tapi udara harus kering. Ini bikin salju di puncak gunung bisa hilang terkikis meskipun suhunya nggak pernah di atas 0 derajat Celcius.",
  },

  // 4. KLIMATOLOGI
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Statistik",
    question:
      "Waktu minimal pengamatan cuaca untuk menentukan iklim suatu wilayah adalah...",
    options: ["10 tahun", "20 tahun", "30 tahun", "50 tahun"],
    answer: "30 tahun",
    explanation: "WMO menetapkan periode 30 tahun untuk normal standar iklim.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Fenomena",
    question:
      "Anomali suhu di Samudra Pasifik yang memicu kekeringan di Indonesia adalah...",
    options: ["La Nina", "El Nino", "MJO", "Dipole Mode"],
    answer: "El Nino",
    explanation:
      "El Nino menyebabkan pergeseran pusat awan hujan ke arah Pasifik Tengah.",
  },
  {
    category: "klimatologi",
    mode: "essay",
    topic: "Lokasi",
    question:
      "Garis khayal 0 derajat di khatulistiwa yang membagi bumi menjadi Utara dan Selatan disebut...",
    answerKeywords: ["ekuator", "khatulistiwa"],
    explanation: "Indonesia terletak tepat di lintang nol derajat ini.",
  },
  {
    category: "klimatologi",
    mode: "essay",
    topic: "Matahari",
    question:
      "Fenomena posisi matahari tepat di atas khatulistiwa (Maret & Sept) disebut...",
    answerKeywords: ["ekuinoks", "equinox"],
    explanation: "Pada saat ekuinoks, panjang siang dan malam hampir sama.",
  },
  // --- TAMBAHAN BATCH 4: KLIMATOLOGI ---
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Siklus Milankovitch",
    question:
      "Menurut hipotesis Milankovitch, perubahan iklim jangka panjang di Bumi (seperti pergantian antara zaman es dan periode hangat) sangat dipengaruhi oleh tiga faktor perubahan orbit astronomis, yaitu...",
    options: [
      "Eksentrisitas, Presesi, dan Obliquity",
      "Rotasi, Revolusi, dan Nutasi",
      "Gaya Coriolis, Gaya Sentripetal, dan Gravitasi",
      "Aktivitas Sunspot, Badai Matahari, dan Flare",
    ],
    answer: "Eksentrisitas, Presesi, dan Obliquity",
    explanation:
      "Milankovitch merumuskan bahwa bentuk orbit (eksentrisitas), kemiringan sumbu (obliquity), dan goyangan sumbu bumi (presesi) secara kolektif mengatur distribusi radiasi matahari yang diterima bumi.",
  },
  {
    category: "klimatologi",
    mode: "essay",
    topic: "Perubahan Iklim",
    question:
      "Meskipun siklus Milankovitch mengatur iklim selama jutaan tahun, pemanasan global yang sangat cepat sejak era pra-industri utamanya bukan disebabkan oleh orbit bumi, melainkan akibat aktivitas...",
    answerKeywords: [
      "manusia",
      "antropogenik",
      "pembakaran bahan bakar",
      "bahan bakar fosil",
      "emisi karbon",
    ],
    explanation:
      "Lembaga sains seperti NASA sepakat bahwa laju pemanasan dekadal saat ini sangat cepat dan murni diakibatkan oleh peningkatan drastis gas rumah kaca dari aktivitas antroposfer (manusia).",
  },
  {
    category: "klimatologi",
    mode: "guess",
    topic: "Kemiringan Sumbu",
    question:
      "Saat ini sumbu rotasi Bumi miring sekitar 23.5 derajat. Siklus perubahan sudut kemiringan ini (bervariasi dari 22.1° hingga 24.5°) yang sangat memengaruhi ekstremnya batas musim dingin dan panas dinamakan...",
    imageType: "axial_tilt",
    options: ["Eksentrisitas", "Obliquity", "Presesi", "Aphelion"],
    answer: "Obliquity",
    explanation:
      "Obliquity (kemiringan sumbu rotasi bumi) bervariasi setiap 41.000 tahun. Semakin miring sumbunya, semakin ekstrem perbedaan radiasi matahari antar musim di bumi.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Anomali Iklim",
    question:
      "Bencana kekeringan parah di wilayah Indonesia (seperti di Nusa Tenggara Barat) sering kali diperburuk oleh anomali interaksi lautan-atmosfer di Samudra Pasifik ekuator yang ditandai dengan menghangatnya suhu laut Pasifik Tengah. Fenomena ini dikenal dengan...",
    options: [
      "La Nina",
      "El Nino",
      "Madden-Julian Oscillation",
      "Dipole Mode Positif",
    ],
    answer: "El Nino",
    explanation:
      "Saat El Nino terjadi, pusat pembentukan awan konvektif bergeser dari Indonesia ke arah Samudra Pasifik Tengah dan Timur, sehingga wilayah Nusantara mengalami defisit curah hujan ekstrem.",
  },
  {
    category: "klimatologi",
    mode: "essay",
    topic: "Interaksi Sistem Bumi",
    question:
      "Lapisan sistem Bumi yang mencakup ekosistem tumbuhan purba dan hutan hujan tropis yang amat berperan mengatur keseimbangan iklim lokal serta siklus karbon melalui fotosintesis disebut...",
    answerKeywords: ["biosfer", "biosphere"],
    explanation:
      "Biosfer saling berinteraksi kuat dengan atmosfer. Deforestasi (kerusakan biosfer) akan mengurangi kemampuan transpirasi vegetasi dan melepas emisi karbon ke udara, memperparah pemanasan iklim.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Feedback Loop Kriosfer",
    question:
      "Pencairan lapisan tanah beku abadi (permafrost) di wilayah kutub akibat pemanasan suhu global sangat berbahaya bagi iklim masa depan karena akan memicu umpan balik positif (positive feedback), yaitu...",
    options: [
      "Meningkatnya kadar salinitas (garam) samudra secara drastis",
      "Pelepasan gas metana dan karbon organik yang terperangkap sejak zaman purba",
      "Terbentuknya lapisan ozon baru di ketinggian troposfer",
      "Meningkatnya albedo (pantulan radiasi) permukaan bumi ke angkasa",
    ],
    answer:
      "Pelepasan gas metana dan karbon organik yang terperangkap sejak zaman purba",
    explanation:
      "Permafrost menyimpan karbon organik sisa tumbuhan purba. Saat mencair, material itu membusuk dan melepaskan metana (gas rumah kaca 25 kali lebih kuat dari CO2) yang akan mempercepat laju pemanasan global.",
  },
  {
    category: "klimatologi",
    mode: "guess",
    topic: "Zaman Es",
    question:
      "Siklus Milankovitch memprediksi bahwa dari satu siklus 100.000 tahun, Bumi menghabiskan sekitar 80% waktunya dalam kondisi suhu yang sangat dingin dengan tutupan lapisan es yang meluas. Periode panjang ini dinamakan zaman...",
    imageType: "ice_age",
    options: ["Holosen", "Interglasial", "Glasial", "Mesozoikum"],
    answer: "Glasial",
    explanation:
      "Periode Glasial adalah fase zaman es (ice age). Sebaliknya, Interglasial adalah fase hangat singkat (sekitar 20% waktu siklus) seperti masa yang sedang dihuni umat manusia saat ini.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Gas Rumah Kaca",
    question:
      "Berdasarkan data penelitian geokimia dari pengeboran lapisan inti es (ice core) di Antartika, grafik historis selama ratusan ribu tahun menunjukkan korelasi yang sangat identik dan searah antara fluktuasi kenaikan suhu global dengan kenaikan konsentrasi gas...",
    options: [
      "Oksigen (O2)",
      "Karbondioksida (CO2)",
      "Sulfur Dioksida (SO2)",
      "Helium (He)",
    ],
    answer: "Karbondioksida (CO2)",
    explanation:
      "Data paleoklimatologi membuktikan bahwa setiap kali bumi memanas di masa lalu, konsentrasi CO2 di atmosfer juga selalu berada pada puncaknya, dan hal yang sama berlaku untuk fluktuasi tinggi muka laut.",
  },
  {
    category: "klimatologi",
    mode: "essay",
    topic: "Standar Observasi",
    question:
      "Menurut pedoman standar Organisasi Meteorologi Dunia (WMO), untuk menyusun parameter 'Normal Iklim' suatu wilayah, diperlukan rata-rata data pengamatan cuaca setidaknya selama minimal berapa tahun?",
    answerKeywords: ["30", "tiga puluh"],
    explanation:
      "WMO (World Meteorological Organization) secara global menetapkan 30 tahun sebagai periode acuan standar agar fluktuasi cuaca ekstrem tahunan/dekadal dapat diratakan menjadi representasi iklim yang akurat.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Kenaikan Muka Laut",
    question:
      "Naiknya suhu iklim global tidak hanya menyebabkan pencairan kriosfer (es di kutub dan gletser), tetapi juga membuat level muka air laut dunia terus merangkak naik melalui mekanisme fisis hidrosfer yang disebut...",
    options: [
      "Pemuaian termal (thermal expansion) volume air laut karena panas",
      "Subsiden tanah akibat berat ekstra dari air laut",
      "Peningkatan intensitas hujan di tengah-tengah lautan samudra",
      "Melemahnya gaya gravitasi bumi di daerah ekuator",
    ],
    answer: "Pemuaian termal (thermal expansion) volume air laut karena panas",
    explanation:
      "Kenaikan muka air laut (sea-level rise) dipicu oleh dua penyumbang utama iklim global: penambahan massa air dari es benua yang mencair, dan pemuaian volume air laut itu sendiri akibat lautan menyerap udara bumi yang memanas.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Mitos Rumah Kaca",
    question:
      "Banyak aktivis teriak 'Hentikan Efek Rumah Kaca!'. Jebakannya: Seandainya efek rumah kaca di bumi ini HILANG 100%, apa yang bakal terjadi sama kita?",
    options: [
      "Bumi jadi tempat paling sejuk dan nyaman buat rebahan",
      "Suhu bumi bakal anjlok jadi beku (sekitar -18°C) dan semua kehidupan mati",
      "Oksigen di udara bakal meledak",
      "Nggak ada bedanya, cuma es kutub aja yang berhenti mencair",
    ],
    answer:
      "Suhu bumi bakal anjlok jadi beku (sekitar -18°C) dan semua kehidupan mati",
    explanation:
      "Efek rumah kaca itu ALAMI dan sangat krusial buat ngejaga bumi tetap hangat (suhu rata-rata 15°C). Yang bahaya itu 'Pemanasan Global', yaitu efek rumah kaca yang berlebihan gara-gara gas polusi manusia.",
  },
  {
    category: "klimatologi",
    mode: "guess",
    topic: "Kapsul Waktu Bumi",
    question:
      "Gimana caranya ilmuwan tau cuaca bumi 800.000 tahun yang lalu padahal belum ada termometer? Mereka ngebor lapisan es purba di Antartika buat neliti 'gelembung udara' yang terperangkap di dalamnya. Es ini disebut...",
    imageType: "ice_core",
    options: ["Permafrost", "Ice Core (Inti Es)", "Gletser Fosil", "Cryo-tube"],
    answer: "Ice Core (Inti Es)",
    explanation:
      "Ice core adalah silinder es yang dibor dari kedalaman Antartika. Di dalam es tersebut terdapat gelembung udara purba yang menyimpan komposisi CO2 dari ratusan ribu tahun yang lalu.",
  },
  {
    category: "klimatologi",
    mode: "essay",
    topic: "Pantulan Maut",
    question:
      "Salju di kutub itu warnanya putih, jadi dia mantulin panas matahari balik ke luar angkasa. Daya pantul permukaan bumi ini (yang kalau angkanya turun bikin bumi makin panas) secara ilmiah disebut...",
    answerKeywords: ["albedo"],
    explanation:
      "Albedo adalah persentase radiasi matahari yang dipantulkan. Es punya albedo tinggi (mantulin panas). Kalau es cair jadi lautan gelap, albedonya turun, panasnya diserap lautan, dan bumi makin mendidih (Positive Feedback).",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Jebakan Petani Padi",
    question:
      "Buat nentuin tipe iklim, kita punya Schmidt-Ferguson (S-F) sama Oldeman. Kalau S-F syarat 'Bulan Basah' itu curah hujannya > 100 mm. Kalau sistem Oldeman (khusus buat nentuin musim tanam padi), syarat 'Bulan Basah' curah hujannya harus di atas berapa?",
    options: ["50 mm", "100 mm", "200 mm", "500 mm"],
    answer: "200 mm",
    explanation:
      "Klasifikasi Iklim Oldeman dibikin spesifik untuk pertanian pangan di Indonesia. Padi butuh banyak banget air, makanya ambang batas Bulan Basah menurut Oldeman itu lebih tinggi, yaitu > 200 mm per bulan.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Gas Mayoritas",
    question:
      "Gas Rumah Kaca (GRK) yang jumlah volumenya PALING BANYAK di atmosfer bumi kita saat ini sebenarnya BUKAN Karbon Dioksida (CO2), melainkan...",
    options: [
      "Metana (CH4)",
      "Uap Air (H2O)",
      "Nitrogen Oksida (N2O)",
      "CFC / Freon",
    ],
    answer: "Uap Air (H2O)",
    explanation:
      "Uap air adalah Gas Rumah Kaca paling berlimpah dan paling kuat secara alami. Tapi ilmuwan lebih fokus ngendaliin CO2 karena jumlah uap air di atmosfer itu dikontrol sama suhu bumi itu sendiri, bukan langsung dari knalpot pabrik.",
  },
  {
    category: "klimatologi",
    mode: "guess",
    topic: "Catatan Pohon",
    question:
      "Selain dari es, klimatolog juga bisa tau umur dan kondisi curah hujan zaman baheula dari ngeliat cincin/lingkaran di dalam batang pohon kayu. Ilmu ngebaca iklim dari cincin pohon ini namanya...",
    imageType: "tree_rings",
    options: [
      "Paleobotani",
      "Dendroklimatologi",
      "Silvikultur",
      "Karbon Dating",
    ],
    answer: "Dendroklimatologi",
    explanation:
      "Dendroklimatologi ngebaca ketebalan cincin tahunan pohon (Tree Rings). Cincin yang tebal berarti tahun itu banyak hujan dan hangat (ideal buat tumbuh). Cincin tipis berarti tahun itu lagi kekeringan ekstrem.",
  },
  {
    category: "klimatologi",
    mode: "essay",
    topic: "Badan Iklim PBB",
    question:
      "Organisasi elit di bawah PBB yang isinya ribuan ilmuwan dunia yang tugasnya ngerilis laporan kiamat iklim (Assessment Report) dan jadi kiblat sains perubahan iklim global. Singkatannya 4 huruf...",
    answerKeywords: ["ipcc"],
    explanation:
      "IPCC (Intergovernmental Panel on Climate Change) tidak melakukan penelitian sendiri, melainkan me-review dan merangkum semua riset iklim dunia untuk dijadikan panduan kebijakan negara-negara di PBB.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Jebakan Gunung Meletus",
    question:
      "Kalau ada gunung berapi super (Supervolcano) meletus dan ngeluarin jutaan ton gas Sulfur Dioksida & abu ke stratosfer, apa efeknya buat iklim global di tahun-tahun berikutnya?",
    options: [
      "Bumi makin panas mendidih karena abu menahan panas",
      "Bumi jadi dingin parah (Global Cooling / Volcanic Winter) karena aerosol menghalangi sinar matahari",
      "Curah hujan di seluruh bumi berhenti total",
      "Oksigen di bumi habis",
    ],
    answer:
      "Bumi jadi dingin parah (Global Cooling / Volcanic Winter) karena aerosol menghalangi sinar matahari",
    explanation:
      "Partikel aerosol sulfat dari letusan gunung raksasa (seperti Krakatau atau Tambora) menjadi payung pemantul radiasi matahari di stratosfer, bikin suhu global anjlok. Fenomena ini disebut 'Tahun Tanpa Musim Panas'.",
  },
  {
    category: "klimatologi",
    mode: "guess",
    topic: "Bintik Panas Matahari",
    question:
      "Matahari itu kadang punya bintik-bintik gelap di permukaannya. Plot twist-nya: Semakin banyak bintik gelap ini, radiasi yang dipancarin matahari justru makin PANAS. Fenomena ini disebut...",
    imageType: "sunspots",
    options: ["Solar Flare", "Sunspots", "Coronal Mass", "Black Hole"],
    answer: "Sunspots",
    explanation:
      "Sunspot (Bintik Matahari) adalah area dingin karena anomali magnetik. Tapi kemunculannya selalu dibarengi dengan ledakan radiasi (fakula) di sekitarnya yang sangat panas. Siklus sunspot ini terjadi sekitar tiap 11 tahun sekali.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Karbon Nyasar di Laut",
    question:
      "Seperempat dari polusi CO2 yang kita buang ke udara itu diserap sama lautan. Kelihatannya bagus kan? Padahal ini memicu bencana kimia bawah laut yang disebut...",
    options: [
      "Eutrofikasi (Ledakan Alga)",
      "Ocean Acidification (Pengasaman Samudra)",
      "Likuifaksi Laut",
      "Kenaikan Salinitas Ekstrem",
    ],
    answer: "Ocean Acidification (Pengasaman Samudra)",
    explanation:
      "Saat CO2 larut di air laut, dia membentuk asam karbonat yang bikin pH laut turun (makin asam). Asam ini melarutkan cangkang kapur hewan laut seperti koral, kerang, dan plankton, menghancurkan rantai makanan laut.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Kota Sauna",
    question:
      "Kenapa kalau lu nongkrong di tengah kota besar (kayak Jakarta) pas malam hari itu udaranya lebih gerah dan sumuk dibanding kalau lu pulang ke kampung/desa pinggiran?",
    options: [
      "Karena di kota banyak orang nafas",
      "Karena banyak gedung pakai AC",
      "Fenomena Urban Heat Island (UHI), aspal dan beton kota menyerap panas siang hari dan ngelepasin panasnya perlahan di malam hari",
      "Karena di kota nggak ada angin darat",
    ],
    answer:
      "Fenomena Urban Heat Island (UHI), aspal dan beton kota menyerap panas siang hari dan ngelepasin panasnya perlahan di malam hari",
    explanation:
      "Material kota (aspal, beton) punya kapasitas panas (Thermal Mass) tinggi. Siang hari nyerep panas, malam hari kayak oven yang lagi buang panas. Beda sama desa yang energinya dipakai buat transpirasi pohon.",
  },
  {
    category: "klimatologi",
    mode: "essay",
    topic: "Batas Kritis Kiamat",
    question:
      "Dalam Perjanjian Paris (Paris Agreement), negara-negara sedunia sepakat buat nahan kenaikan suhu global supaya gak ngelewatin batas kritis (Tipping Point). Berapa Derajat Celcius batas maksimal kenaikan suhu tersebut?",
    answerKeywords: ["1.5", "1,5", "1.5 derajat", "1,5 derajat"],
    explanation:
      "Batas 1.5°C di atas tingkat pra-industri dianggap sebagai batas aman. Kalau lewat dari itu, dampak iklim ekstrem (pencairan permafrost, matinya terumbu karang massal) tidak akan bisa dibalikkan lagi (irreversible).",
  },
  {
    category: "klimatologi",
    mode: "guess",
    topic: "Grafik Ikonik Iklim",
    question:
      "Ini adalah grafik paling legendaris di dunia sains yang nunjukin bahwa kadar CO2 di bumi terus meroket tajam sejak 1950-an. Diambil dari stasiun pemantau di Gunung Mauna Loa, grafik ini disebut...",
    imageType: "keeling_curve",
    options: [
      "Milankovitch Graph",
      "Keeling Curve",
      "Hockey Stick Graph",
      "Lorenz Attractor",
    ],
    answer: "Keeling Curve",
    explanation:
      "Keeling Curve dinamai dari ilmuwan Charles Keeling. Kurva ini punya pola zig-zag kecil (karena bumi 'bernapas' saat musim semi/gugur) tapi tren garis utamanya terus naik secara mengerikan menembus 420+ ppm.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Sandi Rahasia Koppen",
    question:
      "Klasifikasi iklim dunia paling populer (Köppen) pakai kode huruf. Indonesia itu dominan kodenya 'Af'. Huruf 'f' di belakang 'A' (Tropis) itu singkatan dari bahasa Jerman 'feucht' yang artinya...",
    options: [
      "Kering kerontang",
      "Penuh hutan",
      "Selalu basah/lembab sepanjang tahun",
      "Punya musim kemarau panjang",
    ],
    answer: "Selalu basah/lembab sepanjang tahun",
    explanation:
      "Kode 'A' berarti iklim Tropis. Huruf kedua 'f' artinya basah tanpa musim kering yang tegas (Hutan Hujan Tropis). Beda sama 'Aw' (Sabana) yang punya musim kering panjang seperti di NTT.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Harta Karun Mangrove",
    question:
      "Tau nggak sih kalau pohon Mangrove (Bakau) di pesisir itu nyimpen karbon 4-5 kali lebih banyak dari hutan di daratan! Karbon yang disimpen di ekosistem pesisir dan laut ini punya sebutan gaul, yaitu...",
    options: ["Green Carbon", "Black Carbon", "Blue Carbon", "Coral Carbon"],
    answer: "Blue Carbon",
    explanation:
      "Blue Carbon (Karbon Biru) adalah karbon yang ditangkap dan disimpan oleh ekosistem laut (seperti mangrove, padang lamun, dan rawa payau). Mereka menyimpan karbon utamanya di lumpur bawah tanahnya selama ribuan tahun.",
  },
  {
    category: "klimatologi",
    mode: "essay",
    topic: "Perusak Ozon",
    question:
      "Gas buatan manusia yang biasa dipakai di AC, Kulkas, dan semprotan parfum zaman dulu ini nggak cuma bikin suhu bumi panas, tapi juga nyobek Lapisan Ozon. Singkatan 3 hurufnya adalah...",
    answerKeywords: ["cfc", "klorofluorokarbon"],
    explanation:
      "CFC (Chlorofluorocarbon) dilarang total sejak Protokol Montreal 1987 karena radikal klorinnya sangat ganas menghancurkan molekul ozon di stratosfer, bikin radiasi UV tembus ke bumi.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Siklus Karbon Bocor",
    question:
      "Secara alami, Bumi punya Siklus Karbon yang seimbang (dari nafas hewan ke pohon, dll). Terus kenapa polusi CO2 manusia yang 'cuma 4%' dari siklus alam bisa bikin pemanasan global separah ini?",
    options: [
      "Karena CO2 buatan manusia itu beracun",
      "Karena CO2 alamiah diserap balik oleh alam, sedangkan emisi manusia adalah karbon fosil (ekstra) yang ditambahkan tanpa ada alam yang cukup untuk menyerapnya",
      "Karena CO2 manusia suhunya lebih panas",
      "Karena ilmuwan salah hitung",
    ],
    answer:
      "Karena CO2 alamiah diserap balik oleh alam, sedangkan emisi manusia adalah karbon fosil (ekstra) yang ditambahkan tanpa ada alam yang cukup untuk menyerapnya",
    explanation:
      "Alam menyerap 100% dari apa yang dia hasilkan (siklus tertutup). Manusia menggali batubara (karbon yang udah terkubur jutaan tahun) lalu dibakar. Alam cuma bisa nyerap setengah dari 'sampah ekstra' ini, sisanya numpuk di udara.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Jebakan Air Laut Naik",
    question:
      "Bumi makin panas, level air laut di pesisir Jakarta dan dunia makin tinggi. Pertanyaan jebakan: Mencairnya es di bagian bumi mana yang PALING BIKIN air laut nambah tinggi?",
    options: [
      "Gunung Es (Iceberg) yang ngapung di lautan",
      "Lapisan Laut Es (Sea Ice) di Kutub Utara",
      "Lapisan Es di daratan benua (seperti Greenland dan Antartika)",
      "Semuanya sama aja bikin naik",
    ],
    answer: "Lapisan Es di daratan benua (seperti Greenland dan Antartika)",
    explanation:
      "Es yang NGAPUNG di laut (Sea Ice/Iceberg) kalau mencair NGGAK AKAN nambah tinggi air laut (Coba masukin es batu ke gelas penuh air, kalau cair airnya nggak tumpah - Hukum Archimedes). Yang bahaya itu es raksasa di ATAS DARATAN (Greenland/Antartika) yang cair dan airnya masuk ke laut.",
  },
  {
    category: "klimatologi",
    mode: "essay",
    topic: "Periode Hangat Viking",
    question:
      "Jauh sebelum Revolusi Industri, bumi pernah lumayan anget secara alami di sekitar tahun 900-1300 M, sampai bikin bangsa Viking bisa bercocok tanam di pulau Greenland. Periode anomali ini disebut Medieval ... Period.",
    answerKeywords: ["warm", "medieval warm period", "mwp"],
    explanation:
      "Medieval Warm Period (Periode Hangat Abad Pertengahan) adalah masa di mana suhu Eropa menghangat secara regional akibat tingginya aktivitas matahari dan minimnya letusan gunung berapi.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Godzilla El Nino",
    question:
      "Sejarah klimatologi mencatat 2 tahun kejadian El Nino terparah (Godzilla El Nino) yang bikin hutan Indonesia terbakar habis sampai asapnya nutupin negara tetangga. Tahun berapakah itu?",
    options: [
      "1990 dan 2000",
      "1997 dan 2015",
      "2004 dan 2010",
      "2020 dan 2022",
    ],
    answer: "1997 dan 2015",
    explanation:
      "Tahun 1997/1998 dan 2015/2016 adalah dua siklus El Nino terkuat dalam abad modern. Indeks suhu laut (SST) di Pasifik mencapai rekor tertinggi, mengakibatkan kekeringan fatal dan karhutla masif di Indonesia.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Gurun Malah Hijau",
    question:
      "Krisis iklim biasanya diidentikkan sama kekeringan parah (Desertifikasi). Tapi plot twist terjadi di Gurun Thar (India). Menurut riset terbaru, gurun ini malah berubah jadi hijau (Greening). Kok bisa?",
    options: [
      "Karena alien nyebar pupuk",
      "Perubahan iklim malah bikin curah hujan monsun di sana naik drastis sampai 64%, ditambah irigasi manusia",
      "Karena pemerintah India ngecat pasirnya jadi hijau",
      "Karena matahari di India makin redup",
    ],
    answer:
      "Perubahan iklim malah bikin curah hujan monsun di sana naik drastis sampai 64%, ditambah irigasi manusia",
    explanation:
      "Ini fakta unik perubahan iklim: nggak semua tempat jadi kering. Beberapa tempat kering kayak Gurun Thar malah dapet 'jackpot' limpahan hujan ekstrem yang bikin vegetasinya meledak hijau.",
  },
  {
    category: "klimatologi",
    mode: "guess",
    topic: "Gasing Kosmik",
    question:
      "Siklus Milankovitch ngebuktiin kalau iklim bumi itu berubah ngikutin orbit bumi. Nah, gerakan sumbu bumi yang muter goyang-goyang kayak gasing mau jatuh (siklus 26.000 tahun) ini dinamakan...",
    imageType: "precession_wobble",
    options: ["Eksentrisitas", "Obliquity", "Precession (Presesi)", "Aphelion"],
    answer: "Precession (Presesi)",
    explanation:
      "Presesi (Precession) adalah efek goyangan sumbu bumi akibat tarikan gravitasi matahari dan bulan. Efeknya, ribuan tahun lagi, bintang kutub utara kita bukan Polaris lagi, tapi bintang Vega!",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Skeptis vs Alarmist",
    question:
      "Laporan IPCC (PBB) bilang pemanasan global dekade ini 'Unprecedented' (belum pernah terjadi sebelumnya dalam 2.000 tahun). Kelompok Skeptis biasanya ngebantah pernyataan ini dengan bawa-bawa bukti zaman sejarah, yaitu...",
    options: [
      "Zaman Dinosaurus",
      "Medieval Warm Period (Periode Hangat Abad Pertengahan di mana Viking bisa bertani di Greenland)",
      "Zaman Es Pleistosen",
      "Perang Dunia II",
    ],
    answer:
      "Medieval Warm Period (Periode Hangat Abad Pertengahan di mana Viking bisa bertani di Greenland)",
    explanation:
      "Kelompok skeptis iklim sering pakai data Medieval Warm Period (900-1300 M) buat ngebuktin kalau bumi pernah hangat secara alami tanpa perlu ada asap pabrik/mobil dari manusia.",
  },
  {
    category: "klimatologi",
    mode: "essay",
    topic: "Karang Bisa Belajar?",
    question:
      "Studi Halide & Ridd (2001) pakai Fuzzy Logic buat nebak kapan terumbu karang bakal memutih (bleaching). Jebakannya: karang ternyata lebih kuat nahan panas kalau tahun sebelumnya suhu laut juga sempet naik (mereka udah latian panas). Proses adaptasi fisiologis ini disebut...",
    answerKeywords: ["aklimatisasi", "acclimatization", "adaptasi"],
    explanation:
      "Aklimatisasi adalah penyesuaian tubuh organisme terhadap lingkungan baru. Model Fuzzy Logic terbukti akurat karena memasukkan 'selisih suhu tahun lalu' sebagai bukti kalau karang punya memori ketahanan panas.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Mood vs Kepribadian",
    question:
      "Biar gampang bedain Cuaca sama Iklim, anak Gen Z punya analogi yang valid banget. Kalau Cuaca itu ibarat 'Mood' lu hari ini, maka Iklim itu ibarat apanya?",
    options: [
      "Outfit lu",
      "Kepribadian lu (Personality)",
      "Zodiak lu",
      "Mantan lu",
    ],
    answer: "Kepribadian lu (Personality)",
    explanation:
      "Cuaca itu bisa berubah tiap jam (mood swing). Kalau Iklim itu rata-rata cuaca jangka panjang minimal 30 tahun (kepribadian asli yang udah mendarah daging).",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Sumbangan Siapa?",
    question:
      "Kelompok Skeptis nyebut kalau emisi CO2 dari aktivitas manusia (pabrik/mobil) itu jumlahnya KECIL BANGET dibanding siklus CO2 alami dari lautan dan tanah. Berapa sih sumbangan CO2 manusia tiap tahunnya?",
    options: ["Sekitar 90%", "Sekitar 50%", "Sekitar 4%", "Sekitar 0.001%"],
    answer: "Sekitar 4%",
    explanation:
      "Manusia cuma nyumbang ~4-5% (sekitar 30-40 Gigaton) karbon tiap tahun. Tapi! Siklus alami itu seimbang (yang dilepas alam, diserap lagi sama alam). Tambahan 4% dari manusia ini adalah 'sampah ekstra' yang nggak bisa keserap alam, makanya numpuk terus.",
  },
  {
    category: "klimatologi",
    mode: "guess",
    topic: "Arus Tol Samudra",
    question:
      "Ada sistem arus laut raksasa keliling dunia yang digerakin sama perbedaan suhu dan kadar garam. Kalau es kutub mencair, air tawar yang masuk bisa bikin arus ini macet dan bikin bumi kedinginan ekstrem! Arus ini disebut...",
    imageType: "thermohaline_belt",
    options: [
      "Gulf Stream",
      "Sirkulasi Thermohaline (Global Conveyor Belt)",
      "Arlindo",
      "El Nino",
    ],
    answer: "Sirkulasi Thermohaline (Global Conveyor Belt)",
    explanation:
      "Thermohaline circulation digerakkan oleh air dingin dan asin yang berat dan tenggelam di kutub utara. Kalau es kutub cair dan airnya jadi tawar (kurang berat), sabuk arus ini bisa berhenti berputar (skenario film The Day After Tomorrow).",
  },
  {
    category: "klimatologi",
    mode: "essay",
    topic: "Skor Minus",
    question:
      "BMKG sering ngukur nilai SOI (Southern Oscillation Index) buat nebak iklim. Kalau angka SOI-nya minus kuat secara terus-menerus (negatif), berarti Indonesia harus siap-siap kekeringan karena lagi terjadi fenomena...",
    answerKeywords: ["el nino", "elnino"],
    explanation:
      "SOI dihitung dari selisih tekanan udara Tahiti dan Darwin. SOI negatif berarti tekanan di Pasifik Timur lebih rendah, angin pasat melemah, dan air hangat lari menjauh dari Indonesia (El Nino).",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "London Rasa Kutub",
    question:
      "Tahun 1600-an, Eropa pernah ngalamin masa super dingin sampai Sungai Thames di London membeku dan orang-orang bisa main ice skating di atasnya. Periode kedinginan ini disebut...",
    options: [
      "Zaman Es Pleistosen",
      "Medieval Warm Period",
      "Little Ice Age (Zaman Es Kecil)",
      "Holocene Optimum",
    ],
    answer: "Little Ice Age (Zaman Es Kecil)",
    explanation:
      "Little Ice Age (sekitar abad ke-14 sampai ke-19) dipicu oleh kombinasi aktivitas matahari yang sangat rendah (Maunder Minimum) dan letusan gunung berapi berturut-turut.",
  },
  {
    category: "klimatologi",
    mode: "guess",
    topic: "Serangan Balik Air",
    question:
      "La Niña sering dipuja-puja karena bawa hujan subur. TAPI kalau La Niña-nya terlalu kuat dan numpuk air hangat berlebihan di wilayah Indonesia, ancaman bencana apa yang paling ngeri buat warga di bantaran sungai?",
    imageType: "lanina_flood",
    options: [
      "Tsunami",
      "Banjir Bandang & Tanah Longsor",
      "Sinkhole",
      "Badai Debu",
    ],
    answer: "Banjir Bandang & Tanah Longsor",
    explanation:
      "La Nina menambah curah hujan ekstrem di wilayah maritim benua (Indonesia & Australia). Tanah yang kelebihan kapasitas air (saturasi tinggi) bakal sangat rentan longsor dan memicu banjir bandang di musim hujan.",
  },
  {
    category: "klimatologi",
    mode: "essay",
    topic: "Kiamat Karang",
    question:
      "Suhu muka laut naik 1 derajat aja, hewan terumbu karang langsung stres dan buang alga (zooxanthellae) yang ngasih mereka warna dan makanan. Tulang karang yang memutih ini disebut...",
    answerKeywords: ["bleaching", "coral bleaching", "pemutihan karang"],
    explanation:
      "Coral bleaching adalah peringatan keras (canary in the coal mine) dari perubahan iklim. Tanpa alga, karang masih hidup tapi kelaparan, dan jika suhu tidak turun, seluruh ekosistem karang akan mati kelaparan.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Prediksi Ngaco",
    question:
      "Kenapa kelompok skeptis sering ngeremehin Global Climate Models (GCM) yang dipakai PBB buat memprediksi suhu bumi 100 tahun ke depan?",
    options: [
      "Karena komputernya murah",
      "Karena modelnya punya banyak ketidakpastian dalam mensimulasikan efek awan dan terlalu melebih-lebihkan sensitivitas iklim terhadap CO2",
      "Karena datanya diambil dari planet Mars",
      "Karena modelnya cuma jalan di Windows XP",
    ],
    answer:
      "Karena modelnya punya banyak ketidakpastian dalam mensimulasikan efek awan dan terlalu melebih-lebihkan sensitivitas iklim terhadap CO2",
    explanation:
      "Skeptis berargumen bahwa model komputasi gagal memasukkan siklus alamiah dan efek 'pendinginan' dari awan dengan akurat, sehingga hasil proyeksi suhunya selalu over-estimasi (terlalu panas) dibanding data observasi nyata.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Jebakan Tipe Iklim",
    question:
      "Di klasifikasi Schmidt-Ferguson, Indonesia paling banyak punya tipe iklim A. Tipe iklim A ini artinya apa?",
    options: ["Sangat Kering", "Gurun Pasir", "Sangat Basah", "Iklim Salju"],
    answer: "Sangat Basah",
    explanation:
      "Rumus Q Schmidt-Ferguson (Bulan Kering / Bulan Basah x 100%). Kalau nilai Q antara 0 - 14,3%, artinya curah hujannya sangat dominan basah, yang masuk ke dalam Kategori A (Sangat Basah).",
  },
  {
    category: "klimatologi",
    mode: "guess",
    topic: "Sinar Putih Pantulan",
    question:
      "Liat es di kutub utara itu putih cerah? Warna putih ini berfungsi sebagai 'tameng' alami bumi buat memantulkan balik radiasi panas matahari ke luar angkasa. Daya pantul ini disebut...",
    imageType: "albedo_effect",
    options: ["Radiasi Benda Hitam", "Albedo", "Efek Rumah Kaca", "Absorpsi"],
    answer: "Albedo",
    explanation:
      "Nilai albedo es mencapai 80-90% (memantulkan nyaris semua panas). Sedangkan lautan terbuka nilai albedonya kecil banget (banyak menyerap panas). Kalau es hilang, bumi makin cepat panas.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Pesisir Mati Gaya",
    question:
      "Paper Feldman (2025) neliti terumbu karang di Laut Merah zaman Holocene akhir. Berlawanan dari ketakutan orang zaman sekarang (di mana air laut lagi pada naik), ekosistem karang purba ini mati justru karena...",
    options: [
      "Air laut keracunan plastik",
      "Air laut membeku total",
      "Penurunan muka air laut (Sea-Level Fall)",
      "Air laut menguap habis",
    ],
    answer: "Penurunan muka air laut (Sea-Level Fall)",
    explanation:
      "Penelitian paleoklimatologi menunjukkan karang bisa 'turn-off' (berhenti tumbuh/mati) karena level air laut tiba-tiba surut, membuat terumbu karang terekspos ke udara terbuka dan kekeringan.",
  },
  {
    category: "klimatologi",
    mode: "essay",
    topic: "Catatan Sejarah dari Karang",
    question:
      "Kalau pohon punya cincin kayu (Tree Rings) buat nyimpen data iklim purba, hewan laut ini juga nyimpen garis pertumbuhan di tulang kapurnya yang bisa dibor oleh klimatolog buat ngecek suhu laut ratusan tahun lalu. Hewan apa ini?",
    answerKeywords: ["karang", "koral", "terumbu karang", "coral"],
    explanation:
      "Isotop oksigen (O18/O16) yang terperangkap dalam kerangka kalsium karbonat pada terumbu karang adalah proksi (catatan) yang sangat akurat untuk merekonstruksi Suhu Muka Laut (SST) di masa lalu.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Tsunami Es Bawah Tanah",
    question:
      "Daerah dingin di kutub punya lapisan tanah yang selalu beku (Permafrost). Bencana kiamat iklim apa yang tersembunyi kalau tanah beku ini mencair?",
    options: [
      "Virus zombie bakal bangkit",
      "Bakal ngelepasin miliaran ton gas Metana dan Karbon purba yang mempercepat pemanasan global berkali-kali lipat",
      "Bumi bakal terbelah",
      "Air laut bakal berubah jadi es",
    ],
    answer:
      "Bakal ngelepasin miliaran ton gas Metana dan Karbon purba yang mempercepat pemanasan global berkali-kali lipat",
    explanation:
      "Permafrost menyimpan sisa-sisa tumbuhan dan hewan purba. Begitu esnya cair, materi organik ini membusuk masal dan ngelepasin Metana (CH4), gas yang efek rumah kacanya puluhan kali lebih ganas dari CO2.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Beban Industri",
    question:
      "Batas 1.5°C di Paris Agreement itu diukur dari suhu 'Pre-Industrial' (Pra-Industri). Kapan sih tepatnya tahun yang dijadikan patokan Pra-Industri ini?",
    options: [
      "Tahun 2000-an (Masa internet)",
      "Sekitar tahun 1850-1900 (Sebelum revolusi mesin uap dan batubara masif)",
      "Tahun 1 Masehi (Zaman purba)",
      "Tahun 1990-an (Sebelum mobil listrik ada)",
    ],
    answer:
      "Sekitar tahun 1850-1900 (Sebelum revolusi mesin uap dan batubara masif)",
    explanation:
      "Tahun 1850-1900 digunakan oleh IPCC sebagai basis pengukuran karena sebelum periode tersebut, campur tangan manusia dalam memompa CO2 sisa pembakaran fosil ke atmosfer belum terjadi secara masif.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "El Nino Bikin Gerah",
    question:
      "Tahun 2023 dinobatkan sebagai tahun TERPANAS dalam sejarah pengamatan bumi. Selain karena pemanasan global tren panjang, rekor ini ditembus karena kebetulan dibantu oleh fase...",
    options: [
      "La Nina Kuat",
      "El Nino Kuat",
      "Muson Barat Ekstrem",
      "Gerhana Matahari Total",
    ],
    answer: "El Nino Kuat",
    explanation:
      "Fase El Nino menahan panas di permukaan Samudra Pasifik tropis, yang uap panasnya menyebar ke atmosfer global, mendongkrak suhu rata-rata dunia mencapai rekor tertinggi di atas batas normal tren pemanasan.",
  },
  {
    category: "klimatologi",
    mode: "mcq",
    topic: "Jebakan Monsun Model",
    question:
      "Paper Choudhury (2025) nge-review model iklim CMIP6. Meskipun udah pakai komputer super canggih, model iklim ini masih sering ERROR/Bias kalau disuruh mensimulasikan curah hujan monsun di wilayah mana?",
    options: [
      "Eropa Barat",
      "Indian Summer Monsoon Rainfall (ISMR) / Monsun India",
      "Gurun Sahara",
      "Kutub Utara",
    ],
    answer: "Indian Summer Monsoon Rainfall (ISMR) / Monsun India",
    explanation:
      "Model iklim canggih masih sering kesulitan (bias) memprediksi monsun tropis seperti India (ISMR) karena interaksi ruwet antara atmosfer, laut (SST), dan pergerakan persimpangan angin ekuator (ITCZ) yang susah disimulasikan.",
  },

  // 5. INSTRUMEN
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Matahari",
    question: "Alat ukur lama penyinaran matahari adalah...",
    options: ["Campbell Stokes", "Anemometer", "Higrometer", "Barometer"],
    answer: "Campbell Stokes",
    explanation: "Memanfaatkan bola kaca kristal untuk membakar kertas pias.",
  },
  {
    category: "instrumen",
    mode: "guess",
    topic: "Suhu",
    question: "Alat standar pengukur suhu udara lingkungan di BMKG adalah...",
    imageType: "thermometer",
    options: ["Higrometer", "Termometer", "Barometer", "Ombrometer"],
    answer: "Termometer",
    explanation:
      "Termometer raksa atau alkohol diletakkan dalam Sangkar Stevenson.",
  },
  {
    category: "instrumen",
    mode: "essay",
    topic: "Kelembapan",
    question: "Alat pengukur kelembapan udara relatif dinamakan...",
    answerKeywords: ["higrometer", "hygrometer"],
    explanation: "Higrometer mengukur saturasi uap air di udara.",
  },
  {
    category: "instrumen",
    mode: "essay",
    topic: "Angin",
    question: "Alat pengukur kecepatan angin dinamakan...",
    answerKeywords: ["anemometer"],
    explanation: "Anemometer mangkuk adalah yang paling umum di stasiun cuaca.",
  },
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Tekanan Udara",
    question:
      "Alat pengukur tekanan atmosfer yang menggunakan logam lentur hampa udara (tanpa cairan raksa) dan akan mengembang/mengempis sesuai perubahan tekanan disebut...",
    options: [
      "Barometer Raksa",
      "Barometer Aneroid",
      "Altimeter",
      "Psikrometer",
    ],
    answer: "Barometer Aneroid",
    explanation:
      "Barometer aneroid menggunakan kapsul logam tipis (sel aneroid) yang bereaksi terhadap perubahan tekanan udara eksternal tanpa memerlukan cairan berbahaya seperti raksa.",
  },
  {
    category: "instrumen",
    mode: "guess",
    topic: "Suhu Lingkungan",
    question:
      "Alat ini berisi raksa atau alkohol dan diletakkan di dalam tempat teduh berventilasi untuk mengukur suhu udara aktual tanpa paparan radiasi matahari langsung...",
    imageType: "thermometer",
    options: ["Barometer", "Termometer", "Higrometer", "Radiosonde"],
    answer: "Termometer",
    explanation:
      "Termometer standar BMKG harus ditempatkan di dalam Sangkar Stevenson agar pembacaannya benar-benar merepresentasikan suhu udara, bukan panas dari paparan langsung matahari.",
  },
  {
    category: "instrumen",
    mode: "essay",
    topic: "Kecepatan Angin",
    question:
      "Instrumen stasiun cuaca permukaan yang memiliki tiga atau empat mangkuk (cups) yang berputar untuk mengukur kecepatan aliran angin dinamakan...",
    answerKeywords: ["anemometer", "cup anemometer"],
    explanation:
      "Anemometer mangkuk menghitung kecepatan rotasi yang secara proporsional dikonversi menjadi satuan kecepatan angin (knot, km/jam, atau m/s).",
  },
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Radiasi Matahari",
    question:
      "Perekam lama penyinaran matahari Campbell-Stokes menggunakan sebuah instrumen utama yang berfungsi memfokuskan sinar matahari untuk membakar kertas pias. Instrumen tersebut berbentuk...",
    options: [
      "Cermin Cembung",
      "Cermin Cekung",
      "Bola Kaca Pejal (Lensa)",
      "Panel Surya",
    ],
    answer: "Bola Kaca Pejal (Lensa)",
    explanation:
      "Campbell-Stokes menggunakan bola kristal tembus pandang yang bertindak sebagai lensa pembesar. Saat matahari bersinar terang, cahayanya terfokus dan membakar jejak di atas kertas pias harian.",
  },
  {
    category: "instrumen",
    mode: "essay",
    topic: "Kelembapan",
    question:
      "Instrumen pengukur kelembapan relatif (RH) yang prinsip kerjanya membandingkan selisih suhu antara termometer bola kering dan termometer bola basah dinamakan...",
    answerKeywords: ["psikrometer", "psychrometer", "higrometer", "hygrometer"],
    explanation:
      "Semakin kering udara, semakin cepat air menguap dari kain termometer bola basah, sehingga selisih suhu dengan bola kering semakin besar. Ini jadi dasar perhitungan RH.",
  },
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Udara Atas",
    question:
      "Untuk mengetahui profil suhu, kelembapan, dan angin di berbagai lapisan atmosfer atas secara *real-time*, BMKG menerbangkan balon gas yang mengikat instrumen canggih bernama...",
    options: ["Satelit LEO", "Radiosonde", "Ceilometer", "Radar Cuaca"],
    answer: "Radiosonde",
    explanation:
      "Radiosonde adalah paket instrumen mini bertenaga baterai yang diikat ke balon hidrogen/helium. Alat ini memancarkan data meteorologi vertikal via radio ke stasiun bumi.",
  },
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Curah Hujan",
    question:
      "Dalam jaringan *Automatic Weather Station* (AWS), sensor curah hujan umumnya bekerja dengan sistem mangkuk kecil yang akan menjungkit ke bawah secara otomatis saat terisi volume air tertentu (misal 0.5 mm). Tipe ini disebut...",
    options: [
      "Ombrometer Observatorium",
      "Tipping Bucket",
      "Hellmann",
      "Evaporimeter Panci",
    ],
    answer: "Tipping Bucket",
    explanation:
      "Penakar hujan Tipping Bucket menghasilkan sinyal listrik (pulsa) setiap kali mangkuknya menjungkit. Setiap pulsa dikonversi langsung menjadi data milimeter curah hujan digital.",
  },
  {
    category: "instrumen",
    mode: "guess",
    topic: "Arah Angin",
    question:
      "Instrumen mekanis ini didesain aerodinamis (sering berbentuk panah atau ekor burung) yang akan bergerak bebas memutar mengikuti asal datangnya aliran angin. Instrumen ini dinamakan...",
    imageType: "wind_vane",
    options: [
      "Anemometer",
      "Altimeter",
      "Wind Vane (Penunjuk Arah)",
      "Aktinograf",
    ],
    answer: "Wind Vane (Penunjuk Arah)",
    explanation:
      "Wind vane (baling-baling angin) selalu menunjuk ke arah DARI MANA angin bertiup. Jika menunjuk ke arah Utara, artinya itu adalah Angin Utara (mengalir dari Utara ke Selatan).",
  },
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Fasilitas Pengamatan",
    question:
      "Kotak kayu berwarna putih dengan kisi-kisi atau jalusi (bukan dinding padat) yang berfungsi menempatkan alat meteorologi (seperti termometer) agar ada sirkulasi udara namun tidak terkena hujan disebut...",
    options: [
      "Sangkar Meteorologi (Stevenson)",
      "AWS Box",
      "Penakar Hujan",
      "Actinograph Shield",
    ],
    answer: "Sangkar Meteorologi (Stevenson)",
    explanation:
      "Sangkar Stevenson didesain berwarna putih (memantulkan radiasi) dan berjalusi ganda agar udara mengalir bebas, sehingga alat di dalamnya mengukur kondisi udara murni.",
  },
  {
    category: "instrumen",
    mode: "essay",
    topic: "Otomatisasi",
    question:
      "Sistem pengamatan cuaca terpadu di era modern yang menggabungkan berbagai sensor cuaca, datalogger, dan pemancar komunikasi secara otomatis disingkat dengan 3 huruf, yaitu...",
    answerKeywords: ["aws"],
    explanation:
      "AWS (Automatic Weather Station) menekan human-error dan mampu merekam serta mengirimkan data setiap menit, sangat krusial untuk peringatan dini cuaca ekstrem.",
  },
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Jebakan Sangkar",
    question:
      "Semua stasiun cuaca punya Sangkar Stevenson (kotak kayu) buat nyimpen termometer. Jebakannya: Kenapa kotaknya HARUS dicat putih dan dindingnya bolong-bolong berjalusi?",
    options: [
      "Biar estetik dan gampang keliatan dari jauh",
      "Warna putih nyerap panas matahari, jalusi biar air hujan gampang keluar",
      "Warna putih mantulin radiasi matahari (biar termometer gak overheat), jalusi ngasih sirkulasi udara biar suhu yang diukur bener-bener suhu udara alami",
      "Biar nggak jadi sarang burung",
    ],
    answer:
      "Warna putih mantulin radiasi matahari (biar termometer gak overheat), jalusi ngasih sirkulasi udara biar suhu yang diukur bener-bener suhu udara alami",
    explanation:
      "Tujuan utama sangkar ini adalah ngelindungin sensor dari radiasi 'langsung' matahari. Kalau termometer dijemur langsung, yang keukur adalah suhu kaca termometernya yang kepanasan, bukan suhu udaranya.",
  },
  {
    category: "instrumen",
    mode: "guess",
    topic: "Jungkat-Jungkit Air",
    question:
      "Alat pengukur curah hujan otomatis di AWS ini kerjanya kayak jungkat-jungkit mini. Kalau satu mangkuknya penuh air (misal 0.5 mm), dia bakal ngejungkit dan ngirim sinyal listrik. Nama sensornya adalah...",
    imageType: "tipping_bucket_rain_gauge",
    options: [
      "Hellmann Gauge",
      "Tipping Bucket",
      "Ombrometer Observatorium",
      "Radar Rain",
    ],
    answer: "Tipping Bucket",
    explanation:
      "Tipping Bucket sangat populer di Automatic Weather Station (AWS) karena setiap jungkitan (tip) otomatis dikonversi jadi data digital tanpa perlu ada petugas yang nakar airnya manual pakai gelas ukur.",
  },
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Data Monster",
    question:
      "Data satelit dan model cuaca global itu sizenya gila-gilaan karena isinya format array multidimensi (bujur, lintang, waktu, ketinggian). Anak kebumian / programmer cuaca pasti hafal, ekstensi file standar buat data ini apa?",
    options: [
      ".csv (Comma Separated Values)",
      ".shp (Shapefile)",
      ".nc (NetCDF) / .grib",
      ".dwg (AutoCAD)",
    ],
    answer: ".nc (NetCDF) / .grib",
    explanation:
      "NetCDF (Network Common Data Form) dan GRIB (GRIdded Binary) adalah format de facto untuk menyimpan data iklim multidimensi. Ngolah data ini biasanya wajib jago Python (library xarray) atau MATLAB.",
  },
  {
    category: "instrumen",
    mode: "essay",
    topic: "Gosong Kena Kaca",
    question:
      "Alat perekam durasi sinar matahari ini (Campbell-Stokes) pakai bola kaca pejal raksasa yang berfungsi kayak kaca pembesar. Kertas khusus yang dibakar sama bola kaca ini namanya kertas...",
    answerKeywords: ["pias"],
    explanation:
      "Kertas pias dipasang di bawah bola kaca. Kalau matahari bersinar terang, cahayanya terfokus dan membakar kertas tersebut. Panjang garis gosong di kertas itu yang diukur jadi durasi penyinaran (dalam jam).",
  },
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Jebakan Satelit Malam",
    question:
      "Pas malam hari (matahari udah tenggelam), lu buka web BMKG pengen liat citra satelit awan di atas rumah lu. Citra satelit mode apakah yang BISA dipakai buat ngeliat awan pas malam gelap gulita?",
    options: [
      "Citra Satelit Visible (Tampak)",
      "Citra Satelit Inframerah (Infrared / IR)",
      "Kamera DSLR resolusi tinggi",
      "Satelit nggak bisa motret kalau malam",
    ],
    answer: "Citra Satelit Inframerah (Infrared / IR)",
    explanation:
      "Citra Visible butuh cahaya pantulan matahari (kayak mata manusia), jadi malam hari layarnya item pekat. Citra Inframerah (IR) ngukur suhu awan. Suhu panas/dingin tetep mancarin inframerah walaupun gelap gulita.",
  },
  {
    category: "instrumen",
    mode: "guess",
    topic: "Tumbal Troposfer",
    question:
      "Ini adalah instrumen pengorbanan. Balon udara ini diisi hidrogen, diikat ke sensor mini, diterbangin tinggi banget buat ngukur profil suhu/angin vertikal sampai stratosfer, terus balonnya pecah dan alatnya jatuh. Namanya...",
    imageType: "radiosonde_balloon",
    options: [
      "Weather Drone",
      "Radiosonde",
      "Pilot Balloon (Pibal)",
      "Ceilometer",
    ],
    answer: "Radiosonde",
    explanation:
      "Radiosonde memancarkan data (suhu, RH, tekanan) via telemetri radio detik demi detik saat naik. Pas nyampe ketinggian 30km+, balon memuai karena tekanan rendah dan meledak. Alatnya jatuh pakai parasut kecil.",
  },
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Bunga Angin",
    question:
      "Lu disuruh bos ngolah data arah dan kecepatan angin selama 10 tahun buat nentuin hadap landasan pacu bandara baru. Grafik data cuaca yang bentuknya kayak target dart melingkar ini disebut...",
    options: ["Bar Chart", "Scatter Plot", "Wind Rose", "Hydrograph"],
    answer: "Wind Rose",
    explanation:
      "Wind Rose (Mawar Angin) adalah visualisasi pengolahan data yang sangat intuitif. Kelopak yang paling panjang dan tebal nunjukin dari arah mana angin paling sering dan paling kencang bertiup.",
  },
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Tebak Tebakan Spasial",
    question:
      "Di Provinsi A cuma ada 3 stasiun BMKG. Lu disuruh bikin peta curah hujan full se-provinsi. Algoritma pengolahan data spasial (GIS) yang dipakai buat nebak nilai di daerah kosong berdasarkan titik stasiun terdekat disebut...",
    options: [
      "Digitasi",
      "Interpolasi (contoh: IDW, Kriging)",
      "Reclassify",
      "Buffering",
    ],
    answer: "Interpolasi (contoh: IDW, Kriging)",
    explanation:
      "Interpolasi Spasial (seperti Inverse Distance Weighted atau Kriging) menghitung estimasi nilai piksel yang kosong berdasarkan bobot jarak dan variansi spasial dari stasiun observasi nyata di sekitarnya.",
  },
  {
    category: "instrumen",
    mode: "essay",
    topic: "Selimut Kain Basah",
    question:
      "Di dalam sangkar meteorologi, ada dua termometer berdiri sebelahan. Satu biasa, satunya lagi pentol air raksanya dibungkus kain muslin basah yang dicelup ke wadah air. Termometer yang basah ini fungsinya buat ngukur...",
    answerKeywords: [
      "kelembapan",
      "kelembaban",
      "rh",
      "relative humidity",
      "kelembapan relatif",
    ],
    explanation:
      "Itu adalah Psychrometer. Semakin kering udara, air di kain basah makin cepat menguap, sehingga suhu di termometer bola basah bakal drop (lebih dingin dari termometer kering). Selisih suhunya dicari di tabel buat dapet nilai Kelembapan Relatif (RH).",
  },
  {
    category: "instrumen",
    mode: "guess",
    topic: "Panci Haus",
    question:
      "Alat ini super low-tech: Panci besi raksasa kelas A diisi air, ditaruh di lapangan, terus diukur tiap hari airnya berkurang berapa milimeter. Fungsinya jelas buat ngukur...",
    imageType: "evaporation_pan",
    options: [
      "Curah Hujan",
      "Evaporasi (Penguapan)",
      "Infiltrasi",
      "Tingkat Embun",
    ],
    answer: "Evaporasi (Penguapan)",
    explanation:
      "Evaporation Pan Class A mengukur jumlah air yang menguap dari permukaan bebas (open water). Dikasih kawat di atasnya biar airnya nggak diminum burung atau anjing liar, karena bisa bikin datanya kacau.",
  },
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Radar Nipu",
    question:
      "Jebakan Fisika Radar: Pas lu liat layar radar cuaca, warna merah/ungu itu BUKAN berarti awannya lagi panas atau suhunya tinggi. Terus warna merah di radar itu sbenarnya nampilin data apa?",
    options: [
      "Data kecepatan awan",
      "Data gas metana di udara",
      "Data Reflektivitas (pantulan gelombang mikro yang balik ke radar), makin gede air/esnya, pantulannya makin kuat (merah/ungu)",
      "Data kilat dan petir",
    ],
    answer:
      "Data Reflektivitas (pantulan gelombang mikro yang balik ke radar), makin gede air/esnya, pantulannya makin kuat (merah/ungu)",
    explanation:
      "Radar cuaca (Doppler) nembakin gelombang microwave. Kalau gelombangnya nabrak butiran hujan gede atau bongkahan es batu (hail), mantulnya kuat banget (Z > 50 dBZ). Layar bakal warnain pantulan kuat itu dengan warna merah/ungu pekat.",
  },
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Uap Tak Kasat Mata",
    question:
      "Ada satu channel satelit cuaca yang namanya 'Water Vapor'. Uniknya, satelit ini bisa ngeliat pola sirkulasi uap air di awang-awang meskipun di daerah situ lagi cerah nggak ada awan sama sekali. Kok bisa?",
    options: [
      "Karena satelitnya pake teknologi X-Ray",
      "Satelit ngerekam panjang gelombang spesifik (6.2 - 7.3 µm) yang memang diserap dan dipancarin sama molekul uap air di lapisan troposfer atas",
      "Karena uap air di langit memantulkan cahaya matahari",
      "Satelitnya nebak-nebak doang pakai AI",
    ],
    answer:
      "Satelit ngerekam panjang gelombang spesifik (6.2 - 7.3 µm) yang memang diserap dan dipancarin sama molekul uap air di lapisan troposfer atas",
    explanation:
      "Channel Water Vapor (WV) sangat krusial buat ahli cuaca ngeliat Jet Stream dan aliran sungai atmosfer (Atmospheric River), karena kamera ini melihat gas uap air menengah-atas yang invisible di mata manusia.",
  },
  {
    category: "instrumen",
    mode: "essay",
    topic: "Filter Data Sampah",
    question:
      "Dalam pengolahan data, data mentah dari sensor nggak boleh langsung dipakai karena kadang sensornya rusak atau kemasukan serangga. Proses pembersihan data dari anomali/error ini disingkat dengan dua huruf, yaitu Q...",
    answerKeywords: ["qc", "quality control"],
    explanation:
      "Quality Control (QC) sangat penting. Contoh: suhu tercatat 80 derajat Celcius di Indonesia pasti error. Data anomali kayak gini bakal dibuang atau dikoreksi lewat proses QC sebelum masuk database nasional.",
  },
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Perkawinan Data",
    question:
      "Prediksi cuaca modern (NWP) itu super canggih karena pake metode 'Data Assimilation' (Asimilasi Data). Inti dari kerjaan asimilasi data ini ngapain sih?",
    options: [
      "Ngedit data cuaca di Photoshop",
      "Menggabungkan data observasi aktual (radar, satelit, stasiun) ke dalam model komputer buat ngoreksi titik awal simulasi cuaca (Initial Condition)",
      "Nghapus data cuaca masa lalu",
      "Menerjemahkan data cuaca ke bahasa asing",
    ],
    answer:
      "Menggabungkan data observasi aktual (radar, satelit, stasiun) ke dalam model komputer buat ngoreksi titik awal simulasi cuaca (Initial Condition)",
    explanation:
      "Model cuaca matematika butuh titik awal (start) yang akurat. Asimilasi data adalah seni matematika (seperti Kalman Filter) untuk 'menyuapkan' data observasi real-time ke dalam superkomputer agar tebakan prediksinya nggak melenceng.",
  },
  {
    category: "instrumen",
    mode: "guess",
    topic: "Mangkuk Muter",
    question:
      "Alat ini dipasang di tiang paling tinggi di stasiun cuaca. Bentuknya ada tiga mangkuk yang muter-muter tertiup angin. Makin kenceng anginnya, makin kebut putarannya. Nama alat sensor kecepatan angin ini adalah...",
    imageType: "anemometer_cups",
    options: ["Wind Vane", "Anemometer", "Barometer", "Hygrothermograph"],
    answer: "Anemometer",
    explanation:
      "Cup Anemometer berputar horizontal. Putaran as rodanya menghasilkan sinyal magnetik/listrik yang kemudian dikonversi oleh datalogger menjadi informasi kecepatan angin dalam satuan m/s atau knot.",
  },
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Robot Cuaca",
    question:
      "Gara-gara orang BMKG nggak bisa non-stop nongkrong di pelosok 24/7, dibikinlah jaringan stasiun cuaca robotik pakai solar panel yang ngirim data per menit lewat jaringan satelit. Singkatan dari stasiun ini adalah...",
    options: ["UAV", "AWS", "GIS", "GPS"],
    answer: "AWS",
    explanation:
      "Automatic Weather Station (AWS) menggabungkan sensor cuaca elektronik, datalogger untuk memproses, dan modul komunikasi (GSM/Satelit) untuk mengirimkan data ke server pusat tanpa campur tangan manusia.",
  },
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Jebakan Tekanan",
    question:
      "Stasiun cuaca di puncak Gunung Bromo ngirim data tekanan udara: 750 hPa. Di Jakarta, tekanannya 1010 hPa. Ahli cuaca harus mengolah data Bromo ini (dikoreksi) sebelum dimasukin ke peta cuaca nasional. Kenapa?",
    options: [
      "Karena sensor Bromo rusak kedinginan",
      "Karena semua data tekanan udara harus dikonversi seolah-olah stasiunnya ada di ketinggian permukaan laut (MSL) biar bisa dibandingin setara",
      "Karena tekanan di gunung memang lebih berat",
      "Biar warga Jakarta nggak panik",
    ],
    answer:
      "Karena semua data tekanan udara harus dikonversi seolah-olah stasiunnya ada di ketinggian permukaan laut (MSL) biar bisa dibandingin setara",
    explanation:
      "Tekanan udara PASTI turun seiring ketinggian. Kalau nggak dikoreksi ke MSL (Mean Sea Level), di peta cuaca seolah-olah Bromo itu pusat badai bertekanan super rendah terus-menerus. Ini penyeragaman standar WMO.",
  },
  {
    category: "instrumen",
    mode: "essay",
    topic: "Neunggar Angin",
    question:
      "Zaman sebelum ada anemometer, pelaut nebak kecepatan angin pakai mata doang (liat seberapa tinggi ombak laut atau seberapa parah pohon bergoyang di darat). Skala visual jadul namun ikonik ini dinamakan Skala...",
    answerKeywords: ["beaufort", "skala beaufort"],
    explanation:
      "Skala Beaufort (dari 0 tenang sampai 12 badai hurricane) diciptakan oleh Sir Francis Beaufort. Sangat praktis buat estimasi empiris tanpa pakai sensor elektronik di lapangan.",
  },
  {
    category: "instrumen",
    mode: "mcq",
    topic: "Posisi Satelit",
    question:
      "Satelit cuaca canggih kayak Himawari (Jepang) itu ngirim gambar full bumi setiap 10 menit dari sudut yang persis SAMA terus di atas ekuator. Kenapa dia bisa 'nongkrong diam' gitu di angkasa?",
    options: [
      "Satelitnya dikasih jangkar",
      "Satelit itu ditempatkan di orbit Geostasioner (ketinggian ~35.800 km) di mana kecepatan muternya sama persis kayak kecepatan rotasi bumi",
      "Satelitnya diparkir di atas awan",
      "Satelitnya sebenarnya jatuh perlahan",
    ],
    answer:
      "Satelit itu ditempatkan di orbit Geostasioner (ketinggian ~35.800 km) di mana kecepatan muternya sama persis kayak kecepatan rotasi bumi",
    explanation:
      "Orbit Geostasioner (Geostationary) bikin satelit seolah-olah diem aja di satu titik relatif terhadap permukaan bumi, sangat ideal buat ngerekam time-lapse pergerakan badai di satu belahan bumi yang sama.",
  },
  {
    category: "instrumen",
    mode: "guess",
    topic: "Tembakan Laser",
    question:
      "Bukan radar gelombang radio, alat canggih ini nembakin sinar LASER ke angkasa buat ngukur konsentrasi polusi (aerosol), sebaran debu vulkanik, atau bahkan profil kecepatan angin. Alat optik ini dinamakan...",
    imageType: "lidar_laser",
    options: ["SODAR", "LIDAR", "RADAR Doppler", "Ceilometer"],
    answer: "LIDAR",
    explanation:
      "LIDAR (Light Detection and Ranging) menembakkan pulsa cahaya laser (biasanya ultraviolet atau inframerah dekat). Karena panjang gelombangnya super kecil, dia sangat akurat mendeteksi partikel mikroskopis kayak asap polutan yang nggak tembus sama radar biasa.",
  },

  // 6. KEBENCANAAN
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Banjir",
    question:
      "Banjir mendadak yang membawa lumpur dan material dari hulu disebut...",
    options: [
      "Banjir Rob",
      "Banjir Bandang",
      "Banjir Cileuncang",
      "Banjir Genangan",
    ],
    answer: "Banjir Bandang",
    explanation:
      "Pemicunya biasanya hujan ekstrem di wilayah hulu atau jebolnya bendungan alam.",
  },
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Badai",
    question:
      "Angin kencang dengan kecepatan di atas 60 km/jam yang berputar singkat adalah...",
    options: ["Puting Beliung", "Siklon Tropis", "El Nino", "MJO"],
    answer: "Puting Beliung",
    explanation:
      "Di Amerika disebut Tornado skala kecil, biasanya dari awan Cb.",
  },
  {
    category: "kebencanaan",
    mode: "essay",
    topic: "Hutan",
    question:
      "Kebakaran hutan dan lahan akibat kekeringan ekstrem disingkat...",
    answerKeywords: ["karhutla"],
    explanation:
      "Karhutla sering terjadi di wilayah gambut saat musim kemarau.",
  },
  {
    category: "kebencanaan",
    mode: "essay",
    topic: "Tanah",
    question:
      "Bencana pergerakan tanah pada lereng curam akibat hujan lebat disebut...",
    answerKeywords: ["longsor", "landslide"],
    explanation: "Resapan air hujan melebihi daya tahan geser tanah.",
  },
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Siklon Langka",
    question:
      "Berdasarkan sejarah, wilayah ekuator Indonesia umumnya aman dari badai siklon karena minimnya gaya Coriolis. Namun pada 2001, terjadi anomali langka di dekat lintang 1.5° LU (dekat Singapura/Kalimantan) berupa munculnya badai...",
    options: [
      "Siklon Tropis Cempaka",
      "Siklon Tropis Vamei",
      "Badai Katrina",
      "Siklon Seroja",
    ],
    answer: "Siklon Tropis Vamei",
    explanation:
      "Siklon Tropis Vamei terbentuk akibat akumulasi pusaran angin regional yang ekstrem bersinggungan dengan seruak udara dingin dari Asia, membuktikan kawasan ekuator bisa terancam jika ada dinamika tambahan.",
  },
  {
    category: "kebencanaan",
    mode: "essay",
    topic: "Gelombang Mematikan",
    question:
      "Bencana gelombang pasang raksasa yang diakibatkan oleh perpindahan vertikal dasar laut akibat gempa bumi tektonik bawah laut (bahaya geologis) dinamakan...",
    answerKeywords: ["tsunami", "gelombang tsunami"],
    explanation:
      "Tsunami berasal dari bahasa Jepang yang berarti 'gelombang pelabuhan'. Meskipun pemicunya dari dasar laut (geosfer), dampaknya menghancurkan pesisir (hidrosfer & antroposfer).",
  },
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Bencana Geologis",
    question:
      "Ketika gempa bumi kuat mengguncang lapisan tanah atau sedimen yang sangat jenuh oleh air (faktor curah hujan tinggi), tanah tersebut seketika kehilangan kekuatannya dan berubah sifat menyerupai benda cair. Bencana ini disebut...",
    options: ["Sinkhole", "Tanah Longsor", "Likuifaksi", "Erosi Tebing"],
    answer: "Likuifaksi",
    explanation:
      "Likuifaksi atau pencairan tanah sangat mematikan (seperti kejadian Palu 2018), karena tanah amblas dan membawa segala bangunan di atasnya seolah-olah ditelan bumi yang mencair.",
  },
  {
    category: "kebencanaan",
    mode: "guess",
    topic: "Bahaya Cuaca",
    question:
      "Berdasarkan penelitian Machts dkk (2024), saat manusia terkena sambaran ekstrem fenomena atmosfer ini di kepala, kondisi basah/hujan di kulit kepala justru MENINGKATKAN persentase selamat karena memicu 'surface flashover'. Fenomena apakah itu?",
    imageType: "lightning_strike",
    options: ["Badai Pasir", "Siklon Tropis", "Tornado", "Petir (Lightning)"],
    answer: "Petir (Lightning)",
    explanation:
      "Penelitian menggunakan phantom kepala manusia membuktikan bahwa air hujan di kulit kepala merubah jalur aliran arus petir agar mengalir di permukaan luar (flashover), mengurangi kerusakan otak secara signifikan.",
  },
  {
    category: "kebencanaan",
    mode: "essay",
    topic: "Lubang Amblesan",
    question:
      "Bencana terbentuknya lubang raksasa yang amblas secara tiba-tiba akibat erosi rongga air bawah tanah yang melarutkan batuan karst (kapur) disebut dengan istilah...",
    answerKeywords: ["sinkhole", "lubang runtuhan", "lubang amblesan"],
    explanation:
      "Sinkhole dipicu oleh resapan air hujan asam yang lambat laun melarutkan struktur kapur di bawah tanah. Rongga ini akan runtuh mendadak jika atapnya tidak lagi kuat menopang beban di atasnya.",
  },
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Bencana Iklim",
    question:
      "Bencana kekeringan ekstrem (seperti di Nusa Tenggara dan Kalimantan) sering kali meningkatkan risiko kebakaran hutan massal. Secara klimatologis, kekeringan mematikan ini utamanya diperburuk oleh anomali global yaitu fase...",
    options: ["La Nina", "El Nino Kuat", "Angin Monsun Barat", "Ekuinoks"],
    answer: "El Nino Kuat",
    explanation:
      "Fase El Nino menahan awan pembawa hujan agar tetap berada di tengah Samudra Pasifik, membiarkan wilayah maritim Indonesia mengalami defisit hujan parah dan penguapan udara yang kering.",
  },
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Pesisir",
    question:
      "Banjir pesisir atau genangan air yang ditiup masuk ke daratan sangat cepat akibat dorongan angin badai berkekuatan tinggi dan tekanan rendah (biasanya menyertai siklon tropis) disebut...",
    options: [
      "Banjir Cileuncang",
      "Abrasi",
      "Storm Surge (Banjir Pasang Badai)",
      "Tsunami Orografis",
    ],
    answer: "Storm Surge (Banjir Pasang Badai)",
    explanation:
      "Storm surge sangat mematikan karena volume air laut secara riil diangkat ke daratan oleh pusat badai bertekanan rendah dan dorongan angin berkecepatan lebih dari 100 km/jam.",
  },
  {
    category: "kebencanaan",
    mode: "essay",
    topic: "Kriosfer",
    question:
      "Bahaya alam di wilayah kriosfer dan pegunungan tinggi di mana lapisan tumpukan es atau salju runtuh massal dan meluncur deras ke bawah akibat tidak stabil disebut...",
    answerKeywords: ["avalanche", "longsoran salju", "avalanches"],
    explanation:
      "Longsoran salju (avalanche) sangat berbahaya bagi pendaki gunung dan desa lereng alpine. Pemicunya bisa berupa getaran suara, gempa mikro, atau kenaikan suhu yang mencairkan perekat salju bawah.",
  },
  {
    category: "kebencanaan",
    mode: "guess",
    topic: "Bahaya Astronomis",
    question:
      "Meskipun jarang, Bumi bisa dilanda bahaya astronomis akibat pelepasan materi berenergi amat tinggi (Coronal Mass Ejection) yang bisa mengganggu medan magnet bumi serta membakar seluruh satelit cuaca di orbit. Ini disebut...",
    imageType: "solar_storm",
    options: [
      "Badai Salju",
      "Badai Matahari (Solar Flare)",
      "Meteorit",
      "Supernova",
    ],
    answer: "Badai Matahari (Solar Flare)",
    explanation:
      "Badai matahari skala besar (seperti Peristiwa Carrington 1859) berpotensi mematikan jaringan listrik (blackout global) serta membakar sirkuit satelit yang menjadi nyawa bagi permodelan hidro-meteorologi modern.",
  },
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Interaksi Sistem",
    question:
      "Manusia yang memodifikasi tata guna lahan kota (antroposfer) dengan mengganti resapan alami menjadi aspal dan beton akan memperbesar bahaya hidrometeorologi, karena akan secara drastis meningkatkan volume...",
    options: [
      "Evapotranspirasi Harian",
      "Aliran Permukaan (Surface Runoff)",
      "Laju Infiltrasi Air Tanah",
      "Ketebalan Awan Sirus",
    ],
    answer: "Aliran Permukaan (Surface Runoff)",
    explanation:
      "Permukaan kota yang kedap air menolak siklus infiltrasi alami bumi. Akibatnya, air 100% dialirkan sebagai 'surface runoff' yang jauh melampaui kapasitas sungai dan selokan kota, memicu banjir kilat.",
  },
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Beda Penyebab Maut",
    question:
      "Tsunami dan Storm Surge (Banjir Pasang Badai) itu sama-sama ombak raksasa yang ngancurin kota pesisir. Jebakannya: Bedanya apa sih?",
    options: [
      "Tsunami airnya tawar, Storm surge airnya asin",
      "Tsunami dipicu gempa/longsor bawah laut (geologis), Storm surge dipicu tiupan badai ekstrem (meteorologis)",
      "Tsunami cuma terjadi siang hari",
      "Sama aja, cuma beda bahasa doang",
    ],
    answer:
      "Tsunami dipicu gempa/longsor bawah laut (geologis), Storm surge dipicu tiupan badai ekstrem (meteorologis)",
    explanation:
      "Tsunami murni urusan pergeseran kerak bumi atau longsor laut. Kalau Storm Surge itu karena badai (siklon) yang muter di lautan nyedot dan dorong air laut masuk ke daratan.",
  },
  {
    category: "kebencanaan",
    mode: "essay",
    topic: "Skala Kiamat Angin",
    question:
      "Kalau kekuatan gempa diukur pake skala Richter atau Magnitudo, kekuatan daya hancur angin Tornado punya skalanya sendiri dari F0 sampai F5. Nama skalanya adalah Skala...",
    answerKeywords: ["fujita", "enhanced fujita"],
    explanation:
      "Skala Fujita (sekarang Enhanced Fujita / EF) menilai keparahan tornado berdasarkan kerusakan yang ditimbulkannya pada bangunan dan vegetasi, bukan cuma dari kecepatan angin absolutnya.",
  },
  {
    category: "kebencanaan",
    mode: "guess",
    topic: "Tanah Jadi Bubur",
    question:
      "Bencana kiamat kecil ini kejadian pas gempa Palu 2018. Tanah yang tadinya padat tiba-tiba mencair dan ngalir kayak bubur nelen satu perumahan karena air tanahnya terguncang naik. Namanya...",
    imageType: "liquefaction",
    options: ["Sinkhole", "Likuifaksi (Liquefaction)", "Subsiden", "Erosi"],
    answer: "Likuifaksi (Liquefaction)",
    explanation:
      "Likuifaksi terjadi pada tanah berpasir yang jenuh air. Pas diguncang gempa, ikatan antar pasir hancur, air naik ke atas, dan tanah seketika kehilangan kekuatannya lalu berubah jadi benda cair.",
  },
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Puting Beliung vs Tornado",
    question:
      "Di Indonesia kita sering banget kena 'Puting Beliung', tapi jarang dibilang 'Tornado'. Kenapa sih orang BMKG nyebutnya beda?",
    options: [
      "Karena puting beliung nggak muter",
      "Puting beliung itu tornado versi sachet (skalanya lokal, diameternya kecil, dan cuma bentar), sedangkan Tornado itu ukurannya raksasa dan awet",
      "Puting beliung cuma ada di laut",
      "Tornado cuma bisa terjadi di Amerika",
    ],
    answer:
      "Puting beliung itu tornado versi sachet (skalanya lokal, diameternya kecil, dan cuma bentar), sedangkan Tornado itu ukurannya raksasa dan awet",
    explanation:
      "Secara fisis mereka sama-sama pusaran angin dari awan Cb. Tapi Puting Beliung ukurannya jauh lebih kecil (puluhan meter) dan hidupnya cuma 5-10 menit. Tornado bisa berdiameter kilometer dan ngehancurin kota berjam-jam.",
  },
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Ngitung Jarak Gledek",
    question:
      "Lu lagi nongkrong, tiba-tiba liat kilat nyamber ⚡. Tiga (3) detik kemudian baru kedengeran suara gledeknya (JEDAAAR). Berarti jarak lokasi petir itu dari tempat lu nongkrong sekitar...",
    options: ["100 meter", "1 Kilometer", "3 Kilometer", "10 Kilometer"],
    answer: "1 Kilometer",
    explanation:
      "Kecepatan cahaya itu instan, tapi kecepatan suara di udara itu pelan (cuma sekitar 340 meter per detik). Jadi kalau bedanya 3 detik: 340 x 3 = 1020 meter alias sekitar 1 kilometer dari lokasi lu.",
  },
  {
    category: "kebencanaan",
    mode: "essay",
    topic: "Si Bandel dari Ekuator",
    question:
      "Siklon tropis haram hukumnya muncul di khatulistiwa karena efek Coriolis nol. TAPI di tahun 2001, ada satu badai langka yang 'nyasar' dan pecah rekor terbentuk di dekat Singapura. Siklon ini dinamakan...",
    answerKeywords: ["vamei", "siklon vamei", "badai vamei"],
    explanation:
      "Siklon Vamei (2001) adalah badai anomali yang terbentuk di lintang 1.5° Utara akibat pusaran sirkulasi regional dekat Kalimantan yang tertiup seruak udara dingin dari Asia. Ini sangat langka (katanya siklus 400 tahunan).",
  },
  {
    category: "kebencanaan",
    mode: "guess",
    topic: "Tsunami dari Langit",
    question:
      "Bukan sungai biasa, ini adalah pita awan raksasa tak kasat mata di langit yang ngebawa uap air dari daerah tropis ke negara subtropis. Kalau nabrak daratan, bisa bikin banjir bandang parah. Namanya...",
    imageType: "atmospheric_river",
    options: [
      "Jet Stream",
      "Atmospheric River (Sungai Atmosfer)",
      "Monsoon Flow",
      "Trade Winds",
    ],
    answer: "Atmospheric River (Sungai Atmosfer)",
    explanation:
      "Sungai Atmosfer (Atmospheric River) adalah koridor sempit di atmosfer bumi yang mengangkut sebagian besar uap air. Salah satu yang paling terkenal adalah 'Pineapple Express' yang sering bikin banjir di California.",
  },
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Surga Bebas Badai",
    question:
      "Indonesia itu rawan banget gempa, tsunami, gunung meletus. Tapi ada satu bencana kiamat yang ALHAMDULILLAH kita bebas dan nggak pernah dilewatin langsung sama pusat lintasannya. Bencana apa itu?",
    options: [
      "Banjir Bandang",
      "Kekeringan Ekstrem",
      "Siklon Tropis (Hurricane/Topan)",
      "Tanah Longsor",
    ],
    answer: "Siklon Tropis (Hurricane/Topan)",
    explanation:
      "Kita dilindungi oleh parameter fisika yang disebut Gaya Coriolis. Di wilayah 0-5 derajat ekuator, gaya ini bernilai nol sehingga kumpulan angin badai nggak bisa berputar membentuk sistem raksasa.",
  },
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Panas Mematikan",
    question:
      "Gelombang Panas (Heatwave) mematikan jutaan orang tanpa ngancurin satu gedung pun. Kenapa manusia bisa gampang mati pas heatwave yang dibarengi 'Kelembapan Tinggi'?",
    options: [
      "Karena udara lembap isinya racun",
      "Karena keringat manusia gak bisa menguap buat ngedinginin tubuh (Wet-bulb temperature tinggi)",
      "Karena baju nempel ke kulit",
      "Karena darah mendidih di suhu 35°C",
    ],
    answer:
      "Karena keringat manusia gak bisa menguap buat ngedinginin tubuh (Wet-bulb temperature tinggi)",
    explanation:
      "Manusia ngedinginin tubuh pakai keringat. Tapi kalau udara di luar udah full sama uap air (lembap), keringat lu nggak bakal bisa menguap. Tubuh bakal overheat dan kena Heatstroke fatal.",
  },
  {
    category: "kebencanaan",
    mode: "guess",
    topic: "Lubang Neraka Aspal",
    question:
      "Bencana urban paling serem: Lu lagi nyetir santai, tiba-tiba aspal jalan di depan lu amblas ngebentuk lubang raksasa bulat ke bawah tanah nelen apa aja. Bencana pelarutan tanah kapur ini namanya...",
    imageType: "urban_sinkhole",
    options: ["Subsidence", "Sinkhole", "Patahan Aktif", "Abrasi"],
    answer: "Sinkhole",
    explanation:
      "Sinkhole sering terjadi di daerah karst (kapur) atau di kota yang pipa air bawah tanahnya bocor parah. Air melarutkan tanah di bawah jalanan secara diam-diam sampai aspal kehilangan penahannya dan amblas seketika.",
  },
  {
    category: "kebencanaan",
    mode: "essay",
    topic: "Tembok Debu Kiamat",
    question:
      "Bencana ini sering kejadian di Arizona atau Timur Tengah. Tembok debu dan pasir raksasa yang maju nyapu kota, dipicu oleh hembusan angin jatuhan dari awan badai. Berasal dari bahasa Arab, fenomena ini disebut...",
    answerKeywords: ["haboob", "habub"],
    explanation:
      "Haboob terbentuk ketika awan badai (Cb) mati dan melepaskan seluruh massanya berupa angin kencang ke tanah (microburst). Angin ini meniup debu gurun ke udara, membentuk tembok pasir setinggi ratusan meter.",
  },
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Jebakan Banjir Bandang",
    question:
      "Lu lagi bawa mobil dan kejebak di tengah jalan yang tiba-tiba dialiri air banjir bandang (Flash Flood). Air udah mulai naik ke ban mobil. Apa yang PALING BENER lu lakuin?",
    options: [
      "Kunci pintu, tutup jendela, tunggu di dalem mobil",
      "Injek gas dalem-dalem terobos banjirnya",
      "Tinggalin mobilnya saat itu juga, lari cari daratan tinggi/gedung!",
      "Ikat mobil ke pohon pake tali",
    ],
    answer:
      "Tinggalin mobilnya saat itu juga, lari cari daratan tinggi/gedung!",
    explanation:
      "Banyak korban jiwa mati di dalam mobil karena ngerasa aman. Padahal air setinggi 60 cm (setengah ban) dengan arus deras udah bisa bikin mobil SUV ngapung dan tersapu arus. Segera tinggalkan kendaraan!",
  },
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Segitiga Api Hutan",
    question:
      "Pas lagi puncak El Nino (kemarau super parah), hutan gampang banget kebakar. Secara teori fisika, api nggak bakal nyala kalau nggak ada 3 unsur wajib ini (Segitiga Api), yaitu...",
    options: [
      "Panas, Bensin, Udara",
      "Matahari, Ranting kering, Angin",
      "Bahan Bakar, Panas, Oksigen",
      "Gesekan, Keringat, Kayu",
    ],
    answer: "Bahan Bakar, Panas, Oksigen",
    explanation:
      "Fire Triangle (Segitiga Api). Kalau lu mau matiin api hutan raksasa, lu harus ngilangin minimal 1 dari 3 unsur ini. (Bom air buat nurunin Panas, atau nebang area hutan biar Bahan Bakarnya putus).",
  },
  {
    category: "kebencanaan",
    mode: "guess",
    topic: "Puting Beliung Laut",
    question:
      "Pemandangan memukau tapi ngeri. Pusaran angin kencang berbentuk belalai yang turun dari awan badai tapi nyentuhnya bukan ke tanah, melainkan nyedot air lautan. Fenomena ini namanya...",
    imageType: "waterspout",
    options: ["Tornado Darat", "Waterspout", "Whirlpool", "Tsunami Siklonik"],
    answer: "Waterspout",
    explanation:
      "Waterspout adalah tornado yang terbentuk di atas perairan. Meskipun umumnya lebih lemah dari tornado darat, alat ini sangat berbahaya bagi nelayan atau kapal yang nekat mendekat.",
  },
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Tenggelam Pelan-Pelan",
    question:
      "Jakarta Utara itu tiap tahun daratannya turun sampai belasan sentimeter. Bencana tanah yang ambles pelan-pelan akibat penyedotan air tanah gila-gilaan ini istilah akademisnya adalah...",
    options: ["Intrusi Laut", "Likuifaksi", "Land Subsidence", "Erosi Pesisir"],
    answer: "Land Subsidence",
    explanation:
      "Land Subsidence (Penurunan Muka Tanah) beda sama Sinkhole yang tiba-tiba bolong. Ini terjadi pelan-pelan karena pori-pori tanah di bawah kota kempes setelah airnya terus-terusan disedot pompa tanah warga.",
  },
  {
    category: "kebencanaan",
    mode: "essay",
    topic: "Alat Pengintai Tsunami",
    question:
      "Tebak Nama Alat: BMKG masang alat sensor ini terapung-apung di lautan lepas. Fungsinya buat ngerasain anomali gelombang panjang tanda bahaya tsunami sedini mungkin. Nama alat ini adalah...",
    answerKeywords: ["buoy", "tsunami buoy"],
    explanation:
      "Sistem Buoy menggunakan sensor tekanan di dasar laut (OBU) yang mendeteksi perubahan massa air saat tsunami lewat, lalu ngirim sinyal ke pelampung (Buoy) di atasnya, diterusin ke satelit BMKG.",
  },
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Jebakan Petir di Lapangan",
    question:
      "Lu lagi main bola di lapangan luas, terus tiba-tiba awan gelap, dan BULU KUDUK SERTA RAMBUT LU BERDIRI SEMUA ngerasa nyetrum. Ini tanda lu bakal kesambar petir! Apa yang HARUS lu lakuin detik itu juga?",
    options: [
      "Lari sekencang-kencangnya ke pohon terdekat buat neduh",
      "Tiarap rata rebahan di atas rumput",
      "Jongkok, rapatin kaki, peluk lutut, dan tundukin kepala sejauh mungkin",
      "Keluarin HP buat direkam",
    ],
    answer:
      "Jongkok, rapatin kaki, peluk lutut, dan tundukin kepala sejauh mungkin",
    explanation:
      "JANGAN rebahan! Arus petir menjalar di tanah (step voltage), kalau lu tiarap, listriknya ngelewatin jantung lu. Jongkok dengan kaki rapat meminimalkan luas sentuhan ke tanah, sehingga arus listrik nggak masuk ke organ dalam.",
  },
  {
    category: "kebencanaan",
    mode: "mcq",
    topic: "Skala Badai Tropis",
    question:
      "Siklon Tropis (Hurricane) diklasifikasikan dari Kategori 1 (paling lemah) sampai Kategori 5 (kiamat total). Skala metrik internasional ini dinamakan Skala...",
    options: ["Richter", "Mercalli", "Saffir-Simpson", "Beaufort"],
    answer: "Saffir-Simpson",
    explanation:
      "Skala Angin Badai Saffir-Simpson murni berdasarkan pada kecepatan angin maksimum berkelanjutan (1-minute sustained wind) untuk memperkirakan potensi kerusakan properti.",
  },
  {
    category: "kebencanaan",
    mode: "guess",
    topic: "Raja Terakhir Awan Badai",
    question:
      "Ini adalah tipe Thunderstorm 'Raja Terakhir'. Sel badainya tunggal tapi sangat masif, awet berjam-jam, punya awan berbentuk landasan (anvil), dan sistemnya BERPUTAR. 90% tornado ganas lahir dari awan jenis ini, yaitu...",
    imageType: "supercell_storm",
    options: ["Squall Line", "Supercell", "Multi-cell Cluster", "Roll Cloud"],
    answer: "Supercell",
    explanation:
      "Supercell adalah jenis badai paling mematikan dan langka karena dia memiliki sirkulasi udara naik yang berputar-putar dalam skala besar (Mesocyclone). Ini adalah pabrik pembuat Hailstones (Hujan Es) raksasa dan Tornado F5.",
  },
  {
    category: "kebencanaan",
    mode: "essay",
    topic: "Bulan Purnama Jahat",
    question:
      "Gak perlu ada badai hujan, warga di pesisir utara Jawa tetep kebanjiran kalau lagi fase Bulan Purnama. Banjir pasang laut gara-gara tarikan gravitasi bulan ini dinamakan banjir...",
    answerKeywords: ["rob", "banjir rob"],
    explanation:
      "Banjir Rob (Tidal Flooding) terjadi karena posisi Bumi-Bulan-Matahari sejajar, yang memberikan tarikan gravitasi maksimal terhadap air laut (Pasang Purnama/Spring Tide). Air pun meluap menggenangi daratan.",
  },
];

// --- KOMPONEN ILUSTRASI ---
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
    <div className="absolute top-16 right-12 flex flex-col items-center space-y-2 opacity-40 animate-bounce">
      <div className="w-1 h-3 bg-blue-400 rounded-full"></div>
      <div className="w-1 h-3 bg-blue-400 rounded-full"></div>
    </div>
    <div className="w-full h-12 bg-blue-500 rounded-t-xl absolute bottom-0 left-0 right-0 flex items-center justify-center">
      <span className="text-white text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase">
        Samudra
      </span>
    </div>
  </div>
);

const CumulonimbusSVG = () => (
  <div className="relative w-full h-48 bg-slate-200 rounded-2xl overflow-hidden border-2 border-slate-300 flex items-center justify-center p-4 shadow-inner">
    <div className="relative">
      <Cloud
        className="text-slate-700 w-32 h-32 absolute -top-12 -left-8"
        fill="currentColor"
      />
      <Cloud className="text-slate-800 w-40 h-40" fill="currentColor" />
      <CloudRain className="absolute top-20 left-10 text-blue-900 w-20 h-20 opacity-70" />
      <svg
        className="absolute top-24 left-16 w-8 h-8 text-yellow-500 animate-pulse"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    </div>
  </div>
);

const ThermometerSVG = () => (
  <div className="relative w-full h-48 bg-red-50 rounded-2xl overflow-hidden border-2 border-red-200 flex items-center justify-center p-4 shadow-inner">
    <div className="relative w-8 h-32 bg-white border-2 border-slate-300 rounded-t-full rounded-b-full flex flex-col items-center justify-end overflow-hidden z-10 shadow-sm">
      <div className="w-4 h-24 bg-red-500 rounded-full mb-1 transition-all duration-1000 animate-pulse"></div>
    </div>
    <div className="absolute w-12 h-12 bg-red-500 rounded-full bottom-6 z-0 shadow-lg"></div>
  </div>
);

// --- BATCH 1: IKLIM & CUACA ---
const OrbitEllipticalSVG = () => (
  <div className="relative w-full h-48 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex items-center justify-center p-4 shadow-inner">
    {/* Garis Orbit Elips */}
    <div className="absolute w-64 h-24 border-2 border-dashed border-slate-600 rounded-[100%] animate-[spin_20s_linear_infinite]"></div>
    {/* Matahari (Tidak di tengah) */}
    <Sun
      className="absolute left-10 text-yellow-500 w-16 h-16 animate-pulse drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]"
      fill="currentColor"
    />
    {/* Bumi di Perihelion */}
    <div className="absolute left-24 flex flex-col items-center">
      <Globe2 className="text-sky-400 w-6 h-6 animate-bounce" />
    </div>
  </div>
);

const PermafrostSVG = () => (
  <div className="relative w-full h-48 bg-sky-50 rounded-2xl overflow-hidden border-2 border-sky-200 flex flex-col p-4 shadow-inner">
    {/* Tanah Beku */}
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-stone-700 border-t-8 border-sky-200 flex items-start justify-center pt-2">
      <span className="text-white/30 text-[10px] font-black tracking-widest">
        PERMAFROST ZONE
      </span>
    </div>
    {/* Es Mencair */}
    <div className="absolute bottom-16 left-10 w-32 h-8 bg-sky-300/50 rounded-full blur-md animate-pulse"></div>
    {/* Gelembung Gas Metana (CH4) */}
    <div className="absolute bottom-20 left-1/4 w-4 h-4 bg-emerald-400 rounded-full animate-bounce shadow-[0_0_15px_rgba(52,211,153,0.8)]"></div>
    <div className="absolute bottom-16 left-1/2 w-3 h-3 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
    <div className="absolute bottom-24 right-1/3 w-5 h-5 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
  </div>
);

// --- BATCH 2: METEOROLOGI PENERBANGAN ---
const HailStormSVG = () => (
  <div className="relative w-full h-48 bg-slate-300 rounded-2xl overflow-hidden border-2 border-slate-400 flex items-center justify-center p-4 shadow-inner">
    <Cloud
      className="absolute top-2 text-slate-800 w-32 h-32"
      fill="currentColor"
    />
    <div className="absolute top-24 flex gap-6">
      {/* Bongkahan Es */}
      <div className="w-5 h-5 bg-white border-2 border-slate-400 rounded-full animate-bounce shadow-xl"></div>
      <div className="w-7 h-7 bg-white border-2 border-slate-400 rounded-full animate-bounce delay-100 shadow-xl mt-2"></div>
      <div className="w-4 h-4 bg-white border-2 border-slate-400 rounded-full animate-bounce delay-200 shadow-xl"></div>
    </div>
  </div>
);

const RadiationFogSVG = () => (
  <div className="relative w-full h-48 bg-slate-200 rounded-2xl overflow-hidden border-2 border-slate-300 flex flex-col items-center justify-end shadow-inner">
    {/* Landasan Pacu (Runway) */}
    <div className="absolute bottom-0 w-full h-24 bg-slate-700 flex justify-center items-center">
      <div className="w-full h-2 border-t-4 border-dashed border-white/60"></div>
    </div>
    {/* Lapisan Kabut Bawah */}
    <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-white/90 to-transparent blur-sm"></div>
    <Cloud
      className="absolute bottom-4 left-4 text-white/80 w-24 h-24 blur-[2px]"
      fill="currentColor"
    />
    <Cloud
      className="absolute bottom-2 right-8 text-white/80 w-32 h-32 blur-[2px]"
      fill="currentColor"
    />
  </div>
);

// --- BATCH 3: HIDROLOGI ---
const CryosphereSVG = () => (
  <div className="relative w-full h-48 bg-sky-100 rounded-2xl overflow-hidden border-2 border-sky-200 flex flex-col items-center justify-end shadow-inner">
    {/* Gletser/Gunung Es */}
    <div className="absolute bottom-4 w-32 h-32 bg-white border-4 border-sky-200 rounded-t-[3rem] rotate-45 transform translate-y-16 shadow-2xl"></div>
    {/* Lautan */}
    <div className="absolute bottom-0 w-full h-12 bg-blue-500/80 backdrop-blur-sm flex items-center justify-center border-t border-blue-400">
      <span className="text-white text-[10px] font-bold tracking-[0.4em] uppercase opacity-90 drop-shadow-md">
        Kriosfer Laut
      </span>
    </div>
    <Globe2 className="absolute top-4 left-4 w-10 h-10 text-sky-300 opacity-50" />
  </div>
);

const SinkholeSVG = () => (
  <div className="relative w-full h-48 bg-stone-200 rounded-2xl overflow-hidden border-2 border-stone-300 flex items-center justify-center shadow-inner">
    {/* Permukaan Jalan */}
    <div className="absolute w-full h-full bg-slate-800"></div>
    <div className="absolute w-full h-2 border-t-4 border-dashed border-yellow-500"></div>
    {/* Lubang Runtuhan */}
    <div className="relative w-36 h-28 bg-stone-950 rounded-[40%_60%_70%_30%] shadow-[inset_0_20px_30px_rgba(0,0,0,0.9)] flex items-center justify-center border-4 border-stone-800">
      <AlertTriangle className="text-rose-500 w-10 h-10 animate-pulse drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]" />
    </div>
  </div>
);

// --- BATCH 4: KLIMATOLOGI ---
const AxialTiltSVG = () => (
  <div className="relative w-full h-48 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex items-center justify-center shadow-inner">
    {/* Garis Vertikal */}
    <div className="absolute w-px h-40 bg-slate-500 border-dashed border-l-2"></div>
    {/* Garis Kemiringan 23.5° */}
    <div className="absolute w-1 h-48 bg-rose-500 rotate-[23.5deg] shadow-[0_0_15px_rgba(244,63,94,0.8)]"></div>
    <Globe2 className="text-sky-500 w-24 h-24 rotate-[23.5deg] bg-slate-900 rounded-full" />
    <span className="absolute top-4 right-4 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 text-rose-400 text-[10px] font-black tracking-widest">
      23.5°
    </span>
  </div>
);

const IceAgeSVG = () => (
  <div className="relative w-full h-48 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex items-center justify-center shadow-inner">
    <div className="absolute w-40 h-40 bg-sky-500/20 rounded-full blur-2xl animate-pulse"></div>
    <div className="relative flex items-center justify-center">
      <Globe2 className="text-sky-200 w-28 h-28 drop-shadow-[0_0_20px_rgba(186,230,253,0.5)]" />
      {/* Tutupan Es Kutub Membesar */}
      <div className="absolute top-0 w-24 h-16 bg-white/80 rounded-t-full blur-[2px]"></div>
      <div className="absolute bottom-0 w-20 h-12 bg-white/80 rounded-b-full blur-[2px]"></div>
    </div>
  </div>
);

// --- BATCH 5: INSTRUMEN & OBSERVASI ---
const WindVaneSVG = () => (
  <div className="relative w-full h-48 bg-sky-50 rounded-2xl overflow-hidden border-2 border-sky-200 flex flex-col items-center justify-end pb-4 shadow-inner">
    {/* Tiang Penyangga */}
    <div className="w-2 h-24 bg-slate-500 rounded-full relative flex justify-center">
      <div className="absolute top-8 w-16 h-1 bg-slate-400"></div>
    </div>
    {/* Baling-baling (Animate Spin) */}
    <div className="absolute top-12 flex items-center animate-[spin_4s_ease-in-out_infinite] origin-center drop-shadow-lg">
      <div className="w-20 h-2 bg-rose-500 relative">
        {/* Ekor dan Kepala Panah */}
        <div className="absolute -left-2 -top-3 w-4 h-8 bg-rose-600 rounded-sm"></div>
        <div className="absolute -right-3 -top-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-[16px] border-l-rose-500"></div>
      </div>
    </div>
    <Wind className="absolute top-4 right-6 text-sky-400 w-12 h-12 opacity-40 animate-pulse" />
  </div>
);

// --- BATCH 6: KEBENCANAAN ---
const LightningStrikeSVG = () => (
  <div className="relative w-full h-48 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex items-center justify-center shadow-inner">
    <User className="absolute bottom-2 text-slate-400 w-28 h-28 drop-shadow-2xl" />
    <Zap
      className="absolute top-2 text-yellow-400 w-16 h-16 drop-shadow-[0_0_20px_rgba(250,204,21,1)] animate-bounce"
      fill="currentColor"
    />
    {/* Animasi Jalur Surface Flashover di sekitar kepala */}
    <div className="absolute bottom-12 w-32 h-32 border-4 border-sky-400/80 rounded-full border-t-transparent border-b-transparent animate-[spin_2s_linear_infinite] shadow-[0_0_15px_rgba(56,189,248,0.5)]"></div>
    <div className="absolute bottom-2 bg-sky-500 text-white text-[8px] font-black px-3 py-1.5 rounded-full tracking-widest border border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]">
      FLASHOVER
    </div>
  </div>
);

const SolarStormSVG = () => (
  <div className="relative w-full h-48 bg-slate-950 rounded-2xl overflow-hidden border-2 border-rose-900 flex items-center justify-center shadow-inner">
    {/* Matahari */}
    <div className="absolute -left-8 w-40 h-40 bg-orange-600 rounded-full blur-xl animate-pulse"></div>
    <Sun
      className="absolute -left-8 text-yellow-500 w-32 h-32 animate-[spin_10s_linear_infinite]"
      fill="currentColor"
    />
    {/* Lidah Api / Flare */}
    <Flame
      className="absolute left-16 top-10 text-rose-500 w-16 h-16 -rotate-90 animate-bounce drop-shadow-[0_0_20px_rgba(225,29,72,0.8)]"
      fill="currentColor"
    />
    {/* Bumi Terpapar CME */}
    <Globe2 className="absolute right-6 text-sky-500 w-10 h-10 drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
    {/* Gelombang Radiasi (Coronal Mass Ejection) */}
    <div className="absolute right-16 w-8 h-32 border-r-4 border-rose-500/80 rounded-full animate-ping"></div>
  </div>
);

const MammatusCloudSVG = () => (
  <div className="relative w-full h-48 bg-slate-800 rounded-2xl overflow-hidden border-2 border-slate-600 flex items-start justify-center p-4 shadow-inner">
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-12 h-12 bg-slate-600 rounded-full -mt-6 shadow-[inset_0_-10px_10px_rgba(0,0,0,0.5)] animate-pulse"
        ></div>
      ))}
    </div>
    <Cloud
      className="text-slate-500 w-48 h-32 absolute top-0"
      fill="currentColor"
    />
    <CloudLightning className="absolute bottom-4 right-10 text-yellow-500/30 w-12 h-12" />
  </div>
);

const OvershootingTopSVG = () => (
  <div className="relative w-full h-48 bg-sky-950 rounded-2xl overflow-hidden border-2 border-sky-800 flex items-center justify-center shadow-inner">
    {/* Lapisan Tropopause */}
    <div className="absolute top-12 w-full h-px border-t border-dashed border-sky-400/50"></div>
    {/* Awan Cb */}
    <div className="relative flex flex-col items-center">
      {/* Overshooting Top */}
      <div className="w-12 h-12 bg-white rounded-full -mb-6 z-10 animate-bounce shadow-[0_0_20px_rgba(255,255,255,0.4)]"></div>
      {/* Anvil */}
      <div className="w-48 h-8 bg-slate-200 rounded-full shadow-lg"></div>
      {/* Body */}
      <div className="w-32 h-40 bg-gradient-to-b from-slate-200 to-slate-900 rounded-t-xl"></div>
    </div>
  </div>
);

const RollCloudSVG = () => (
  <div className="relative w-full h-48 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex flex-col justify-end p-4 shadow-inner">
    {/* Tanah/Kota */}
    <div className="absolute bottom-0 left-0 w-full h-10 bg-slate-950 flex gap-2 items-end px-4">
      <div className="w-4 h-6 bg-slate-800"></div>
      <div className="w-6 h-10 bg-slate-800"></div>
      <div className="w-5 h-8 bg-slate-800"></div>
    </div>
    {/* Awan Gulung (Arcus/Roll Cloud) */}
    <div className="absolute top-12 -left-10 w-[120%] h-16 bg-slate-500 rounded-full blur-sm rotate-3 shadow-[0_20px_30px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden">
      <div className="w-[150%] h-4 bg-slate-400/30 blur-md animate-[spin_5s_linear_infinite]"></div>
    </div>
    <Wind className="absolute top-4 right-4 text-sky-400/50 w-12 h-12 animate-pulse" />
  </div>
);

const WeatherRadarSVG = () => (
  <div className="relative w-full h-48 bg-emerald-950 rounded-2xl overflow-hidden border-4 border-slate-800 flex items-center justify-center shadow-inner">
    {/* Garis Crosshair Radar */}
    <div className="absolute w-full h-px bg-emerald-700/50"></div>
    <div className="absolute h-full w-px bg-emerald-700/50"></div>
    {/* Sapuan Radar (Sweep) */}
    <div className="absolute w-48 h-48 rounded-full border border-emerald-600/30 flex items-center justify-center">
      <div className="w-full h-full rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(16,185,129,0.5)_360deg)] animate-[spin_3s_linear_infinite]"></div>
    </div>
    {/* Badai Es (Warna Merah-Ungu pekat) */}
    <div className="absolute w-20 h-16 bg-red-600 rounded-[40%_60%_70%_30%] blur-md flex items-center justify-center animate-pulse">
      <div className="w-8 h-8 bg-fuchsia-600 rounded-full blur-sm"></div>
    </div>
    <div className="absolute bottom-2 left-2 text-emerald-500 text-[8px] font-mono tracking-widest">
      RADAR: REFLECTIVITY &gt; 65 dBZ
    </div>
  </div>
);

const CycloneEyeSVG = () => (
  <div className="relative w-full h-48 bg-slate-800 rounded-2xl overflow-hidden border-2 border-slate-600 flex items-center justify-center shadow-inner">
    {/* Pusaran Awan Putih Badai (Spiral) */}
    <div className="w-64 h-64 border-[16px] border-slate-300 border-t-transparent border-b-transparent rounded-full animate-[spin_2s_linear_infinite] blur-md absolute"></div>
    <div className="w-48 h-48 border-[20px] border-slate-200 border-l-transparent rounded-full animate-[spin_1.5s_linear_infinite] blur-sm absolute"></div>
    <div className="w-32 h-32 border-[24px] border-white border-r-transparent rounded-full animate-[spin_1s_linear_infinite] blur-[2px] absolute"></div>

    {/* Lubang Tenang Mata Badai */}
    <div className="w-16 h-16 bg-sky-900 rounded-full shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] z-10 flex items-center justify-center overflow-hidden border-4 border-slate-100">
      <Star className="text-yellow-200 w-4 h-4 animate-pulse opacity-50" />
    </div>
  </div>
);

const ClearAirTurbulenceSVG = () => (
  <div className="relative w-full h-48 bg-sky-600 rounded-2xl overflow-hidden border-2 border-sky-400 flex items-center justify-center shadow-inner">
    {/* Langit Biru Cerah (Tanpa Awan) */}
    <div className="absolute inset-0 bg-gradient-to-b from-blue-700 to-sky-400"></div>
    {/* Gelombang Angin (Jet Stream/CAT) */}
    <div className="absolute top-1/2 w-[150%] h-12 border-t-4 border-dashed border-white/30 rounded-[50%] animate-[bounce_2s_infinite_alternate] rotate-6"></div>
    <div className="absolute top-1/3 w-[150%] h-12 border-t-4 border-dashed border-white/20 rounded-[50%] animate-[bounce_1.5s_infinite_alternate-reverse] -rotate-6"></div>
    {/* Pesawat Guncang */}
    <Plane
      className="text-white w-20 h-20 drop-shadow-2xl animate-[spin_0.5s_ease-in-out_infinite_alternate] rotate-12"
      fill="currentColor"
    />
  </div>
);

const MicroburstDownburstSVG = () => (
  <div className="relative w-full h-48 bg-slate-400 rounded-2xl overflow-hidden border-2 border-slate-500 flex flex-col items-center justify-between shadow-inner">
    {/* Awan Cb di atas */}
    <Cloud
      className="text-slate-800 w-32 h-32 absolute -top-8"
      fill="currentColor"
    />
    {/* Aliran Angin Jatuh (Downburst) */}
    <div className="absolute top-12 flex flex-col items-center animate-bounce">
      <div className="w-2 h-16 bg-blue-500/50 rounded-full mb-1"></div>
      <ChevronLeft className="text-blue-700 w-8 h-8 -rotate-90 -mt-4" />
    </div>
    {/* Angin Menyebar di Tanah */}
    <div className="absolute bottom-4 flex justify-between w-full px-8">
      <div className="flex animate-[pulse_1s_infinite]">
        <ChevronLeft className="text-blue-700 w-8 h-8" />
        <div className="w-16 h-2 bg-blue-500/50 rounded-full mt-3"></div>
      </div>
      <div className="flex animate-[pulse_1s_infinite]">
        <div className="w-16 h-2 bg-blue-500/50 rounded-full mt-3"></div>
        <ChevronLeft className="text-blue-700 w-8 h-8 rotate-180" />
      </div>
    </div>
    {/* Landasan Pacu */}
    <div className="absolute bottom-0 w-full h-6 bg-slate-800 border-t border-slate-600"></div>
  </div>
);

const WingIcingSVG = () => (
  <div className="relative w-full h-48 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex items-center justify-center shadow-inner">
    {/* Awan Gelap/Malam */}
    <Cloud
      className="absolute -left-10 text-slate-800 w-64 h-64 opacity-50"
      fill="currentColor"
    />
    {/* Potongan Sayap Pesawat */}
    <div className="relative w-48 h-16 bg-slate-300 rounded-r-full border-b-8 border-slate-400 shadow-2xl transform -rotate-12">
      {/* Tumpukan Es (Icing) di ujung sayap */}
      <div className="absolute -left-2 top-0 w-12 h-16 bg-sky-200/90 rounded-l-xl border-l-4 border-white flex flex-col justify-around overflow-hidden shadow-[0_0_15px_rgba(186,230,253,0.8)]">
        <div className="w-4 h-2 bg-white rounded-r-full animate-pulse"></div>
        <div className="w-6 h-2 bg-white rounded-r-full animate-pulse delay-75"></div>
        <div className="w-3 h-2 bg-white rounded-r-full animate-pulse delay-150"></div>
        <div className="w-5 h-2 bg-white rounded-r-full animate-pulse delay-300"></div>
      </div>
      {/* Lampu Strobo Sayap */}
      <div className="absolute right-4 top-1/2 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
    </div>
  </div>
);

const CockpitWeatherRadarSVG = () => (
  <div className="relative w-full h-48 bg-slate-800 rounded-2xl overflow-hidden border-[8px] border-slate-950 flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,1)]">
    {/* Busur Radar (Layar) */}
    <div className="relative w-full h-full bg-slate-900 overflow-hidden flex items-end justify-center">
      {/* Garis Jarak Radar */}
      <div className="absolute bottom-0 w-64 h-64 rounded-full border border-sky-500/20"></div>
      <div className="absolute bottom-0 w-48 h-48 rounded-full border border-sky-500/30"></div>
      <div className="absolute bottom-0 w-32 h-32 rounded-full border border-sky-500/40"></div>

      {/* Ikon Pesawat di Bawah */}
      <Plane
        className="absolute -bottom-4 text-white w-8 h-8 z-20"
        fill="currentColor"
      />

      {/* Sapuan Radar (Wiper) */}
      <div className="absolute bottom-0 w-[200%] h-[200%] bg-[conic-gradient(from_270deg,rgba(14,165,233,0.3)_0deg,transparent_90deg)] origin-bottom animate-[spin_3s_linear_infinite_alternate]"></div>

      {/* Awan Badai (Merah/Magenta) */}
      <div className="absolute top-4 left-10 w-24 h-24 bg-red-600 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-10 left-16 w-12 h-12 bg-fuchsia-600 rounded-full blur-lg animate-bounce"></div>

      {/* Cuaca Ringan (Hijau) */}
      <div className="absolute top-12 right-12 w-20 h-16 bg-emerald-500 rounded-full blur-xl opacity-70"></div>
    </div>
  </div>
);

const StElmosFireSVG = () => (
  <div className="relative w-full h-48 bg-slate-950 rounded-2xl overflow-hidden border-4 border-slate-800 flex items-center justify-center shadow-inner">
    {/* Frame Kaca Kokpit */}
    <div className="absolute inset-0 border-[16px] border-slate-700 rounded-xl"></div>
    <div className="absolute w-2 h-full bg-slate-700"></div>
    {/* Kegelapan Badai di luar */}
    <Cloud
      className="absolute -left-10 text-slate-800 w-64 h-64 opacity-50"
      fill="currentColor"
    />

    {/* Cahaya St. Elmo's Fire (Plasma Ungu) */}
    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-fuchsia-600/20 blur-xl animate-pulse"></div>
    <div className="absolute right-10 top-10 flex gap-2">
      <Zap
        className="text-fuchsia-400 w-8 h-8 drop-shadow-[0_0_10px_rgba(192,38,211,1)] animate-bounce"
        fill="currentColor"
      />
      <Zap
        className="text-blue-400 w-10 h-10 drop-shadow-[0_0_10px_rgba(96,165,250,1)] animate-pulse"
        fill="currentColor"
      />
    </div>
    <div className="absolute bottom-10 left-16 flex gap-1 transform rotate-45">
      <Zap
        className="text-fuchsia-400 w-6 h-6 drop-shadow-[0_0_10px_rgba(192,38,211,1)] animate-ping"
        fill="currentColor"
      />
      <Zap
        className="text-blue-400 w-8 h-8 drop-shadow-[0_0_10px_rgba(96,165,250,1)] animate-bounce"
        fill="currentColor"
      />
    </div>
  </div>
);

const PitotTubeSVG = () => (
  <div className="relative w-full h-48 bg-sky-200 rounded-2xl overflow-hidden border-2 border-sky-300 flex items-center justify-center shadow-inner">
    {/* Angin bergerak */}
    <div className="absolute top-10 left-0 w-full h-px bg-white/50 border-t border-dashed animate-[slide_2s_linear_infinite]"></div>
    <div className="absolute bottom-10 left-0 w-full h-px bg-white/50 border-t border-dashed animate-[slide_3s_linear_infinite]"></div>

    {/* Moncong Pesawat */}
    <div className="absolute right-0 top-0 w-16 h-full bg-slate-300 border-l-4 border-slate-400"></div>

    {/* Tabung Pitot (L-Shape) */}
    <div className="absolute right-16 top-1/2 -mt-4 flex items-center">
      {/* Pipa horizontal */}
      <div className="w-24 h-4 bg-slate-500 rounded-l-full relative shadow-lg">
        <div className="w-2 h-2 bg-black rounded-full absolute left-1 top-1"></div>{" "}
        {/* Lubang masuk udara */}
        {/* Lapisan Es menutupi lubang */}
        <div className="absolute -left-2 -top-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] animate-pulse"></div>
      </div>
      {/* Pipa vertikal nempel bodi */}
      <div className="w-4 h-16 bg-slate-500 -ml-4 -mt-12 rounded-t-md"></div>
    </div>
  </div>
);

const WindsockSVG = () => (
  <div className="relative w-full h-48 bg-sky-400 rounded-2xl overflow-hidden border-2 border-sky-500 flex items-end justify-center shadow-inner pb-4">
    <Wind className="absolute top-6 left-6 text-white/40 w-16 h-16 animate-[slide_4s_linear_infinite]" />

    {/* Tiang */}
    <div className="w-3 h-32 bg-slate-400 rounded-t-full border-l-2 border-white/50 relative">
      {/* Lingkaran Ring */}
      <div className="absolute -top-2 -left-3 w-8 h-12 border-4 border-slate-300 rounded-[50%]"></div>

      {/* Kantung Angin (Orange-White Stripes) */}
      <div className="absolute top-0 left-3 w-32 h-10 flex animate-[pulse_1s_ease-in-out_infinite_alternate] origin-left drop-shadow-xl transform -rotate-6">
        <div className="w-1/4 h-full bg-orange-500 rounded-l-full border-t border-b border-orange-600"></div>
        <div className="w-1/4 h-[90%] mt-[2%] bg-white border-t border-b border-slate-200"></div>
        <div className="w-1/4 h-[80%] mt-[5%] bg-orange-500 border-t border-b border-orange-600"></div>
        <div className="w-1/4 h-[70%] mt-[7%] bg-white rounded-r-full border-t border-b border-slate-200"></div>
      </div>
    </div>
  </div>
);

const BleedAirSystemSVG = () => (
  <div className="relative w-full h-48 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex items-center justify-center shadow-inner">
    {/* Sayap Pesawat Cross-Section */}
    <div className="relative w-64 h-32 bg-slate-600 rounded-[50%_0_0_50%] border-4 border-slate-500 flex overflow-hidden shadow-2xl">
      {/* Ruang dalam sayap (Leading Edge) */}
      <div className="absolute left-2 top-2 w-16 h-26 border-4 border-slate-400 rounded-[50%_0_0_50%] bg-slate-800"></div>

      {/* Aliran Pipa Panas (Bleed Air) */}
      <div className="absolute left-6 top-1/2 -mt-2 flex gap-1">
        <Flame
          className="text-red-500 w-6 h-6 animate-bounce drop-shadow-[0_0_10px_rgba(239,68,68,1)]"
          fill="currentColor"
        />
        <Flame
          className="text-orange-400 w-6 h-6 animate-pulse drop-shadow-[0_0_10px_rgba(249,115,22,1)]"
          fill="currentColor"
        />
        <ArrowRight className="text-red-400 w-6 h-6 animate-[slide_1s_linear_infinite]" />
      </div>

      {/* Es Rontok di Luar */}
      <div className="absolute -left-2 top-4 w-4 h-4 bg-sky-200 rounded-full animate-[ping_2s_infinite]"></div>
      <div className="absolute -left-2 bottom-4 w-4 h-4 bg-sky-200 rounded-full animate-[ping_1.5s_infinite]"></div>
    </div>
    <div className="absolute bottom-2 text-red-400 text-[10px] tracking-[0.3em] font-black">
      ANTI-ICING: ACTIVE
    </div>
  </div>
);

const SquallLineRadarSVG = () => (
  <div className="relative w-full h-48 bg-green-950 rounded-2xl overflow-hidden border-4 border-slate-800 flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,1)]">
    {/* Layar Navigasi */}
    <div className="absolute w-full h-px bg-green-700/50"></div>
    <div className="absolute h-full w-px bg-green-700/50"></div>

    {/* Ikon Pesawat di Tengah */}
    <Plane
      className="absolute text-white w-8 h-8 z-20 transform -rotate-45"
      fill="currentColor"
    />

    {/* Tembok Badai (Squall Line) Memanjang */}
    <div className="absolute top-6 left-12 w-64 h-12 bg-red-600 rounded-full blur-xl transform rotate-12 flex animate-pulse items-center justify-around">
      <div className="w-8 h-8 bg-fuchsia-600 rounded-full blur-md"></div>
      <div className="w-12 h-12 bg-purple-600 rounded-full blur-md"></div>
      <div className="w-8 h-8 bg-fuchsia-600 rounded-full blur-md"></div>
    </div>

    {/* Awan Ekor ringan */}
    <div className="absolute top-4 left-6 w-72 h-16 bg-yellow-500 rounded-full blur-xl opacity-60 transform rotate-12"></div>

    <div className="absolute bottom-2 right-2 text-rose-500 text-[10px] font-mono tracking-widest animate-ping">
      WARN: SQUALL LINE AHEAD
    </div>
  </div>
);

const CrosswindLandingSVG = () => (
  <div className="relative w-full h-48 bg-slate-400 rounded-2xl overflow-hidden border-2 border-slate-500 flex flex-col items-center justify-end shadow-inner">
    {/* Landasan Pacu Lurus */}
    <div className="w-32 h-full bg-slate-800 border-x-4 border-slate-700 relative flex justify-center perspective-1000">
      <div className="w-2 h-full bg-transparent border-l-4 border-dashed border-white/60"></div>
    </div>

    {/* Angin dari Kiri */}
    <Wind className="absolute top-1/2 left-4 text-sky-200/80 w-16 h-16 animate-[slide_1s_linear_infinite]" />

    {/* Pesawat Miring Serong (Crabbing) */}
    <div className="absolute bottom-16 flex flex-col items-center">
      <Plane
        className="text-white w-20 h-20 drop-shadow-2xl transform rotate-[25deg] origin-center -ml-8 animate-[bounce_0.5s_infinite_alternate]"
        fill="currentColor"
      />
      <div className="w-16 h-2 bg-black/30 rounded-full blur-md mt-4"></div>{" "}
      {/* Bayangan */}
    </div>
  </div>
);

const AerodynamicContrailSVG = () => (
  <div className="relative w-full h-48 bg-sky-600 rounded-2xl overflow-hidden border-2 border-sky-400 flex items-center justify-center shadow-inner">
    <div className="absolute inset-0 bg-gradient-to-t from-sky-400 to-blue-700"></div>

    {/* Pesawat dari belakang menanjak */}
    <div className="relative z-10 flex flex-col items-center transform -rotate-12 animate-pulse">
      {/* Jejak putih dari ujung sayap */}
      <div className="absolute -top-16 left-2 w-2 h-32 bg-gradient-to-b from-transparent to-white/80 blur-[2px] -rotate-[15deg]"></div>
      <div className="absolute -top-16 right-2 w-2 h-32 bg-gradient-to-b from-transparent to-white/80 blur-[2px] rotate-[15deg]"></div>
      <Plane
        className="text-slate-100 w-16 h-16 drop-shadow-xl -rotate-90"
        fill="currentColor"
      />
    </div>
  </div>
);

const RotorCloudSVG = () => (
  <div className="relative w-full h-48 bg-sky-200 rounded-2xl overflow-hidden border-2 border-sky-300 flex items-end shadow-inner">
    {/* Gunung */}
    <div className="w-48 h-32 bg-stone-700 rounded-tr-[100%] absolute left-[-20px] bottom-0 shadow-lg"></div>

    {/* Gelombang Angin (Mountain Wave) */}
    <div className="absolute top-8 left-16 w-[150%] h-16 border-t-4 border-dashed border-white/50 rounded-[50%] rotate-12"></div>

    {/* Awan Lentikular (Atas) */}
    <div className="absolute top-4 right-12 w-32 h-8 bg-white rounded-full shadow-md blur-[1px]"></div>
    <div className="absolute top-2 right-16 w-24 h-6 bg-white/80 rounded-full shadow-md blur-[1px]"></div>

    {/* Awan Rotor (Bawah) Mutar-mutar */}
    <div className="absolute top-24 right-16 flex items-center justify-center">
      <div className="w-20 h-16 bg-slate-400/80 rounded-full blur-md absolute"></div>
      <RotateCcw className="text-white w-10 h-10 animate-[spin_1s_linear_infinite]" />
    </div>
  </div>
);

const VolcanicAshMapSVG = () => (
  <div className="relative w-full h-48 bg-blue-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex items-center justify-center shadow-inner">
    {/* Garis Peta (Grid) */}
    <div className="absolute w-full h-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

    {/* Siluet Pulau */}
    <div className="absolute left-4 top-10 w-32 h-16 bg-emerald-800 rounded-[30%_70%_50%_40%] blur-[1px]"></div>

    {/* Titik Gunung Berapi */}
    <div className="absolute left-20 top-16">
      <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute -left-1.5 -top-1.5"></div>
      <div className="w-2 h-2 bg-red-500 rounded-full relative z-10"></div>
    </div>

    {/* Poligon Sebaran Abu (VAAC) */}
    <div className="absolute left-20 top-8 w-48 h-24 bg-rose-500/30 border border-rose-500/50 rounded-[10%_90%_60%_40%] transform rotate-12 backdrop-blur-sm animate-pulse flex items-center justify-center">
      <Skull className="text-white/50 w-8 h-8 transform -rotate-12" />
    </div>

    {/* Arah Angin */}
    <ArrowRight className="absolute right-4 top-16 text-white/50 w-8 h-8 animate-[slide_2s_linear_infinite]" />
  </div>
);

const GroundClutterRadarSVG = () => (
  <div className="relative w-full h-48 bg-emerald-950 rounded-2xl overflow-hidden border-[8px] border-slate-900 flex items-end justify-center shadow-[inset_0_0_30px_rgba(0,0,0,1)]">
    {/* Ring Radar */}
    <div className="absolute bottom-0 w-64 h-64 rounded-full border border-emerald-500/20"></div>
    <div className="absolute bottom-0 w-32 h-32 rounded-full border border-emerald-500/30"></div>

    <Plane
      className="absolute -bottom-4 text-white w-8 h-8 z-20"
      fill="currentColor"
    />

    {/* Ground Clutter (Gedung/Gunung) - Nggak gerak/statis dan berantakan */}
    <div className="absolute bottom-12 left-8 w-16 h-12 bg-fuchsia-600 rounded-[20%] blur-md opacity-80"></div>
    <div className="absolute bottom-16 right-10 w-24 h-16 bg-red-500 rounded-[40%] blur-md opacity-70"></div>
    <div className="absolute bottom-8 right-20 w-12 h-10 bg-yellow-400 rounded-[10%] blur-sm opacity-90"></div>

    {/* Wiper Scanner */}
    <div className="absolute bottom-0 w-[200%] h-[200%] bg-[conic-gradient(from_270deg,rgba(16,185,129,0.2)_0deg,transparent_90deg)] origin-bottom animate-[spin_4s_linear_infinite_alternate]"></div>

    {/* Tulisan TILT DOWN */}
    <div className="absolute top-2 left-2 text-rose-500 text-[10px] font-mono font-black animate-ping">
      RADAR TILT: -5° (DOWN)
    </div>
  </div>
);

const OxbowLakeSVG = () => (
  <div className="relative w-full h-48 bg-emerald-100 rounded-2xl overflow-hidden border-2 border-emerald-300 flex items-center justify-center shadow-inner">
    {/* Sungai Baru (Jalan Pintas lurus) */}
    <div className="absolute top-1/2 left-0 w-full h-12 bg-sky-400 transform -translate-y-1/2 shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]">
      {/* Aliran air */}
      <div className="absolute top-4 left-0 w-full h-px bg-white/40 border-t border-dashed animate-[slide_2s_linear_infinite]"></div>
      <div className="absolute top-8 left-0 w-full h-px bg-white/40 border-t border-dashed animate-[slide_1.5s_linear_infinite]"></div>
    </div>

    {/* Oxbow Lake (Terpotong, bentuk tapal kuda) */}
    <div className="absolute top-4 left-1/2 w-40 h-24 border-t-[16px] border-l-[16px] border-r-[16px] border-sky-600/80 rounded-t-full transform -translate-x-1/2 shadow-inner blur-[1px]"></div>

    {/* Endapan Sedimen memotong danau */}
    <div className="absolute top-1/2 left-1/2 w-48 h-12 flex justify-between transform -translate-x-1/2 -translate-y-1/2 z-10">
      <div className="w-6 h-full bg-orange-300/80 rounded-full blur-[2px]"></div>
      <div className="w-6 h-full bg-orange-300/80 rounded-full blur-[2px]"></div>
    </div>
  </div>
);

const WaterTableSVG = () => (
  <div className="relative w-full h-48 bg-sky-50 rounded-2xl overflow-hidden border-2 border-slate-300 flex flex-col shadow-inner">
    {/* Udara & Pohon */}
    <div className="h-16 w-full relative">
      <Cloud
        className="absolute top-2 right-4 text-slate-300 w-12 h-12"
        fill="currentColor"
      />
      <div className="absolute bottom-0 left-8 w-2 h-8 bg-amber-800"></div>{" "}
      {/* Batang */}
      <div className="absolute bottom-4 left-4 w-10 h-10 bg-emerald-500 rounded-full"></div>{" "}
      {/* Daun */}
    </div>

    {/* Tanah Atas (Zona Aerasi) - Kering */}
    <div className="h-12 w-full bg-orange-200 border-t-4 border-emerald-600 relative overflow-hidden">
      <div className="text-[8px] font-black tracking-widest text-orange-900/40 p-2">
        ZONE OF AERATION
      </div>
      {/* Tetesan air infiltrasi */}
      <Droplets className="absolute top-2 left-1/2 text-blue-400 w-4 h-4 animate-bounce" />
    </div>

    {/* Water Table (Garis batas) */}
    <div className="h-1 w-full bg-blue-500 border-t border-dashed border-white shadow-[0_0_10px_rgba(59,130,246,1)] z-10 animate-pulse"></div>

    {/* Air Tanah Bawah (Zona Saturasi) - Basah */}
    <div className="flex-1 w-full bg-blue-800 relative">
      <div className="text-[8px] font-black tracking-widest text-blue-200/50 p-2">
        ZONE OF SATURATION
      </div>
      <div className="absolute bottom-2 right-2 flex gap-1">
        <div className="w-8 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        <div className="w-12 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></div>
      </div>
    </div>
  </div>
);

const HydrographSVG = () => (
  <div className="relative w-full h-48 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex items-end p-4 shadow-inner">
    {/* Garis sumbu X dan Y */}
    <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-500"></div>
    <div className="absolute left-6 bottom-4 right-4 h-px bg-slate-500"></div>

    {/* Bar Chart Curah Hujan (Terbalik dari atas) */}
    <div className="absolute top-0 left-12 flex gap-2 rotate-180">
      <div className="w-4 h-12 bg-sky-400/50"></div>
      <div className="w-4 h-24 bg-sky-400/80"></div>
      <div className="w-4 h-16 bg-sky-400/50"></div>
    </div>

    {/* Kurva Debit Air (Flashy) */}
    <div className="relative w-full h-full ml-6 flex items-end">
      {/* Garis Lengkung SVG */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full preserve-3d"
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 C20,90 30,10 40,10 C50,10 60,80 100,90"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="3"
          className="animate-[dash_2s_linear_infinite]"
        />
        {/* Area di bawah kurva */}
        <path
          d="M0,100 C20,90 30,10 40,10 C50,10 60,80 100,90 L100,100 L0,100 Z"
          fill="rgba(244,63,94,0.2)"
        />
      </svg>
    </div>

    <div className="absolute right-4 top-4 text-[8px] font-black text-rose-500 tracking-widest bg-rose-500/10 px-2 py-1 rounded">
      FLASH FLOOD
    </div>
  </div>
);

const KarstCaveSVG = () => (
  <div className="relative w-full h-48 bg-stone-900 rounded-2xl overflow-hidden border-2 border-stone-600 flex flex-col shadow-inner">
    {/* Permukaan atas (Dolinen) */}
    <div className="h-10 w-full bg-emerald-800 border-b-8 border-stone-700 rounded-b-[40%] shadow-lg"></div>

    {/* Rongga Gua Utama */}
    <div className="flex-1 w-full bg-stone-950 relative overflow-hidden flex justify-center items-center">
      {/* Stalaktit (Atas) */}
      <div className="absolute top-0 left-10 w-4 h-12 bg-stone-700 rounded-b-full shadow-lg"></div>
      <div className="absolute top-0 right-16 w-6 h-16 bg-stone-700 rounded-b-full shadow-lg"></div>
      <div className="absolute top-0 right-20 w-2 h-8 bg-stone-700 rounded-b-full shadow-lg"></div>

      {/* Stalagmit (Bawah) */}
      <div className="absolute bottom-8 left-12 w-4 h-10 bg-stone-600 rounded-t-full"></div>
      <div className="absolute bottom-8 right-16 w-8 h-12 bg-stone-600 rounded-t-full"></div>

      {/* Tetesan Air */}
      <Droplets className="absolute top-14 right-17 text-sky-400 w-3 h-3 animate-bounce" />
    </div>

    {/* Sungai Bawah Tanah */}
    <div className="h-8 w-full bg-sky-900 border-t border-sky-700 relative overflow-hidden">
      <div className="absolute top-2 w-[200%] h-1 bg-sky-600/30 blur-sm animate-[slide_3s_linear_infinite]"></div>
    </div>
  </div>
);

const GeyserSVG = () => (
  <div className="relative w-full h-48 bg-sky-100 rounded-2xl overflow-hidden border-2 border-slate-300 flex flex-col items-center justify-end shadow-inner">
    {/* Langit & Awan uap */}
    <Cloud
      className="absolute top-2 text-slate-100 w-24 h-24 opacity-80 animate-pulse blur-sm"
      fill="currentColor"
    />
    <Cloud
      className="absolute top-8 text-white w-16 h-16 opacity-90 animate-bounce blur-[2px]"
      fill="currentColor"
    />

    {/* Kolom Air Mendidih menyembur */}
    <div className="absolute bottom-10 w-8 h-32 bg-sky-300/80 rounded-t-full blur-[1px] animate-[ping_1.5s_infinite_alternate] shadow-[0_0_20px_rgba(125,211,252,1)]"></div>
    <div className="absolute bottom-10 w-4 h-28 bg-white rounded-t-full blur-[1px] animate-[ping_1.5s_infinite_alternate-reverse]"></div>

    {/* Celah Tanah */}
    <div className="w-full h-12 bg-stone-600 rounded-t-[50%] relative border-t-4 border-stone-500 flex justify-center">
      {/* Lubang Magma di bawah */}
      <div className="w-16 h-4 bg-orange-500 rounded-[50%] absolute top-2 blur-[2px] shadow-[0_0_15px_rgba(249,115,22,1)] animate-pulse"></div>
    </div>
  </div>
);

const LiquefactionSVG = () => (
  <div className="relative w-full h-48 bg-stone-300 rounded-2xl overflow-hidden border-2 border-stone-400 flex flex-col justify-end shadow-inner">
    {/* Getaran Gempa */}
    <div className="absolute inset-0 bg-stone-800/10 animate-[bounce_0.1s_infinite_alternate]"></div>

    {/* Tanah Berubah Cair/Lumpur */}
    <div className="w-full h-20 bg-orange-900/80 rounded-t-full border-t-8 border-orange-800 blur-[2px] animate-[pulse_1s_infinite_alternate] flex items-center justify-center">
      <div className="w-[150%] h-4 bg-orange-700/50 blur-md animate-[spin_4s_linear_infinite]"></div>
    </div>

    {/* Bangunan/Rumah Amblas Miring */}
    <div className="absolute bottom-6 flex gap-8">
      <div className="w-16 h-24 bg-slate-700 border-4 border-slate-600 transform rotate-12 origin-bottom translate-y-8 animate-[slide_3s_ease-in_forwards]">
        <div className="w-full h-4 bg-slate-500 mb-2"></div>
        <div className="w-full h-4 bg-slate-500"></div>
      </div>
      <div className="w-12 h-20 bg-slate-600 border-4 border-slate-500 transform -rotate-[20deg] origin-bottom translate-y-6 mt-4 animate-[slide_2s_ease-in_forwards]"></div>
    </div>
    <AlertTriangle className="absolute top-4 left-4 text-red-500 w-10 h-10 animate-ping" />
  </div>
);

const AtmosphericRiverSVG = () => (
  <div className="relative w-full h-48 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex items-center justify-center shadow-inner">
    {/* Latar Bumi Gelap */}
    <Globe2 className="absolute text-sky-900/40 w-64 h-64 animate-[spin_20s_linear_infinite]" />

    {/* Sungai Atmosfer (Pita Awan Putih/Biru Panjang) */}
    <div className="absolute w-[150%] h-12 transform rotate-12 flex">
      <div className="w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent blur-md animate-[slide_2s_linear_infinite]"></div>
      <div className="absolute top-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent blur-xl animate-[slide_1.5s_linear_infinite]"></div>
    </div>

    <div className="absolute bottom-4 right-4 text-[10px] text-sky-400 font-mono tracking-widest border border-sky-400/50 px-2 py-1 rounded-full bg-sky-900/30">
      MOISTURE TRANSPORT
    </div>
  </div>
);

const UrbanSinkholeSVG = () => (
  <div className="relative w-full h-48 bg-stone-900 rounded-2xl overflow-hidden border-2 border-stone-700 flex flex-col shadow-inner">
    {/* Aspal Jalanan */}
    <div className="w-full h-24 bg-slate-800 border-b-8 border-slate-600 flex justify-center items-center relative">
      <div className="w-full h-2 border-t-4 border-dashed border-yellow-500"></div>

      {/* Lubang Raksasa di Aspal */}
      <div className="absolute -bottom-8 w-32 h-16 bg-stone-950 rounded-[40%_60%_70%_30%] shadow-[inset_0_20px_30px_rgba(0,0,0,0.9)] border-4 border-stone-800 z-10 flex items-center justify-center">
        {/* Pipa Pecah (Air Ngalir) */}
        <div className="w-16 h-2 bg-slate-400 absolute -top-1 -left-2 transform rotate-12">
          <div className="w-2 h-12 bg-sky-400 absolute right-0 top-0 blur-[1px] animate-[slide_0.5s_linear_infinite]"></div>
        </div>
      </div>
    </div>

    {/* Tanah Bawah Jalan (Rongga) */}
    <div className="flex-1 w-full bg-stone-900 relative p-4 flex items-end">
      <Skull className="text-stone-700 w-12 h-12 absolute bottom-2 left-1/2 transform -translate-x-1/2" />
    </div>
  </div>
);

const WaterspoutSVG = () => (
  <div className="relative w-full h-48 bg-sky-200 rounded-2xl overflow-hidden border-2 border-sky-300 flex flex-col justify-between shadow-inner">
    {/* Awan Badai Atas */}
    <div className="w-full h-12 bg-slate-700 rounded-b-[50%] blur-[2px] shadow-2xl z-10 relative">
      <CloudLightning className="absolute top-2 left-6 text-yellow-400/50 w-8 h-8 animate-pulse" />
    </div>

    {/* Belalai Angin (Funnel Cloud) */}
    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-16 h-32 flex flex-col items-center">
      {/* Pusaran Transparan */}
      <div className="w-16 h-32 bg-gradient-to-b from-slate-500/60 to-transparent blur-[2px] rounded-t-full transform rotate-3 animate-[pulse_0.5s_infinite_alternate]"></div>
      <div className="absolute top-0 w-8 h-32 bg-slate-400/80 blur-[1px] rounded-t-full animate-[spin_0.2s_linear_infinite] transform -rotate-3"></div>
    </div>

    {/* Pusaran Air Laut di Bawah */}
    <div className="w-full h-12 bg-blue-600 flex items-center justify-center relative border-t-2 border-blue-400">
      <div className="w-24 h-6 bg-white/40 rounded-[50%] absolute -top-3 animate-[spin_0.5s_linear_infinite] blur-sm"></div>
    </div>
  </div>
);

const SupercellStormSVG = () => (
  <div className="relative w-full h-48 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex flex-col justify-end shadow-inner p-2">
    {/* Bentuk Landasan (Anvil) Raksasa di atas */}
    <div className="w-full h-16 bg-slate-300 rounded-full blur-[2px] absolute top-2 transform -skew-x-12 shadow-2xl"></div>
    <div className="w-full h-12 bg-slate-400 rounded-full blur-[2px] absolute top-6"></div>

    {/* Badan Badai Muter (Mesocyclone) */}
    <div className="w-32 h-24 bg-slate-600 rounded-full blur-md absolute top-12 left-1/2 transform -translate-x-1/2 animate-[spin_4s_linear_infinite]"></div>

    {/* Wall Cloud (Turun di bawah) */}
    <div className="w-24 h-12 bg-slate-800 rounded-b-xl blur-[1px] absolute bottom-8 left-1/4 shadow-lg border-b border-slate-950"></div>

    {/* Hujan Es & Presipitasi Lebat */}
    <div className="absolute bottom-0 right-10 w-24 h-16 bg-blue-400/30 blur-sm transform -rotate-12 border-l-4 border-dashed border-white/50"></div>

    {/* Kilat Menyambar */}
    <Zap
      className="absolute bottom-4 left-1/3 text-yellow-400 w-10 h-10 drop-shadow-[0_0_15px_rgba(250,204,21,1)] animate-bounce"
      fill="currentColor"
    />
  </div>
);

const IceCoreSVG = () => (
  <div className="relative w-full h-48 bg-sky-900 rounded-2xl overflow-hidden border-2 border-sky-700 flex items-center justify-center shadow-inner">
    {/* Tabung Es (Ice Core) */}
    <div className="w-64 h-24 bg-gradient-to-r from-sky-200/40 via-white/60 to-sky-200/40 border-y-2 border-white/50 rounded-lg backdrop-blur-sm relative flex items-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
      {/* Gelembung Udara Purba (Air Bubbles) */}
      <div className="absolute left-6 top-4 w-3 h-3 border border-white rounded-full"></div>
      <div className="absolute left-10 bottom-6 w-2 h-2 border border-white rounded-full"></div>
      <div className="absolute left-24 top-8 w-4 h-4 border border-white rounded-full"></div>
      <div className="absolute right-20 top-6 w-2 h-2 border border-white rounded-full"></div>
      <div className="absolute right-12 bottom-4 w-3 h-3 border border-white rounded-full"></div>

      {/* Garis-garis Lapisan Musim (Banding) */}
      <div className="absolute w-full h-full flex justify-evenly opacity-30">
        <div className="w-1 h-full bg-slate-800"></div>
        <div className="w-1 h-full bg-slate-800"></div>
        <div className="w-0.5 h-full bg-slate-800"></div>
        <div className="w-2 h-full bg-slate-800"></div>
        <div className="w-1 h-full bg-slate-800"></div>
      </div>
    </div>

    {/* Teks Scanner */}
    <div className="absolute bottom-2 left-4 text-sky-400 font-mono text-[10px] tracking-widest animate-pulse">
      ANALYZING CO2 BUBBLES...
    </div>
  </div>
);

const TreeRingsSVG = () => (
  <div className="relative w-full h-48 bg-stone-900 rounded-2xl overflow-hidden border-2 border-stone-700 flex items-center justify-center shadow-inner">
    {/* Potongan Kayu (Cross Section) */}
    <div className="w-40 h-40 bg-amber-700 rounded-full flex items-center justify-center border-4 border-amber-900 shadow-2xl relative overflow-hidden">
      {/* Cincin Tahun-Tahun (Tree Rings) */}
      <div className="w-32 h-32 rounded-full border-2 border-amber-800/80 absolute"></div>
      {/* Cincin Tebal (Tahun Basah) */}
      <div className="w-28 h-28 rounded-full border-4 border-amber-800/90 absolute"></div>
      <div className="w-20 h-20 rounded-full border-2 border-amber-800/70 absolute"></div>
      {/* Cincin Sangat Tipis (Kekeringan/El Nino) */}
      <div className="w-16 h-16 rounded-full border border-amber-900 absolute"></div>
      <div className="w-10 h-10 rounded-full border-2 border-amber-800 absolute"></div>

      {/* Inti Kayu (Pith) */}
      <div className="w-2 h-2 bg-amber-950 rounded-full"></div>
    </div>

    <div className="absolute right-4 top-1/2 flex items-center gap-2">
      <div className="w-8 h-px bg-rose-500"></div>
      <div className="text-rose-500 font-mono text-[8px] font-black">
        1997 EL NINO
        <br />
        (THIN RING)
      </div>
    </div>
  </div>
);

const SunspotsSVG = () => (
  <div className="relative w-full h-48 bg-slate-950 rounded-2xl overflow-hidden border-2 border-rose-900 flex items-center justify-center shadow-inner">
    {/* Matahari */}
    <div className="w-40 h-40 bg-orange-500 rounded-full blur-[1px] shadow-[0_0_40px_rgba(249,115,22,0.8)] relative flex items-center justify-center overflow-hidden animate-[pulse_3s_infinite_alternate]">
      {/* Tekstur Permukaan */}
      <div className="absolute w-[150%] h-[150%] bg-[radial-gradient(circle,transparent_20%,rgba(0,0,0,0.1)_20%,transparent_40%)] bg-[length:10px_10px] opacity-30"></div>

      {/* Sunspots (Bintik Gelap) */}
      <div className="absolute top-10 left-8 w-4 h-3 bg-stone-900 rounded-full blur-[1px]"></div>
      <div className="absolute top-12 left-14 w-2 h-2 bg-stone-900 rounded-full blur-[1px]"></div>
      <div className="absolute bottom-10 right-10 w-5 h-4 bg-stone-900 rounded-full blur-[1px]"></div>
      <div className="absolute bottom-8 right-16 w-3 h-3 bg-stone-900 rounded-full blur-[1px]"></div>

      {/* Solar Flare (Cahaya Panas di sekitar bintik) */}
      <div className="absolute top-10 left-10 w-12 h-8 bg-yellow-300 blur-md opacity-80 animate-pulse"></div>
      <div className="absolute bottom-10 right-12 w-16 h-10 bg-yellow-300 blur-md opacity-80 animate-pulse delay-100"></div>
    </div>
  </div>
);

const KeelingCurveSVG = () => (
  <div className="relative w-full h-48 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex flex-col p-4 shadow-inner">
    {/* Sumbu X dan Y */}
    <div className="absolute left-6 top-4 bottom-8 w-px bg-slate-500"></div>
    <div className="absolute left-6 bottom-8 right-4 h-px bg-slate-500"></div>

    <div className="text-[10px] text-slate-400 font-black tracking-widest ml-4 mb-2">
      CO2 CONCENTRATION (PPM)
    </div>

    {/* Kurva Zig-Zag Naik (Keeling Curve) */}
    <div className="relative flex-1 w-full ml-4 flex items-end overflow-hidden">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0,90 L5,85 L10,88 L15,80 L20,83 L25,75 L30,78 L35,65 L40,68 L45,55 L50,58 L55,45 L60,48 L65,35 L70,38 L75,25 L80,28 L85,15 L90,18 L95,5 L100,8"
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="1.5"
          className="animate-[dash_3s_linear_infinite]"
        />
        {/* Garis Trend Lurus (Merah) */}
        <path
          d="M0,90 Q50,45 100,5"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      </svg>
    </div>

    <div className="absolute bottom-2 right-4 text-[8px] text-rose-500 font-mono font-black animate-pulse">
      420+ PPM (DANGER)
    </div>
  </div>
);

const PrecessionWobbleSVG = () => (
  <div className="relative w-full h-48 bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-700 flex items-center justify-center shadow-inner">
    {/* Garis Vertikal Lurus (Batas Normal) */}
    <div className="absolute w-px h-40 bg-slate-600 border-dashed border-l-2"></div>

    {/* Lintasan Goyangan (Wobble Circle) di atas */}
    <div className="absolute top-4 w-32 h-10 border-4 border-dashed border-rose-500/50 rounded-[50%] transform rotate-x-60 animate-[spin_4s_linear_infinite]"></div>

    {/* Bumi Miring & Berputar */}
    <div className="relative flex items-center justify-center animate-[spin_4s_linear_infinite] origin-bottom h-40">
      {/* Sumbu rotasi merah */}
      <div className="absolute w-1 h-48 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]"></div>
      <Globe2 className="text-sky-400 w-20 h-20 bg-slate-900 rounded-full" />
    </div>

    <div className="absolute bottom-4 text-sky-300 text-[10px] font-mono tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-sky-500/30">
      CYCLE: 26,000 YEARS
    </div>
  </div>
);

const ThermohalineBeltSVG = () => (
  <div className="relative w-full h-48 bg-blue-950 rounded-2xl overflow-hidden border-2 border-blue-800 flex items-center justify-center shadow-inner">
    {/* Peta Benua (Siluet) */}
    <div className="absolute left-4 top-10 w-24 h-32 bg-emerald-900/40 rounded-[20%_40%_60%_30%] blur-[2px]"></div>
    <div className="absolute right-4 top-4 w-20 h-24 bg-emerald-900/40 rounded-[40%_20%_50%_40%] blur-[2px]"></div>

    {/* Arus Panas (Merah) di Permukaan */}
    <div className="absolute bottom-10 left-10 w-48 h-16 border-b-4 border-r-4 border-red-500 rounded-br-[50%] shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-[pulse_2s_infinite]">
      <ArrowRight className="absolute -right-3 -top-2 text-red-500 w-6 h-6 transform -rotate-90" />
    </div>

    {/* Titik Sinking (Tenggelam di Kutub) */}
    <div className="absolute top-10 right-24 w-8 h-8 bg-white/80 rounded-full blur-[2px] animate-ping"></div>

    {/* Arus Dingin (Biru) Bawah Laut */}
    <div className="absolute top-14 right-20 w-40 h-20 border-t-4 border-l-4 border-sky-400 rounded-tl-[50%] shadow-[0_0_15px_rgba(56,189,248,0.8)] animate-[pulse_2s_infinite_delay-1000]">
      <ChevronLeft className="absolute -left-4 bottom-2 text-sky-400 w-8 h-8 transform -rotate-90" />
    </div>
  </div>
);

const LaNinaFloodSVG = () => (
  <div className="relative w-full h-48 bg-sky-100 rounded-2xl overflow-hidden border-2 border-sky-300 flex items-center shadow-inner">
    {/* Indonesia (Kiri) - Basah & Hujan */}
    <div className="absolute left-0 w-1/2 h-full bg-emerald-600/20 flex flex-col items-center justify-center border-r-2 border-dashed border-sky-400">
      <CloudRain className="text-blue-600 w-16 h-16 animate-bounce drop-shadow-lg" />
      <div className="w-full h-8 bg-blue-500/50 absolute bottom-0"></div>{" "}
      {/* Banjir */}
      <span className="absolute bottom-2 text-blue-900 font-black text-[10px]">
        INDONESIA (BANJIR)
      </span>
    </div>

    {/* Pasifik / Peru (Kanan) - Kering & Upwelling */}
    <div className="absolute right-0 w-1/2 h-full bg-orange-100 flex flex-col items-center justify-center">
      <Sun
        className="text-orange-500 w-16 h-16 animate-pulse"
        fill="currentColor"
      />
      {/* Upwelling Panah Biru ke Atas */}
      <div className="absolute bottom-4 flex flex-col items-center animate-[slide_1.5s_linear_infinite]">
        <div className="w-2 h-8 bg-sky-400/80 rounded-full"></div>
      </div>
      <span className="absolute bottom-2 text-orange-800 font-black text-[10px]">
        PERU (KERING)
      </span>
    </div>

    {/* Angin Pasat Kencang ke Kiri */}
    <div className="absolute top-1/2 left-1/4 w-1/2 flex items-center justify-center transform -translate-y-1/2 z-10">
      <div className="w-full h-2 bg-sky-500 relative animate-[slide_1s_linear_infinite]">
        <ChevronLeft className="absolute -left-4 -top-3 text-sky-600 w-8 h-8" />
      </div>
    </div>
  </div>
);

const AlbedoEffectSVG = () => (
  <div className="relative w-full h-48 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex shadow-inner">
    <Sun
      className="absolute top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 w-12 h-12 animate-[spin_10s_linear_infinite]"
      fill="currentColor"
    />

    {/* Setengah Laut Gelap (Absorpsi Panas) */}
    <div className="w-1/2 h-full bg-blue-950 flex flex-col items-center justify-end pb-4 relative">
      <div className="text-[8px] font-black text-sky-300 tracking-widest">
        OCEAN (ABSORBS HEAT)
      </div>
      {/* Sinar masuk diserap */}
      <div className="absolute top-10 left-1/2 w-1 h-20 bg-yellow-400 transform rotate-12 drop-shadow-[0_0_8px_rgba(250,204,21,1)]"></div>
      <div className="absolute bottom-12 w-10 h-10 bg-red-500/50 rounded-full blur-xl animate-pulse"></div>
    </div>

    {/* Setengah Es Putih (Albedo/Pantulan) */}
    <div className="w-1/2 h-full bg-slate-100 flex flex-col items-center justify-end pb-4 relative border-l border-slate-400">
      <div className="text-[8px] font-black text-slate-500 tracking-widest z-10">
        ICE (HIGH ALBEDO)
      </div>
      {/* Sinar masuk */}
      <div className="absolute top-10 right-1/2 w-1 h-12 bg-yellow-400 transform -rotate-12"></div>
      {/* Sinar dipantulkan keluar (bounce) */}
      <div className="absolute top-10 right-1/4 w-1 h-16 bg-yellow-200 transform rotate-[30deg] animate-pulse drop-shadow-[0_0_10px_rgba(253,224,71,1)]">
        <ArrowRight className="absolute -top-4 -right-3 text-yellow-200 w-6 h-6 transform -rotate-90" />
      </div>
    </div>
  </div>
);

const TippingBucketSVG = () => (
  <div className="relative w-full h-48 bg-slate-200 rounded-2xl overflow-hidden border-2 border-slate-400 flex flex-col items-center justify-center shadow-inner">
    {/* Corong Air */}
    <div className="w-24 h-12 border-t-8 border-slate-600 border-x-4 border-x-transparent bg-slate-300 relative">
      <Droplets className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-500 w-6 h-6 animate-bounce" />
    </div>

    {/* Silinder Bawah */}
    <div className="w-16 h-20 border-x-4 border-b-4 border-slate-500 bg-slate-800 relative flex items-center justify-center overflow-hidden">
      {/* Jungkat Jungkit (Bucket) */}
      <div className="w-12 h-6 bg-blue-400/80 border-2 border-blue-500 rounded-b-md transform -rotate-12 animate-[bounce_1s_infinite_alternate] origin-bottom">
        <div className="w-1 h-8 bg-slate-400 absolute left-1/2 -top-4 transform -translate-x-1/2"></div>
      </div>

      {/* Kabel Sinyal Data */}
      <div className="absolute right-0 bottom-2 w-8 h-1 bg-red-500 rounded-full animate-pulse"></div>
    </div>
  </div>
);

const RadiosondeBalloonSVG = () => (
  <div className="relative w-full h-48 bg-sky-400 rounded-2xl overflow-hidden border-2 border-sky-500 flex flex-col items-center justify-end shadow-inner pb-2">
    <div className="absolute inset-0 bg-gradient-to-t from-sky-400 to-blue-800"></div>

    <div className="relative flex flex-col items-center animate-[slide_3s_ease-in-out_infinite_alternate]">
      {/* Balon Helium Raksasa */}
      <div className="w-20 h-24 bg-white rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-lg relative flex justify-center">
        <div className="absolute bottom-0 w-4 h-2 bg-slate-300 rounded-b-md"></div>
      </div>

      {/* Tali Pengikat */}
      <div className="w-0.5 h-12 bg-white"></div>

      {/* Parasut Kecil (terlipat di tali) */}
      <div className="w-6 h-4 bg-red-500 rounded-t-full -mt-8 mb-4"></div>

      {/* Kotak Sensor Radiosonde */}
      <div className="w-8 h-10 bg-slate-100 border-2 border-slate-300 rounded-sm relative shadow-md">
        <div className="w-1 h-6 bg-slate-800 absolute -right-2 top-0 transform rotate-12"></div>{" "}
        {/* Antena Tx */}
        <div className="w-4 h-4 bg-blue-500 rounded-full absolute bottom-1 left-1.5 animate-ping opacity-70"></div>
      </div>
    </div>
  </div>
);

const EvaporationPanSVG = () => (
  <div className="relative w-full h-48 bg-green-900 rounded-2xl overflow-hidden border-2 border-green-700 flex items-center justify-center shadow-inner">
    {/* Permukaan Rumput */}
    <div className="absolute bottom-0 w-full h-16 bg-emerald-800"></div>

    {/* Panci Kayu/Besi Penakar (Class A Pan) */}
    <div className="relative w-40 h-12 bg-slate-400 border-4 border-slate-500 rounded-b-xl shadow-2xl flex items-center justify-center">
      {/* Air di dalam panci */}
      <div className="absolute top-2 w-[90%] h-2 bg-blue-500/80 rounded-full blur-[1px]"></div>

      {/* Kawat Penutup (Wire Mesh) */}
      <div className="absolute -top-4 w-44 h-8 border-2 border-slate-600 rounded-[50%] bg-[linear-gradient(90deg,rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.5)_1px,transparent_1px)] bg-[size:5px_5px]"></div>

      {/* Hook Gauge (Pengukur ketinggian jarum) */}
      <div className="absolute -top-8 left-4 w-2 h-16 bg-yellow-600 border border-yellow-700 z-10"></div>
    </div>

    <Sun
      className="absolute top-4 left-6 text-yellow-400 w-12 h-12 animate-pulse"
      fill="currentColor"
    />
  </div>
);

const AnemometerCupsSVG = () => (
  <div className="relative w-full h-48 bg-sky-200 rounded-2xl overflow-hidden border-2 border-sky-400 flex flex-col items-center justify-end shadow-inner pb-4">
    <Wind className="absolute top-6 left-6 text-white/50 w-16 h-16 animate-[slide_1s_linear_infinite]" />

    {/* Tiang AWS */}
    <div className="w-4 h-24 bg-slate-600 border-r-2 border-slate-400 rounded-t-md relative">
      {/* Poros putar */}
      <div className="absolute -top-4 left-1 w-2 h-6 bg-slate-400"></div>

      {/* Mangkuk Anemometer (Cup) - Animasi Muter Kenceng */}
      <div className="absolute -top-4 -left-10 w-24 h-4 animate-[spin_0.5s_linear_infinite] origin-center flex justify-between items-center">
        {/* Cup Kiri */}
        <div className="w-6 h-6 bg-slate-800 rounded-l-full border-2 border-slate-900 shadow-xl"></div>
        {/* Batang Tengah */}
        <div className="w-full h-1 bg-slate-700 absolute"></div>
        {/* Cup Kanan */}
        <div className="w-6 h-6 bg-slate-800 rounded-r-full border-2 border-slate-900 shadow-xl"></div>
      </div>
    </div>
  </div>
);

const LidarLaserSVG = () => (
  <div className="relative w-full h-48 bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 flex flex-col items-center justify-end shadow-inner">
    {/* Langit Penuh Aerosol/Polusi (Titik-titik) */}
    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px] opacity-30"></div>

    {/* Sinar Laser (LIDAR) Nembak Ke Atas */}
    <div className="absolute bottom-12 w-2 h-48 bg-emerald-400 blur-[2px] animate-[pulse_0.1s_infinite] shadow-[0_0_20px_rgba(52,211,153,1)]"></div>
    <div className="absolute bottom-12 w-0.5 h-48 bg-white animate-[pulse_0.1s_infinite_alternate]"></div>

    {/* Mesin Kotak LIDAR */}
    <div className="w-20 h-16 bg-slate-700 border-t-8 border-slate-600 rounded-t-lg relative z-10 shadow-2xl flex justify-center items-start">
      {/* Lensa Emitor */}
      <div className="w-8 h-4 bg-emerald-950 rounded-b-full border-2 border-emerald-500 flex justify-center overflow-hidden">
        <div className="w-4 h-2 bg-emerald-500 blur-sm mt-1"></div>
      </div>
    </div>
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
            <div className="mb-12 max-w-lg mx-auto transform hover:scale-[1.02] transition-transform shadow-2xl rounded-3xl overflow-hidden bg-slate-800/50">
              {q.imageType === "condensation" && <WaterCycleSVG />}
              {q.imageType === "cumulonimbus" && <CumulonimbusSVG />}
              {q.imageType === "thermometer" && <ThermometerSVG />}
              {q.imageType === "orbit_elliptical" && <OrbitEllipticalSVG />}
              {q.imageType === "permafrost" && <PermafrostSVG />}
              {q.imageType === "hail_storm" && <HailStormSVG />}
              {q.imageType === "radiation_fog" && <RadiationFogSVG />}
              {q.imageType === "cryosphere" && <CryosphereSVG />}
              {q.imageType === "sinkhole" && <SinkholeSVG />}
              {q.imageType === "axial_tilt" && <AxialTiltSVG />}
              {q.imageType === "ice_age" && <IceAgeSVG />}
              {q.imageType === "wind_vane" && <WindVaneSVG />}
              {q.imageType === "lightning_strike" && <LightningStrikeSVG />}
              {q.imageType === "solar_storm" && <SolarStormSVG />}
              {q.imageType === "mammatus_cloud" && <MammatusCloudSVG />}
              {q.imageType === "overshooting_top" && <OvershootingTopSVG />}
              {q.imageType === "roll_cloud" && <RollCloudSVG />}
              {q.imageType === "weather_radar" && <WeatherRadarSVG />}
              {q.imageType === "cyclone_eye" && <CycloneEyeSVG />}
              {q.imageType === "clear_air_turbulence" && (
                <ClearAirTurbulenceSVG />
              )}
              {q.imageType === "microburst_downburst" && (
                <MicroburstDownburstSVG />
              )}
              {q.imageType === "wing_icing" && <WingIcingSVG />}
              {q.imageType === "cockpit_weather_radar" && (
                <CockpitWeatherRadarSVG />
              )}
              {q.imageType === "st_elmos_fire" && <StElmosFireSVG />}
              {q.imageType === "pitot_tube" && <PitotTubeSVG />}
              {q.imageType === "windsock" && <WindsockSVG />}
              {q.imageType === "bleed_air_system" && <BleedAirSystemSVG />}
              {q.imageType === "squall_line_radar" && <SquallLineRadarSVG />}
              {q.imageType === "crosswind_landing" && <CrosswindLandingSVG />}
              {q.imageType === "aerodynamic_contrail" && (
                <AerodynamicContrailSVG />
              )}
              {q.imageType === "rotor_cloud" && <RotorCloudSVG />}
              {q.imageType === "volcanic_ash_map" && <VolcanicAshMapSVG />}
              {q.imageType === "ground_clutter_radar" && (
                <GroundClutterRadarSVG />
              )}
              {q.imageType === "oxbow_lake" && <OxbowLakeSVG />}
              {q.imageType === "water_table" && <WaterTableSVG />}
              {q.imageType === "hydrograph" && <HydrographSVG />}
              {q.imageType === "karst_cave" && <KarstCaveSVG />}
              {q.imageType === "geyser" && <GeyserSVG />}
              {q.imageType === "liquefaction" && <LiquefactionSVG />}
              {q.imageType === "atmospheric_river" && <AtmosphericRiverSVG />}
              {q.imageType === "urban_sinkhole" && <UrbanSinkholeSVG />}
              {q.imageType === "waterspout" && <WaterspoutSVG />}
              {q.imageType === "supercell_storm" && <SupercellStormSVG />}
              {q.imageType === "ice_core" && <IceCoreSVG />}
              {q.imageType === "tree_rings" && <TreeRingsSVG />}
              {q.imageType === "sunspots" && <SunspotsSVG />}
              {q.imageType === "keeling_curve" && <KeelingCurveSVG />}
              {q.imageType === "precession_wobble" && <PrecessionWobbleSVG />}
              {q.imageType === "thermohaline_belt" && <ThermohalineBeltSVG />}
              {q.imageType === "lanina_flood" && <LaNinaFloodSVG />}
              {q.imageType === "albedo_effect" && <AlbedoEffectSVG />}
              {q.imageType === "tipping_bucket_rain_gauge" && (
                <TippingBucketSVG />
              )}
              {q.imageType === "radiosonde_balloon" && <RadiosondeBalloonSVG />}
              {q.imageType === "evaporation_pan" && <EvaporationPanSVG />}
              {q.imageType === "anemometer_cups" && <AnemometerCupsSVG />}
              {q.imageType === "lidar_laser" && <LidarLaserSVG />}
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
