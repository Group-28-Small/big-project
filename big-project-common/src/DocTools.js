
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

function setUserActiveTask(userDetails, userDetailsRef, item, db, active_task) {
    const user_was_tracking = userDetails?.is_tracking_task;
    var need_set_task = false;
    console.log("switching active task");
    if (user_was_tracking) {
        if (!(userDetails.last_task_set_time) || (Date.now() / 1000) - userDetails.last_task_set_time > MIN_TASK_TIME) {
            userStopTask(db, active_task, userDetails, userDetailsRef);
            need_set_task = true;
        }
    }
    const itemRef = db.collection('tasks').doc(item);
    userDetailsRef.set({ 'active_task': itemRef, 'last_task_set_time': Date.now() / 1000 }, { merge: true })
    if (need_set_task) {
        userStartTask(db, userDetailsRef);
    }
}

function userStopTask(db, active_task, userDetails, userDetailsRef) {
    const moment = require("moment")
    console.log("stopping task");
    var batch = db.batch();
    // use batching for this - we don't want part of this succeeding and part failing
    if ((Date.now() / 1000) - userDetails.task_start_time > MIN_TASK_TIME) {
        var taskSession = db.collection("sessions").doc();
        batch.set(taskSession, { task: "tasks/" + active_task.id, start: userDetails.task_start_time, end: Date.now() / 1000, user: userDetailsRef });
        // TOOD: this is only _this sessions_ duration - eventually this should be cumulative
        db.collection("tasks").doc(active_task.id).set({ 'duration': moment.duration((((Date.now() / 1000) - userDetails.task_start_time) * 1000)).humanize() }, { merge: true });
    } else {
        console.log("task too short... " + ((Date.now() / 1000) - userDetails.task_start_time));
    }
    batch.set(userDetailsRef, { is_tracking_task: false }, { merge: true });

    return batch.commit();
}

function userStartTask(db, userDetailsRef) {
    console.log("starting task");
    // start recording a new task
    var batch = db.batch();
    batch.set(userDetailsRef, { is_tracking_task: true, task_start_time: Date.now() / 1000 }, { merge: true });

    batch.commit();
}

const MIN_TASK_TIME = 5; // seconds
module.exports = { createUserDocument, getOrCreateUserDocument, setUserActiveTask, userStopTask, userStartTask, MIN_TASK_TIME }