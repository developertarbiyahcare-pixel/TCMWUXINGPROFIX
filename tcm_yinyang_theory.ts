export type TheorySubtopic = {
  id: string;
  title: string;
  body: string;
  bullets?: string[];
};

export type TheoryCard = {
  id: string;
  title: string;
  subtitle?: string;
  axis?: "yin_yang" | "hot_cold" | "def_excess" | "int_ext" | "other";
  yin?: string;
  yang?: string;
  keyIdeas: string[];
  tags: string[];
  subtopics?: TheorySubtopic[];
};

export const TCM_YINYANG_THEORY: TheoryCard[] = [
  {
    id: "yin_yang_basic",
    title: "Yin–Yang: Kerangka Besar",
    subtitle: "Dasar semua pola sindrom TCM",
    axis: "yin_yang",
    yin: "Dalam, dingin, istirahat, struktur (darah, cairan, organ Zang, malam)",
    yang: "Luar, panas, gerak, fungsi (Qi, aktivitas, organ Fu, siang)",
    keyIdeas: [
      "Semua sindrom bisa dianalisis minimal dari empat sumbu: Yin/Yang, Interior/Exterior, Deficiency/Excess, Cold/Heat.",
      "Yin dan Yang saling bergantung, saling bertransformasi, dan saling mengontrol.",
      "Gangguan klinis muncul bila ada kelebihan, kekurangan, atau disharmoni antara Yin dan Yang."
    ],
    tags: ["dasar", "yinyang", "kerangka"],
    subtopics: [
      {
        id: "mutual_opposition",
        title: "Saling Berlawanan",
        body: "Yin–Yang selalu berlawanan namun tidak pernah terpisah total.",
        bullets: [
          "Yin ⇢ struktur, material, dingin, pasif.",
          "Yang ⇢ fungsi, aktivitas, panas, ekspansi.",
          "Contoh klinis: Defisiensi Yin Ginjal bisa tampak sebagai gejala 'Yang relatif berlebih' (panas kosong)."
        ]
      },
      {
        id: "mutual_root",
        title: "Saling Menjadi Akar",
        body: "Yin memelihara Yang; Yang memanaskan dan menggerakkan Yin.",
        bullets: [
          "Yin lemah → Yang tidak punya akar, muncul gejala panas kosong.",
          "Yang lemah → Yin tidak termetabolisme, muncul dingin, edema, cairan menumpuk."
        ]
      }
    ]
  },
  {
    id: "eight_principles",
    title: "Delapan Prinsip (Ba Gang)",
    subtitle: "Cara cepat mengelompokkan sindrom",
    axis: "other",
    keyIdeas: [
      "Empat pasang berlawanan: Interior–Exterior, Cold–Heat, Deficiency–Excess, Yin–Yang.",
      "Yin biasanya ⇢ interior, cold, deficiency; Yang ⇢ exterior, heat, excess (tapi tidak selalu 1:1).",
      "Diagnosis klinis: tentukan posisi pasien di tiap sumbu untuk memilih pola sindrom yang paling mendekati."
    ],
    tags: ["ba-gang", "diagnosis"],
    subtopics: [
      {
        id: "interior_exterior",
        title: "Interior–Exterior",
        body: "Menjelaskan lokasi patologi.",
        bullets: [
          "Exterior ⇢ kulit, otot, meridian Superfisial (serangan Angin-Dingin/Panas).",
          "Interior ⇢ Zang–Fu, darah, cairan, organ dalam."
        ]
      },
      {
        id: "cold_heat",
        title: "Cold–Heat",
        body: "Menjelaskan sifat patogen.",
        bullets: [
          "Cold ⇢ tidak tahan dingin, nyeri membaik dengan hangat, anggota badan dingin, lidah pucat, nadi slow.",
          "Heat ⇢ demam, rasa panas, haus, wajah merah, lidah merah dengan sabur kuning, nadi rapid."
        ]
      },
      {
        id: "def_excess",
        title: "Deficiency–Excess",
        body: "Menjelaskan status Qi/Zang-Fu vs kekuatan patogen.",
        bullets: [
          "Deficiency ⇢ kekurangan Qi, darah, Yin atau Yang (lelah, gejala kronis).",
          "Excess ⇢ patogen kuat (Damp-Heat, Phlegm, Stagnation) menekan fungsi normal."
        ]
      }
    ]
  },
  {
    id: "qi_blood_fluids",
    title: "Qi – Xue – JinYe",
    subtitle: "Bahan dasar sindrom",
    axis: "other",
    keyIdeas: [
      "Qi bergerak dan menghangatkan; darah (Xue) memelihara dan melembabkan; JinYe (cairan) menghidrasi jaringan.",
      "Defisiensi Qi → lelah, sesak aktivitas, keringat spontan.",
      "Defisiensi Xue → pucat, pusing, insomnia, kulit kering.",
      "Gangguan JinYe → dahak, edema, kering, atau lembap berlebih."
    ],
    tags: ["qi", "darah", "cairan"]
  },
  {
    id: "etiology_external",
    title: "Faktor Eksternal (Liu Yin)",
    subtitle: "Angin, Dingin, Panas, Lembap, Kering, Api",
    axis: "other",
    keyIdeas: [
      "Angin: onset cepat, gejala berpindah-pindah, sering mengenai bagian atas tubuh.",
      "Dingin: nyeri spasmodik membaik dengan hangat, warna pucat, nadi tight/slow.",
      "Panas/Api: merah, haus, iritabel, lidah merah, nadi rapid.",
      "Lembap/Damp: rasa berat, sabur lengket, sekresi kental, dapat berubah menjadi Dahak.",
      "Kering: kulit dan mucosa kering, batuk kering."
    ],
    tags: ["patogen", "external"]
  },
  {
    id: "etiology_internal",
    title: "Faktor Internal (Emosi, Diet, Overwork)",
    subtitle: "Bagaimana gaya hidup menjadi sindrom",
    axis: "other",
    keyIdeas: [
      "Marah, frustrasi → terutama mengganggu Liver (stagnasi Qi Hati → Fire, menyerang Paru atau Spleen).",
      "Khawatir/overthinking → melemahkan Spleen Qi (kembung, tinja lembek).",
      "Takut/kaget → mengganggu Kidney (Qi Ginjal tidak mantap, enuresis, palpitasi).",
      "Diet dingin/berlemak → Cold-Damp, Damp-Heat di Spleen–Stomach.",
      "Overwork kurang istirahat → defisiensi Qi & Yin."
    ],
    tags: ["internal-cause"]
  },
  {
    id: "tongue_pulse_overview",
    title: "Konsep Lidah & Nadi",
    subtitle: "Validasi Yin–Yang & Cold–Heat",
    axis: "other",
    keyIdeas: [
      "Lidah pucat ⇢ cenderung Cold/Defisiensi; lidah merah ⇢ Heat; kering ⇢ kurang cairan/Yin; sabur tebal ⇢ patogen masih kuat.",
      "Nadi slow ⇢ Cold; rapid ⇢ Heat; weak/empty ⇢ Defisiensi; wiry/slippery ⇢ stagnasi, Damp, Phlegm.",
      "Interpretasi lidah/nadi selalu digabung dengan gejala klinis, bukan berdiri sendiri."
    ],
    tags: ["tongue", "pulse", "diagnosis"]
  }
];
