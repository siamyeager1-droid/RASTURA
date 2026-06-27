export type MenuItemCategory = 'appetizer' | 'main' | 'cocktail' | 'wine-white' | 'wine-red';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuItemCategory;
  price: number;
  description: string;
  image?: string;
  tags?: string[];
  details?: string;
  subText?: string;
  flavorProfile?: string[];
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Reservation {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  notes?: string;
  seatingPreference: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
}
