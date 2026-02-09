import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await signInWithEmailAndPassword(auth, email, password);
};

window.logout = async function () {
  await signOut(auth);
};

window.registrarPonto = async function () {
  const user = auth.currentUser;

  await addDoc(collection(db, "pontos"), {
    uid: user.uid,
    data: serverTimestamp()
  });

  alert("Ponto registrado com sucesso!");
  carregarPontos();
};

async function carregarPontos() {
  const user = auth.currentUser;
  const lista = document.getElementById("listaPontos");
  lista.innerHTML = "";

  const q = query(
    collection(db, "pontos"),
    where("uid", "==", user.uid)
  );

  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = doc.data().data?.toDate().toLocaleString();
    lista.appendChild(li);
  });
}

onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("login").style.display = "none";
    document.getElementById("painel").style.display = "block";
    carregarPontos();
  } else {
    document.getElementById("login").style.display = "block";
    document.getElementById("painel").style.display = "none";
  }
});
