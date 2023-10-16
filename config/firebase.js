import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Constants } from "expo-constants";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCAkzjeurEbk2Fwn7lA0QeRXG7k21EhbP4",
    authDomain: "chatapp-guru.firebaseapp.com",
    projectId: "chatapp-guru",
    storageBucket: "chatapp-guru.appspot.com",
    messagingSenderId: "1088073544683",
    appId: "1:1088073544683:web:0460f9da14892ac1dc9fae"
  };
  

initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
export const storage = getStorage();
  