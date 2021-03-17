const { is_production } = require("./DevTools");

function createUserDocument(uid, db) {
    db.collection("users").doc(uid).set({
        // TODO: set up user doc, if needed
    })
        .then(() => {
            if (!is_production()) {
                console.log("Document successfully written with uid " + uid + "!");
            }
        })
        .catch((error) => {
            if (!is_production()) {
                console.error("Error writing document: ", error);
            }
        });
}
module.exports = { createUserDocument }