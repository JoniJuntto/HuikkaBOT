import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import serviceAccount from "./twitchhuikka.json" assert { type: "json" };

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export default async function DrinkingGame(username) {
  //Add user to firebase firestore

  try {
    const docRef = db.collection("players").doc("players");
    const doc = await docRef.get();
    console.log("Document data:", doc.data().usernames);

    await docRef.set({
      usernames: [...doc.data().usernames, username],
    });
  } catch (error) {
    console.log(error);
  }
}
