
export interface UkomQuestion {
  id: number;
  question: string;
  options?: string[];
  answer: string;
  discussion: string;
  theme?: string;
}

export interface Syndrome {
  id: string;
  name_id: string;
  name_en: string;
  name_zh?: string;
  name_pinyin?: string;
  primary_organs: string[];
  wuxing_element: string;
  pattern_type: string;
  clinical_manifestations: string[];
  tongue: string[];
  pulse: string[];
  key_symptoms: string[];
  treatment_principle: string[];
  acupuncture_points: string[];
  herbal_prescription?: string;
  needling_method?: string;
  diagnostic_tip?: string;
}

export interface UserAccount {
  uid?: string;
  username: string;
  password: string;
  role: 'SUPER_SAINT' | 'SUPER_USER' | 'ADMIN' | 'REGULAR';
  createdAt: number;
  provider?: 'google' | 'local';
}

export interface ApiKeyEntry {
  key: string;
  isExhausted: boolean;
  lastUsed?: number;
  errorCount?: number;
}

export interface AppSettings {
  geminiApiKey: string;
  geminiApiKeys: ApiKeyEntry[];
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
}

export interface SavedPatient {
  id: string;
  authorUid?: string;
  patientName: string;
  age: string;
  sex: string;
  phone?: string;
  email?: string;
  address: string;
  complaint: string;
  symptoms: string;
  selectedSymptoms: string[]; 
  tongue: any;
  pulse: any;
  diagnosis: TcmDiagnosisResult;
  timestamp: number;
  medicalHistory?: string;
  biomedicalDiagnosis?: string;
  icd10?: string;
  medications?: string;
  followUpTanggal?: string;
  notes?: string;
}

export interface TcmDiagnosisResult {
  patternId: string;
  confidence: number;
  explanation: string;
  differentiation?: {
    ben: { label: string; value: string; score?: number }[];
    biao: { label: string; value: string; score?: number }[];
  };
  recommendedPoints: { code: string; description: string }[];
  masterTungPoints?: { code: string; description: string }[];
  treatment_principle?: string[];
  classical_prescription?: string;
  lifestyleAdvice: string;
  wuxingElemen?: string; 
  wuxingRelationships?: {
    type: string;
    targetElemen: string;
    description: string;
  }[];
  herbal_recommendation?: {
    formula_name?: string;
    chief: string[];
  };
  obesity_indication?: string | null;
  beauty_acupuncture?: string | null;
  keySymptoms?: string[];
  tongueDescription?: string;
  pulseDescription?: string;
}

export enum Language {
  INDONESIAN = "Bahasa Indonesia",
  ENGLISH = "English",
  SUNDANESE = "Basa Sunda",
  JAVANESE = "Basa Jawa",
  ACEHNESE = "Basa Aceh"
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
  tcmResult?: TcmDiagnosisResult;
  image?: string;
}

export type RxPoint = {
  code: string;
  role: string;
  source: string;
  note?: string;
};

export interface ScoredSyndrome {
  syndrome: Syndrome;
  score: number;
  points: RxPoint[];
  warnings: string[];
  rationale: string[];
  herbal_recommendation?: any;
  wuxingRelationships?: any[];
}

export interface HerbalRule {
  suggest_chief?: string[];
  suggest_assistants?: string[];
  notes?: string;
  contraindications?: string[];
}

export interface TcmDatabase {
  metadata: {
    db_name: string;
    version: string;
    sources_used: string[];
    scope_note: string;
  };
  clinical_config: any;
  patient_form_schema: any;
  core_rules: any;
  wuxing_map: Record<string, string[]>;
  organ_details: Record<string, any>;
  special_point_tables: any;
  syndromes: {
    FILLED_FROM_PDF: Syndrome[];
    TODO_FROM_PDF: any[];
  };
  herbal_guidelines: {
    per_syndrome_overrides_for_current_DB_snippet: Record<string, HerbalRule>;
    herbal_rules_by_pattern_type: Record<string, HerbalRule>;
  };
  stroke_protocols: any;
}
