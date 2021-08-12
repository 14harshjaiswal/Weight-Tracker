import firebase from "firebase";

const config ={

    apiKey: "AIzaSyBmfolU55EAdFMz4uArNG46FbRM2BvAOy8",
    authDomain: "weight-tracker-ef038.firebaseapp.com",
    projectId: "weight-tracker-ef038",
    storageBucket: "weight-tracker-ef038.appspot.com",
    messagingSenderId: "824864442181",
    appId: "1:824864442181:web:7c56e40155eaf1787ba02c",
    measurementId: "G-3TJ72X30FP"
}

const fire = firebase.initializeApp(config);
export default fire;