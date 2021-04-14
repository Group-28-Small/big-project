import React, { useState } from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from "@material-ui/core/IconButton";
import PauseIcon from '@material-ui/icons/Pause';
import { backend_address, setUserActiveTask, userStopTask, userStartTask } from 'big-project-common';
import { AuthCheck, useFirestore, useFirestoreCollectionData, useFirestoreDocData, useUser } from 'reactfire';



export default function PlayPauseButton(props) {
    const MIN_TASK_TIME = 5; // seconds
    const { taskId, ...other } = props;
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
    .doc(user.uid) : null;
    const { data: userDetails } = useFirestoreDocData(userDetailsRef ?? db.collection('users').doc());
    const { data: tasks } = useFirestoreCollectionData(db.collection("tasks").where("user", "==", userDetailsRef), {
        idField: 'id'
    });
    const active_task = userDetails?.active_task;
    if(active_task !== undefined)
        var active_task_id = active_task.id;
    const isCurrTracking = (active_task_id === taskId); //TODO: doesn't keep isTracking when refreshing page
    const [isTracking, setTracking] = useState(isCurrTracking);   
    const setActiveTask = item_id => {
        setUserActiveTask(userDetails, userDetailsRef, item_id, db, active_task);
        if((Date.now() / 1000) - userDetails.last_task_set_time < MIN_TASK_TIME && userDetails?.is_tracking_task){
            //TODO: show message that task has been switched
        }
    }

    const trackTaskPressed = () => {
        // TODO: handle return values from these
        if (userDetails.is_tracking_task) {
            userStopTask(db, active_task, userDetails, userDetailsRef);
            setTracking(false);
        } else {
            userStartTask(db, userDetailsRef);
            setActiveTask(taskId);
            setTracking(true);
        }
    }

    console.log("Active Task:\t" + active_task_id);
    console.log(isTracking);
    if(active_task === undefined || !isTracking)
        return(
            <div>
                <IconButton size='small' onClick={trackTaskPressed}>
                    <PlayArrowIcon style={ {color: '#4caf50'} } />
                </IconButton>
            </div>
        );
    return (
        <div>
            {isCurrTracking ?
                <IconButton size='small' onClick={trackTaskPressed}>
                    <PauseIcon style={ {color: '#f44336'} } />
                </IconButton>
            :
                <IconButton size='small' onClick={trackTaskPressed}>
                    <PlayArrowIcon style={ {color: '#4caf50'} } />
                </IconButton>
            }
        </div>
    );
}