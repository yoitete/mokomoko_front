// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 開発環境と本番環境の設定を分岐
const getFirebaseConfig = () => {
  // 本番環境の設定（環境変数が設定されている場合）
  if (
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "dummy-api-key"
  ) {
    return {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };
  }

  // 開発環境の設定（実際のFirebase設定に置き換えてください）
  return {
    apiKey: "実際のAPIキーをここに貼り付けてください",
    authDomain: "mokomoko-2ac26.firebaseapp.com",
    projectId: "mokomoko-2ac26",
    storageBucket: "mokomoko-2ac26.appspot.com",
    messagingSenderId: "実際のMessagingSenderIdをここに貼り付けてください",
    appId: "実際のAppIdをここに貼り付けてください",
    measurementId: "実際のMeasurementIdをここに貼り付けてください",
  };
};

const firebaseConfig = getFirebaseConfig();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
