import { Point, AcupunctureSystem } from '../types/acupuncture';

export const tcmPoints: Point[] = [
  { 
    name: 'LU7 (Lieque)', 
    location: 'Radial side of the forearm, 1.5 cun above the wrist crease.', 
    indication: 'Cough, asthma, sore throat, facial paralysis.', 
    element: 'Metal',
    technique: 'Oblique insertion 0.3-0.5 cun upwards.',
    imageUrl: 'https://picsum.photos/seed/arm-anatomy/400/300',
    system: AcupunctureSystem.TCM
  },
  { 
    name: 'LI4 (Hegu)', 
    location: 'On the dorsum of the hand, between the 1st and 2nd metacarpal bones.', 
    indication: 'Headache, toothache, fever, constipation.', 
    element: 'Metal',
    technique: 'Perpendicular insertion 0.5-1.0 cun. Contraindicated in pregnancy.',
    imageUrl: 'https://picsum.photos/seed/hand-acupuncture/400/300',
    system: AcupunctureSystem.TCM
  },
  { 
    name: 'ST36 (Zusanli)', 
    location: '3 cun below the knee, one finger-width lateral to the tibia.', 
    indication: 'Stomach pain, bloating, fatigue, immune boost.', 
    element: 'Earth',
    technique: 'Perpendicular insertion 1.0-1.5 cun. Strong moxibustion point.',
    imageUrl: 'https://picsum.photos/seed/knee-anatomy/400/300',
    system: AcupunctureSystem.TCM
  },
  { 
    name: 'SP6 (Sanyinjiao)', 
    location: '3 cun above the medial malleolus, behind the tibia.', 
    indication: 'Insomnia, menstrual pain, digestive issues.', 
    element: 'Earth',
    technique: 'Perpendicular insertion 1.0-1.5 cun. Intersection of 3 Yin meridians.',
    imageUrl: 'https://picsum.photos/seed/ankle-anatomy/400/300',
    system: AcupunctureSystem.TCM
  },
  { 
    name: 'HT7 (Shenmen)', 
    location: 'At the ulnar end of the wrist crease.', 
    indication: 'Anxiety, insomnia, heart palpitations.', 
    element: 'Fire',
    technique: 'Perpendicular insertion 0.3-0.5 cun.',
    imageUrl: 'https://picsum.photos/seed/wrist-anatomy/400/300',
    system: AcupunctureSystem.TCM
  },
  { 
    name: 'SI3 (Houxi)', 
    location: 'On the ulnar side of the hand, proximal to the 5th metacarpophalangeal joint.', 
    indication: 'Neck pain, back pain, epilepsy.', 
    element: 'Fire',
    technique: 'Perpendicular insertion 0.5-0.7 cun.',
    imageUrl: 'https://picsum.photos/seed/hand-side/400/300',
    system: AcupunctureSystem.TCM
  },
  { 
    name: 'BL40 (Weizhong)', 
    location: 'At the midpoint of the transverse crease of the popliteal fossa.', 
    indication: 'Back pain, hip pain, skin diseases.', 
    element: 'Water',
    technique: 'Perpendicular insertion 0.5-1.0 cun. Prick to bleed for heat clearing.',
    imageUrl: 'https://picsum.photos/seed/leg-back/400/300',
    system: AcupunctureSystem.TCM
  },
  { 
    name: 'KI3 (Taixi)', 
    location: 'In the depression between the medial malleolus and the Achilles tendon.', 
    indication: 'Dizziness, tinnitus, sore throat, asthma.', 
    element: 'Water',
    technique: 'Perpendicular insertion 0.5-1.0 cun.',
    imageUrl: 'https://picsum.photos/seed/foot-anatomy/400/300',
    system: AcupunctureSystem.TCM
  },
  { 
    name: 'PC6 (Neiguan)', 
    location: '2 cun above the wrist crease, between the tendons of palmaris longus and flexor carpi radialis.', 
    indication: 'Nausea, vomiting, chest pain, insomnia.', 
    element: 'Fire',
    technique: 'Perpendicular insertion 0.5-0.8 cun.',
    imageUrl: 'https://picsum.photos/seed/forearm-inner/400/300',
    system: AcupunctureSystem.TCM
  },
  { 
    name: 'TE5 (Waiguan)', 
    location: '2 cun above the wrist crease, between the radius and ulna.', 
    indication: 'Fever, headache, earache, wrist pain.', 
    element: 'Fire',
    technique: 'Perpendicular insertion 0.7-1.0 cun.',
    imageUrl: 'https://picsum.photos/seed/forearm-outer/400/300',
    system: AcupunctureSystem.TCM
  },
  { 
    name: 'GB34 (Yanglingquan)', 
    location: 'In the depression anterior and inferior to the head of the fibula.', 
    indication: 'Gallbladder issues, muscle pain, sciatica.', 
    element: 'Wood',
    technique: 'Perpendicular insertion 1.0-1.5 cun.',
    imageUrl: 'https://picsum.photos/seed/leg-anatomy/400/300',
    system: AcupunctureSystem.TCM
  },
  { 
    name: 'LR3 (Taichong)', 
    location: 'On the dorsum of the foot, in the depression distal to the junction of the 1st and 2nd metatarsal bones.', 
    indication: 'Stress, anger, headache, eye issues.', 
    element: 'Wood',
    technique: 'Perpendicular insertion 0.5-0.8 cun.',
    imageUrl: 'https://picsum.photos/seed/foot-top/400/300',
    system: AcupunctureSystem.TCM
  },
];
