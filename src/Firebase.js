import firebase from 'firebase';
import "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyBf-gNwY6RWVHEwGNC5Vlm5_jkqxICT8sk",
    authDomain: "tlcnproject.firebaseapp.com",
    databaseURL: "https://tlcnproject.firebaseio.com",
    projectId: "tlcnproject",
    storageBucket: "tlcnproject.appspot.com",
    messagingSenderId: "471190501995",
    appId: "1:471190501995:web:244886b2981b1c36cc0f2e",
    measurementId: "G-ZRM28DF4CB"
};

const fbApp = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export default fbApp;
export { storage };