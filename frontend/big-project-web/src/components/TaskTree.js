import { Container, Fab, makeStyles, Modal, Popover, TextField, Typography } from '@material-ui/core';
import IconButton from "@material-ui/core/IconButton";
import { TextFields } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import NoteIcon from '@material-ui/icons/Note';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import React, { useState } from 'react';
import Moment from 'react-moment';
import { useFirebaseApp, useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import EditTaskButton from './EditTaskButton';
import { EditTaskPage, NewTaskPage } from "./NewTask";
import PlayPauseButton from './PlayPauseButton';
import { backend_address, search_url } from 'big-project-common'
import DoneIcon from '@material-ui/icons/Done';
import Confetti from 'react-dom-confetti';

const config = {
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
    const [tasksCache, setTasksCache] = React.useState([])
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
    // turns out this should be done with useEffect (well akchually useReducer if we want to be 100% best practices)
    if (firebase_tasks !== tasksCache) {
        console.log("update detected")
        setTasksCache(firebase_tasks)
        setSearchText(searchText)
    }


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


    return (
        <Container>
            <Typography variant='h4' className={styles.task}>Tasks</Typography>
            <TextField className={styles.search} id='search' type="text" label='Search' variant='outlined' onChange={(e) => setSearchText(e.target.value)} value={searchText}></TextField>

            <TreeView>
                {tasks.map((item, idx) => {
                    return (
                        <TaskTreeItem 
                            nodeId={item.id} 
                            key={item.id} 
                            task={item} 
                            //onClick={() => editTask(item)} 
                            isLast={idx === tasks.length - 1}
                            editCallback={editTask}
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
                        <EditTaskPage taskID={taskID} setOpen={setOpen}/>
}
                </div>
            </Modal>
        </Container>
    );
}



function TaskTreeItem(props) {
    const { task, isLast, ...other } = props;
    const styles = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [done, setDone]  = React.useState(task.done);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const handleTaskCompletion = (task) => {
        task.done = true;
        setDone(true);
    }


    return (
        <TreeItem 
            label={
                <div className={`${styles.treeItem} ${isLast && styles.lastItem}`} >
                    {task.name}{' \t'}{task.estimated_time}{' hrs \t'}{task.percentage}{'% \t'}
                    <Moment format="DD MMMM YYYY" date={task.due_date} unix />
                    <div style={{ marginRight: '0', marginLeft: 'auto' }}>
                        <IconButton size="small" onClick={ handleTaskCompletion }>
                            <Confetti active={ done } config={ config }/>
                            <DoneIcon />
                        </IconButton>
                    </div>
                    <IconButton size="small">
                        <NoteIcon aria-owns={open ? 'mouse-over-popover' : undefined} aria-haspopup="true" onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}/>
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
                        <Typography className = {styles.formating}>{task.note}</Typography>
                        </Popover>
                        
                    </IconButton>
                    <EditTaskButton taskId={task.id} editCallback={props.editCallback} />
                    <PlayPauseButton taskId={task.id}/>
                </div>
            }
            {...other}
        />
    );
}



const useStyles = makeStyles((theme) => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    // purely experimental - delete if you want
    treeItem: {
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: 'black',
        borderStyle: 'solid',
        padding: 4,
        alignItems: 'center',
        display: 'flex'
    },
    lastItem: {
        borderBottomWidth: 1,
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
        margin: '16px',
        marginRight: '64px'

    }
}));