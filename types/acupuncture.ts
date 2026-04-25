export enum AcupunctureSystem {
  TCM = 'TCM',
  MASTER_TUNG = 'Master Tung'
}

export interface Point {
  name: string;
  location: string;
  indication: string;
  element: string;
  technique: string;
  imageUrl: string;
  reactionArea?: string;
  system: AcupunctureSystem;
}
