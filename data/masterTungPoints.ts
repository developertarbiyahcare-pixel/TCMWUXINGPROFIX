import { Point, AcupunctureSystem } from '../types/acupuncture';

export const masterTungPoints: Point[] = [
  {
    name: '11.01 Da Jian',
    location: 'B-line of index finger, center of first phalange.',
    indication: 'Hernia, pain at corner of eye, urethritis, toothache, angina, palpitation.',
    element: 'Metal',
    technique: 'Perpendicular insertion 0.2-0.3 cun.',
    imageUrl: 'https://picsum.photos/seed/index-finger/400/300',
    reactionArea: 'Heart, Small Intestine, Large Intestine',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '11.06 Huan Chao',
    location: 'Ulnar side of middle phalange of ring finger.',
    indication: 'PMS, Menopausal hot flashes, infertility, blocked fallopian tube, miscarriage.',
    element: 'Wood',
    technique: 'Perpendicular insertion 0.2-0.3 cun.',
    imageUrl: 'https://picsum.photos/seed/ring-finger/400/300',
    reactionArea: 'Liver, Kidney',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '11.17 Mu (Wood)',
    location: 'D-line of proximal phalange of index finger.',
    indication: 'Anger, headaches, TMJ, irritability, depression, nasal congestion.',
    element: 'Wood',
    technique: 'Perpendicular insertion 0.2-0.3 cun.',
    imageUrl: 'https://picsum.photos/seed/wood-element/400/300',
    reactionArea: 'Liver',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '11.24 Fu Ke',
    location: 'Ulnar line of proximal phalange of thumb.',
    indication: 'Uterine pain, menstrual irregularity, infertility, endometriosis.',
    element: 'Wood',
    technique: 'Perpendicular insertion 0.2-0.3 cun.',
    imageUrl: 'https://picsum.photos/seed/thumb-anatomy/400/300',
    reactionArea: 'Uterus',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '11.27 Wu Hu',
    location: 'Radial side of proximal phalange of thumb.',
    indication: 'Swelling of joints, finger or toe pain, arthritis, headache.',
    element: 'Earth',
    technique: 'Perpendicular insertion 0.2-0.3 cun.',
    imageUrl: 'https://picsum.photos/seed/tiger-hand/400/300',
    reactionArea: 'Spleen',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '22.04 Da Bai',
    location: 'Dorsum of hand, proximal and radial to distal head of 2nd metacarpal.',
    indication: 'Lower back pain, sciatica, common cold, headache, high fever.',
    element: 'Metal',
    technique: 'Perpendicular insertion 0.5-1.5 cun.',
    imageUrl: 'https://picsum.photos/seed/hand-dorsum/400/300',
    reactionArea: 'Lung',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '22.05 Ling Gu',
    location: 'Dorsum of hand, distal to junction of 1st and 2nd metacarpals.',
    indication: 'Lower back pain, sciatica, hemiplegia, headache, frequent urination.',
    element: 'Metal',
    technique: 'Perpendicular insertion 0.5-1.5 cun.',
    imageUrl: 'https://picsum.photos/seed/spirit-bone/400/300',
    reactionArea: 'Lung',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '22.06 Zhong Bai',
    location: 'Dorsum of hand, proximal to junction of 4th and 5th metacarpals.',
    indication: 'Sciatica, lower back pain, nephritis, dizziness, tinnitus.',
    element: 'Water',
    technique: 'Perpendicular insertion 0.5 cun.',
    imageUrl: 'https://picsum.photos/seed/hand-side-view/400/300',
    reactionArea: 'Heart, Kidney, Spleen',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '33.10 Chang Men',
    location: '3 cun above wrist crease, inferior to ulna.',
    indication: 'Acute abdominal pain, diarrhea, enteritis, colitis.',
    element: 'Earth',
    technique: 'Perpendicular insertion 0.5-0.8 cun.',
    imageUrl: 'https://picsum.photos/seed/forearm-ulna/400/300',
    reactionArea: 'Kidney, Liver',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '33.12 Xin Men',
    location: '2 cun distal to tip of ulna (elbow).',
    indication: 'Groin pain, sacral pain, lower back pain, myocarditis, chest oppression.',
    element: 'Fire',
    technique: 'Perpendicular insertion 0.5-1.0 cun.',
    imageUrl: 'https://picsum.photos/seed/elbow-joint/400/300',
    reactionArea: 'Heart',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '44.06 Jian Zhong',
    location: 'Center of deltoid muscle, 2.5-3.0 cun below acromion.',
    indication: 'Skin diseases on neck, shoulder pain, muscle atrophy, hemiplegia.',
    element: 'Fire',
    technique: 'Perpendicular insertion 0.5-1.0 cun.',
    imageUrl: 'https://picsum.photos/seed/shoulder-muscle/400/300',
    reactionArea: 'Heart',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '55.02 Hua Gu Yi',
    location: 'Ball of foot, opposite LV2 and LV3.',
    indication: 'Night blindness, glaucoma, cataracts, macular degeneration, photophobia.',
    element: 'Wood',
    technique: 'Perpendicular insertion 0.5-1.0 cun.',
    imageUrl: 'https://picsum.photos/seed/foot-sole/400/300',
    reactionArea: 'Kidney, Lung, Spleen',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '66.03 Huo Ying',
    location: 'Dorsum of foot, proximal to distal heads of 1st and 2nd metatarsals.',
    indication: 'Jaw pain, TMJ, irregular heart rate, dizziness, hypertension.',
    element: 'Fire',
    technique: 'Perpendicular insertion 0.5-1.0 cun.',
    imageUrl: 'https://picsum.photos/seed/foot-top-view/400/300',
    reactionArea: 'Heart, Liver',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '66.04 Huo Zhu',
    location: 'Dorsum of foot, distal to proximal junction of 1st and 2nd metatarsals.',
    indication: 'Jaw pain, TMJ, irregular heart rate, liver disease, neurasthenia.',
    element: 'Fire',
    technique: 'Perpendicular insertion 0.5-1.5 cun.',
    imageUrl: 'https://picsum.photos/seed/foot-artery/400/300',
    reactionArea: 'Heart',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '66.05 Men Jin',
    location: 'Dorsum of foot, distal to proximal junction of 2nd and 3rd metatarsals.',
    indication: 'Indigestion, abdominal distension, diarrhea, migraine, TMJ.',
    element: 'Earth',
    technique: 'Perpendicular insertion 0.5-1.3 cun.',
    imageUrl: 'https://picsum.photos/seed/foot-stomach/400/300',
    reactionArea: 'Duodenum, Stomach',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '77.01 Zheng Jin',
    location: 'Center of Achilles tendon, 3.5 cun proximal to heel.',
    indication: 'Occipital headache, neck pain, whiplash, brain tumor, whiplash.',
    element: 'Water',
    technique: 'Perpendicular insertion 1.5-2.0 cun.',
    imageUrl: 'https://picsum.photos/seed/achilles-tendon/400/300',
    reactionArea: 'Brain, Spine',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '77.08 Si Hua Shang',
    location: '3 cun below knee, 1/3 distance lateral from tibial tuberosity.',
    indication: 'Frontal headache, epilepsy, heart disease, asthma, hypertension.',
    element: 'Earth',
    technique: 'Perpendicular insertion 2.0-3.0 cun.',
    imageUrl: 'https://picsum.photos/seed/lower-leg-anatomy/400/300',
    reactionArea: 'Heart, Lung',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '77.18 Shen Guan',
    location: 'Medial side of lower leg, 1.5 cun inferior to SP9.',
    indication: 'Frontal headache, acid reflux, heart disease, kidney failure, diabetes.',
    element: 'Water',
    technique: 'Perpendicular insertion 0.5-1.5 cun.',
    imageUrl: 'https://picsum.photos/seed/kidney-gate/400/300',
    reactionArea: 'Heart, Kidney',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '77.21 Ren Huang',
    location: 'Medial side of lower leg, 3 cun above medial malleolus.',
    indication: 'Hypertension, dizziness, nephritis, diabetes, impotence.',
    element: 'Water',
    technique: 'Perpendicular insertion 0.5-1.2 cun.',
    imageUrl: 'https://picsum.photos/seed/man-emperor/400/300',
    reactionArea: 'Kidney',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '88.12 Ming Huang',
    location: 'Midpoint of medial thigh, 8 cun proximal to patella.',
    indication: 'Liver pain, hepatitis, cirrhosis, liver cancer, Parkinson\'s disease.',
    element: 'Wood',
    technique: 'Perpendicular insertion 1.0-3.0 cun.',
    imageUrl: 'https://picsum.photos/seed/thigh-medial/400/300',
    reactionArea: 'Liver, Heart',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '88.17 Si Ma Zhong',
    location: '8 cun superior to patella, 3 cun anterior to GB31.',
    indication: 'Common cold, allergies, asthma, skin diseases, rhinitis.',
    element: 'Metal',
    technique: 'Perpendicular insertion 0.8-2.5 cun.',
    imageUrl: 'https://picsum.photos/seed/four-horses/400/300',
    reactionArea: 'Liver, Lung',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '11.02 Xiao Jian',
    location: 'Radial side of index finger, center of first phalange.',
    indication: 'Bronchitis, heart palpitations, knee pain, enteritis.',
    element: 'Metal',
    technique: 'Perpendicular insertion 0.2-0.3 cun.',
    imageUrl: 'https://picsum.photos/seed/small-interval/400/300',
    reactionArea: 'Heart, Lung',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '22.01 Chong Zi',
    location: 'Palmar side of hand, between 1st and 2nd metacarpals, 1 cun distal to wrist crease.',
    indication: 'Back pain, shoulder pain, common cold, asthma in children.',
    element: 'Metal',
    technique: 'Perpendicular insertion 0.5-1.0 cun.',
    imageUrl: 'https://picsum.photos/seed/double-son/400/300',
    reactionArea: 'Lung',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '22.02 Chong Xian',
    location: 'Palmar side of hand, between 1st and 2nd metacarpals, 2 cun distal to wrist crease.',
    indication: 'Back pain, knee pain, pneumonia, palpitations.',
    element: 'Metal',
    technique: 'Perpendicular insertion 0.5-1.0 cun.',
    imageUrl: 'https://picsum.photos/seed/double-immortal/400/300',
    reactionArea: 'Heart, Lung',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '88.01 Tong Guan',
    location: 'Center of anterior thigh, 5 cun proximal to patella.',
    indication: 'Heart disease, palpitations, dizziness, stomach pain.',
    element: 'Fire',
    technique: 'Perpendicular insertion 0.5-1.5 cun.',
    imageUrl: 'https://picsum.photos/seed/pass-gate/400/300',
    reactionArea: 'Heart',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '88.02 Tong Shan',
    location: 'Center of anterior thigh, 7 cun proximal to patella.',
    indication: 'Heart disease, palpitations, dizziness, stomach pain.',
    element: 'Fire',
    technique: 'Perpendicular insertion 0.5-1.5 cun.',
    imageUrl: 'https://picsum.photos/seed/pass-mountain/400/300',
    reactionArea: 'Heart',
    system: AcupunctureSystem.MASTER_TUNG
  },
  {
    name: '88.03 Tong Tian',
    location: 'Center of anterior thigh, 9 cun proximal to patella.',
    indication: 'Heart disease, palpitations, dizziness, stomach pain.',
    element: 'Fire',
    technique: 'Perpendicular insertion 0.5-1.5 cun.',
    imageUrl: 'https://picsum.photos/seed/pass-heaven/400/300',
    reactionArea: 'Heart',
    system: AcupunctureSystem.MASTER_TUNG
  },
];
