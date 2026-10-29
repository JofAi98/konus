// Signing in, and keeping your words and progress the same on every device.
// The app opens only for the owner's account, after password and authenticator code.
// Each card is one Firestore document; the newest edit wins.
import { firebaseConfig, ownerUid } from './firebase-config.js';
import { store } from './store.js';

const SDK = 'https://www.gstatic.com/firebasejs/10.12.2';
export const configured = !!(firebaseConfig && firebaseConfig.apiKey);

let A = null, F = null, auth = null, fdb = null, user = null;
let state = configured ? 'loading' : 'off';
let lastSync = 0, errorMsg = '';
let resolver = null; // a sign-in waiting for the authenticator code
let totpSecret = null; // a two-step setup in progress
const subs = new Set();
const pending = new Set();
let metaDirty = false, timer = null, unsubCards = null, unsubMeta = null;

const emit = () => subs.forEach((fn) => fn(status()));
const isOwner = (u) => !!u && (!ownerUid || u.uid === ownerUid);
export const status = () => ({
  state, email: user?.email || '', uid: user?.uid || '', lastSync, error: errorMsg,
  allowed: isOwner(user), verified: !!user?.emailVerified,
  twoStep: user && A ? A.multiFactor(user).enrolledFactors.length > 0 : false,
});
export function onStatus(fn) { subs.add(fn); fn(status()); return () => subs.delete(fn); }

export async function init() {
  if (!configured) return;
  try {
    const [appMod, authMod, fsMod] = await Promise.all([
      import(`${SDK}/firebase-app.js`), import(`${SDK}/firebase-auth.js`), import(`${SDK}/firebase-firestore.js`),
    ]);
    A = authMod; F = fsMod;
    const app = appMod.initializeApp(firebaseConfig);
    // Same storage as getAuth, without the pop-up sign-in helper: it loads a Google script
    // the page's Content Security Policy blocks, and email sign-in doesn't need it.
    auth = A.initializeAuth(app, { persistence: [A.indexedDBLocalPersistence, A.browserLocalPersistence] });
    fdb = F.getFirestore(app);
    A.onAuthStateChanged(auth, async (u) => {
      if (u && !isOwner(u)) {
        await A.signOut(auth);
        errorMsg = 'This account can\'t open Konuş.';
        return;
      }
      user = u;
      if (u) start(); else stop();
      state = u ? 'on' : resolver ? 'code' : 'signed-out';
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
  'auth/user-not-found': 'Wrong email or password.',
  'auth/user-disabled': 'This account is turned off.',
  'auth/invalid-email': 'That email address doesn\'t look right.',
  'auth/missing-password': 'Type your password.',
  'auth/too-many-requests': 'Too many tries. Wait a few minutes, then try again.',
  'auth/network-request-failed': 'No connection. Try again when you\'re online.',
  'auth/invalid-verification-code': 'That code is wrong or has expired. Type the newest one.',
  'auth/missing-code': 'Type the 6-digit code.',
  'auth/requires-recent-login': 'For safety, sign out and sign in again, then set this up.',
  'auth/unverified-email': 'Verify your email first: tap Send email, then open the link in it.',
  'auth/operation-not-allowed': 'Two-step sign-in isn\'t switched on in Firebase yet.',
  'auth/admin-restricted-operation': 'That isn\'t allowed on this app.',
  'auth/maximum-second-factor-count-exceeded': 'Two-step sign-in is already set up.',
};
const authError = (e) => AUTH_ERRORS[e.code] || e.message;

// Each of these returns an error message to show, or null when it worked.
export async function signIn(email, password) {
  if (!auth) return 'Still loading. Try again in a moment.';
  errorMsg = '';
  try {
    await A.signInWithEmailAndPassword(auth, email, password);
    return null;
  } catch (e) {
    if (e.code === 'auth/multi-factor-auth-required') {
      resolver = A.getMultiFactorResolver(auth, e);
      state = 'code';
      emit();
      return null;
    }
    return authError(e);
  }
}

export async function confirmCode(code) {
  if (!resolver) return 'Sign in again.';
  const hint = resolver.hints.find((h) => h.factorId === A.TotpMultiFactorGenerator.FACTOR_ID) || resolver.hints[0];
  try {
    await resolver.resolveSignIn(A.TotpMultiFactorGenerator.assertionForSignIn(hint.uid, code.trim()));
    resolver = null;
    return null;
  } catch (e) { return authError(e); }
}

export function cancelCode() { resolver = null; state = 'signed-out'; emit(); }

// Two-step setup: verify the email, get a secret for the authenticator, confirm with a code.
export async function sendVerification() {
  try { await A.sendEmailVerification(user); return null; } catch (e) { return authError(e); }
}
export async function reloadUser() {
  try { await user.reload(); emit(); return null; } catch (e) { return authError(e); }
}
export async function startTwoStep() {
  try {
    const session = await A.multiFactor(user).getSession();
    totpSecret = await A.TotpMultiFactorGenerator.generateSecret(session);
    return { key: totpSecret.secretKey, uri: totpSecret.generateQrCodeUrl(user.email, 'Konuş') };
  } catch (e) { return { error: authError(e) }; }
}
export async function finishTwoStep(code) {
  if (!totpSecret) return 'Start the setup again.';
  try {
    await A.multiFactor(user).enroll(A.TotpMultiFactorGenerator.assertionForEnrollment(totpSecret, code.trim()), 'Authenticator');
    totpSecret = null;
    emit();
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
