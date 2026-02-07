export interface Room {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  tags: string[];
}

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  stars: number;
  address: string;
  distance: string;
  minPrice: number;
  images: string[];
  tags: string[];
  facilities: string[];
  rooms: Room[];
}

export interface SearchState {
  city: string;
  checkIn: Date;
  checkOut: Date;
  guests: string;
}
