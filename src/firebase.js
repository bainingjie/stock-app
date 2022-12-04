import firebase from "@firebase/app";
import "@firebase/auth";
import store from "./store";

const config = {
  apiKey: "AIzaSyDSaju1b8wtB_lKrMVKeQzCLSnLyNuoOeI",
  authDomain: "stock-app-7c76b.firebaseapp.com",
  databaseURL: "https://stock-app-7c76b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "stock-app-7c76b",
  storageBucket: "stock-app-7c76b.appspot.com",
  messagingSenderId: "426313048975",
  appId: "1:426313048975:web:11777feaf68e281be5a1fa"
};


export default {
  init() {
    firebase.initializeApp(config);
    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  },
  login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
  },
  logout() {
    firebase.auth().signOut()
  },
  onAuth() {
    firebase.auth().onAuthStateChanged(user => {
      user = user ? user : {};
      store.commit('onAuthStateChanged', user);
      store.commit('onUserStatusChanged', user.uid ? true : false);
    })
  },
  onAuthAdd(func) {
    firebase.auth().onAuthStateChanged(func)
  }
};