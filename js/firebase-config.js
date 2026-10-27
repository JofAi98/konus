// Konuş signs in with Firebase's free plan (project konus-a7f30).
// These values only identify the project; they are not secrets. What keeps the app
// private is the sign-in (password plus a code from your authenticator), ownerUid
// below, and firestore.rules, which lets only that account read or write anything.
export const firebaseConfig = {
  apiKey: 'AIzaSyBv9b51onKArVsHTN-L98rLUlrUNTlNgAQ',
  authDomain: 'konus-a7f30.firebaseapp.com',
  projectId: 'konus-a7f30',
  storageBucket: 'konus-a7f30.firebasestorage.app',
  messagingSenderId: '341761424487',
  appId: '1:341761424487:web:3acf1585101de050a6a8c2',
};

// The only account allowed to open the app. Empty means any signed-in account,
// which is still safe once sign-ups are turned off in Firebase.
export const ownerUid = '9Yywlv5PWVODGx48JFyHHc0tyhb2';
