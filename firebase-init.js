// 1. Clear old localStorage data to ensure a fresh, clean start on Firebase
if (!localStorage.getItem('tfp_migrated_to_firebase')) {
  localStorage.removeItem('tfp_users');
  localStorage.removeItem('tfp_session');
  // clear vehicle and trip keys based on user IDs
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('tfp_vehicles_') || key.startsWith('tfp_trips_'))) {
      localStorage.removeItem(key);
    }
  }
  localStorage.setItem('tfp_migrated_to_firebase', 'true');
  console.log("Old insecure localStorage data wiped.");
}

// 2. Initialize Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFSnMEPXQ6qZ43GcGDKbmUPpcBQ052bz0",
  authDomain: "truck-fleet-e950c.firebaseapp.com",
  projectId: "truck-fleet-e950c",
  storageBucket: "truck-fleet-e950c.firebasestorage.app",
  messagingSenderId: "380888702750",
  appId: "1:380888702750:web:27e82b34226680c1d5f30f",
  measurementId: "G-9Z0EXQDK7R"
};

// Initialize Firebase using the compat script loaded in HTML
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Make them globally available for our existing scripts
window.auth = auth;
window.db = db;
