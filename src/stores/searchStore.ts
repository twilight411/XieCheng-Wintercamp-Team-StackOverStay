import type {StateCreator} from 'zustand';
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
  setStarLevel: (starLevel: number | number[] | undefined) => void;
  setPriceRange: (priceMin?: number, priceMax?: number) => void;
}

const creator: StateCreator<SearchState> = (set: any) => ({
  city: DEFAULT_CITY,
  checkIn: undefined,
  checkOut: undefined,
  keyword: undefined,
  starLevel: undefined,
  priceMin: undefined,
  priceMax: undefined,
  setCity: (city: string) => set({city}),
  setCheckIn: (checkIn: string | undefined) => set({checkIn}),
  setCheckOut: (checkOut: string | undefined) => set({checkOut}),
  setKeyword: (keyword: string | undefined) => set({keyword}),
  setStarLevel: (starLevel: number | number[] | undefined) => set({starLevel}),
  setPriceRange: (priceMin?: number, priceMax?: number) =>
    set({priceMin, priceMax}),
});

export const useSearchStore = create<SearchState>(creator);

