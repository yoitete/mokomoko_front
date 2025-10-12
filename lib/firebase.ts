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
    console.log("🔧 本番環境のFirebase設定を使用");
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

  // 開発環境の設定（Firebase Consoleから取得した実際の値を使用）
  console.log("🔧 開発環境のFirebase設定を使用");
  return {
    apiKey: "AIzaSyDWvJMpHDw8kayI4Lr4gN3sm-3FBSKCHHs",
    authDomain: "mokomoko-2ac26.firebaseapp.com",
    projectId: "mokomoko-2ac26",
    storageBucket: "mokomoko-2ac26.appspot.com",
    messagingSenderId: "963617085321", // 実際の値に更新
    appId: "1:963617085321:web:c8f1371dc10af2bf", // 実際の値に更新
    measurementId: "G-XXXXXXXXXX", // Firebase Consoleから取得した実際の値に置き換えてください（オプション）
  };
};

const firebaseConfig = getFirebaseConfig();

// デバッグ用：Firebase設定をログ出力
console.log("🔍 Firebase設定詳細:");
console.log("  apiKey:", firebaseConfig.apiKey?.substring(0, 10) + "...");
console.log("  authDomain:", firebaseConfig.authDomain);
console.log("  projectId:", firebaseConfig.projectId);
console.log("  messagingSenderId:", firebaseConfig.messagingSenderId);
console.log("  appId:", firebaseConfig.appId?.substring(0, 20) + "...");
console.log("  storageBucket:", firebaseConfig.storageBucket);

// Firebase設定の型定義
interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

// Firebase設定の検証
const validateFirebaseConfig = (config: FirebaseConfig) => {
  const requiredFields: (keyof FirebaseConfig)[] = [
    "apiKey",
    "authDomain",
    "projectId",
    "messagingSenderId",
    "appId",
  ];

  // ダミー値や不完全な値をチェック
  const dummyValues = [
    "123456789012",
    "1:123456789012:web:abcdef1234567890",
    "G-XXXXXXXXXX",
    "実際の",
  ];

  const invalidFields = requiredFields.filter((field) => {
    const value = config[field];
    return (
      !value ||
      value.includes("実際の") ||
      dummyValues.some((dummy) => value.includes(dummy))
    );
  });

  if (invalidFields.length > 0) {
    console.error("❌ Firebase設定に無効な値があります:", invalidFields);
    console.error("🔧 Firebase Consoleから正しい値を取得して設定してください");
    console.error("📋 必要な設定値:");
    console.error(
      "  - messagingSenderId: Firebase Console → プロジェクト設定 → 全般 → MessagingSenderId"
    );
    console.error(
      "  - appId: Firebase Console → プロジェクト設定 → 全般 → AppId"
    );
    console.error(
      "  - measurementId: Firebase Console → プロジェクト設定 → 全般 → MeasurementId (オプション)"
    );
  } else {
    console.log("✅ Firebase設定は正常です");
  }
};

validateFirebaseConfig(firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
