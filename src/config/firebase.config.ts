import { apiKeyFB, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId } from "../constants";

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, ref } from 'firebase/storage';
import { getDatabase } from 'firebase/database';


// Firebase configuration
const firebaseConfig = {
    apiKey: apiKeyFB,
    authDomain: authDomain,
    databaseURL: databaseURL,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const storage = getStorage(app);
const database = getDatabase(app);

export {
    app,
    auth,
    storage,
    getStorage,
    ref,
    database
};