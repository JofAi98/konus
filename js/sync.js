// Keeps your words and progress the same on every device you sign in on.
// Each card is one Firestore document; the newest edit wins.
import { firebaseConfig } from './firebase-config.js';
import { store } from './store.js';

const SDK = 'https://www.gstatic.com/firebasejs/10.12.2';
export const configured = !!(firebaseConfig && firebaseConfig.apiKey);

let A = null, F = null, auth = null, fdb = null, user = null;
let state = configured ? 'loading' : 'off';
let lastSync = 0, errorMsg = '';
const subs = new Set();
const pending = new Set();
let metaDirty = false, timer = null, unsubCards = null, unsubMeta = null;

const emit = () => subs.forEach((fn) => fn(status()));
export const status = () => ({ state, email: user?.email || '', lastSync, error: errorMsg });
export function onStatus(fn) { subs.add(fn); fn(status()); return () => subs.delete(fn); }

export async function init() {
  if (!configured) return;
  try {
    const [appMod, authMod, fsMod] = await Promise.all([
      import(`${SDK}/firebase-app.js`), import(`${SDK}/firebase-auth.js`), import(`${SDK}/firebase-firestore.js`),
    ]);
    A = authMod; F = fsMod;
    const app = appMod.initializeApp(firebaseConfig);
    auth = A.getAuth(app);
    fdb = F.getFirestore(app);
    A.onAuthStateChanged(auth, (u) => {
      user = u;
      if (u) start(); else stop();
      state = u ? 'on' : 'signed-out';
      emit();
    });
    store.setSyncHook((kind, payload) => {
      if (!user) return;
      if (kind === 'card') pending.add(payload);
      else if (kind === 'all') { store.allCardsIncludingDeleted().forEach((c) => pending.add(c.id)); metaDirty = true; }
      else metaDirty = true;
      schedule();
    });
    window.addEventListener('online', () => { if (user) schedule(0); });
  } catch (e) {
    state = 'error'; errorMsg = 'Could not load sync. Check your connection.'; emit();
  }
}

const AUTH_ERRORS = {
  'auth/invalid-credential': 'Wrong email or password.',
  'auth/wrong-password': 'Wrong email or password.',
  'auth/user-not-found': 'No account with this email yet. Tap Create account.',
  'auth/email-already-in-use': 'This email already has an account. Tap Sign in instead.',
  'auth/weak-password': 'Use at least 6 characters for the password.',
  'auth/invalid-email': 'That email address doesn\'t look right.',
  'auth/missing-password': 'Type your password.',
  'auth/too-many-requests': 'Too many tries. Wait a few minutes, then try again.',
  'auth/network-request-failed': 'No connection. Try again when you\'re online.',
};
const authError = (e) => AUTH_ERRORS[e.code] || e.message;

// Returns an error message to show, or null when it worked.
export async function signIn(email, password, create = false) {
  if (!auth) return 'Sync is still loading.';
  try {
    if (create) await A.createUserWithEmailAndPassword(auth, email, password);
    else await A.signInWithEmailAndPassword(auth, email, password);
    return null;
  } catch (e) { return authError(e); }
}

export async function resetPassword(email) {
  if (!auth) return 'Sync is still loading.';
  try { await A.sendPasswordResetEmail(auth, email); return null; } catch (e) { return authError(e); }
}
export async function signOut() { if (auth) await A.signOut(auth); }

function start() {
  const uid = user.uid;
  let first = true;
  unsubCards = F.onSnapshot(F.collection(fdb, 'users', uid, 'cards'), (snap) => {
    const remoteAt = new Map();
    snap.docChanges().forEach((ch) => {
      const r = ch.doc.data();
      remoteAt.set(ch.doc.id, r.updatedAt || 0);
      const local = store.state.cards[ch.doc.id];
      if (!local || (r.updatedAt || 0) > (local.updatedAt || 0)) store.putCard({ ...r, id: ch.doc.id }, { remote: true });
    });
    if (first) {
      first = false;
      for (const c of store.allCardsIncludingDeleted()) {
        if (!remoteAt.has(c.id) || (c.updatedAt || 0) > remoteAt.get(c.id)) pending.add(c.id);
      }
      metaDirty = true;
      schedule(0);
    }
    lastSync = Date.now(); emit();
  }, (err) => { state = 'error'; errorMsg = err.message; emit(); });
  unsubMeta = F.onSnapshot(F.doc(fdb, 'users', uid, 'meta', 'main'), (snap) => {
    if (snap.exists() && !snap.metadata.hasPendingWrites) store.mergeMeta(snap.data());
  });
}

function stop() {
  unsubCards?.(); unsubMeta?.();
  unsubCards = unsubMeta = null;
}

function schedule(delay = 1500) {
  clearTimeout(timer);
  timer = setTimeout(flush, delay);
}

async function flush() {
  if (!user || !navigator.onLine) return;
  const ids = [...pending];
  pending.clear();
  try {
    for (let i = 0; i < ids.length; i += 400) {
      const batch = F.writeBatch(fdb);
      for (const id of ids.slice(i, i + 400)) {
        const c = store.state.cards[id];
        if (c) batch.set(F.doc(fdb, 'users', user.uid, 'cards', id), c);
      }
      await batch.commit();
    }
    if (metaDirty) {
      metaDirty = false;
      await F.setDoc(F.doc(fdb, 'users', user.uid, 'meta', 'main'), store.metaForSync());
    }
    lastSync = Date.now(); state = 'on'; errorMsg = ''; emit();
  } catch (e) {
    ids.forEach((id) => pending.add(id));
    metaDirty = true;
    errorMsg = 'Sync paused. It will retry.'; emit();
    schedule(15000);
  }
}
