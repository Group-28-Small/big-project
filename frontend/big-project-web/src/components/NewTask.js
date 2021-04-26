import { Box, Button, Container, FormControlLabel, makeStyles, Slider, Switch, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { DateTimePicker } from "@material-ui/pickers";
import Moment from 'react-moment';
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';
import { Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const EditTaskPage = props => {
    const db = useFirestore();
    const item_id = props.taskID;
    console.log(item_id);
    const itemRef = db.collection('tasks').doc(item_id);
    const item = useFirestoreDocData(itemRef, { initialData: null });
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    if (item.data && user) {
        const data = item.data
        return <TaskEditor item={data} item_id={itemRef.id} user={user} userRef={userDetailsRef} editing={true} {...props} />
    } else {
        // TODO
        return (
            <div>Loading...</div>
        )
    }

}
export const NewTaskPage = props => {
    const db = useFirestore();
    const [itemRef,] = useState(db.collection('tasks').doc());
    const { data: user } = useUser();
    const item = useFirestoreDocData(itemRef, { initialData: null });
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const [timeSet, setTimeSet] = useState(false);
    if (item.data && user) {
        const data = item.data
        if (!timeSet) {
            data.due_date = (Date.now() / 1000) + (60 * 60 * 24);
            setTimeSet(true);
        }
        return <TaskEditor item={data} item_id={itemRef.id} user={user} userRef={userDetailsRef} editing={false} {...props} />
    } else {
        // TODO
        return (
            <div>loading...</div>
        )
    }
}

function TaskEditor(props) {
    const db = useFirestore();
    const styles = useStyles();

    const handleSwitchChange = (event) => {
        setSwitchesState({ ...switchesState, [event.target.name]: event.target.checked });
    };

    const { item, item_id, userRef, editing } = props;

    const [switchesState, setSwitchesState] = React.useState({
        hasDueDate: item.has_due_date ?? false,
        hasEstimatedTime: item.has_estimated_time ?? false,
    });

    const [taskName, onChangeName] = React.useState(item.name ?? '');
    const [selectedMinutes, setSelectedMinutes] = React.useState(item.estimated_time?Math.floor((item.estimated_time / (60*60)) % 24):0)
    const [selectedHours, setSelectedHours] = React.useState(item.estimated_time? Math.floor((item.estimated_time / (60*60)) % 24):0)
    const [pct, onChangePct] = React.useState(item.percentage ?? 0);
    const [dueDate, setDueDate] = React.useState(new Date(item.due_date * 1000));
    const [notes, onChangeNotes] = React.useState(item.note ?? '');

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const updateTask = () => {
        console.log(dueDate);
        const estimatedTime = selectedMinutes * 60 + selectedHours * 60 * 60;
        db.collection("tasks").doc(item_id).set({ 'name': taskName, 'estimated_time': estimatedTime, 'has_estimated_time':switchesState.hasEstimatedTime, 'due_date': dueDate.getTime() / 1000, 'note': notes, 'user': userRef }, { merge: true });
        props.setOpen(false)
    }
    const deleteTask = () => {
        db.collection("tasks").doc(item_id).delete();
        props.setOpen(false)
    }
    useEffect(() => {
        console.log("item id or state changed");
        // TODO: find a way to do this without code duplication
        // I think if we bundle this state into a single state, we can unpack it directly from the item... ? I'll look at it later. ~Kurt
        onChangeName(item.name ?? '');
        // onChangeTime(item.estimated_time ?? '');
        setSelectedMinutes(item.estimated_time?Math.floor((item.estimated_time / (60)) % 60):0)
        setSelectedHours(item.estimated_time? Math.floor((item.estimated_time / (60*60)) % 24):0)
        setSwitchesState({hasEstimatedTime: item.has_estimated_time??false, hasDueDate: item.has_due_date??false})
        onChangePct(item.percentage ?? 0);
        setDueDate(new Date(item.due_date * 1000))
    }, [item_id, item]);

    return (
        <Container maxWidth="md">
            <form>
                <Box display='flex' justifyContent='center' alignContent='center' alignItems='center' flexDirection='column'>
                    <div className={styles.left}>
                        {editing ?
                            <Typography variant='h4' >Edit Task</Typography>
                            :
                            <Typography variant='h4' >New Task</Typography>
                        }
                    </div>
                    <TextField className={styles.field} required id='taskName' label='Task Name' type='text' variant='outlined' autoFocus={true} onChange={(e) => onChangeName(e.target.value)} value={taskName}></TextField>
                    {/* <TextField className={styles.field} id='taskEstimated' type="text" label='Estimated Time (Hours)' variant='outlined' onChange={(e) => onChangeTime(e.target.value)} value={estimatedTime}></TextField> */}
                    <FormControlLabel
                        control={<Switch checked={switchesState.hasEstimatedTime} name="hasEstimatedTime" onChange={handleSwitchChange} />}
                        label="Has Estimated Time" labelPlacement="start" className={`${styles.field} ${styles.wide}`}
                    />
                    {switchesState.hasEstimatedTime && (
                        <div className={styles.field}>
                    <TextField type="number" value={selectedHours} style={{width:"40%"}} label='Hours' variant='outlined' onChange={(e) => setSelectedHours(e.target.value)} />
                        :
                    <TextField type="number" value={selectedMinutes} style={{width:"40%"}} label='Minutes' variant='outlined' onChange={(e)=>setSelectedMinutes(e.target.value)} />
                        </div>
                    )}
                    <TextField className={styles.field} id='notes' type="text" label='Notes...' variant='outlined' onChange={(e) => onChangeNotes(e.target.value)} value={notes} multiline rowsMax = "6"></TextField>
                    <FormControlLabel
                        control={<Switch checked={switchesState.hasDueDate} name="hasDueDate" onChange={handleSwitchChange} />}
                        label="Has Due Date" labelPlacement="start" className={`${styles.field} ${styles.wide}`}
                    />
                    {switchesState.hasDueDate && (
                        <>
                            <DateTimePicker
                                label="DateTimePicker"
                                inputVariant="outlined"
                                value={dueDate}
                                onChange={(d) => { setDueDate(d.toDate()) }}
                                className={styles.field}
                            />
                            <div className={styles.field}>
                                Due: <Moment date={dueDate} fromNow />
                            </div>
                        </>
                    )}
                    {editing ?
                        <>
                            <Button variant='contained' color='primary' onClick={updateTask} component={Link} to={'/'}>Update Task</Button>
                            <Button variant='contained' color='secondary' onClick={handleClickOpen} component={Link} to={'/'}>Delete Task</Button>
                            <Dialog
                            open={open}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-slide-title"
                            aria-describedby="alert-dialog-slide-description"
                            >
                                <DialogTitle id="alert-dialog-slide-title">{"Delete Task?"}</DialogTitle>
                                <DialogContent>
                                <DialogContentText id="alert-dialog-slide-description">
                                    Are you sure you want to delete this task permenantly? Session history will not be saved.
                                </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} color="primary">
                                    Disagree
                                    </Button>
                                    <Button onClick={deleteTask} color="primary">
                                    Agree
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </>
                    :
                        <Button variant='contained' color='primary' onClick={updateTask} component={Link} to={'/'}>Add Task</Button>}
                </Box>
            </form>
        </Container>
    )
}

const useStyles = makeStyles((theme) => ({
    field: {
        margin: 8,
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
        width: '70%'
    },
    wide: {
        justifyContent: 'space-between'
    },
    left: {
        marginRight: 'auto',
        marginLeft: '15%'
    }
}));
