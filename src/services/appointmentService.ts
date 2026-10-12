import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Appointment } from '../types';
import {
  saveAppointment as saveLocal,
  updateAppointment as updateLocal,
  deleteStoredAppointment as deleteLocal,
  getStoredAppointments as getLocal
} from '../utils/storage';

const APPOINTMENTS_PATH = 'appointments';

export async function createAppointmentInFirestore(appointment: Appointment, userId: string): Promise<void> {
  const appointmentWithUser = {
    ...appointment,
    userId
  };

  try {
    const docRef = doc(db, APPOINTMENTS_PATH, appointment.id);
    await setDoc(docRef, appointmentWithUser);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${APPOINTMENTS_PATH}/${appointment.id}`);
  } finally {
    // Keep local cache up to date
    saveLocal(appointment);
  }
}

export function subscribeToUserAppointments(
  userId: string,
  onData: (appointments: Appointment[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(
    collection(db, APPOINTMENTS_PATH),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Appointment[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Appointment);
      });
      // Sort by date descending
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      onData(items);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, APPOINTMENTS_PATH);
      if (onError && err instanceof Error) {
        onError(err);
      }
    }
  );
}

export async function cancelAppointmentInFirestore(appointmentId: string): Promise<void> {
  try {
    const docRef = doc(db, APPOINTMENTS_PATH, appointmentId);
    await updateDoc(docRef, {
      status: 'cancelled'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${APPOINTMENTS_PATH}/${appointmentId}`);
  } finally {
    updateLocal(appointmentId, { status: 'cancelled' });
  }
}

// ---------------- ADMIN API FUNCTIONS ---------------- //

export function subscribeToAllAdminAppointments(
  onData: (appointments: Appointment[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    collection(db, APPOINTMENTS_PATH),
    (snapshot) => {
      const firestoreItems: Appointment[] = [];
      snapshot.forEach((docSnap) => {
        firestoreItems.push(docSnap.data() as Appointment);
      });

      // Merge with local storage in case some appointments were written locally
      const localItems = getLocal();
      const map = new Map<string, Appointment>();

      localItems.forEach(item => map.set(item.id, item));
      firestoreItems.forEach(item => map.set(item.id, item));

      const merged = Array.from(map.values());
      merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      onData(merged);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, APPOINTMENTS_PATH);
      // Fallback to local storage for admin view
      const localItems = getLocal();
      onData(localItems);
      if (onError && err instanceof Error) {
        onError(err);
      }
    }
  );
}

export async function adminCreateAppointment(appointment: Appointment): Promise<void> {
  saveLocal(appointment);
  try {
    const docRef = doc(db, APPOINTMENTS_PATH, appointment.id);
    await setDoc(docRef, {
      ...appointment,
      userId: 'admin_created'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${APPOINTMENTS_PATH}/${appointment.id}`);
  }
}

export async function adminUpdateAppointment(
  appointmentId: string,
  updates: Partial<Appointment>
): Promise<void> {
  updateLocal(appointmentId, updates);
  try {
    const docRef = doc(db, APPOINTMENTS_PATH, appointmentId);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${APPOINTMENTS_PATH}/${appointmentId}`);
  }
}

export async function adminDeleteAppointment(appointmentId: string): Promise<void> {
  deleteLocal(appointmentId);
  try {
    const docRef = doc(db, APPOINTMENTS_PATH, appointmentId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${APPOINTMENTS_PATH}/${appointmentId}`);
  }
}

