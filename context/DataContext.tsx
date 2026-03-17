import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AppService, AppTeamMember, GalleryImage,
  ExtendedBusinessInfo, VacationMode,
} from '../types';
import {
  listenServices, listenTeam, listenGallery,
  listenBusinessInfo, listenVacationMode, listenMetrics, seedIfEmpty,
} from '../firebase/db';
import { SERVICES, TEAM, GALLERY_IMAGES, BUSINESS_INFO } from '../constants';

interface DataContextType {
  services: AppService[];
  team: AppTeamMember[];
  gallery: GalleryImage[];
  businessInfo: ExtendedBusinessInfo;
  vacationMode: VacationMode;
  metrics: Record<string, number>;
  loading: boolean;
}

const defaultBusiness: ExtendedBusinessInfo = {
  ...BUSINESS_INFO,
  heroTitle: 'A ARTE DO CORTE MASCULINO',
  heroSubtitle:
    'Tradição, qualidade e atendimento diferenciado no coração do Jardim Primavera.',
  heroImageUrl:
    'https://lh3.googleusercontent.com/p/AF1QipPqKN7tQYj1xEZ8bBLaSiJo9Jy7qfUwpg0PUygv=w1600',
};

const DataContext = createContext<DataContextType>({
  services: SERVICES,
  team: TEAM,
  gallery: GALLERY_IMAGES.map((url, order) => ({ url, order })),
  businessInfo: defaultBusiness,
  vacationMode: { active: false, message: '', from: '', to: '' },
  metrics: {},
  loading: true,
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices]         = useState<AppService[]>(SERVICES);
  const [team, setTeam]                 = useState<AppTeamMember[]>(TEAM);
  const [gallery, setGallery]           = useState<GalleryImage[]>(
    GALLERY_IMAGES.map((url, order) => ({ url, order })),
  );
  const [businessInfo, setBusinessInfo] = useState<ExtendedBusinessInfo>(defaultBusiness);
  const [vacationMode, setVacationMode] = useState<VacationMode>({
    active: false, message: '', from: '', to: '',
  });
  const [metrics, setMetrics]           = useState<Record<string, number>>({});
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    seedIfEmpty()
      .then(() => {
        const unsubs = [
          listenServices(setServices),
          listenTeam(setTeam),
          listenGallery(setGallery),
          listenBusinessInfo(setBusinessInfo),
          listenVacationMode(setVacationMode),
          listenMetrics(setMetrics),
        ];
        setLoading(false);
        return () => unsubs.forEach(u => u());
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <DataContext.Provider
      value={{ services, team, gallery, businessInfo, vacationMode, metrics, loading }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
