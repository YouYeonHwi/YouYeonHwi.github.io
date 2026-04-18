/**
 * firebase-config.js
 * 전용 Firebase 설정 파일
 */
const firebaseConfig = {
  apiKey: "AIzaSyD2q2ykzICqLhaHaG1XruxzgVePbeYydVY",
  authDomain: "my-blog-421ef.firebaseapp.com",
  databaseURL: "https://my-blog-421ef-default-rtdb.firebaseio.com",
  projectId: "my-blog-421ef",
  storageBucket: "my-blog-421ef.firebasestorage.app",
  messagingSenderId: "826507240720",
  appId: "1:826507240720:web:fd8ee26b47b593d9ab3195",
  measurementId: "G-J00DM0BCDY"
};

// 전역 변수로 노출 (모듈 시스템 미사용 환경 대비)
window.FIREBASE_CONFIG = firebaseConfig;
