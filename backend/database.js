const common_lib = require("big-project-common");
var admin = require("firebase-admin");
if (common_lib.is_production()) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(atob(process.env.FIREBASE_KEY_BASE64))),
    });
} else {
    var serviceAccount = require("./cop4331-group21-bigproject-firebase-adminsdk-aepd8-9da7bc02cb.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}