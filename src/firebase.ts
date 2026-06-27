import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLD7G4nZcnPCUlTvrgRl3Gmz_ygrdVgEw",
  authDomain: "friday-abd3a.firebaseapp.com",
  projectId: "friday-abd3a",
  storageBucket: "friday-abd3a.firebasestorage.app",
  messagingSenderId: "583923761109",
  appId: "1:583923761109:web:2889296ff80f8db46bc75c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-rastura-e4ceb480-06c2-412b-92ee-a7ebea3981c2");

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { signInWithPopup, signOut };

// Validate connection to Firestore on initialization
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    // Suppress offline connection errors or warn about them
    console.warn("Firebase test connection result:", error);
  }
}
testConnection();
