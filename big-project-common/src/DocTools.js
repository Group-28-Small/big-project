const { is_production } = require("./DevTools");

function createUserDocument(uid, db) {
    var doc = db.collection("users").doc(uid);
    doc.set({
        'created': true
        // TODO: set up user doc, if needed
    }, { 'merge': true });
    return doc.get();
}

function getOrCreateUserDocument(uid, db) {
    var docRef = db.collection("users").doc(uid);
    return docRef.get().then((doc) => {
        if (doc.exists) {
            // console.log("Document data:", doc.data());
            return Promise.resolve(doc);
            // return db.collection("tasks").where("user", "==", doc.ref).get();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            return createUserDocument(uid, db);
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    // .then((doc) => {
    //     console.log("got doc from user");
    //     // console.log(doc);
    // });
}
module.exports = { createUserDocument, getOrCreateUserDocument }