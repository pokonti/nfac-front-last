import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onChildAdded, onChildChanged, onChildRemoved, set, remove, onDisconnect } from 'firebase/database';


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const playersRef = ref(db, 'players');

export function writePlayer(player) {
  const playerRef = ref(db, `players/${player.id}`);
  set(playerRef, player);
  onDisconnect(playerRef).remove();
}

export function updatePlayer(player) {
  set(ref(db, `players/${player.id}`), player);
}

export function removePlayer(id) {
  remove(ref(db, `players/${id}`));
}

export function onPlayersUpdate(callback) {
  const players = {};
  onChildAdded(playersRef, snapshot => {
    players[snapshot.key] = snapshot.val();
    callback({ ...players });
  });
  onChildChanged(playersRef, snapshot => {
    players[snapshot.key] = snapshot.val();
    callback({ ...players });
  });
  onChildRemoved(playersRef, snapshot => {
    delete players[snapshot.key];
    callback({ ...players });
  });
  return () => {};
}
