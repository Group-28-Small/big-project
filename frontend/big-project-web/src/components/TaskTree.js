import { Container, Fab, makeStyles, Modal, Popover, TextField, Typography, List, Grid, LinearProgress } from '@material-ui/core';
import IconButton from "@material-ui/core/IconButton";
import { TextFields } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import RedoIcon from '@material-ui/icons/Redo'
import NoteIcon from '@material-ui/icons/Note';
import DoneIcon from '@material-ui/icons/Done';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { useFirebaseApp, useFirestore, useFirestoreCollectionData, useFirestoreDocData, useUser } from 'reactfire';
import EditTaskButton from './EditTaskButton';
import { EditTaskPage, NewTaskPage } from "./NewTask";
import PlayPauseButton from './PlayPauseButton';
import { backend_address, search_url, total_url } from 'big-project-common';
import Confetti from 'react-dom-confetti';
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
momentDurationFormatSetup(moment)



function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

export default function TaskTree(props) {
    const db = useFirestore();
    const firebase = useFirebaseApp();
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const { data: firebase_tasks } = useFirestoreCollectionData(db.collection("tasks").where("user", "==", userDetailsRef), {
        idField: 'id'
    });
    const styles = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [modalMode, setModalMode] = React.useState("newtask")
    const [taskID, setTaskID] = React.useState(undefined);
    const [searchText, _setSearchText] = useState("")
    const [searchedTasks, setSearchedTasks] = React.useState([])
    const [taskDurations, setDurations] = React.useState({})
    const setSearchText = (text) => {
        _setSearchText(text);
        if (text === '') {
            setSearchedTasks(firebase_tasks)
            return
        }
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            const url = backend_address(search_url + "/" + idToken + "/" + text)
            console.log(url);
            fetch(url)
                .then(response => response.json())
                .then(data => setSearchedTasks(data)).catch((error) => {
                    // do nothing
                });
        }).catch((error) => {
            // this should never happen
        })
    }

    useEffect(() => {
        // firebase tasks changed - fetch done tasks again
        console.log("data changed");
        setSearchText(searchText)
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            firebase_tasks.forEach((task) => {
                const url = backend_address(total_url + "/" + idToken + "/" + task.id)
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        // so it turns out that setState callbacks can accept a function that recieves the old state
                        // if we update it from within, it's guaranteed to happen atomically
                        setDurations((oldDurations) => {
                            return { ...oldDurations, [task.id]: data.total_time }
                        })
                    }).catch((error) => {
                        console.log(error);
                    });
            });
        }).catch((error) => {
            // this should never happen
        })
    }, [firebase_tasks])

    const [progress, setProgress] = React.useState(30)

    var tasks = [];
    if (searchText === "") {
        tasks = firebase_tasks ?? [];
    } else if (searchedTasks !== null) {
        tasks = searchedTasks
    }

    const editTask = (task_id) => {
        setTaskID(task_id)
        setModalMode("edittask")
        setOpen(true)
    }

    const handleOpen = () => {
        setModalMode("newtask")
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const done_tasks = []
    const not_done_tasks = []
    if (tasks) {

        tasks.forEach((task) => {
            if (task?.done) {
                done_tasks.push(task)
            } else {
                not_done_tasks.push(task)
            }
        });
    }
    return (
        <Container>
            <List>
                {/* <Typography variant='h4' className={styles.task}>Tasks</Typography> */}
                <TextField className={styles.search} id='search' type="text" label='Search' variant='filled' onChange={(e) => setSearchText(e.target.value)} value={searchText}></TextField>
                <Grid container>
                    <Typography variant="h6" style={{ paddingLeft: '10px', paddingRight: '60px' }}>Name</Typography>

                    <Typography variant="h6" style={{ marginLeft: 'auto', paddingRight: '10px' }}>Finish/Notes/Edit/Track</Typography>


                </Grid>
                <TreeView>
                    {not_done_tasks.map((item, idx) => {
                        return (
                            <TaskTreeItem
                                nodeId={item.id}
                                key={item.id}
                                task={item}
                                db={db}
                                isLast={idx === not_done_tasks.length - 1}
                                editCallback={editTask}
                                total_time={taskDurations[item.id] ?? 0}
                            />
                        );
                    })}
                </TreeView>
                <hr />
                <TreeView>
                    {done_tasks.map((item, idx) => {
                        return (
                            <TaskTreeItem
                                nodeId={item.id}
                                key={item.id}
                                task={item}
                                db={db}
                                isLast={idx === done_tasks.length - 1}
                                editCallback={editTask}
                                total_time={taskDurations[item.id] ?? 0}
                            />
                        );
                    })}
                </TreeView>
                <Fab color="primary" aria-label="add" className={styles.fab} onClick={handleOpen}>
                    <AddIcon />
                </Fab>
                <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                    <div style={modalStyle} className={styles.paper}>
                        {modalMode === 'newtask' ?
                            <NewTaskPage setOpen={setOpen} />
                            :
                            <EditTaskPage taskID={taskID} setOpen={setOpen} />
                        }
                    </div>
                </Modal>
            </List>
        </Container>
    );
}



function TaskTreeItem(props) {
    const { task, isLast, db, ...other } = props;
    const styles = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [current_tracktime, setCurrentTrackTime] = React.useState(0)
    const [done, setDone] = useState(task.done ?? false);
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const { data: userDetails } = useFirestoreDocData(userDetailsRef ?? db.collection('users').doc());

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const handleTaskCompletion = () => {
        //console.log(`setting ${task.id} to done`);
        if (!task.done) {
            if (task.estimated_time) {
                db.collection('tasks').doc(task.id).set({
                    'done': true,
                    'duration': task.estimated_time
                }, { merge: true })
            }
            else {
                db.collection('tasks').doc(task.id).set({
                    'done': true,
                    'duration': 0
                }, { merge: true })
            }
            setDone(true);
        } else {
            db.collection('tasks').doc(task.id).set({
                'done': false,
            }, { merge: true })
            setDone(false);
        }
    }
    const [progressInterval, setProgressInterval] = React.useState(null)
    useEffect(() => {
        if (userDetails?.is_tracking_task && userDetails?.active_task.id === task.id) {
            if (!progressInterval) {
                setProgressInterval(setInterval(() => {
                    setCurrentTrackTime((prev) => {
                        return (Date.now() / 1000) - userDetails.task_start_time
                    });
                }, 1000))
            }
        } else {
            clearInterval(progressInterval);
            setProgressInterval(null)

        }
        if (progressInterval) {
            return progressInterval;
        }
    }, [userDetails])
    return (
        <TreeItem
            classes={{ label: styles.treeItemNoPadding, iconContainer: styles.nope }}
            label={
                <div className={`${styles.treeItem} ${isLast && styles.lastItem} ${task.done && styles.TreeItemDone}`} >
                    <p style={{ marginLeft: '0px', borderRight: 'thin solid #666666', lineHeight: '30px', padding: '8px' }}>{task.name}</p>
                    {/* show estimated time  */}

                    {task.has_estimated_time &&
                        <>
                        <span style={{ fontWeight: 'bold', marginRight: '10px', marginLeft: '10px' }}>Estimated: {moment.duration(task.estimated_time, "seconds").format("hh:mm", 0, { trim: false })}</span>
                        <span><LinearProgress variant='determinate' style={{ width: 150 }} value={100 * (props.total_time + current_tracktime) / task.estimated_time} /></span>
                        <span style={{ fontWeight: 'bold', marginLeft: '5px', borderRight: 'thin solid #666666', lineHeight: '40px', padding: '8px' }}>{Math.round(100 * (props.total_time + current_tracktime) / task.estimated_time)}%</span>
                        </>
                    }

                    {task.has_due_date &&
                        <>
                        <p style={{ marginLeft: '8px', fontWeight: 'bold' }}>Due:</p><Moment style={{ borderRight: 'thin solid #666666', lineHeight: '40px', padding: '8px' }} format="DD MMMM YYYY" date={task.due_date} unix />
                        </>
                    }

                    {/* show total time spent */}
                    {props.total_time &&
                        <>
                        <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>Total:</span><span style={{ borderRight: 'thin solid #666666', lineHeight: '40px', padding: '8px' }}> {moment.duration(props.total_time, "seconds").format("hh:mm:ss", 0, { trim: false })}</span>
                        </>
                    }

                    {/* show current session time in currently tracked task */}
                    {(userDetails?.active_task?.id === task.id && userDetails.is_tracking_task) &&
                        (
                            <>
                            <div style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                                Current Session: </div> <div style={{ borderRight: 'thin solid #666666', lineHeight: '40px', padding: '8px' }}><Moment date={userDetails.task_start_time} interval={1000} format="hh:mm:ss" durationFromNow unix /></div>
                            </>
                        )
                    }

                    <div style={{ marginRight: '20', marginLeft: 'auto' }}>
                        <IconButton style={{ marginRight: '22px' }} size='small' onClick={handleTaskCompletion}>
                            <Confetti config={confettiConfig} active={done} />
                            {!task.done ? <DoneIcon /> : <RedoIcon />}
                        </IconButton>
                        <IconButton size='small' style={{ marginRight: '22px' }}>
                            <NoteIcon aria-owns={open ? 'mouse-over-popover' : undefined} aria-haspopup="true" onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose} />
                            <Popover
                                id="mouse-over-popover"
                                className={styles.popover}
                                classes={{
                                    paper: styles.poper,
                                }}
                                open={open}
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                onClose={handlePopoverClose}
                                disableRestoreFocus
                            >
                                <Typography className={styles.formating}>{task.note === '' ? "No note" : task.note}</Typography>
                            </Popover>

                        </IconButton>
                    </div>
                    <EditTaskButton taskId={task.id} editCallback={props.editCallback} />
                    <PlayPauseButton taskId={task.id} />
                </div>
            }
            {...other}
        />
    );
}

const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 1000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#000", "#eab800"]
};


const useStyles = makeStyles((theme) => ({
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    // purely experimental - delete if you want
    treeItem: {
        borderWidth: 2,
        borderBottomWidth: 0,
        borderColor: 'black',
        borderStyle: 'solid',
        padding: 0,
        alignItems: 'center',
        display: 'flex',

    },
    TreeItemDone: {
        borderStyle: 'dashed',
    },
    lastItem: {
        borderBottomWidth: 2,
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    popover: {
        pointerEvents: 'none',
        maxWidth: '80%',
    },
    poper: {
        padding: theme.spacing(1),
    },
    formating: {
        whiteSpace: 'pre-wrap',
    },
    task: {
        textAlign: 'center',
    },
    search: {
        margin: '12px',
        marginLeft: '0',
        width: '100%',
        textAlign: 'center',
    },
    treeItemNoPadding: {
        padding: 0,
    },
    nope: {
        display: 'none'
    },
}));