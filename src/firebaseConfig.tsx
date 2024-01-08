
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCj_EXmA6mNqZTV-un_Hd-l-c_H3iaGHfM",
    authDomain: "leafy-emblem-385311.firebaseapp.com",
    databaseURL: "https://leafy-emblem-385311-default-rtdb.firebaseio.com",
    projectId: "leafy-emblem-385311",
    storageBucket: "leafy-emblem-385311.appspot.com",
    messagingSenderId: "8705164594",
    appId: "1:8705164594:web:5ff9c386cd177ca9b0432b",
    measurementId: "G-9TSF7S1DYJ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const storage = getStorage();