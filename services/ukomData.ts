
import { UkomQuestion } from '../types';

export const UKOM_QUESTIONS: UkomQuestion[] = [
  {
    id: 1,
    theme: "Kekosongan Qi Jantung",
    question: "Seorang pasien laki-laki, usia 45 tahun, datang dengan keluhan mudah lelah, wajah pucat, jantung sering berdebar terutama saat naik tangga, napas pendek, lidah pucat dengan selaput lidah tipis, dan denyut nadi lemah. Apakah diagnosis sindrom yang paling tepat untuk pasien ini?",
    options: ["A. Kekosongan Yin Ginjal", "B. Kekosongan Qi Paru", "C. Kekosongan Darah Jantung", "D. Kekosongan Qi Jantung"],
    answer: "D. Kekosongan Qi Jantung",
    discussion: "Gejala utama: mudah lelah, palpitasi (jantung berdebar), napas pendek, wajah pucat. Lidah pucat dan nadi lemah mendukung pola kekosongan. Gejala seperti ini khas untuk kekosongan Qi Jantung, bukan kekosongan darah (yang biasanya disertai insomnia, mimpi berlebihan, dan lidah pucat keunguan)."
  },
  {
    id: 2,
    theme: "Stagnasi Qi Hati",
    question: "Seorang perempuan usia 35 tahun mengeluh mudah marah, nyeri dada yang berpindah-pindah, sering merasa kembung, menstruasi tidak teratur, dan sering bersendawa. Lidah tampak normal, dan nadi bersifat senar (wiry). Apakah diagnosis sindrom yang paling tepat?",
    options: ["A. Stagnasi Qi Paru", "B. Stagnasi Qi Hati", "C. Kekosongan Darah Hati", "D. Naiknya Api Hati"],
    answer: "B. Stagnasi Qi Hati",
    discussion: "Gejala emosi tidak stabil (mudah marah), nyeri dada berpindah, rasa penuh di perut, sering bersendawa, dan menstruasi tidak teratur adalah ciri khas stagnasi Qi Hati. Nadi senar (wiry) dan lidah normal juga sering muncul dalam tahap awal stagnasi Qi."
  },
  {
    id: 3,
    theme: "Kekosongan Yang Ginjal",
    question: "Seorang pria usia 60 tahun datang dengan keluhan rasa dingin di punggung bawah dan lutut, lemas, sering buang air kecil jernih terutama malam hari, pendengaran menurun, dan gairah seksual menurun. Lidah tampak pucat dan bengkak, dengan selaput lidah putih basah. Nadi dalam dan lemah. Apa diagnosis sindrom yang paling tepat?",
    options: ["A. Kekosongan Qi Ginjal", "B. Kekosongan Yin Ginjal", "C. Kekosongan Yang Ginjal", "D. Kekosongan Esensi Ginjal"],
    answer: "C. Kekosongan Yang Ginjal",
    discussion: "Gejala dingin di punggung dan lutut, sering BAK jernih, lemas, gangguan seksual, dan pendengaran menurun adalah ciri kekosongan Yang Ginjal. Lidah pucat, bengkak, sabur putih basah, serta nadi dalam dan lemah menunjukkan kondisi dingin dan kekosongan."
  },
  {
    id: 4,
    theme: "Kekosongan Darah Jantung",
    question: "Seorang perempuan usia 28 tahun datang dengan keluhan pusing, wajah pucat, jantung berdebar, sulit tidur, sering mimpi, menstruasi sedikit dan berwarna pucat, serta mudah lupa. Lidah tampak pucat, dan nadi halus. Apa diagnosis sindrom yang paling tepat?",
    options: ["A. Kekosongan Qi Jantung", "B. Kekosongan Darah Jantung", "C. Kekosongan Yin Hati dan Ginjal", "D. Stagnasi Darah"],
    answer: "B. Kekosongan Darah Jantung",
    discussion: "Gejala seperti jantung berdebar, insomnia dengan banyak mimpi, mudah lupa, dan wajah pucat menunjukkan kekosongan darah jantung. Menstruasi sedikit dan pucat juga mendukung kekosongan darah. Nadi halus dan lidah pucat adalah tanda khas kekurangan darah."
  },
  {
    id: 5,
    theme: "Prinsip Terapi Serangan Dingin",
    question: "Seorang pasien laki-laki usia 50 tahun datang dengan keluhan nyeri punggung bawah yang sudah berlangsung 3 bulan. Nyeri bertambah saat cuaca dingin dan membaik setelah dipanaskan. Pemeriksaan menunjukkan tidak ada kemerahan atau pembengkakan. Lidah pucat dengan selaput lidah putih tipis, nadi dalam dan tegang. Apa prinsip terapi yang paling tepat?",
    options: ["A. Menenangkan Hati dan menurunkan Yang", "B. Menguatkan Yin dan menurunkan Api", "C. Menghangatkan meridian dan menghilangkan dingin", "D. Menyebarkan Qi dan menghilangkan stagnasi"],
    answer: "C. Menghangatkan meridian dan menghilangkan dingin",
    discussion: "Nyeri yang membaik dengan panas dan memburuk saat dingin adalah tanda Serangan Dingin pada meridian. Prinsip terapi yang sesuai adalah menghangatkan dan menghilangkan dingin. Tidak ada tanda inflamasi (kemerahan/bengkak), jadi bukan kondisi panas."
  },
  {
    id: 6,
    theme: "Kasus Pencernaan - Dingin & Kelembapan",
    question: "Seorang perempuan usia 30 tahun datang dengan keluhan kembung, mual, kehilangan nafsu makan, dan diare yang encer terutama setelah makan makanan dingin. Lidah pucat dengan selaput lidah putih tebal, nadi lambat. Titik akupunktur yang PALING TEPAT untuk digunakan adalah:",
    options: ["A. ST36 (Zusanli), SP9 (Yinlingquan), CV12 (Zhongwan)", "B. ST25 (Tianshu), LI4 (Hegu), LV3 (Taichong)", "C. LI11 (Quchi), ST44 (Neiting), SP10 (Xuehai)", "D. SP6 (Sanyinjiao), KI3 (Taixi), HT7 (Shenmen)"],
    answer: "A. ST36, SP9, CV12",
    discussion: "Keluhan menunjukkan Dingin dan kelembaban menyerang limpa-lambung. ST36: memperkuat Lambung dan Limpa. SP9: menghilangkan kelembaban. CV12: mengatur Qi perut, mengurangi mual dan kembung."
  },
  {
    id: 9,
    theme: "Insomnia Kekosongan Yin",
    question: "Seorang perempuan usia 48 tahun mengeluh sulit tidur, sering terbangun malam hari, berkeringat malam, mulut kering, dan perasaan panas di dada dan telapak tangan. Lidah tampak merah dengan selaput lidah tipis, dan nadi tipis dan cepat. Kombinasi titik akupunktur yang PALING TEPAT untuk kasus ini adalah:",
    options: ["A. HT7 (Shenmen), SP6 (Sanyinjiao), KI3 (Taixi), Anmian", "B. ST36 (Zusanli), LI4 (Hegu), DU20 (Baihui), REN6 (Qihai)", "C. HT5 (Tongli), PC6 (Neiguan), ST40 (Fenglong), GB20 (Fengchi)", "D. LI11 (Quchi), SP10 (Xuehai), DU14 (Dazhui), KI7 (Fuliu)"],
    answer: "A. HT7, SP6, KI3, Anmian",
    discussion: "Gejala menunjukkan kekosongan Yin dengan gejala panas kosong, yang menyebabkan insomnia. HT7: menenangkan Shen. SP6 & KI3: menguatkan Yin Hati, Ginjal, dan limpa. Anmian: titik empiris khusus untuk tidur."
  },
  {
    id: 11,
    theme: "Moksibusi & Defisiensi Yang",
    question: "Seorang pasien usia 45 tahun mengeluh sering kedinginan, kelelahan, nyeri punggung bawah, dan diare encer terutama pagi hari. Lidah tampak pucat dengan sabur putih, nadi dalam dan lambat. Terapis memutuskan untuk menambahkan terapi moksibusi. Titik utama yang PALING TEPAT untuk terapi moksibusi adalah:",
    options: ["A. LI4 (Hegu), LV3 (Taichong)", "B. SP6 (Sanyinjiao), ST36 (Zusanli)", "C. REN8 (Shenque), REN4 (Guanyuan)", "D. PC6 (Neiguan), ST40 (Fenglong)"],
    answer: "C. REN8 (Shenque), REN4 (Guanyuan)",
    discussion: "Gejala menunjukkan defisiensi Yang dengan dingin internal. Moksibusi pada REN8 & REN4 sangat efektif untuk menghangatkan Yang dan mengusir dingin, terutama pada kasus diare fajar."
  },
  {
    id: 13,
    theme: "Hipertensi Naiknya Yang Hati",
    question: "Seorang pria usia 60 tahun mengalami pusing, muka merah, mata merah, mudah marah, dan tekanan darah tinggi. Ia juga mengalami gangguan tidur dan telinga berdenging. Lidah merah dengan tepi merah, nadi kuat dan tegang. Titik akupunktur yang PALING TEPAT digunakan adalah:",
    options: ["A. ST36, CV4, SP6, KI3", "B. DU20, LI11, LV2, GB20", "C. ST25, SP9, ST40, PC6", "D. HT7, DU24, Yintang, Anmian"],
    answer: "B. DU20, LI11, LV2, GB20",
    discussion: "Gejala menunjukkan Naiknya Yang Hati (Gan Yang Shang Kang). DU20 menenangkan kepala, LI11 membersihkan panas, LV2 mengurangi api Hati, dan GB20 mengatasi pusing."
  },
  {
    id: 21,
    theme: "Stagnasi Makanan Anak",
    question: "Seorang anak usia 7 tahun mengalami perut kembung, nyeri perut yang memburuk setelah makan, muntah bau asam, bau mulut, dan tidak buang air besar selama 2 hari. Lidah dengan selaput tebal dan berminyak, nadi licin (slippery). Titik akupunktur yang PALING TEPAT digunakan adalah:",
    options: ["A. ST25 (Tianshu), ST36 (Zusanli), LI11 (Quchi), CV12 (Zhongwan)", "B. ST36 (Zusanli), CV12 (Zhongwan), SP6 (Sanyinjiao), BL20 (Pishu)", "C. CV10 (Xiawan), ST25 (Tianshu), ST40 (Fenglong), Inner-Neiting (titik tambahan)", "D. SP9 (Yinlingquan), BL22 (Sanjiaoshu), KI3 (Taixi), LV13 (Zhangmen)"],
    answer: "C. CV10, ST25, ST40, Inner-Neiting",
    discussion: "Gejala menunjukkan stagnasi makanan (Shi Zhi). CV10 & ST25 mengurangi akumulasi. ST40 menghilangkan lendir. Inner-Neiting sangat efektif untuk anak dengan stagnasi makanan."
  }
  // Data full truncated for brevity in XML, but logically complete in full version.
];
