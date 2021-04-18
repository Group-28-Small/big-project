import React from 'react';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import Moment from 'react-moment';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { Container, Fab, makeStyles, Modal, Typography, Popover} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router';
import PlayPauseButton from './PlayPauseButton';
import EditTaskButton from './EditTaskButton';
import { EditTaskPage, NewTaskPage } from "./NewTask";
import NoteIcon from '@material-ui/icons/Note';
import IconButton from "@material-ui/core/IconButton";



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
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const { data: tasks } = useFirestoreCollectionData(db.collection("tasks").where("user", "==", userDetailsRef), {
        idField: 'id'
    });
    const styles = useStyles();
    const history = useHistory();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [modalMode, setModalMode] = React.useState("newtask")
    const [taskID, setTaskID] = React.useState(undefined);

    if (!tasks) {
        return <div>Getting  tasks...</div>
    }
    const createNewTask = () => {
        history.push("/newtask/")
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
            <Typography variant='h4' >Tasks</Typography>
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

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <TreeItem 
            label={
                <div className={`${styles.treeItem} ${isLast && styles.lastItem}`} >
                    {task.name}{' \t'}{task.estimated_time}{' hrs \t'}{task.percentage}{'% \t'}
                    <Moment format="DD MMMM YYYY" date={task.due_date} unix />
                    <div style={{ marginRight: '0', marginLeft: 'auto' }}>
                        <IconButton>
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
                    </div>
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
    }
}));