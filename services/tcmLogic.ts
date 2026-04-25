
import { TCM_DB } from '../constants';
import { Syndrome, RxPoint, ScoredSyndrome, HerbalRule } from '../types';

/**
 * Normalizes strings by removing punctuation and extra whitespace.
 */
export const normalize = (s: string) => 
  (s || "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();

/**
 * Enhanced Fuzzy Match using token-based overlap and internal synonym mapping.
 * Considers a match if tokens from one string appear significantly in another.
 */
const fuzzyMatch = (input: string, reference: string, threshold = 0.6): boolean => {
  const normInput = normalize(input);
  const normRef = normalize(reference);
  
  // Exact or contains match
  if (normInput.includes(normRef) || normRef.includes(normInput)) return true;

  // Simple synonym mapping for common TCM terms
  const synonyms: Record<string, string[]> = {
    "pusing": ["dizziness", "vertigo", "puyeng", "keliyengan"],
    "nyeri": ["sakit", "pain", "achiness", "ngilu"],
    "lelah": ["letih", "lesu", "lemas", "tired", "fatigue", "exhaustion", "weakness"],
    "haus": ["thirst", "dry mouth", "kering"],
    "sulit tidur": ["insomnia", "sleeplessness", "susah tidur", "tidak bisa tidur"],
    "berdebar": ["palpitations", "palpitasi", "jantung berdebar", "debar"],
    "keringat malam": ["night sweating", "night sweats", "keringat saat tidur"],
    "kembung": ["bloating", "distension", "abdominal fullness", "begah"],
    "mual": ["nausea", "enek", "mau muntah"],
    "muntah": ["vomiting", "muntah-muntah"],
    "diare": ["diarrhea", "mencret", "feses lembek", "loose stools"],
    "sembelit": ["constipation", "susah bab", "bab keras"],
    "dingin": ["cold", "kedinginan", "aversion to cold", "takut dingin"],
    "panas": ["heat", "fever", "kepanasan", "demam"],
    "marah": ["irritability", "emosi", "mudah marah", "anger"],
    "cemas": ["anxiety", "gelisah", "khawatir"],
    "depresi": ["depression", "murung", "sedih"],
    "lupa": ["poor memory", "pelupa", "mudah lupa", "amnesia"],
    "napas pendek": ["shortness of breath", "sesak", "ngos-ngosan", "asthma"],
    "batuk": ["cough", "batuk-batuk"],
    "kencing": ["urine", "urination", "buang air kecil", "bak"],
    "haid": ["menses", "menstruation", "menstruasi", "datang bulan"],
    "keputihan": ["leukorrhea", "fluor albus", "pek tay"]
  };

  for (const [key, vals] of Object.entries(synonyms)) {
    if ((normInput.includes(key) || vals.some(v => normInput.includes(v))) && 
        (normRef.includes(key) || vals.some(v => normRef.includes(v)))) {
      return true;
    }
  }

  const inputTokens = normInput.split(/\s+/).filter(t => t.length > 2);
  const refTokens = normRef.split(/\s+/).filter(t => t.length > 2);
  
  if (inputTokens.length === 0 || refTokens.length === 0) return false;

  let matches = 0;
  inputTokens.forEach(it => {
    if (refTokens.some(rt => rt.includes(it) || it.includes(rt))) matches++;
  });

  return (matches / inputTokens.length) >= threshold || (matches / refTokens.length) >= threshold;
};

const extractSymptoms = (text: string): string[] => {
    return text.split(/[\n,.]+/).map(normalize).filter(s => s.length > 2);
};

/**
 * === ANALISA WU XING YANG LEBIH DETAIL & EDUKATIF ===
 */
const getBaseWuxingRelationships = (element: string, patternType: string, syndromeId: string) => {
  const relationships: any[] = [];
  const el = (element || "").toLowerCase();

  switch (syndromeId) {
    case "heart-fire-blazing":
      relationships.push({
        type: "Cheng (Overacting / Tertindas)",
        description: "Elemen Api (Heart) berlebihan menindas elemen Logam (Lung).",
        disturbedElement: "Fire (Heart)",
        affectedElement: "Metal (Lung)",
        reason: "Api yang terlalu kuat mengganggu siklus Ke normal, sehingga Lung gagal mengendalikan Api.",
        clinicalImplication: "Lung Qi menjadi lemah, mudah timbul batuk, sesak napas, atau kekeringan."
      });
      break;

    case "liver-fire-blazing":
      relationships.push({
        type: "Cheng (Overacting / Tertindas)",
        description: "Elemen Kayu (Liver) terlalu kuat menindas elemen Tanah (Spleen).",
        disturbedElement: "Wood (Liver)",
        affectedElement: "Earth (Spleen)",
        reason: "Liver Fire berlebih melanggar siklus Ke, sehingga Spleen tidak mampu mentransformasi dan mengangkut dengan baik.",
        clinicalImplication: "Sering muncul masalah pencernaan, kembung, diare, dan kelelahan."
      });
      break;

    case "spleen-yang-deficiency":
      relationships.push({
        type: "Wu (Insulting / Merampok)",
        description: "Elemen Tanah (Spleen) yang lemah 'dirampok' oleh elemen Kayu (Liver).",
        disturbedElement: "Earth (Spleen)",
        affectedElement: "Wood (Liver)",
        reason: "Spleen Yang Deficiency membuat Tanah tidak kuat mengendalikan Kayu, sehingga Liver Qi mudah stagnan.",
        clinicalImplication: "Mudah marah, kembung, dan pencernaan terganggu meski pola utamanya adalah Spleen Deficiency."
      });
      break;

    case "kidney-yang-deficiency":
      relationships.push({
        type: "Wu (Insulting / Merampok)",
        description: "Elemen Air (Kidney) yang lemah gagal mengendalikan Api (Heart), sehingga muncul Empty-Heat.",
        disturbedElement: "Water (Kidney)",
        affectedElement: "Fire (Heart)",
        reason: "Defisiensi Yang Ginjal menyebabkan Air tidak mampu mengontrol Api.",
        clinicalImplication: "Muncul gejala panas kosong seperti keringat malam, gelisah, dan palpitasi."
      });
      break;

    default:
      // Fallback to general element-based logic if no specific syndrome match
      const pt = (patternType || "").toLowerCase();
      const isExcess = pt.includes('excess') || pt.includes('full') || pt.includes('stagnation') || pt.includes('invasion') || pt.includes('fire');
      const isDeficiency = pt.includes('deficiency') || pt.includes('empty') || pt.includes('xu');

      if (el.includes('wood')) {
        if (isExcess) {
          relationships.push({ type: 'Cheng (Overacting / Tertindas)', description: 'Kayu berlebih (Hati Shi) menindas Tanah (Limpa/Lambung), mengakibatkan stagnasi makanan atau diare (Hati menyerang Limpa).', disturbedElement: 'Wood', affectedElement: 'Earth', reason: 'Liver Qi stagnasi atau Hati Shi.', clinicalImplication: 'Masalah pencernaan, gas, pergerakan usus tak teratur.' });
          relationships.push({ type: 'Wu (Insulting / Merampok)', description: 'Api Hati menghina Logam (Paru), memicu gejala batuk atau sesak akibat Qi Paru tidak dapat turun.', disturbedElement: 'Wood', affectedElement: 'Metal', reason: 'Energi Kayu memberontak terhadap Logam.', clinicalImplication: 'Rasa sesak, napas pendek, asma.' });
        } else if (isDeficiency) {
          relationships.push({ type: 'Sheng (Generating)', description: 'Ibu (Kayu) gagal menghidupi Anak (Api); Defisiensi Darah Hati memicu Defisiensi Darah Jantung.', disturbedElement: 'Wood', affectedElement: 'Fire', reason: 'Defisiensi Yin/Darah Hati.', clinicalImplication: 'Palpitasi, insomnia, gelisah.' });
        }
      } else if (el.includes('fire')) {
        if (isExcess) {
          relationships.push({ type: 'Cheng (Overacting / Tertindas)', description: 'Api berlebih (Api Jantung) melukai Logam (Paru); Panas Jantung yang ekstrem mengeringkan cairan Paru.', disturbedElement: 'Fire', affectedElement: 'Metal', reason: 'Api Jantung berlebih.', clinicalImplication: 'Batuk kering, sakit tenggorokan.' });
          relationships.push({ type: 'Wu (Insulting / Merampok)', description: 'Api menghina Air; Panas Jantung yang berkobar melawan kontrol dingin Ginjal.', disturbedElement: 'Fire', affectedElement: 'Water', reason: 'Panas ekstrem di Hati/Jantung.', clinicalImplication: 'Empty heat, keringat malam.' });
        } else if (isDeficiency) {
          relationships.push({ type: 'Sheng (Generating)', description: 'Api yang padam (Yang Jantung Def) gagal menghangatkan Tanah (Limpa); menyebabkan kegagalan transportasi makanan.', disturbedElement: 'Fire', affectedElement: 'Earth', reason: 'Yang Jantung menurun.', clinicalImplication: 'Lelah, pucat, tungkai dingin.' });
        }
      } else if (el.includes('earth')) {
        if (isExcess) {
            relationships.push({ type: 'Cheng (Overacting / Tertindas)', description: 'Tanah berlebih (Lembap Limpa) membendung Air (Ginjal); menyebabkan edema atau retensi cairan.', disturbedElement: 'Earth', affectedElement: 'Water', reason: 'Lembap Tanah menghalangi Air.', clinicalImplication: 'Edema, retensi cairan, kencing sedikit.' });
            relationships.push({ type: 'Wu (Insulting / Merampok)', description: 'Lembap-Panas Limpa menghina Kayu (Hati); menghambat aliran bebas Qi Hati.', disturbedElement: 'Earth', affectedElement: 'Wood', reason: 'Lembap-Panas menumpuk.', clinicalImplication: 'Jaundice, kembung parah, mual.' });
        } else if (isDeficiency) {
            relationships.push({ type: 'Sheng (Generating)', description: 'Ibu (Tanah) gagal menumbuhkan Anak (Logam); Defisiensi Limpa sering memicu Defisiensi Paru.', disturbedElement: 'Earth', affectedElement: 'Metal', reason: 'Transportasi Spleen lemah.', clinicalImplication: 'Mudah flu, suara lemah, napas pendek.' });
        }
      } else if (el.includes('metal')) {
        if (isExcess) {
          relationships.push({ type: 'Cheng (Overacting / Tertindas)', description: 'Logam berlebih (Paru Shi) menyerang Kayu (Hati); menyebabkan spasme atau kekakuan otot.', disturbedElement: 'Metal', affectedElement: 'Wood', reason: 'Angin/Panas di Paru.', clinicalImplication: 'Kekakuan, nyeri muskuloskeletal.' });
        } else if (isDeficiency) {
          relationships.push({ type: 'Sheng (Generating)', description: 'Logam gagal menghasilkan Air; Qi Paru tidak turun untuk membantu Ginjal menerima Qi.', disturbedElement: 'Metal', affectedElement: 'Water', reason: 'Qi Paru lemah.', clinicalImplication: 'Sesak makin parah saat aktivitas.' });
        }
      } else if (el.includes('water')) {
        if (isExcess) {
          relationships.push({ type: 'Cheng (Overacting / Tertindas)', description: 'Air berlebih (Dingin Ginjal) memadamkan Api (Jantung); mengancam vitalitas Yang Jantung.', disturbedElement: 'Water', affectedElement: 'Fire', reason: 'Dingin menyebar dari Ginjal.', clinicalImplication: 'Palpitasi karena retensi cairan.' });
        } else if (isDeficiency) {
          relationships.push({ type: 'Sheng (Generating)', description: 'Air (Ibu) gagal menghidupi Kayu (Anak); Defisiensi Yin Ginjal gagal menutrisi Yin Hati, memicu Yang Hati naik.', disturbedElement: 'Water', affectedElement: 'Wood', reason: 'Ginjal tidak melembabkan Hati.', clinicalImplication: 'Mata kering, tinnitus, pusing.' });
          relationships.push({ type: 'Wu (Insulting / Merampok)', description: 'Air yang lemah dihina oleh Tanah; Defisiensi Ginjal menyebabkan Tanah (Limpa) tidak terkendali.', disturbedElement: 'Water', affectedElement: 'Earth', reason: 'Defisiensi Yang Ginjal.', clinicalImplication: 'Diare pagi hari, kaki dingin.' });
        }
      }
      
      if (relationships.length === 0) {
        relationships.push({
          type: "Mild Imbalance",
          description: `Elemen ${element} mengalami ketidakseimbangan ringan.`,
          disturbedElement: element,
          affectedElement: "—",
          reason: "Tidak terdeteksi hubungan patologis Cheng atau Wu yang kuat.",
          clinicalImplication: "Perlu observasi lebih lanjut dan data tambahan untuk analisa yang lebih akurat."
        });
      }
  }

  return relationships;
};

export const getHerbalRecommendation = (syndrome: Syndrome) => {
  const guidelines = TCM_DB.herbal_guidelines;
  const override = guidelines.per_syndrome_overrides_for_current_DB_snippet[syndrome.id];
  
  if (override) {
    return { 
      formula_name: override.notes, 
      chief: override.suggest_chief || [],
      assistants: override.suggest_assistants || [],
      avoid: override.contraindications || ["Hindari makanan dingin", "Monitor tekanan darah"]
    };
  }

  const patternRule = guidelines.herbal_rules_by_pattern_type[syndrome.pattern_type];
  if (patternRule) {
    return { 
      formula_name: patternRule.notes || "Protokol Standar", 
      chief: patternRule.suggest_chief || [],
      assistants: patternRule.suggest_assistants || [],
      avoid: patternRule.contraindications || ["Ikuti dosis standar"]
    };
  }
  
  return undefined;
};

const WEIGHTS = {
  key_symptoms:           50,   // 50%
  clinical_manifestations: 25,   // 25%
  tongue:                 15,    // 15%
  pulse:                  10     // 10%
};

/**
 * Performs clinical analysis using weighted scoring and fuzzy matching.
 * Weights: Key Symptoms (50), Manifestations (25), Tongue (15), Pulse (10).
 */
export const analyzePatient = (data: any): ScoredSyndrome[] => {
    const allSyndromes = [...TCM_DB.syndromes.FILLED_FROM_PDF];
    const symptomsList = extractSymptoms(data.symptoms || "");
    const selectedSymptoms = (data.selectedSymptoms || []).map(normalize);
    const allInputSymptoms = [...symptomsList, ...selectedSymptoms];

    const tongueInfo = normalize(data.tongue?.body_color + " " + (data.tongue?.coating_color || "") + " " + (data.tongue?.special_features?.join(" ") || ""));
    const pulseInfo = (data.pulse?.qualities || []).map(normalize);
    
    return allSyndromes.map(syn => {
        let score = 0;
        let matchedTraits: string[] = [];

        // 1. Match Key Symptoms
        (syn.key_symptoms || []).forEach(ks => {
            if (allInputSymptoms.some(input => fuzzyMatch(input, ks))) {
              score += WEIGHTS.key_symptoms;
              matchedTraits.push(`Kunci: ${ks}`);
            }
        });

        // 2. Match Clinical Manifestations
        (syn.clinical_manifestations || []).forEach(cm => {
            if (allInputSymptoms.some(input => fuzzyMatch(input, cm))) {
              score += WEIGHTS.clinical_manifestations;
              matchedTraits.push(`Gejala: ${cm}`);
            }
        });

        // 3. Match Tongue
        (syn.tongue || []).forEach(st => {
            if (fuzzyMatch(tongueInfo, st)) {
                score += WEIGHTS.tongue;
                matchedTraits.push(`Lidah: ${st}`);
            }
        });

        // 4. Match Pulse
        (syn.pulse || []).forEach(sp => {
            if (pulseInfo.some(pi => fuzzyMatch(pi, sp))) {
                score += WEIGHTS.pulse;
                matchedTraits.push(`Nadi: ${sp}`);
            }
        });

        return {
            syndrome: syn,
            score: score,
            matchDetails: matchedTraits
        };
    })
    .filter(s => s.score > 15) // Ignore very low matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => ({
        ...s,
        points: Array.isArray(s.syndrome.acupuncture_points) ? s.syndrome.acupuncture_points.map((p:string) => ({code:p, role:'kausal', source:'db'})) : [],
        warnings: s.syndrome.wuxing_element === 'Wood' && s.syndrome.pattern_type.includes('excess') ? ["Waspada: Naiknya Api Hati", "Risiko Hipertensi Kronis"] : [],
        rationale: [
          `Analisis berbasis Maciocia: Menunjukkan kecocokan kuat pada ${s.matchDetails.filter(d => d.startsWith('Kunci')).length} gejala kunci.`,
          ...s.matchDetails.slice(0, 4)
        ],
        herbal_recommendation: getHerbalRecommendation(s.syndrome),
        wuxingRelationships: getBaseWuxingRelationships(s.syndrome.wuxing_element, s.syndrome.pattern_type, s.syndrome.id)
    }));
};
