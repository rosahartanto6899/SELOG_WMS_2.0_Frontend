import { decryptData } from "@sera-utils/encryptor";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: decryptData(process.env.FIREBASE_API_KEY),
  authDomain: decryptData(process.env.FIREBASE_AUTH_DOMAIN),
  projectId: decryptData(process.env.FIREBASE_PROJECT_ID),
  storageBucket: decryptData(process.env.FIREBASE_STORAGE_BUCKET),
  messagingSenderId: decryptData(process.env.FIREBASE_MESSAGING_SENDER_ID),
  appId: decryptData(process.env.FIREBASE_APP_ID),
  databaseURL: decryptData(process.env.FIREBASE_DATABASE_URL),
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const rdb = getDatabase(app);
export const db = getFirestore(app);
