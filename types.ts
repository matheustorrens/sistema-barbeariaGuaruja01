export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  popular?: boolean;
}

export interface AppService extends Service {
  firestoreId?: string;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  experience: string;
  image: string;
  available: boolean;
}

export interface AppTeamMember extends TeamMember {
  firestoreId?: string;
}

export interface BusinessInfo {
  name: string;
  phone: string;
  phoneDisplay: string;
  address: string;
  mapLink: string;
  hours: { weekdays: string; sunday: string };
  social: { facebook: string; instagram: string };
}

export interface ExtendedBusinessInfo extends Omit<BusinessInfo, 'hours'> {
  hours: { weekdays: string; saturday?: string; sunday: string };
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  whatsappMessage?: string;
  city?: string;
  mapsEmbedUrl?: string;
}

export interface GalleryImage {
  firestoreId?: string;
  url: string;
  order: number;
}

export interface VacationMode {
  active: boolean;
  message: string;
  from: string;
  to: string;
}