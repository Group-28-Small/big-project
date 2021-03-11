const common_lib = require("big-project-common");
var admin = require("firebase-admin");
if (common_lib.is_production()) {
    admin.initializeApp({
        credential: admin.credential.cert({
            "projectId": process.env.FIREBASE_PROJECT_ID,
            "private_key": process.env.FIREBASE_PRIVATE_KEY,
            "client_email": process.env.FIREBASE_CLIENT_EMAIL,
        }),
    });
} else {
    var serviceAccount = require("./cop4331-group21-bigproject-firebase-adminsdk-aepd8-9da7bc02cb.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}