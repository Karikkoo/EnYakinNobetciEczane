export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PharmacyResult {
  text: string;
  mapUri?: string;
  placeName?: string;
  address?: string;
}

export enum AppState {
  IDLE = 'IDLE',
  LOCATING = 'LOCATING',
  SEARCHING_AI = 'SEARCHING_AI',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}