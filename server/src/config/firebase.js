import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(), // Or use a service account JSON
});

export default admin;
