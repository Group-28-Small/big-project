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

function setUserActiveTask(userDetails, item, db) {
    // console.log(userDetails);
    const itemRef = db.collection('tasks').doc(item);
    userDetails.update({ 'active_task': itemRef })
}

function userStopTask(db, active_task, userDetails, userDetailsRef) {
    console.log("stopping task");
    var batch = db.batch();
    var taskSession = db.collection("sessions").doc();
    // use batching for this - we don't want part of this succeeding and part failing
    batch.set(taskSession, { task: "tasks/" + active_task.id, start: userDetails.task_start_time, end: Date.now() / 1000 });
    batch.update(userDetailsRef, { is_tracking_task: false });

    return batch.commit();
}

function userStartTask(db, userDetailsRef) {
    console.log("starting task");
    // start recording a new task
    var batch = db.batch();
    batch.update(userDetailsRef, { is_tracking_task: true, task_start_time: Date.now() / 1000 });

    batch.commit();
}

const MIN_TASK_TIME = 10; // seconds
module.exports = { createUserDocument, getOrCreateUserDocument, setUserActiveTask, userStopTask, userStartTask, MIN_TASK_TIME }