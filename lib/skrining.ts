export type KatPenyakit = "DM" | "HT" | "S" | "J" | "G" | "OA";
type Skrining = {
  pertanyaan: string;
  jawaban: string[];
  kategori?: KatPenyakit[];
}[];
export const skriningRiwKesehatan = [
  {
    pertanyaan: "Apakah anda merasa haus pada saat melakukan aktifitas normal?",
    jawaban: [
      "Ya, sering dan selalu haus",
      "Tidak, saya merasa haus secara normal saja",
    ],
    kategori: ["DM"],
  },
  {
    pertanyaan:
      "Apakah anda sering terbangun disaat tidur malam akibat buang air kecil berkali-kali?",
    jawaban: ["Ya, lebih dari 3 kali", "Tidak"],
    kategori: ["DM"],
  },
  {
    pertanyaan:
      "Apakah anda selalu merasa lapar walaupun sudah makan besar (nasi, lauk pauk dsb) beberapa saat sebelumnya?",
    jawaban: [
      "Ya, saya selalu merasa lapar meskipun sudah makan banyak dan berkali-kali (makan lebih dari 5 kali)",
      "Tidak, saya makan 2-3 kali sehari dengan porsi normal",
    ],
    kategori: ["DM"],
  },
  {
    pertanyaan:
      "Apakah anda mempunyai kebiasaan makan-makanan yang berasa asin?",
    jawaban: [
      "Ya, hampir setiap hari saya mengkonsumsi makanan yang berasa asin",
      "Tidak",
    ],
    kategori: ["HT"],
  },
  {
    pertanyaan: "Apakah anda mengkonsumsi kopi?",
    jawaban: [
      "Ya, saya hampir selalu mengkonsumsi kopi setiap hari lebih dari 3 gelas sehari",
      "Tidak, saya tidak pernah mengkonsumsi",
    ],
    kategori: ["HT"],
  },
  {
    pertanyaan: "Apakah anda suka merokok?",
    jawaban: [
      "Ya, saya merokok hamper setiap hari lebih dari 1 bungkus",
      "Tidak",
    ],
    kategori: ["HT", "S", "J"],
  },
  {
    pertanyaan:
      "Apakah pekerjaan anda menuntut anda untuk bekerja keras, sehingga anda merasakan sering mudah lelah, susah tidur dan cepat terbangun di pagi hari?",
    jawaban: [
      "Ya, saya merasa suasana di tempat kerja saya sangat tinggi, sehingga saya merasa tidak nyaman di tempat kerja. Ketika di rumah saya merasa susah tidur dan saya tidak bisa tidur nyeyak, saya sering terbangun dini hari                ",
      "Tidak, tempat kerja kami terasa nyaman, meski penuh persaingan namun tidak menegangkan. Kami cukup tidur dan nyenyak",
    ],
    kategori: ["S", "J"],
  },
  {
    pertanyaan: "Apakah punya kebiasaan olahraga rutin dan teratur?",
    jawaban: [
      "Ya, saya rutin olahraga sedikitnya 2 kali seminggu",
      "Tidak, saya jarang berolahraga",
    ],
    kategori: ["S", "J"],
  },
  {
    pertanyaan:
      "Apakah anda pernah memperoleh hasil pemeriksaan kolesterol tinggi?",
    jawaban: [
      "Ya, hasil kolesterol saya dinyatakan tinggi",
      "Tidak, hasil kolesterol saya normal",
    ],
    kategori: ["S", "J"],
  },
  {
    pertanyaan: "Apakah anda punya kebiasaan kurang minum air putih?",
    jawaban: [
      "Ya, saya minum hanya bila haus",
      "Tidak, saya minum minimal 2 liter per hari",
    ],
    kategori: ["G"],
  },
  {
    pertanyaan: "Apakah anda punya kebiasaan minum-minuman kemasan atau soda?",
    jawaban: ["Ya", "Tidak"],
    kategori: ["G"],
  },
  {
    pertanyaan:
      "Apakah anda sering mengkonsumsi jamu-jamuan atau membeli obat terutama anti nyeri di apotek tanpa resep dokter?",
    jawaban: ["Ya", "Tidak"],
    kategori: ["G"],
  },
  {
    pertanyaan: "Apakah anda merasakan nyeri sendi saat posisi lutut ditekuk?",
    jawaban: ["Ya", "Tidak"],
    kategori: ["OA"],
  },
  {
    pertanyaan:
      "Apakah kaki anda terasa kaku-kaku pada saat bangun tidur di pagi hari?",
    jawaban: ["Ya", "Tidak"],
    kategori: ["OA"],
  },
  {
    pertanyaan: "Apakah saat bekerja anda sering mengangkat beban berat?",
    jawaban: ["Ya", "Tidak"],
    kategori: ["OA"],
  },
] as Skrining;

export const skriningRiwPenyakit = [
  { pertanyaan: "Diabetes Mellitus (kencing manis)", kategori: ["DM"] },
  { pertanyaan: "Stroke", kategori: ["S"] },
  { pertanyaan: "Penyakit pada retina/mata", kategori: ["DM"] },
  { pertanyaan: "Hipertensi/tekanan darah tinggi", kategori: ["HT"] },
  { pertanyaan: "Penyakit jantung koroner", kategori: ["J"] },
  { pertanyaan: "Kolesterol tinggi", kategori: ["S", "J"] },
  { pertanyaan: "Penyakit ginjal", kategori: ["G"] },
  { pertanyaan: "Asam urat tinggi", kategori: ["G"] },
  { pertanyaan: "Pengapuran pada sendi lutut", kategori: ["OA"] },
] as Skrining;

export const skriningRiwKeluarga = [
  { pertanyaan: "Hipertensi/tekanan darah tinggi", kategori: ["HT"] },
  { pertanyaan: "Diabetes Mellitus/kencing manis", kategori: ["DM"] },
  { pertanyaan: "Penyakit jantung koroner", kategori: ["J"] },
  { pertanyaan: "Penyakit ginjal", kategori: ["G"] },
  { pertanyaan: "Stroke", kategori: ["S"] },
  { pertanyaan: "Pengapuran sendi", kategori: ["OA"] },
] as Skrining;

export const skriningPolaMakan = [
  { pertanyaan: "Masakan bersantan", kategori: ["HT", "J", "S"] },
  {
    pertanyaan: "Masakan berminyak dan berlemak",
    kategori: ["HT", "J", "S"],
  },
  {
    pertanyaan:
      "Makanan cepat saji (Kentucky/ayam goreng tepung, French fries/kentang goreng dll)",
    kategori: ["HT", "J", "S"],
  },
  { pertanyaan: "Jerohan, otak, dll", kategori: ["HT", "J", "S"] },
  {
    pertanyaan: "Sup buntut, sup daging, sup jerohan, dll",
    kategori: ["HT", "J", "S"],
  },
  {
    pertanyaan:
      "Minuman bersoda (larutan, adem sari, coca-cola, fanta, sprite dll)",
    kategori: ["G"],
  },
  { pertanyaan: "Teh manis > 3 gelas/hari", kategori: ["DM"] },
  { pertanyaan: "Kopi > 3 gelas/hari", kategori: ["HT"] },
] as Skrining;
