import {
  collection, doc, getDocs, getDoc, addDoc,
  updateDoc, deleteDoc, setDoc, onSnapshot, increment,
} from 'firebase/firestore';
import { db } from './config';
import {
  AppService, AppTeamMember, GalleryImage,
  ExtendedBusinessInfo, VacationMode,
} from '../types';
import { SERVICES, TEAM, GALLERY_IMAGES, BUSINESS_INFO } from '../constants';

// ── SEED (popula Firestore na primeira execução) ──────────────────────────────
export const seedIfEmpty = async () => {
  const [sSnap, tSnap, gSnap, bSnap] = await Promise.all([
    getDocs(collection(db, 'services')),
    getDocs(collection(db, 'team')),
    getDocs(collection(db, 'gallery')),
    getDoc(doc(db, 'settings', 'business')),
  ]);

  if (sSnap.empty) {
    for (const s of SERVICES) await addDoc(collection(db, 'services'), s);
  }
  if (tSnap.empty) {
    for (const m of TEAM) await addDoc(collection(db, 'team'), m);
  }
  if (gSnap.empty) {
    let order = 0;
    for (const url of GALLERY_IMAGES)
      await addDoc(collection(db, 'gallery'), { url, order: order++ });
  }
  if (!bSnap.exists()) {
    await setDoc(doc(db, 'settings', 'business'), {
      ...BUSINESS_INFO,
      heroTitle: 'A ARTE DO CORTE MASCULINO',
      heroSubtitle:
        'Tradição, qualidade e atendimento diferenciado no coração do Jardim Primavera.',
      heroImageUrl:
        'https://lh3.googleusercontent.com/p/AF1QipPqKN7tQYj1xEZ8bBLaSiJo9Jy7qfUwpg0PUygv=w1600',
    });
  }
};

// ── SERVICES ──────────────────────────────────────────────────────────────────
export const listenServices = (cb: (s: AppService[]) => void) =>
  onSnapshot(collection(db, 'services'), snap =>
    cb(
      snap.docs
        .map(d => ({ firestoreId: d.id, ...(d.data() as AppService) }))
        .sort((a, b) => a.id - b.id),
    ),
  );

export const saveService = async (
  data: Omit<AppService, 'firestoreId'>,
  firestoreId?: string,
) => {
  if (firestoreId) await updateDoc(doc(db, 'services', firestoreId), { ...data });
  else await addDoc(collection(db, 'services'), data);
};

export const deleteService = (id: string) =>
  deleteDoc(doc(db, 'services', id));

// ── TEAM ──────────────────────────────────────────────────────────────────────
export const listenTeam = (cb: (t: AppTeamMember[]) => void) =>
  onSnapshot(collection(db, 'team'), snap =>
    cb(snap.docs.map(d => ({ firestoreId: d.id, ...(d.data() as AppTeamMember) }))),
  );

export const saveTeamMember = async (
  data: Omit<AppTeamMember, 'firestoreId'>,
  firestoreId?: string,
) => {
  if (firestoreId) await updateDoc(doc(db, 'team', firestoreId), { ...data });
  else await addDoc(collection(db, 'team'), data);
};

export const deleteTeamMember = (id: string) =>
  deleteDoc(doc(db, 'team', id));

// ── GALLERY ───────────────────────────────────────────────────────────────────
export const listenGallery = (cb: (g: GalleryImage[]) => void) =>
  onSnapshot(collection(db, 'gallery'), snap =>
    cb(
      snap.docs
        .map(d => ({ firestoreId: d.id, ...(d.data() as GalleryImage) }))
        .sort((a, b) => a.order - b.order),
    ),
  );

export const addGalleryImage = async (base64: string) => {
  const count = (await getDocs(collection(db, 'gallery'))).size;
  await addDoc(collection(db, 'gallery'), { url: base64, order: count });
};

export const deleteGalleryImage = async (firestoreId: string) => {
  await deleteDoc(doc(db, 'gallery', firestoreId));
};

// ── BUSINESS INFO ─────────────────────────────────────────────────────────────
export const listenBusinessInfo = (cb: (b: ExtendedBusinessInfo) => void) =>
  onSnapshot(doc(db, 'settings', 'business'), snap => {
    if (snap.exists()) cb(snap.data() as ExtendedBusinessInfo);
  });

export const saveBusinessInfo = (data: ExtendedBusinessInfo) =>
  setDoc(doc(db, 'settings', 'business'), data);

// ── VACATION MODE ─────────────────────────────────────────────────────────────
export const listenVacationMode = (cb: (v: VacationMode) => void) =>
  onSnapshot(doc(db, 'settings', 'vacation'), snap =>
    cb(
      snap.exists()
        ? (snap.data() as VacationMode)
        : { active: false, message: '', from: '', to: '' },
    ),
  );

export const saveVacationMode = (v: VacationMode) =>
  setDoc(doc(db, 'settings', 'vacation'), v);

// ── METRICS ───────────────────────────────────────────────────────────────────
export const listenMetrics = (cb: (m: Record<string, number>) => void) =>
  onSnapshot(doc(db, 'settings', 'metrics'), snap =>
    cb(snap.exists() ? (snap.data() as Record<string, number>) : {}),
  );

export const incrementMetric = async (field: string) => {
  const today    = new Date().toISOString().slice(0, 10);
  const mainRef  = doc(db, 'settings', 'metrics');
  const dailyRef = doc(db, 'dailyMetrics', today);
  await Promise.all([
    setDoc(mainRef,  { [field]: increment(1) }, { merge: true }),
    setDoc(dailyRef, { [field]: increment(1) }, { merge: true }),
  ]);
};

export const fetchDailyMetrics = async (
  from: string,
  to: string,
): Promise<Record<string, number>> => {
  const dates: string[] = [];
  const cursor = new Date(from + 'T00:00:00');
  const end    = new Date(to   + 'T00:00:00');
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  const snaps = await Promise.all(
    dates.map(d => getDoc(doc(db, 'dailyMetrics', d)))
  );
  const result: Record<string, number> = {};
  for (const snap of snaps) {
    if (!snap.exists()) continue;
    for (const [k, v] of Object.entries(snap.data() as Record<string, number>)) {
      result[k] = (result[k] ?? 0) + v;
    }
  }
  return result;
};

export const fetchAllDailyMetrics = async (): Promise<Record<string, number>> => {
  const snap = await getDocs(collection(db, 'dailyMetrics'));
  const result: Record<string, number> = {};
  for (const d of snap.docs) {
    for (const [k, v] of Object.entries(d.data() as Record<string, number>)) {
      result[k] = (result[k] ?? 0) + (typeof v === 'number' ? v : 0);
    }
  }
  return result;
};

export const resetMetrics = async () => {
  const snap = await getDocs(collection(db, 'dailyMetrics'));
  await Promise.all([
    setDoc(doc(db, 'settings', 'metrics'), {}),
    ...snap.docs.map(d => deleteDoc(doc(db, 'dailyMetrics', d.id))),
  ]);
};
