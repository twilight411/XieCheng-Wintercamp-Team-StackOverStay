import {create} from 'zustand';

import {DEFAULT_CITY} from '../constants';

export interface SearchState {
  city: string;
  checkIn?: string;
  checkOut?: string;
  keyword?: string;
  starLevel?: number | number[];
  priceMin?: number;
  priceMax?: number;
  setCity: (city: string) => void;
  setCheckIn: (checkIn: string | undefined) => void;
  setCheckOut: (checkOut: string | undefined) => void;
  setKeyword: (keyword: string | undefined) => void;
}

export const useSearchStore = create<SearchState>(set => ({
  city: DEFAULT_CITY,
  checkIn: undefined,
  checkOut: undefined,
  keyword: undefined,
  starLevel: undefined,
  priceMin: undefined,
  priceMax: undefined,
  setCity: city => set({city}),
  setCheckIn: checkIn => set({checkIn}),
  setCheckOut: checkOut => set({checkOut}),
  setKeyword: keyword => set({keyword}),
}));

